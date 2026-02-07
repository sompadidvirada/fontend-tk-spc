"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export type Branch = {
  id: number;
  name: string;
  province: string;
  lat: number;
  lng: number;
};

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

const BranchMap = ({ branchs }: { branchs: Branch[] }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [102.6331, 17.9757],
      zoom: 12,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // 🔥 REMOVE old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 🔥 ADD new markers
    branchs.forEach((branch) => {
      if (branch.lat == null || branch.lng == null) return;

      // 1. Create a custom HTML element for the marker
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.backgroundColor = "#e11d48";
      el.style.width = "22px";
      el.style.height = "22px";
      el.style.borderRadius = "50% 50% 50% 50%";
      el.style.transform = "rotate(-45deg)";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";

      // 2. Add marker to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([branch.lng, branch.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
  <div style="font-family: 'Noto Sans Lao', sans-serif; padding: 5px; min-width: 160px;">
    <strong style="display: block; color: #e11d48; font-size: 15px; margin-bottom: 2px;">
      ${branch.name}
    </strong>
    <span style="color: #64748b; font-size: 13px; display: block; margin-bottom: 10px;">
      ${branch.province}
    </span>
    <a 
      href="https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}" 
      target="_blank" 
      rel="noopener noreferrer"
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e11d48;
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        text-decoration: none;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(225, 29, 72, 0.2);
      "
      onmouseover="this.style.backgroundColor='#be123c'; this.style.transform='translateY(-1px)';"
      onmouseout="this.style.backgroundColor='#e11d48'; this.style.transform='translateY(0)';"
    >
      <svg style="width:16px; height:16px; margin-right:6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
      </svg>
      ທາງໄປສາງຂາ
    </a>
  </div>
`),
        )
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
    const handleJump = (e: any) => {
      const { lat, lng, id } = e.detail;
      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom: 16,
        essential: true,
      });

      // Find the marker and open its popup
      const target = markersRef.current.find((m) => (m as any).id === id);
      if (target) {
        (target as any).marker.togglePopup();
      }
    };

    window.addEventListener("map-jump", handleJump);
    return () => window.removeEventListener("map-jump", handleJump);
  }, [branchs]);

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border">
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 16px !important; /* Adds space inside the whole box */
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .mapboxgl-popup-close-button {
          top: 8px !important; /* Moves it down from the top edge */
          right: 8px !important; /* Moves it in from the right edge */
          font-size: 18px; /* Makes the 'X' a bit easier to click */
          color: #64748b; /* Neutral color */
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .mapboxgl-popup-close-button:hover {
          background-color: #f1f5f9; /* Light grey circle on hover */
          color: #ef4444; /* Changes X to red on hover */
        }
      `}</style>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default BranchMap;
