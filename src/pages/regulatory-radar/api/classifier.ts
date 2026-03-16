/**
 * Fireworks AI Classifier
 * Uses OpenAI-compatible API to classify regulatory updates
 * Model: accounts/fireworks/models/llama-v3p3-70b-instruct
 */

const FIREWORKS_API_URL = 'https://api.fireworks.ai/inference/v1/chat/completions';
const FIREWORKS_MODEL = 'accounts/fireworks/models/llama-v3p3-70b-instruct';

export interface ClassifiedAlert {
  title: string;
  description: string;
  severity: 'negligible' | 'minor' | 'moderate' | 'major' | 'critical';
  source: string;
  regulation: string;
  affected_framework: string;
  recommended_action: string;
  category: string;
  url?: string;
  date?: string;
}

interface FireworksResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const CLASSIFICATION_PROMPT = `You are an AI regulatory compliance classifier. Analyze the following regulatory update data scraped from a government website.

For each distinct regulatory update found, classify it and return a JSON array of objects with these exact fields:

- title: Short descriptive title of the regulatory update
- description: 2-3 sentence summary of the update and its implications
- severity: One of "negligible", "minor", "moderate", "major", "critical" based on impact:
  - critical: Immediate enforcement action, new mandatory requirements with near deadlines
  - major: Significant new requirements or amendments affecting compliance obligations
  - moderate: Updated guidance, new best practices, or clarifications with compliance impact
  - minor: Informational updates, minor clarifications, low-impact changes
  - negligible: Administrative notices, no direct compliance impact
- regulation: The specific regulation (e.g., "EU AI Act", "NIST AI RMF", "NYC Local Law 144")
- affected_framework: The compliance framework affected (e.g., "EU AI Act", "GDPR", "NIST AI RMF 1.0", "NYC LL144")
- recommended_action: Specific action the compliance team should take
- category: Risk category — one of "regulatory", "compliance", "enforcement", "guidance"
- url: Direct URL to the update if available
- date: Publication date if available (ISO 8601 format)

IMPORTANT: Return ONLY a valid JSON array. No markdown, no explanation, just the JSON array.
If no meaningful regulatory updates are found, return an empty array: []

Source: {SOURCE_NAME}
Data to classify:
{RAW_DATA}`;

/**
 * Classify raw scraped regulatory data using Fireworks AI (Llama 70B).
 * Maps severity to existing risk_severity enum values.
 */
export async function classifyRegulatory(
  rawData: string,
  sourceName: string,
  apiKey: string
): Promise<ClassifiedAlert[]> {
  const prompt = CLASSIFICATION_PROMPT
    .replace('{SOURCE_NAME}', sourceName)
    .replace('{RAW_DATA}', rawData);

  const response = await fetch(FIREWORKS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: FIREWORKS_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 4096,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Fireworks API error: ${response.status} — ${errorBody}`);
  }

  const data: FireworksResponse = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No content in Fireworks API response');
  }

  return parseClassifierResponse(content, sourceName);
}

/**
 * Parse the LLM response into typed ClassifiedAlert objects.
 * Handles edge cases: markdown code blocks, extra text, etc.
 */
function parseClassifierResponse(content: string, sourceName: string): ClassifiedAlert[] {
  // Strip markdown code blocks if present
  let cleaned = content.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  // Find JSON array in the response
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (!arrayMatch) {
    console.warn('No JSON array found in classifier response:', content);
    return [];
  }

  try {
    const parsed = JSON.parse(arrayMatch[0]);

    if (!Array.isArray(parsed)) {
      console.warn('Parsed result is not an array:', parsed);
      return [];
    }

    // Validate and normalize each alert
    return parsed
      .filter((item: Record<string, unknown>) => item && typeof item === 'object' && item.title)
      .map((item: Record<string, unknown>) => ({
        title: String(item.title || 'Untitled Update'),
        description: String(item.description || ''),
        severity: validateSeverity(item.severity as string),
        source: sourceName,
        regulation: String(item.regulation || ''),
        affected_framework: String(item.affected_framework || ''),
        recommended_action: String(item.recommended_action || 'Review and assess impact'),
        category: validateCategory(item.category as string),
        url: item.url ? String(item.url) : undefined,
        date: item.date ? String(item.date) : undefined,
      }));
  } catch (error) {
    console.error('Failed to parse classifier response:', error);
    return [];
  }
}

const VALID_SEVERITIES = ['negligible', 'minor', 'moderate', 'major', 'critical'] as const;
const VALID_CATEGORIES = ['regulatory', 'compliance', 'enforcement', 'guidance'] as const;

function validateSeverity(value: string): ClassifiedAlert['severity'] {
  const normalized = (value || '').toLowerCase().trim();

  // Map common aliases to our enum values
  const mapping: Record<string, ClassifiedAlert['severity']> = {
    low: 'minor',
    medium: 'moderate',
    high: 'major',
  };

  if (mapping[normalized]) return mapping[normalized];
  if (VALID_SEVERITIES.includes(normalized as ClassifiedAlert['severity'])) {
    return normalized as ClassifiedAlert['severity'];
  }
  return 'moderate'; // safe default
}

function validateCategory(value: string): string {
  const normalized = (value || '').toLowerCase().trim();
  if (VALID_CATEGORIES.includes(normalized as (typeof VALID_CATEGORIES)[number])) {
    return normalized;
  }
  return 'regulatory';
}

/**
 * Classify results from all sources in sequence
 * (to avoid rate limiting on Fireworks API).
 */
export async function classifyAllResults(
  results: Array<{ sourceName: string; data: string }>,
  apiKey: string,
  onProgress?: (sourceName: string, alerts: ClassifiedAlert[]) => void
): Promise<ClassifiedAlert[]> {
  const allAlerts: ClassifiedAlert[] = [];

  for (const result of results) {
    try {
      const alerts = await classifyRegulatory(result.data, result.sourceName, apiKey);
      allAlerts.push(...alerts);
      onProgress?.(result.sourceName, alerts);
    } catch (error) {
      console.error(`Classification failed for ${result.sourceName}:`, error);
    }
  }

  return allAlerts;
}
