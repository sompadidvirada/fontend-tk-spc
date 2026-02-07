"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit2, Trash2, MapPin } from "lucide-react";
import EditBranch from "./EditBranch";

type Branch = {
  id: number;
  name: string;
  province: string;
  lat: number;
  lng: number;
};

interface DetailBranchProps {
  branchs: Branch[];
}

const DetailBranch = ({ branchs }: DetailBranchProps) => {
    const handleJumpToLocation = (lat: number, lng: number) => {
    // Dispatch a custom event that the Map component will listen to
    const event = new CustomEvent("map-jump", { detail: { lat, lng } });
    window.dispatchEvent(event);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-lao">
          ລາຍລະອຽດແຕ່ລະສາຂາ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl font-lao">
        <DialogHeader>
          <DialogTitle className="text-xl border-b pb-2">
            ລາຍຊື່ສາຂາທັງໝົດ
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            {branchs.map((branch) => (
              <div
                key={branch.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex gap-3 items-center">
                  <div className="p-2 bg-rose-100 rounded-full" >
                    <MapPin className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{branch.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ແຂວງ: {branch.province}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <EditBranch branch={branch} />

                  <Button
                    size="icon"
                    variant="outline"
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    disabled
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {branchs.length === 0 && (
              <p className="text-center text-muted-foreground py-10">
                ບໍ່ມີຂໍ້ມູນສາຂາ
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DetailBranch;
