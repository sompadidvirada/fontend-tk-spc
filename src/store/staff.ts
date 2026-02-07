import { create } from "zustand";
import { persist } from "zustand/middleware";

type Staff_Deatil = {
  id: string;
  name: string;
  image?: string;
  phonenumber: string;
  role: string;
  birthdate: string;
  branchId: number | null;
  branch_name: string | null;
};

interface SATFFState {
  staff: Staff_Deatil;
  setStaff: (staff: Staff_Deatil) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  resetStaff: () => void;
}
export const useStaffStore = create<SATFFState>()(
  persist(
    (set) => ({
      staff: {
        id: "",
        name: "",
        phonenumber: "",
        role: "",
        birthdate: "",
        image: "",
        branchId: null,
        branch_name: null,
      },
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setStaff: (staff) => set({ staff }),
      resetStaff: () =>
        set({
          staff: {
            id: "",
            name: "",
            phonenumber: "",
            role: "",
            birthdate: "",
            image: "",
            branchId: null,
            branch_name: null,
          },
        }),
    }),
    {
      name: "staff-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
