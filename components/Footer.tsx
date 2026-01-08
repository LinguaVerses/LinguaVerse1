import React from 'react';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">L</div>
              <span className="text-xl font-bold tracking-tight">LinguaVerse</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Explore infinite worlds across languages. Your ultimate destination for web novels from around the globe.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-200">Discover</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-pink-400 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Top Rated</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Completed</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Recommendations</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-200">Support</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-pink-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Writer Guidelines</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-200">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-purple-600 transition-all"><Facebook size={18} /></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-purple-600 transition-all"><Twitter size={18} /></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-purple-600 transition-all"><Instagram size={18} /></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-purple-600 transition-all"><Mail size={18} /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} LinguaVerse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;