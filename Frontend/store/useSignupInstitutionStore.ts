import { create } from "zustand";
import {
  SignupInstitutionFirstStageData,
  SignupInstitutionSecondStageData,
  SignupInstitutionThirdStageData,
} from "@/utils/schemas/signupInstitutionSchema";

type SignupInstitutionStore = {
  data: Partial<
    SignupInstitutionFirstStageData &
      SignupInstitutionSecondStageData &
      SignupInstitutionThirdStageData
  >;
  updateData: (newData: Partial<SignupInstitutionStore["data"]>) => void;
  clearData: () => void;
};

export const useSignupInstitutionStore = create<SignupInstitutionStore>(
  (set) => ({
    data: {},
    updateData: (newData) =>
      set((state) => ({
        data: { ...state.data, ...newData },
      })),
    clearData: () => set({ data: {} }),
  })
);
