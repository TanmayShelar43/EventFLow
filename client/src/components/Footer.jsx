import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#121316] text-white pt-16 pb-12 border-t border-[#26282E]">
      <div className="container-desktop">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#26282E]">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-bold text-sm">
                EF
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Event<span className="text-[#6366F1]">Flow</span>
              </span>
            </a>
            <p className="text-xs text-[#8E8F99] leading-relaxed max-w-sm">
              EventFlow is a premium event discovery platform curated for live concerts, stand-up comedy, hands-on workshops, and cultural arts.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Discover</h4>
            <ul className="space-y-2 text-xs text-[#8E8F99]">
              <li><a href="#hero" className="hover:text-white transition-colors">Concerts</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">Comedy Shows</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">Masterclasses</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">Art Exhibitions</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Company</h4>
            <ul className="space-y-2 text-xs text-[#8E8F99]">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press & Media</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Newsletter Input */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Stay Updated</h4>
            <p className="text-xs text-[#8E8F99]">Subscribe to receive weekly curated event digests in your city.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email..." 
                className="bg-[#1E2026] text-xs text-white placeholder-[#8E8F99] px-3.5 py-2.5 rounded-lg border border-[#2E313A] focus:outline-none focus:border-[#4F46E5] flex-1"
              />
              <button className="px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-xs font-semibold text-white rounded-lg transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E8F99] gap-4">
          <p>© {new Date().getFullYear()} EventFlow Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}