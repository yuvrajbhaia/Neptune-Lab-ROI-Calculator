"use client";

import { WorldMap } from "@/components/ui/map";

export function GlobalReach() {
  return (
    <section className="py-12 sm:py-16 md:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Global Reach
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            With 2,457+ machines installed across 6 continents, Neptune Plastics has been serving the global plastics industry for 57 years. Our technology powers production facilities worldwide.
          </p>
        </div>

        <WorldMap
          dots={[
            {
              start: { lat: 20.5937, lng: 78.9629, label: "India" },
              end: { lat: 37.0902, lng: -95.7129, label: "USA" }
            },
            {
              start: { lat: 20.5937, lng: 78.9629, label: "India" },
              end: { lat: 51.1657, lng: 10.4515, label: "Germany" }
            },
            {
              start: { lat: 20.5937, lng: 78.9629, label: "India" },
              end: { lat: -14.2350, lng: -51.9253, label: "Brazil" }
            },
            {
              start: { lat: 20.5937, lng: 78.9629, label: "India" },
              end: { lat: 25.2744, lng: 133.7751, label: "Australia" }
            },
            {
              start: { lat: 20.5937, lng: 78.9629, label: "India" },
              end: { lat: 35.6762, lng: 139.6503, label: "Japan" }
            },
            {
              start: { lat: 20.5937, lng: 78.9629, label: "India" },
              end: { lat: -1.2921, lng: 36.8219, label: "Kenya" }
            }
          ]}
          lineColor="#E07A5F"
        />
      </div>
    </section>
  );
}
