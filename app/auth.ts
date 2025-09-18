import AsyncStorage from "@react-native-async-storage/async-storage";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: string;
}

interface LoginPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  /** persist rehydration 완료 여부 (UI 깜빡임/미스매치 방지용) */
  hasHydrated: boolean;

  /** 액션들 */
  login: (data: LoginPayload) => void;
  logout: () => void;
  setTokens: (tokens: {
    accessToken?: string | null;
    refreshToken?: string | null;
  }) => void;
  setUser: (user: User | null) => void;
}

// TODO: react-native-keychain 등을 이용해 토큰 보안 강화 고려
/** 코어 스토어 (persist 래핑 전) */
const authStoreCreator: StateCreator<AuthState> = (set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  hasHydrated: false,

  login: (data) =>
    set(() => ({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    })),

  logout: () =>
    set(() => ({
      accessToken: null,
      refreshToken: null,
      user: null,
    })),

  setTokens: (tokens) =>
    set((state) => ({
      accessToken: tokens.accessToken ?? state.accessToken,
      refreshToken: tokens.refreshToken ?? state.refreshToken,
    })),

  setUser: (user) => set(() => ({ user })),
});

export const useAuthStore = create<AuthState>()(
  persist(authStoreCreator, {
    name: "auth-storage",
    storage: createJSONStorage(() => AsyncStorage),

    /**
     * persist에 저장/복원할 키만 선별 (불필요한 값 누적 방지)
     * hasHydrated 같은 런타임 플래그는 저장하지 않음 -> 첫 앱 실행했을 때만 사용하는거라 따로 저장할 필요없음.
     */
    partialize: (state) => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
      user: state.user,
    }),

    /**
     * 마이그레이션(버전업 시 스키마 변경 대응)
     */
    version: 1,
    migrate: async (persistedState, version) => {
      // 버전 바뀔 때 필요한 정리 로직이 있으면 여기에 추가
      return persistedState as any;
    },

    /**
     * 복원 훅: UI에서 안전하게 "복원완료"를 감지할 수 있게 플래그를 켭니다.
     */
    onRehydrateStorage: () => (state, error) => {
      if (error) {
        // 로깅 등
        return;
      }
      // hydrate가 끝난 직후 한 번 더 set
      useAuthStore.setState({ hasHydrated: true });
    },
  })
);
