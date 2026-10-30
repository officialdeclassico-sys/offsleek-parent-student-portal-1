import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Mail, Lock, Eye, EyeOff, Users, GraduationCap, KeyRound, CheckCircle2, Phone, X } from 'lucide-react';
import parentHeroImg from '../assets/images/parent_child_hero_1792307210749.jpg';
import studentHeroImg from '../assets/images/student_hero_1792307209478.jpg';
import { OffsleekLogo } from './OffsleekLogo';
import { formatISTClock, useISTNow } from '../utils/dateTime';

export const LoginScreen: React.FC = () => {
  const { login, recoverPassword, isDemoMode, setIsDemoMode, loading, error, clearError } = useAuth();
  const now = useISTNow(10000);
  const [role, setRole] = useState<UserRole>('parent');
  const [email, setEmail] = useState<string>('parent@offsleek.edu');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Modals
  const [isRecoveryOpen, setIsRecoveryOpen] = useState<boolean>(false);
  const [recoveryEmail, setRecoveryEmail] = useState<string>('');
  const [recoverySuccess, setRecoverySuccess] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'parent') {
      setEmail('parent@offsleek.edu');
    } else {
      setEmail('student@offsleek.edu');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(email, role);
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await recoverPassword(recoveryEmail);
    if (success) {
      setRecoverySuccess(true);
      setTimeout(() => {
        setRecoverySuccess(false);
        setIsRecoveryOpen(false);
      }, 2500);
    }
  };

  return (
    <div className="h-full w-full bg-white text-black flex flex-col selection:bg-black selection:text-white px-5 sm:px-6 py-2 sm:py-3 font-sans box-border overflow-y-auto overflow-x-hidden">
      
      {/* 1. Top Bar: Time, Dynamic Island, and Environment Mode Switcher */}
      <div className="flex items-center justify-between text-xs text-neutral-800 shrink-0 h-6 mb-1">
        <span className="font-semibold text-xs tracking-tight tabular-nums">{formatISTClock(now)}</span>
        
        {/* Dynamic Island Pill (Center) */}
        <div className="w-20 h-4 bg-black rounded-full mx-auto hidden xs:block"></div>

        {/* Demo / Production Environment Switcher */}
        <button
          type="button"
          onClick={() => setIsDemoMode(!isDemoMode)}
          className="text-[10px] px-2 py-0.5 rounded-full border border-neutral-300 bg-neutral-100 font-medium text-neutral-700 hover:bg-neutral-200 transition-colors flex items-center space-x-1"
          title="Toggle between Demo Sandbox and Production Mode"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? 'bg-emerald-500' : 'bg-blue-600'}`}></span>
          <span>{isDemoMode ? 'Demo' : 'Prod'}</span>
        </button>
      </div>

      {/* Main Content Area: Centered, Balanced, Unified Compact Flow */}
      <div className="w-full max-w-[370px] mx-auto my-auto flex flex-col shrink-0 py-1 sm:py-2">

        {/* 2. Hero Section: Left Logo & Tagline | Right Prominent Enlarged Hero Image (Proportionally balanced) */}
        <div className="flex items-center justify-between gap-3 pt-0.5 pb-0.5">
          {/* Left Side: Brand & Tagline */}
          <div className="flex flex-col justify-center flex-1 pr-1">
            {/* OFFSLEEK Floating Molecule Logo — Original Asset */}
            <OffsleekLogo
              variant="full"
              size="lg"
              className="-ml-1"
              imgClassName="h-14 sm:h-16 w-auto object-contain"
              showSubtitle={true}
              subtitle="SCHOOL OS"
            />

            {/* Role-Specific Tagline */}
            <h1 className="text-base sm:text-lg font-medium tracking-tight text-neutral-900 mt-2 sm:mt-2.5 leading-snug">
              {role === 'parent' ? (
                <>
                  A brighter<br />tomorrow together
                </>
              ) : (
                <>
                  Learn today,<br />Lead tomorrow
                </>
              )}
            </h1>
          </div>

          {/* Right Side: Hero Portrait Image - Balanced Proportion (aligns with left brand block) */}
          <div className="w-[44%] sm:w-[46%] max-w-[165px] flex justify-end items-center shrink-0">
            <div className="relative w-full aspect-[4/5] h-[155px] sm:h-[170px] overflow-hidden rounded-2xl border border-neutral-100 shadow-xs">
              <img
                src={role === 'parent' ? parentHeroImg : studentHeroImg}
                alt={role === 'parent' ? 'Parent and child' : 'Student'}
                className="w-full h-full object-cover object-top filter grayscale contrast-110 transition-all duration-300"
              />
              {/* Subtle gentle bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* 3. Form & Controls - Begins immediately below hero section with compact 12-14px gap */}
        <div className="flex flex-col mt-2.5 sm:mt-3 space-y-2 sm:space-y-2.5">
          
          {/* 1. Parent/Student Segmented Selector (44px ergonomic touch target) */}
          <div className="bg-[#f2f2f4] p-1 rounded-2xl flex items-center shadow-2xs h-10.5 sm:h-11 border border-neutral-200/70">
            <button
              type="button"
              onClick={() => handleRoleSelect('parent')}
              className={`flex-1 h-full rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                role === 'parent'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              <Users className="w-3.5 h-3.5 stroke-[2]" />
              <span>Parent</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={`flex-1 h-full rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                role === 'student'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 stroke-[2]" />
              <span>Student</span>
            </button>
          </div>

          {/* Error Notice if any */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-1.5 rounded-xl">
              {error}
            </div>
          )}

          {/* Form Inputs (compact 8-10px consistent spacing, 42-44px input height) */}
          <form onSubmit={handleLogin} className="space-y-2 sm:space-y-2.5">
            
            {/* 2. Email Address Field */}
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-semibold text-neutral-800">Email Address</label>
              <div className="w-full bg-[#fbfbfb] border border-neutral-200 rounded-xl px-3.5 h-10.5 sm:h-11 flex items-center space-x-2.5 focus-within:border-black focus-within:bg-white transition-all">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0 stroke-[1.8]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
              </div>
            </div>

            {/* 3. Password Field with Visibility Toggle */}
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-semibold text-neutral-800">Password</label>
              <div className="w-full bg-[#fbfbfb] border border-neutral-200 rounded-xl px-3.5 h-10.5 sm:h-11 flex items-center space-x-2.5 focus-within:border-black focus-within:bg-white transition-all">
                <Lock className="w-4 h-4 text-neutral-400 shrink-0 stroke-[1.8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-neutral-400 hover:text-neutral-700 p-1 focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 stroke-[1.8]" />
                  ) : (
                    <Eye className="w-4 h-4 stroke-[1.8]" />
                  )}
                </button>
              </div>
            </div>

            {/* 4. Options Row: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs px-1 pt-0.5">
              <label className="flex items-center space-x-2 text-neutral-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-neutral-300 text-black accent-black focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px] font-medium text-neutral-800">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setIsRecoveryOpen(true)}
                className="text-[11px] text-neutral-800 underline hover:text-black font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* 5. Full-Width Primary Sign-In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10.5 sm:h-11.5 bg-black text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 shadow-xs hover:bg-neutral-800 active:scale-[0.98] transition-all disabled:opacity-50 mt-0.5 cursor-pointer"
            >
              <span>{loading ? 'Signing in...' : `Sign in as ${role === 'parent' ? 'Parent' : 'Student'}`}</span>
              <span className="text-sm font-bold">→</span>
            </button>

            {/* Quick Demo Mode Instant Login */}
            {isDemoMode && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => login('parent@offsleek.edu', 'parent')}
                  className="py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-[10.5px] font-medium transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  title="Instant login as Parent"
                >
                  <span>⚡ Quick Parent</span>
                </button>
                <button
                  type="button"
                  onClick={() => login('student@offsleek.edu', 'student')}
                  className="py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-[10.5px] font-medium transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  title="Instant login as Student"
                >
                  <span>⚡ Quick Student</span>
                </button>
              </div>
            )}
          </form>

          {/* 4. Bottom Helper Link - Directly below sign-in button with clean spacing */}
          <div className="text-center pt-1 pb-0.5">
            <p className="text-[11px] text-neutral-600">
              New to OFFSLEEK?{' '}
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="text-black font-semibold underline hover:text-neutral-700 transition-colors"
              >
                Contact your school
              </button>
            </p>
            {isDemoMode && (
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Demo Sandbox Active: Instant login enabled for multi-child testing
              </p>
            )}
          </div>

          {/* 5. Subtle, Elegant Brand Footer with Original Logo Icon */}
          <div className="w-full pt-1.5 sm:pt-2 pb-0.5 text-center flex flex-col items-center">
            <div className="w-full border-t border-neutral-200/80 mb-1.5 sm:mb-2"></div>
            <div className="flex items-center space-x-1.5 justify-center mb-0.5">
              <OffsleekLogo variant="mark" imgClassName="h-3 w-auto" showSubtitle={false} />
              <p className="text-[9.5px] font-semibold tracking-[0.24em] text-neutral-400 uppercase leading-none">
                OFFSLEEK SCHOOL OS
              </p>
            </div>
            <p className="text-[8.5px] tracking-wide text-neutral-400 font-normal mt-0.5 leading-none">
              Education, connected.
            </p>
          </div>

        </div>

      </div>

      {/* Account Recovery Modal */}
      {isRecoveryOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 z-50">
          <div className="w-full max-w-sm bg-white text-black border border-neutral-200 p-5 rounded-3xl space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <KeyRound className="w-4 h-4 text-black" />
                <span>Account Recovery</span>
              </div>
              <button onClick={() => setIsRecoveryOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-600">
              Enter your registered portal email to receive a secure recovery OTP link.
            </p>
            {recoverySuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center space-x-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Recovery link dispatched to {recoveryEmail}.</span>
              </div>
            ) : (
              <form onSubmit={handleRecoverySubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="name@school.edu"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsRecoveryOpen(false)}
                    className="flex-1 py-2 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-xl hover:bg-neutral-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Contact Your School Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 z-50">
          <div className="w-full max-w-sm bg-white text-black border border-neutral-200 p-5 rounded-3xl space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <Phone className="w-4 h-4 text-black" />
                <span>School Administration</span>
              </div>
              <button onClick={() => setIsContactOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-600">
              For parent portal onboarding, student ID linkage, or credentials assistance:
            </p>
            <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 space-y-1.5 text-xs">
              <p><span className="font-semibold text-black">Registrar:</span> registrar@offsleek.edu</p>
              <p><span className="font-semibold text-black">Helpdesk:</span> +1 (800) 555-SLEEK</p>
              <p><span className="font-semibold text-black">Hours:</span> Mon - Fri, 8:00 AM - 4:30 PM</p>
            </div>
            <button
              onClick={() => setIsContactOpen(false)}
              className="w-full py-2 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
