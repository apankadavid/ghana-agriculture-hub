import Link from "next/link";


function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.8L4.4 22H1.3l8.1-9.3L1 2h7.1l4.9 6.2L18.9 2Zm-1.2 18h1.7L7.4 4H5.6l12.1 16Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c2.7 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.89 1.11 1.15 1.77.25.64.42 1.37.47 2.43C21.99 8.94 22 9.3 22 12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47C15.06 21.99 14.7 22 12 22s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.7 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45.53C6.09.28 6.82.11 7.88.06 8.94.01 9.3 0 12 0Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.4 4.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-green-950 text-green-100">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo-full-transparent.png" alt="Ghana Agriculture Hub" className="h-14 w-auto mb-2 brightness-0 invert" />
        </div>

        <div>
          <h4 className="text-white text-sm font-medium mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-green-300">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/marketplace">Marketplace</Link></li>
            <li><Link href="/knowledge">Knowledge</Link></li>
            <li><Link href="/weather">Weather</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-medium mb-3">For Users</h4>
          <ul className="space-y-2 text-sm text-green-300">
            <li><Link href="/register">Register</Link></li>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-medium mb-3">Stay Connected</h4>
          {/* Placeholder — no real social accounts exist yet, links go nowhere */}
          <div className="flex gap-3 mb-4">
            <FacebookIcon />
            <XIcon />
            <InstagramIcon />
            <LinkedInIcon />
            <YoutubeIcon />
          </div>
          {/* Visual only — no email capture backend built yet */}
          <p className="text-sm text-green-300 mb-2">Subscribe to our newsletter</p>
          <form className="flex gap-1">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 min-w-0 rounded px-2 py-1.5 text-gray-900 text-xs"
            />
            <button
              type="submit"
              className="bg-green-600 text-white rounded px-3 text-xs shrink-0"
            >
              →
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-green-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-green-400">
          <p>© {new Date().getFullYear()} Ghana Agriculture Hub. All rights reserved.</p>
          <p>Designed for Ghana. Scalable for Africa.</p>
        </div>
      </div>
    </footer>
  );
}