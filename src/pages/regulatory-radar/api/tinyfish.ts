/**
 * TinyFish Web Agent API Client
 * Navigates government regulatory websites via autonomous browser agents
 * Uses SSE streaming — reads until event type COMPLETE with status COMPLETED
 */

const TINYFISH_API_URL = 'https://agent.tinyfish.ai/v1/automation/run-sse';

export interface RegulatorySource {
  id: string;
  name: string;
  url: string;
  prompt: string;
}

export interface AgentResult {
  sourceId: string;
  sourceName: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  data: string | null;
  error: string | null;
}

export interface AgentStatusUpdate {
  sourceId: string;
  status: AgentResult['status'];
  message?: string;
  data?: string;
}

export const REGULATORY_SOURCES: RegulatorySource[] = [
  {
    id: 'eur-lex',
    name: 'EUR-Lex',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689',
    prompt:
      'Navigate to the EUR-Lex page for the EU AI Act (Regulation 2024/1689). ' +
      'Find and extract any recent amendments, corrigenda, or related delegated/implementing acts listed on the page. ' +
      'For each update found, extract: the title, date published, summary of changes, and the direct URL. ' +
      'Return the results as a JSON array of objects with fields: title, date, summary, url.',
  },
  {
    id: 'eu-ai-office',
    name: 'EU AI Office',
    url: 'https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence',
    prompt:
      'Navigate to the EU AI Office / European Commission AI strategy page. ' +
      'Find the latest news, press releases, or policy updates related to AI regulation enforcement. ' +
      'Extract the 5 most recent items with: title, date, summary, and URL. ' +
      'Return as a JSON array with fields: title, date, summary, url.',
  },
  {
    id: 'nist',
    name: 'NIST',
    url: 'https://www.nist.gov/artificial-intelligence',
    prompt:
      'Navigate to the NIST AI page. ' +
      'Find the latest publications, frameworks, or guidance documents related to AI risk management. ' +
      'Extract the 5 most recent items with: title, date, summary, and URL. ' +
      'Return as a JSON array with fields: title, date, summary, url.',
  },
  {
    id: 'nyc-ll144',
    name: 'NYC LL144',
    url: 'https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page',
    prompt:
      'Navigate to the NYC Department of Consumer and Worker Protection page for Automated Employment Decision Tools (Local Law 144). ' +
      'Find any recent enforcement actions, guidance updates, or compliance notices. ' +
      'Extract items with: title, date, summary, and URL. ' +
      'Return as a JSON array with fields: title, date, summary, url.',
  },
];

/**
 * Run a single TinyFish agent against one regulatory source.
 * Streams SSE events and resolves when COMPLETE event is received.
 */
export async function runAgent(
  source: RegulatorySource,
  apiKey: string,
  onStatus: (update: AgentStatusUpdate) => void
): Promise<AgentResult> {
  onStatus({ sourceId: source.id, status: 'running', message: `Scanning ${source.name}...` });

  try {
    const response = await fetch(TINYFISH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        url: source.url,
        prompt: source.prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`TinyFish API error: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('No response body received from TinyFish API');
    }

    const result = await parseSSEStream(response.body, source.id, onStatus);

    onStatus({ sourceId: source.id, status: 'completed', message: `${source.name} scan complete` });

    return {
      sourceId: source.id,
      sourceName: source.name,
      status: 'completed',
      data: result,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    onStatus({ sourceId: source.id, status: 'error', message: errorMessage });

    return {
      sourceId: source.id,
      sourceName: source.name,
      status: 'error',
      data: null,
      error: errorMessage,
    };
  }
}

/**
 * Parse SSE stream from TinyFish API.
 * Reads until event type is COMPLETE and status is COMPLETED,
 * then extracts resultJson field.
 */
async function parseSSEStream(
  body: ReadableStream<Uint8Array>,
  sourceId: string,
  onStatus: (update: AgentStatusUpdate) => void
): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';

      let currentEventType = '';

      for (const line of lines) {
        if (line.startsWith('event:')) {
          currentEventType = line.slice(6).trim();
        } else if (line.startsWith('data:')) {
          const dataStr = line.slice(5).trim();

          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);

            // Emit progress updates
            if (data.message) {
              onStatus({
                sourceId,
                status: 'running',
                message: data.message,
              });
            }

            // Check for completion
            if (
              (currentEventType === 'COMPLETE' || data.type === 'COMPLETE') &&
              data.status === 'COMPLETED'
            ) {
              // Extract resultJson — the actual scraped data
              const resultJson = data.resultJson || data.result || data.data;

              if (typeof resultJson === 'string') {
                return resultJson;
              }
              return JSON.stringify(resultJson);
            }

            // Check for error events
            if (data.status === 'FAILED' || data.status === 'ERROR') {
              throw new Error(data.error || data.message || 'Agent failed');
            }
          } catch (parseError) {
            // Not valid JSON data line, skip
            if (parseError instanceof SyntaxError) continue;
            throw parseError;
          }
        }
      }
    }

    throw new Error('Stream ended without COMPLETE event');
  } finally {
    reader.releaseLock();
  }
}

/**
 * Run all 4 regulatory source agents in parallel.
 * Returns results as they complete.
 */
export async function runAllAgents(
  apiKey: string,
  onStatus: (update: AgentStatusUpdate) => void
): Promise<AgentResult[]> {
  const promises = REGULATORY_SOURCES.map((source) => runAgent(source, apiKey, onStatus));
  return Promise.allSettled(promises).then((results) =>
    results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return {
        sourceId: REGULATORY_SOURCES[index].id,
        sourceName: REGULATORY_SOURCES[index].name,
        status: 'error' as const,
        data: null,
        error: result.reason?.message || 'Unknown error',
      };
    })
  );
}
