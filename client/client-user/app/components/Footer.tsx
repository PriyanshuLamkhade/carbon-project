import React from 'react'

const Footer = () => {
  return (
    <>
    <footer className="bg-gradient-to-t from-blue-50 via-white to-white border-t border-gray-200 mt-10">
  <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
    {/* Left side: Brand / Tagline */}
    <div className="text-center md:text-left">
      <h3 className="text-xl font-extrabold text-gray-800">LayerZero</h3>
      <p className="text-gray-600 text-sm mt-1">Empowering ecological restoration with transparency & tech.</p>
    </div>

    {/* Middle: Navigation Links */}
    <div className="flex space-x-6">
      <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
      <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
      <a href="#faq" className="text-gray-700 hover:text-blue-600 transition">FAQ</a>
    </div>

    {/* Right side: Social / Contact */}
    <div className="flex space-x-4">
      <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-blue-500 transition">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4 1.64a9.05 9.05 0 01-2.88 1.1A4.52 4.52 0 0016.15.49c-2.5 0-4.51 2.02-4.51 4.51 0 .35.04.69.11 1A12.8 12.8 0 013 2.16a4.52 4.52 0 001.4 6.02 4.5 4.5 0 01-2.04-.56v.06c0 2.23 1.58 4.09 3.68 4.51a4.5 4.5 0 01-2.02.08 4.53 4.53 0 004.22 3.14A9.06 9.06 0 012 19.54 12.8 12.8 0 008.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.35-.02-.53A8.32 8.32 0 0023 3z"/></svg>
      </a>
      <a href="mailto:support@mentorconnect.org" className="text-gray-500 hover:text-blue-500 transition" aria-label="Email">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M2 4a2 2 0 012-2h16a2 2 0 012 2v2l-10 6L2 6V4zm0 4v10a2 2 0 002 2h16a2 2 0 002-2V8l-10 6L2 8z" /></svg>
      </a>
    </div>
  </div>

  <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-100">
    © {new Date().getFullYear()} Mentor Connect. All rights reserved.
  </div>
</footer>

    </>
  )
}

export default Footer