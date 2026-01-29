"use client";

import { VideoThumbnailPlayer } from "@/components/ui/video-player";

export function VideoSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            See the 25mm Lab Raffia Tape Line in Action
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test before you commit. Use just 4.5-6 kg of material instead of 600 kg. Save ₹34-80 Lakhs annually on wastage and production trials.
          </p>
        </div>

        {/* Video Player */}
        <div className="max-w-4xl mx-auto">
          <VideoThumbnailPlayer
            thumbnailUrl="https://img.youtube.com/vi/UDEbAwv8d1I/maxresdefault.jpg"
            videoUrl="https://www.youtube.com/embed/UDEbAwv8d1I?autoplay=1"
            title="25mm Lab Raffia Tape Line"
            description="See what this machine can do for you"
            aspectRatio="16/9"
            className="rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
