import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, UserRoundPlus } from "lucide-react";
import React from "react";

const ToggleBakeryList = () => {
  return (
  
      <Button
        variant="outline"
        className="font-lao justify-start h-8 md:h-9 max-w-50"
        disabled
      >
        <Eye className="mr-1 h-4 w-4" /> ສະຫຼັບ
      </Button>
  );
};

export default ToggleBakeryList;
