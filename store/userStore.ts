import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import axios from "axios";

interface IState {
  userData: Record<string, any> | null;
  setUserData: () => void;
  logoutUser: () => void;
  userTheme: string;
  setUserTheme: (theme: string) => void;
}

// Create the store
export const useUserStore = create<IState>()(
  immer<IState>((set) => ({
    userData: null,
    userTheme: "dark",
    setUserData: async (): Promise<void> => {
      try {
        const response = await axios.post('/api/user', {});
        const userData = response.data.user;
        
        if (userData) {
          const questionsResponse = await axios.get('/api/learners-community/profile');
          
          if (questionsResponse.data) {
            // Merge the profile data with user data
            const updatedUserData = {
              ...userData,
              questionsAsked: questionsResponse.data.questionsAsked || 0,
              recentQuestions: questionsResponse.data.recentQuestions || []
            };
            
            set((state) => {
              state.userData = updatedUserData;
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    },
    logoutUser: () => {
      set((state) => {
        state.userData = null;
      });
    },
    setUserTheme: (theme: string) => {
      set((state) => {
        state.userTheme = theme;
      });
    },
  }))
);
