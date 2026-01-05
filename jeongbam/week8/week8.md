### **01. 전역 상태가 필요한 이유**

**1) 상태 정의 방법**

- 상태 끌어올리기 개념을 활용
- 공통 부모 컴포넌트에서 상태 정의

**2) Props Drilling**

- props를 중첩해서 계속 전달하는 패턴
- 리액트에서는 Context API, Redux Toolkit, Zustand를 라이브러리를 사용해서 해결

---

### **02. Context API**

**1) Context API란?**

- 상태를 포함한 다양한 데이터를 컴포넌트 트리 전역에서 공유
- Context 객체 생성 후, 이를 통해 데이터의 공유 범위와 공유할 데이터 설정→ 해당 컨텍스트 객체의 공유 범위에 포함된 다른 컴포넌트들은 컨텍스트 객체에서 공유하는 데이터 가져와서 사용

```tsx
// Context 객체 생성하기// TypeError 방지 위해 매개변수를 null 값으로 넘겨줌// Context 객체 할당될 변수는 대문자로 지정 -> Context 객체를 컴포넌트처럼 활용할 예정이기 때문const CounterContext = createContext<CounterContextType | (null);

return (
    <>
     <CounterContext value={{count, increment, decrement, reset}}>
      <Count
        count={count}
        increment={increment}
        decrement={decrement}
        reset={reset}
      />
      <CounterOutside count={count> />
     <CounterContext?
    </>
);
```

- Context 객체를 통해 데이터 공급 범위 지정
- 공급하고 있는 value라는 속성의 데이터들을 공유 범위 내 각각의 컴포넌트들이 직접 접근하여 사용 가능→ Props Drilling으로 전달해주는 것 없이도 똑같은 기능 가지고 있는 App 생성 가능

---

**2) Context API 개선**

- Context의 경우, 별도의 파일로 분리해서 작성하는 것이 코드 유지 보수 및 가독성 측면에서 유리
- 'context' 폴더를 따로 만들어서 컨텍스트 객체, 생성하는 파일, 공유 범위 설정 컴포넌트, 커스텀 훅 등을 세트로 만드는 것이 좋음

(1) CounterContext.ts

```tsx
import { createContext } from "react";

type CounterContextType = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};
export const CounterContext = createContext<CounterContextType | null>(null);
```

(2) CounterProvider.tsx

```tsx
import { useState } from "react";
import { CounterContext } from "./CounterContext";

export default function CounterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount((count) => count + 1);
  };
  const decrement = () => {
    setCount((count) => count - 1);
  };
  const reset = () => {
    setCount(0);
  };
  return (
    <>
      <CounterContext value={{ count, increment, decrement, reset }}>
        {children}
      </CounterContext>
    </>
  );
}
```

(3) useCounter.ts

```tsx
import { useContext } from "react";
import { CounterContext } from "./CounterContext";

export default function useCounter() {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error("useCounter는 CounterProvider 안에서만 사용가능합니다.");
  }
  return context;
}
```

---

**3) Context API 리렌더링**

- 증가 or 감소 버튼 클릭 시, 카운트 버튼 컴포넌트도 함께 리렌더링 됨 → 불필요한 리렌더링
- 보통 불필요한 리렌더링 → React.memo 함수나 useCallback 훅을 사용해야 함
- Context API가 리렌더링 되는 이유
  - Context API는 공유하는 상태값이 변경되면, CounterProvider이라는 컴포넌트가 리렌더링 됨
  - 컴포넌트 리렌더링 시, 컨텍스트 객체에서 value 속성으로 제공되고 있는 객체가 매번 새로운 객체값으로 변경됨→ **value 속성을 Memorization해서 해결**해야 함→ 여기서 함수는 메모리제이션 되어져도 괜찮지만, 상태값은 X (숫자가 변하지 않기 때문)

(1) CounterProvider.tsx

```tsx
import { useMemo, useState } from "react";
import { CounterContext, CounterContextAction } from "./CounterContext";

export default function CounterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount((count) => count + 1);
  };
  const decrement = () => {
    setCount((count) => count - 1);
  };
  const reset = () => {
    setCount(0);
  };

  const memoization = useMemo(() => ({ increment, decrement, reset }), []);
  return (
    <>
      <CounterContextAction value={memoization}>
        <CounterContext value={{ count }}>{children}</CounterContext>
      </CounterContextAction>
    </>
  );
}
```

(2) CounterContext.ts

```tsx
import { createContext } from "react";

type CounterContextType = {
  count: number;
};
type CounterContextActionType = {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};
export const CounterContext = createContext<CounterContextType | null>(null);
export const CounterContextAction =
  createContext<CounterContextActionType | null>(null);
```

---

**4) Context API reducer**

- useState → useReducer로 변경하기
- 'reducer' 폴더 생성
- 결론 : API 데이터 공유에 있어 useState, useReducer, 일반 데이터 모두 문제 X

(1) counterReducer.ts

```tsx
export default function counterReducer(
  count: number,
  action: { type: string }
) {
  switch (action.type) {
    case "INCREMENT":
      return count + 1;
    case "DECREMENT":
      return count - 1;
    case "RESET":
      return 0;
    default:
      return count;
  }
}
```

---

### **03. UserProfile 실습**

**1) UserProfile 실습 개요**

- UserProfile 글자 크기
- UserProfile 알림 설정
- UserProfile 테마 설정
- UserProfile 언어 설정
- UserProfile 값 설정

---

**2) UserProfile 컨텍스트 객체 만들기**

(1) Type 정의하기

- types 폴더 생성
- types/settings.d.ts에서 interface를 통해 타입 정의하기

```tsx
interface UserPreferences {
  language: "ko" | "en" | "ja";
  fontSize: "small" | "medium" | "large";
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  colorScheme: "system" | "light" | "dark";
}
interface PreferencesContextType {
  preferences: UserPreferences;
}
interface PreferencesContextActionType {
  updateLanguage: (language: UserPreferences["language"]) => void;
  updateFontSize: (size: UserPreferences["fontSize"]) => void;
  updateNotifications: (
    key: keyof UserPreferences["notifications"],
    value: boolean
  ) => void;
  updateColorScheme: (shceme: UserPreferences["colorScheme"]) => void;
}
```

(2) Context 객체 생성 + 프로바이더 생성 + 커스텀 훅 만들기

- context 폴더 / setting 폴더 생성
- jsx 사용하지 않을 것이기에 ts 확장자로 생성하는 것이 유리
- context/setting/SettingContext.ts 파일 생성

```tsx
import { createContext } from "react";

export const SettingContext = createContext<PreferencesContextType | null>(
  null
);
export const SettingContextAction =
  createContext<PreferencesContextActionType | null>(null);
```

- context/setting/SettingProvider.tsx 파일 생성

```tsx
import { useMemo, useState } from "react";
import { SettingContext, SettingContextAction } from "./SettingContext";

const defaultValue: UserPreferences = {
  language: "ko",
  fontSize: "medium",
  notifications: {
    email: false,
    push: false,
    desktop: false,
  },
  colorScheme: "system",
};

export default function SettingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultValue);
  const updateLanguage = (language: UserPreferences["language"]) => {
    setPreferences((preferences) => ({ ...preferences, language }));
  };
  const updateFontSize = (fontSize: UserPreferences["fontSize"]) => {
    setPreferences((preferences) => ({ ...preferences, fontSize }));
  };
  const updateNotifications = (
    key: keyof UserPreferences["notifications"],
    value: boolean
  ) => {
    setPreferences((preferences) => ({
      ...preferences,
      notifications: { ...preferences.notifications, [key]: value },
    }));
  };
  const updateColorScheme = (colorScheme: UserPreferences["colorScheme"]) => {
    setPreferences((preferences) => ({ ...preferences, colorScheme }));
  };
  const memoization = useMemo(
    () => ({
      updateLanguage,
      updateFontSize,
      updateNotifications,
      updateColorScheme,
    }),
    []
  );
  return (
    <>
      <SettingContextAction value={memoization}>
        <SettingContext value={{ preferences }}>{children}</SettingContext>
      </SettingContextAction>
    </>
  );
}
```

- context/setting/useSetting.ts 파일 생성 : 커스텀 훅 만들기

```tsx
import { useContext } from "react";
import { SettingContext, SettingContextAction } from "./SettingContext";

export function useSetting() {
  const context = useContext(SettingContext);
  if (!context) {
    throw new Error(
      "useSetting은 SettingProvider 내부에서만 사용할 수 있습니다."
    );
  }
  return context;
}

export function useSettingAction() {
  const context = useContext(SettingContextAction);
  if (!context) {
    throw new Error(
      "useSettingAction은 SettingProvider 내부에서만 사용할 수 있습니다."
    );
  }
  return context;
}
```

---

**3) UserProfile 글자 크기**

- 반복문을 통해 비슷한 UI를 반복 렌더링 → 코드 처리 간단하게 가능
- 삼항연산자를 중첩해서 텍스트를 보여주도록 함

```tsx
import { Type } from "lucide-react";
import { useSetting, useSettingAction } from "../context/setting/useSetting";
import { twMerge } from "tailwind-merge";

export default function FontSizeSetting() {
  const { preferences } = useSetting();
  const { updateFontSize } = useSettingAction();
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Type className="text-blue-500" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            글자 크기
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(["small", "medium", "large"] as const).map((size) => (
            <button
              key={size}
              className={twMerge(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                preferences.fontSize === size
                  ? " bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={() => updateFontSize(size)}
            >
              {size === "small" ? "작게" : size === "medium" ? "보통" : "크게"}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
```

- useEffect를 사용해서 preferences 값이 변경되었는지 감지
- context/setting/SettingProvider.tsx 파일 수정
- Tailwind는 폰트 사이즈 지정하는 스타일이 rem 방식으로 코딩 → HTML 폰트 크기 바뀌면 일괄 변동됨

```tsx
import { useEffect, useMemo, useState } from "react";
import { SettingContext, SettingContextAction } from "./SettingContext";

const defaultValue: UserPreferences = {
  language: "ko",
  fontSize: "medium",
  notifications: {
    email: false,
    push: false,
    desktop: false,
  },
  colorScheme: "system",
};

export default function SettingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultValue);
  const updateLanguage = (language: UserPreferences["language"]) => {
    setPreferences((preferences) => ({ ...preferences, language }));
  };
  const updateFontSize = (fontSize: UserPreferences["fontSize"]) => {
    setPreferences((preferences) => ({ ...preferences, fontSize }));
  };
  const updateNotifications = (
    key: keyof UserPreferences["notifications"],
    value: boolean
  ) => {
    setPreferences((preferences) => ({
      ...preferences,
      notifications: { ...preferences.notifications, [key]: value },
    }));
  };
  const updateColorScheme = (colorScheme: UserPreferences["colorScheme"]) => {
    setPreferences((preferences) => ({ ...preferences, colorScheme }));
  };
  const memoization = useMemo(
    () => ({
      updateLanguage,
      updateFontSize,
      updateNotifications,
      updateColorScheme,
    }),
    []
  );

  useEffect(() => {
    document.documentElement.style.fontSize = {
      small: "14px",
      medium: "16px",
      large: "18px",
    }[preferences.fontSize];
  }, [preferences]);

  return (
    <>
      <SettingContextAction value={memoization}>
        <SettingContext value={{ preferences }}>{children}</SettingContext>
      </SettingContextAction>
    </>
  );
}
```

---

**4) UserProfile 알림 설정**

- 위에 폰트 사이즈와 마찬가지로 map 메서드 통해 반복 렌더링으로 UI 구현
- +) Tailwind 클래스 많이 사용 시 로딩 걸림 해결법→ Ctrl + Shift + P (Reload Window)
- src/components/AlarmSetting.tsx 생성

```tsx
import { Bell } from "lucide-react";
import { useSetting, useSettingAction } from "../context/setting/useSetting";
import { twMerge } from "tailwind-merge";

export default function AlarmSetting() {
  const { preferences } = useSetting();
  const { updateNotifications } = useSettingAction();
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-blue-500" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            알림 설정
          </h2>
        </div>
        <div className="space-y-4">
          {(
            Object.keys(
              preferences.notifications
            ) as (keyof UserPreferences["notifications"])[]
          ).map((key) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300 capitalize">
                {key === "email"
                  ? "이메일 알림"
                  : key === "push"
                  ? "푸시 알림"
                  : "데스크톱 알림"}
              </span>
              {/* On: bg-blue-500 */}
              {/* Off: bg-gray-300 dark:bg-gray-600 */}
              <button
                className={twMerge(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  preferences.notifications[key]
                    ? "bg-blue-500"
                    : " bg-gray-300 dark:bg-gray-600"
                )}
                onClick={() =>
                  updateNotifications(key, !preferences.notifications[key])
                }
              >
                {/* On: translate-x-6  */}
                {/* Off: translate-x-1 */}
                <span
                  className={twMerge(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1",
                    preferences.notifications[key]
                      ? "translate-x-6 "
                      : " translate-x-1"
                  )}
                />
              </button>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
```

---

**5) UserProfile 테마 설정**

- src/components/ThemeSetting.tsx 생성

```tsx
import { Monitor, Moon, Sun } from "lucide-react";
import { useSetting, useSettingAction } from "../context/setting/useSetting";
import { twMerge } from "tailwind-merge";

export default function ThemeSetting() {
  const { preferences } = useSetting();
  const { updateColorScheme } = useSettingAction();
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Sun className="text-blue-500" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            테마 설정
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(["system", "light", "dark"] as const).map((scheme) => (
            <button
              key={scheme}
              className={twMerge(
                "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors  ",
                preferences.colorScheme === scheme
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={() => updateColorScheme(scheme)}
            >
              {scheme === "system" ? (
                <>
                  <Monitor size={16} />
                  <span>시스템</span>
                </>
              ) : scheme === "light" ? (
                <>
                  <Sun size={16} />
                  <span>라이트</span>
                </>
              ) : (
                <>
                  <Moon size={16} />
                  <span>다크</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
```

- Provider 컴포넌트에서 UserEffect로 확인하는 코드 작성해줘야함
- **matchMedia 메서드** : 사용자의 OS 환경 설정이 어떤 값인지 가져옴 → matches로 검사
- context/setting/SettingProvider.tsx 파일 수정

```tsx
import { useEffect, useMemo, useState } from "react";
import { SettingContext, SettingContextAction } from "./SettingContext";

const defaultValue: UserPreferences = {
  language: "ko",
  fontSize: "medium",
  notifications: {
    email: false,
    push: false,
    desktop: false,
  },
  colorScheme: "system",
};

export default function SettingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultValue);
  const updateLanguage = (language: UserPreferences["language"]) => {
    setPreferences((preferences) => ({ ...preferences, language }));
  };
  const updateFontSize = (fontSize: UserPreferences["fontSize"]) => {
    setPreferences((preferences) => ({ ...preferences, fontSize }));
  };
  const updateNotifications = (
    key: keyof UserPreferences["notifications"],
    value: boolean
  ) => {
    setPreferences((preferences) => ({
      ...preferences,
      notifications: { ...preferences.notifications, [key]: value },
    }));
  };
  const updateColorScheme = (colorScheme: UserPreferences["colorScheme"]) => {
    setPreferences((preferences) => ({ ...preferences, colorScheme }));
  };
  const memoization = useMemo(
    () => ({
      updateLanguage,
      updateFontSize,
      updateNotifications,
      updateColorScheme,
    }),
    []
  );

  useEffect(() => {
    document.documentElement.style.fontSize = {
      small: "14px",
      medium: "16px",
      large: "18px",
    }[preferences.fontSize];

    if (preferences.colorScheme === "system") {
      document.documentElement.classList.remove("light", "dark");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");
      }
    } else {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(preferences.colorScheme);
    }
  }, [preferences]);

  return (
    <>
      <SettingContextAction value={memoization}>
        <SettingContext value={{ preferences }}>{children}</SettingContext>
      </SettingContextAction>
    </>
  );
}
```

---

**6) UserProfile 언어 설정**

- src/components/LanguageSetteing.tsx 생성

```tsx
import { Languages } from "lucide-react";
import { useSetting, useSettingAction } from "../context/setting/useSetting";
import { twMerge } from "tailwind-merge";
import useTranslation from "../libs/useTranslation";

export default function LanguageSetting() {
  const { preferences } = useSetting();
  const { updateLanguage } = useSettingAction();
  const { t } = useTranslation();
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Languages className="text-blue-500" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.languageSetting}
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(["ko", "en", "ja"] as const).map((lang) => (
            <button
              key={lang}
              className={twMerge(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                preferences.language === lang
                  ? " bg-blue-500 text-white "
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={() => updateLanguage(lang)}
            >
              {lang === "ko" ? "한국어" : lang === "en" ? "English" : "日本語"}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
```

- 다국어에 대한 정보를 가지고 있는 객체 필요
- src/libs/i18n.ts 생성 : 언어별 객체가 정의되어져 있는 파일
- as const로 단언한 이유 : 리터럴 객체처럼 사용하기 위해서

```tsx
export const translations = {
  ko: {
    profileTitle: "사용자 설정",
    languageSetting: "언어 설정",
    fontSize: {
      label: "글자 크기",
      small: "작게",
      medium: "보통",
      large: "크게",
    },
    notifications: {
      label: "알림 설정",
      email: "이메일 알림",
      push: "푸시 알림",
      desktop: "데스크톱 알림",
    },
    theme: {
      label: "테마 설정",
      system: "시스템",
      light: "라이트",
      dark: "다크",
    },
  },
  en: {
    profileTitle: "User Settings",
    languageSetting: "Language Setting",
    fontSize: {
      label: "Font Size",
      small: "Small",
      medium: "Medium",
      large: "Large",
    },
    notifications: {
      label: "Notification Settings",
      email: "Email Notifications",
      push: "Push Notifications",
      desktop: "Desktop Notifications",
    },
    theme: {
      label: "Theme Setting",
      system: "System",
      light: "Light",
      dark: "Dark",
    },
  },
  ja: {
    profileTitle: "ユーザー設定",
    languageSetting: "言語設定",
    fontSize: {
      label: "文字サイズ",
      small: "小",
      medium: "中",
      large: "大",
    },
    notifications: {
      label: "通知設定",
      email: "メール通知",
      push: "プッシュ通知",
      desktop: "デスクトップ通知",
    },
    theme: {
      label: "テーマ設定",
      system: "システム",
      light: "ライト",
      dark: "ダーク",
    },
  },
} as const;

export type SupportedLanguage = keyof typeof translations;
export type LocaleKey = keyof (typeof translations)["ko"];
```

- 객체 파일을 가지고 커스텀 워크플로우 생성
- src/libs/useTranslation.ts 파일 생성

```tsx
import { useSetting } from "../context/setting/useSetting";
import { SupportedLanguage, translations } from "./i18n";

export default function useTranslation() {
  const { preferences } = useSetting();
  const lang = preferences.language as SupportedLanguage;
  const t = translations[lang];
  return { t, lang };
}
```

- src/components/AlarmSetting.tsx 파일 수정 : 다국어 처리

```tsx
import { Bell } from "lucide-react";
import { useSetting, useSettingAction } from "../context/setting/useSetting";
import { twMerge } from "tailwind-merge";
import useTranslation from "../libs/useTranslation";

export default function AlarmSetting() {
  const { preferences } = useSetting();
  const { updateNotifications } = useSettingAction();
  const { t } = useTranslation();
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-blue-500" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.notifications.label}
          </h2>
        </div>
        <div className="space-y-4">
          {(
            Object.keys(
              preferences.notifications
            ) as (keyof UserPreferences["notifications"])[]
          ).map((key) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300 capitalize">
                {key === "email"
                  ? t.notifications.email
                  : key === "push"
                  ? t.notifications.push
                  : t.notifications.desktop}
              </span>
              {/* On: bg-blue-500 */}
              {/* Off: bg-gray-300 dark:bg-gray-600 */}
              <button
                className={twMerge(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  preferences.notifications[key]
                    ? "bg-blue-500"
                    : " bg-gray-300 dark:bg-gray-600"
                )}
                onClick={() =>
                  updateNotifications(key, !preferences.notifications[key])
                }
              >
                {/* On: translate-x-6  */}
                {/* Off: translate-x-1 */}
                <span
                  className={twMerge(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1",
                    preferences.notifications[key]
                      ? "translate-x-6 "
                      : " translate-x-1"
                  )}
                />
              </button>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
```

- src/components/ThemeSetting.tsx 파일 수정 : 다국어 처리

```tsx
import { Monitor, Moon, Sun } from "lucide-react";
import { useSetting, useSettingAction } from "../context/setting/useSetting";
import { twMerge } from "tailwind-merge";
import useTranslation from "../libs/useTranslation";

export default function ThemeSetting() {
  const { preferences } = useSetting();
  const { updateColorScheme } = useSettingAction();
  const { t } = useTranslation();
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Sun className="text-blue-500" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.theme.label}
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(["system", "light", "dark"] as const).map((scheme) => (
            <button
              key={scheme}
              className={twMerge(
                "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors  ",
                preferences.colorScheme === scheme
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={() => updateColorScheme(scheme)}
            >
              {scheme === "system" ? (
                <>
                  <Monitor size={16} />
                  <span>{t.theme.system}</span>
                </>
              ) : scheme === "light" ? (
                <>
                  <Sun size={16} />
                  <span>{t.theme.light}</span>
                </>
              ) : (
                <>
                  <Moon size={16} />
                  <span>{t.theme.dark}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
```

- src/components/UserSettings.tsx 파일 수정 : 다국어 처리

```tsx
import LanguageSetting from "./LanguageSetting";
import FontSizeSetting from "./FontSizeSetting";
import AlarmSetting from "./AlarmSetting";
import ThemeSetting from "./ThemeSetting";
import useTranslation from "../libs/useTranslation";

export default function UserSettings() {
  const { t } = useTranslation();
  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {t.profileTitle}
          </h1>

          <div className="space-y-6">
            {/* 언어 설정 */}
            <LanguageSetting />

            {/* 글자 크기 */}
            <FontSizeSetting />

            {/* 알림 설정 */}
            <AlarmSetting />

            {/* 테마 설정 */}
            <ThemeSetting />
          </div>
        </div>
      </div>
    </>
  );
}
```

---

**7) UserProfile 값 저장하기**

- 새로고침했을 때 값 유지되도록 → Local Storage 같은 곳에 값이 저장되어야 함
- json stringify로 현재 preferences 값을 json 문자열로 바꿔서 저장
- 초기값을 지정하는 데 있어 몇 개의 로직을 작성해야 될 때, 함수 값으로 useState 초기값 지정하면 편함
- context/setting/SettingProvider.tsx 파일 수정

```tsx
import { useEffect, useMemo, useState } from "react";
import { SettingContext, SettingContextAction } from "./SettingContext";

const defaultValue: UserPreferences = {
  language: "ko",
  fontSize: "medium",
  notifications: {
    email: false,
    push: false,
    desktop: false,
  },
  colorScheme: "system",
};

export default function SettingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const save = localStorage.getItem("preferences");
    return save ? JSON.parse(save) : defaultValue;
  });
  const updateLanguage = (language: UserPreferences["language"]) => {
    setPreferences((preferences) => ({ ...preferences, language }));
  };
  const updateFontSize = (fontSize: UserPreferences["fontSize"]) => {
    setPreferences((preferences) => ({ ...preferences, fontSize }));
  };
  const updateNotifications = (
    key: keyof UserPreferences["notifications"],
    value: boolean
  ) => {
    setPreferences((preferences) => ({
      ...preferences,
      notifications: { ...preferences.notifications, [key]: value },
    }));
  };
  const updateColorScheme = (colorScheme: UserPreferences["colorScheme"]) => {
    setPreferences((preferences) => ({ ...preferences, colorScheme }));
  };
  const memoization = useMemo(
    () => ({
      updateLanguage,
      updateFontSize,
      updateNotifications,
      updateColorScheme,
    }),
    []
  );

  useEffect(() => {
    localStorage.setItem("preferences", JSON.stringify(preferences));

    document.documentElement.style.fontSize = {
      small: "14px",
      medium: "16px",
      large: "18px",
    }[preferences.fontSize];

    if (preferences.colorScheme === "system") {
      document.documentElement.classList.remove("light", "dark");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");
      }
    } else {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(preferences.colorScheme);
    }
  }, [preferences]);

  return (
    <>
      <SettingContextAction value={memoization}>
        <SettingContext value={{ preferences }}>{children}</SettingContext>
      </SettingContextAction>
    </>
  );
}
```

---

**8) UserProfile useLayoutEffect**

다크모드로 설정하고 새로고침했을 때 라이트모드가 잠시 보이는 문제 해결해야함

UI적 버그(깜빡거림) 발생 이유 : DOM 조작을 useEffect라는 훅(컴포넌트가 화면에 렌더링 된 후 실행)에서 처리하고 있기 때문

→ useEffect 훅 대신에 useLayoutEffect 훅을 사용하면 됨→ 둘의 차이점 : 컴포넌트가 그려지기 전에 동기적으로 이펙트 함수의 로직이 실행
