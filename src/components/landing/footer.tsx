"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/neptune-logo.png"
                alt="Neptune Plastics"
                width={120}
                height={72}
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Leading manufacturer of lab extrusion lines for masterbatch, raffia tape, film filament and pipes since 1968.
            </p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-[#E07A5F] text-gray-600 hover:text-white transition-all flex items-center justify-center group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-[#E07A5F] text-gray-600 hover:text-white transition-all flex items-center justify-center group"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-[#E07A5F] text-gray-600 hover:text-white transition-all flex items-center justify-center group"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-[#E07A5F] text-gray-600 hover:text-white transition-all flex items-center justify-center group"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Products
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/calculator" className="text-sm text-gray-600 hover:text-[#E07A5F] transition-colors">
                  25mm Lab Raffia Tape Line
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-sm text-gray-600 hover:text-[#E07A5F] transition-colors">
                  25mm Blown Film Lab Line
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-sm text-gray-600 hover:text-[#E07A5F] transition-colors">
                  Masterbatch Solutions
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-sm text-gray-600 hover:text-[#E07A5F] transition-colors">
                  Filament Extrusion
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#about" className="text-sm text-gray-600 hover:text-[#E07A5F] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#customers" className="text-sm text-gray-600 hover:text-[#E07A5F] transition-colors">
                  Our Customers
                </Link>
              </li>
              <li>
                <Link href="/#global-reach" className="text-sm text-gray-600 hover:text-[#E07A5F] transition-colors">
                  Global Reach
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-sm text-gray-600 hover:text-[#E07A5F] transition-colors">
                  ROI Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@neptuneplastics.com"
                  className="text-sm text-gray-600 hover:text-[#E07A5F] transition-colors flex items-start gap-2"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>info@neptuneplastics.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+911234567890"
                  className="text-sm text-gray-600 hover:text-[#E07A5F] transition-colors flex items-start gap-2"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>+91 123 456 7890</span>
                </a>
              </li>
              <li>
                <div className="text-sm text-gray-600 flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} Neptune Plastics. Est. 1968. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#E07A5F] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-[#E07A5F] transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-sm text-gray-500 hover:text-[#E07A5F] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
