"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  CheckCircle2,
  Building2,
  ArrowRight,
  Key,
  User,
  Fingerprint,
  LogIn,
  Sparkles,
} from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const { login, isAuthenticated } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Check for saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem("adminEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Lock timer
  useEffect(() => {
    if (isLocked && lockTimer > 0) {
      const timer = setTimeout(() => setLockTimer(lockTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isLocked && lockTimer === 0) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [isLocked, lockTimer]);

  if (isAuthenticated) {
    router.push("/admin/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLocked) {
      setError(`Account locked. Please wait ${lockTimer} seconds.`);
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);

      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem("adminEmail", email);
      } else {
        localStorage.removeItem("adminEmail");
      }

      router.push("/admin/dashboard");
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockTimer(60); // Lock for 60 seconds
        setError("Too many failed attempts. Account locked for 60 seconds.");
      } else {
        setError(err instanceof Error ? err.message : "Invalid credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    alert("Password reset link will be sent to your email.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5 bg-repeat"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl"></div>

      <Card className="w-full max-w-md p-8 border-0 shadow-2xl bg-gradient-to-b from-card to-secondary/5 relative z-10">
        {/* Logo & Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold shadow-lg shadow-primary/20 mx-auto mb-4">
            <Building2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            HATI Admin
          </h1>
          <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Secure Access Portal
          </p>
        </div>

        {/* Status Badge */}
        <div className="mb-6 flex justify-center">
          <Badge variant="outline" className="gap-2 text-xs">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
            System Online
          </Badge>
        </div>

        {/* Welcome Message */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-primary/10">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Welcome Back</p>
              <p className="text-xs text-muted-foreground mt-1">
                Sign in to manage your content and access admin controls
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 flex items-center gap-2"
            >
              <Mail className="h-4 w-4 text-primary" />
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hati.com"
                required
                disabled={isLocked}
                className="w-full px-4 py-3 pl-10 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 flex items-center gap-2"
            >
              <Lock className="h-4 w-4 text-primary" />
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLocked}
                className="w-full px-4 py-3 pl-10 pr-12 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLocked}
                className="rounded border-primary/20 text-primary focus:ring-primary focus:ring-offset-0"
              />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:underline transition-all"
              disabled={isLocked}
            >
              Forgot password?
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Lock Timer */}
          {isLocked && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>Account locked. Please wait {lockTimer} seconds.</span>
            </div>
          )}

          {/* Demo Credentials */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                Demo Credentials
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="font-mono">admin@hati.com</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Password:</span>
                <span className="font-mono">demo123</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full gap-2 text-base h-12"
            disabled={isLoading || isLocked}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Security Footer */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>Secure login with 256-bit encryption</span>
              <Fingerprint className="h-3 w-3 ml-2" />
            </div>
            {attempts > 0 && !isLocked && (
              <div className="mt-2 text-xs text-muted-foreground">
                {5 - attempts} attempts remaining
              </div>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
