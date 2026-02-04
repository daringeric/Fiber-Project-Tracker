import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Logo theme="light" />
            <p className="mt-4 text-sm text-gray-600 max-w-md">
              Track your fiber installation project from start to finish.
              We&apos;re committed to keeping you informed every step of the way.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-navy-700 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-navy-700 transition-colors"
                >
                  Track Your Project
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-sm text-gray-600 hover:text-navy-700 transition-colors"
                >
                  Get Support
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-600 hover:text-navy-700 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-navy-700 mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="tel:1-800-555-0123"
                  className="hover:text-navy-700 transition-colors"
                >
                  1-800-555-0123
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@lightcurve.com"
                  className="hover:text-navy-700 transition-colors"
                >
                  support@lightcurve.com
                </a>
              </li>
              <li>Monday - Friday: 8am - 6pm</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Light Curve. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-navy-700 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-navy-700 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
