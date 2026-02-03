import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#f7f7f7] border-t border-[#e5e5e5] mt-12">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14 py-12 grid grid-cols-2 md:grid-cols-4 gap-10 text-[14px] text-[#2f2f2f]">
        <div>
          <h3 className="text-[15px] font-semibold mb-3 text-[#1f1f1f]">Courses</h3>
          <div className="space-y-2 text-[#404040] leading-relaxed">
            <div>Game Dev 101</div>
            <div>C# for Beginners</div>
            <div>Phaser.js Mastery</div>
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-semibold mb-3 text-[#1f1f1f]">Features</h3>
          <div className="space-y-2 text-[#404040] leading-relaxed">
            <div>Live Code Editor</div>
            <div>GameJam Arena</div>
            <div>Real-time Judge</div>
            <div>Sandbox Mode</div>
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-semibold mb-3 text-[#1f1f1f]">About</h3>
          <div className="space-y-2 text-[#404040] leading-relaxed">
            <div>Terms & Conditions</div>
            <div>Privacy Policy</div>
            <div>Security</div>
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-semibold mb-3 text-[#1f1f1f]">Contacts</h3>
          <div className="flex items-center gap-4 text-[#1a1a1a]">
            <a aria-label="Facebook" href="#" className="w-10 h-10" title="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.34 2 1.86 6.48 1.86 12.07c0 4.93 3.51 9.03 8.1 9.88v-6.99H7.9v-2.89h2.06v-2.2c0-2.03 1.21-3.16 3.06-3.16.89 0 1.82.16 1.82.16v2H13.6c-1.01 0-1.32.63-1.32 1.27v1.93h2.25l-.36 2.89h-1.89v6.99c4.59-.85 8.1-4.95 8.1-9.88Z" />
              </svg>
            </a>
            <a aria-label="Instagram" href="#" className="w-10 h-10" title="Instagram">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                <circle cx="17" cy="7" r="1.2" fill="currentColor" />
              </svg>
            </a>
            <a aria-label="TikTok" href="#" className="w-10 h-10" title="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M14.6 4.5c.47 1.33 1.55 2.4 2.88 2.84.35.12.71.19 1.08.22v2.13c-.99-.03-1.97-.28-2.86-.73a6.9 6.9 0 0 1-1.1-.69v6.27c0 2.78-2.25 5.01-5.05 5.01A5.03 5.03 0 0 1 5.5 13.6c.33-2.37 2.38-4.2 4.86-4.2.34 0 .68.03 1.01.1v2.27a2.9 2.9 0 0 0-1.01-.18 2.81 2.81 0 0 0-2.86 2.8 2.81 2.81 0 0 0 2.86 2.8c1.1 0 2.05-.64 2.48-1.58.14-.3.21-.63.21-.96V4.5h1.65Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

