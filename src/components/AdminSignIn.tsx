import React, { useState } from 'react';
import { Shield, Key, Mail, Eye, EyeOff } from 'lucide-react';

export const AdminSignIn: React.FC<{ onSignIn: () => void }> = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn();
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-slate-950/60 p-8 rounded-2xl border border-slate-900 shadow-2xl">
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-full bg-slate-900 border border-slate-800">
          <Shield className="w-8 h-8 text-amber-500" />
        </div>
      </div>
      <h2 className="text-2xl font-black text-center text-white mb-6 uppercase tracking-wider">Admin Portal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-full bg-slate-900 p-3 rounded-lg border border-slate-800 text-white focus:border-amber-500 transition-colors"
            placeholder="admin@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full bg-slate-900 p-3 pr-10 rounded-lg border border-slate-800 text-white focus:border-amber-500 transition-colors"
              placeholder="Enter admin password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* No error message needed */}
        <button
          type="submit"
          className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-lg flex items-center justify-center gap-2 transition-colors uppercase tracking-wider text-sm"
        >
          <Key className="w-4 h-4" /> Sign In
        </button>
      </form>
    </div>
  );
};
