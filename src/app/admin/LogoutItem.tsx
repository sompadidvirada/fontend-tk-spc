"use client"

import { useState } from "react"
import { LogOut, AlertTriangle, Loader2 } from "lucide-react"
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { logoutAction } from "../(auth)/logout/action"
import { useStaffStore } from "@/store/staff"

export function LogoutItem({lang}: {lang: string}) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const resetStaff = useStaffStore((state) => state.resetStaff);

 const handleLogout = async () => {
    setIsPending(true)
    try {
      resetStaff();
      await logoutAction()
  
    } catch (err) {
      console.error("Logout failed:", err)
      setIsPending(false)
    }
  }

  return (
    <>
      {/* 1. The Menu Item */}
      <DropdownMenuItem
        className="font-lao cursor-pointer text-destructive focus:text-destructive"
        onSelect={(e) => {
          e.preventDefault() // Prevents dropdown from closing instantly
          setShowLogoutDialog(true)
        }}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>{lang ==="LA" ? "ອອກຈາກລະບົບ" : "log out"}</span>
      </DropdownMenuItem>

      {/* 2. The Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="font-lao sm:max-w-[400px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle>ຢືນຢັນການອອກຈາກລະບົບ</DialogTitle>
            </div>
            <DialogDescription className="pt-2 text-base">
              ທ່ານແນ່ໃຈຫຼືບໍ່ວ່າຕ້ອງການອອກຈາກລະບົບ? ທ່ານຈະຕ້ອງໄດ້ເຂົ້າສູ່ລະບົບໃໝ່ເພື່ອເຂົ້າເຖິງຂໍ້ມູນ.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex flex-row gap-2 pt-4 sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowLogoutDialog(false)}
              disabled={isPending}
            >
              ຍົກເລີກ
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isPending}
              className="min-w-[100px]"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "ຢືນຢັນອອກລະບົບ"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}