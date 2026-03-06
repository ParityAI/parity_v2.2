import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Loader2, LogIn } from "lucide-react";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const DEMO_EMAIL = "admin@parityai.demo";
const DEMO_PASSWORD = "admin123";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0].message;
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0].message;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ variant: "destructive", title: "Sign in failed", description: error.message });
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: redirectUrl },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        toast({ variant: "destructive", title: "Account exists", description: "This email is already registered. Please sign in instead." });
      } else {
        toast({ variant: "destructive", title: "Sign up failed", description: error.message });
      }
    } else if (data.user) {
      const demoOrgId = "00000000-0000-0000-0000-000000000001";
      await supabase.from("profiles").insert({
        user_id: data.user.id, organization_id: demoOrgId, full_name: email.split("@")[0],
      });
      await supabase.from("user_roles").insert({ user_id: data.user.id, role: "user" });
      toast({ title: "Account created", description: "You can now sign in with your credentials." });
    }
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    // Try to sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL, password: DEMO_PASSWORD,
    });

    if (signInError) {
      // If sign-in fails, create the demo account first
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: DEMO_EMAIL, password: DEMO_PASSWORD,
      });

      if (signUpError) {
        toast({ variant: "destructive", title: "Demo login failed", description: signUpError.message });
        setDemoLoading(false);
        return;
      }

      if (data.user) {
        const demoOrgId = "00000000-0000-0000-0000-000000000001";
        await supabase.from("profiles").insert({
          user_id: data.user.id, organization_id: demoOrgId, full_name: "Demo Admin",
        });
        await supabase.from("user_roles").insert({ user_id: data.user.id, role: "admin" });

        // Sign in after creating account
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: DEMO_EMAIL, password: DEMO_PASSWORD,
        });
        if (loginError) {
          toast({ variant: "destructive", title: "Demo login failed", description: loginError.message });
        }
      }
    }
    setDemoLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">P</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Parity AI</span>
          </Link>
        </div>

        {/* Demo Login Card */}
        <Card className="mb-4 border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <p className="text-sm font-medium text-foreground">
                🚀 Quick Demo Access for Investors
              </p>
              <p className="text-xs text-muted-foreground">
                One-click login with full admin access to explore all features
              </p>
              <Button
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="w-full gap-2"
                size="lg"
              >
                {demoLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                {demoLoading ? "Logging in..." : "Login as Demo Admin"}
              </Button>
              <p className="text-[11px] text-muted-foreground">
                Email: {DEMO_EMAIL} · Password: {DEMO_PASSWORD}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input id="signin-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">← Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
