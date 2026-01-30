"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  isDownloading: boolean;
  leadName?: string;
}

export function DownloadModal({
  isOpen,
  onClose,
  onDownload,
  isDownloading,
  leadName,
}: DownloadModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-green-600" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-center text-[#1A1A1A] mb-2">
              Your Report is Ready!
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Click below to download your detailed ROI report and quotation
            </p>

            {/* Download Button */}
            <Button
              onClick={onDownload}
              disabled={isDownloading}
              size="lg"
              className="w-full bg-[#E07A5F] hover:bg-[#C96A51]"
            >
              {isDownloading ? (
                <>
                  <Download className="mr-2 h-4 w-4 animate-bounce" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report & Quotation
                </>
              )}
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
