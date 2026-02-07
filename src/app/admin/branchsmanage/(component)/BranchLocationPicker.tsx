"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

type Props = {
  value: { lat: number; lng: number } | null;
  onChange: (val: { lat: number; lng: number }) => void;
};

const BranchLocationPicker = ({ value, onChange }: Props) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const updateLocation = (lat: number, lng: number) => {
    if (!mapRef.current) return;

    // Move Map
    mapRef.current.flyTo({ center: [lng, lat], zoom: 15 });

    // Update Marker
    markerRef.current?.remove();
    markerRef.current = new mapboxgl.Marker({ color: "#e11d48" })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    // Update parent state
    onChange({ lat, lng });
  };

  const handleSearch = () => {
    // Regex to handle "lat, lng" or "lat lng"
    const coords = searchValue.split(/[ ,]+/).map(Number);
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      updateLocation(coords[0], coords[1]);
    } else {
      alert("Format ບໍ່ຖືກຕ້ອງ. ກະລຸນາໃສ່: latitude, longitude");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 🛑 Stops the "Add Branch" form from submitting
      handleSearch(); // 🔍 Triggers the map search instead
    }
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const startCenter: [number, number] = value
      ? [value.lng, value.lat]
      : [102.6331, 17.9757];

    const startZoom = value ? 15 : 12;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: startCenter,
      zoom: startZoom,
    });

    if (value) {
      markerRef.current = new mapboxgl.Marker({ color: "#e11d48" })
        .setLngLat([value.lng, value.lat])
        .addTo(mapRef.current);
    }

    mapRef.current.addControl(new mapboxgl.NavigationControl());

    mapRef.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      // Remove old marker
      markerRef.current?.remove();

      // Add new marker
      markerRef.current = new mapboxgl.Marker({ color: "#e11d48" })
        .setLngLat([lng, lat])
        .addTo(mapRef.current!);

      onChange({ lat, lng });
    });
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="ວາງພິກັດທີ່ນີ້ (e.g. 17.96, 102.61)"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-xs"
        />
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={handleSearch}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <div className="h-[300px] w-full rounded-lg border overflow-hidden relative">
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default BranchLocationPicker;
