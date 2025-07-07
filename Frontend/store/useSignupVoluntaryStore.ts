import { create } from "zustand";
import {
  SignupVoluntaryFirstStageData,
  SignupVoluntarySecondStageData,
  SignupVoluntaryThirdStageData,
} from "@/utils/schemas/signupVoluntarySchema";

type SignupVoluntaryStore = {
  data: Partial<
    SignupVoluntaryFirstStageData &
      SignupVoluntarySecondStageData &
      SignupVoluntaryThirdStageData
  >;
  updateData: (newData: Partial<SignupVoluntaryStore["data"]>) => void;
  clearData: () => void;
};

export const useSignupVoluntaryStore = create<SignupVoluntaryStore>(
  (set) => ({
    data: {},
    updateData: (newData) =>
      set((state) => ({
        data: { ...state.data, ...newData },
      })),
    clearData: () => set({ data: {} }),
  })
);
