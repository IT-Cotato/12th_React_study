### 전역 상태 관리가 필요한 이유

![image.png](attachment:3e8eb964-0d56-44fc-bfdb-889bad2e470e:e2f8f5a9-a6f3-4db8-bce5-671ebdc01abe.png)

초록색 컴포넌트들에 상태를 정의하게 되면, 정의한 상태를 다른 컴포넌트에 전달해 줄 수 있는 방법이 없기 때문에 거기에 정의하면 안됨.

하지만 상태 끌어올리기를 쓴다고 해도 Count Group에서 해버리면 Count Outside가 상태를 못 쓰기 때문에 안됨.
> 결국 모두의 공통 부모 컴포넌트인 App 컴포넌트에서 정의해야함

```tsx
//App.tsx
import { useState } from "react";
import Count from "./components/Count";
import CountOutside from "./components/CountOutside";

export default function App() {
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
      <Count
        count={count}
        increment={increment}
        decrement={decrement}
        reset={reset}
      />
      <CountOutside count={count} />
    </>
  );
}

```

하지만 이렇게 하면 Count 컴포넌트나 CountGroup 컴포넌트 같이 상태값을 전혀 사용하지 않는 중간 컴포넌트들 조차 props를 받아서 다시 하위 컴포넌트로 전달해야한다는 문제점이 있음.

Props를 계속 중첩해서 전달하고 전달하고 하는 패턴 > props drilling

Props drilling 문제를 해결하기 위한 여러가지 전역 상태 관리 방법 제공

>전역 상태 관리 도구(Context API, Redux Toolkit, Zustand)

### ContextAPI

contextAPI는 context 객체를 생성한 후 해당 객체를 통해 데이터의 공유 범위와 공유할 데이터를 설정함.

그러면 해당 컨텍스트 객체의 공유 범위에 포함된 다른 컴포넌트들은 컨텍스트 객체에서 공유하는 데이터를 가져와서 사용할 수 있게 되는 원리

```tsx
//App.tsx
import { createContext, useState } from "react";
import Count from "./components/Count";
import CountOutside from "./components/CountOutside";

type CounterContextType = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};
export const CounterContext = createContext<CounterContextType | null>(null);
export default function App() {
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
    //countercontext안에 있어야 공유 범위, value에 있는 값들을 공유하는거!
      <CounterContext value={{ count, increment, decrement, reset }}>
        <Count />
        <CountOutside />
      </CounterContext>
    </>
  );
}

```

```tsx
//CountOutside.tsx
import { useContext } from "react";
import { CounterContext } from "../App";

export default function CountOutside() {
//countContext에서 공유하고 있는 데이터를 useContext훅으로 가져와서 사용하겠다, null이 아니라는 보장 연산자
  const { count } = useContext(CounterContext)!;
  return (
    <>
      <h1>CountOutside: {count}</h1>
    </>
  );
}
```

![image.png](attachment:2cefef00-a0a7-4d6c-8cfa-9ac983938911:11523608-7451-4650-bbed-1a480bdedb44.png)

그래서 이렇게 파란색 영역이 context 객체로 공급하는 영역이고 value라는 속성의 데이터들을 이 공유 범위 안에 있는 컴포넌트들이 접근해서 사용하는 것

### ContextAPI 개선

context의 경우, 별도의 파일로 분리해서 작성하는게 코드의 유지보수기나 가독성을 더 좋게 만드는 방법이 될 수 있음.

```tsx
//CounterContext.ts
import { createContext } from "react";

type CounterContextType = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};
export const CounterContext = createContext<CounterContextType | null>(null);

//CounterProvider.tsx
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

//App.tsx
import Count from "./components/Count";
import CountOutside from "./components/CountOutside";
import CounterProvider from "./context/counter/CounterProvider";

export default function App() {
  return (
    <>
      <CounterProvider>
        <Count />
        <CountOutside />
      </CounterProvider>
    </>
  );
}
```

컨텍스트 객체로 공급하는 데이터를 더 간편하게 활용하기 위해 커스텀 훅을 만들 수 있음

```tsx
//useCounter.ts
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

### ContextAPI 리렌더링

콘솔로 찍어보면 countButton 같이 리렌더링이 필요 없는 버튼 컴포넌트도 불필요하게 리렌더링되고 있음.

원래 불필요한 리렌더링은 React.memo 함수나 useCallback 훅을 사용해야함

근데 react.memo 함수를 써도 여전히 리렌더링이 발생함

contextAPI는 공유하는 상태값이 변경되면 counterProvider 컴포넌트가 리렌더링 됨

왜냐하면 공유하고 있는 상태는 실제로 counterprovider 컴포넌트에 정의되어 있기 때문

그래서  상태가 변경되면 카운터 프로바이터 컴포넌트가 리렌더링 되고 context 객체의 value속성의 객체가 매번 새로운 객체 값으로 변경이 되어서 데이터가 공유되게 됨.

그래서 리렌더링을 막기 위해서는 결국 컨텍스트 객체에서 공급되고 있는 value속성이 할당되는 이 객체 값 자체를 메모이제이션 하면 됨.

```tsx
//CounterProvider.tsx
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

### ContextAPI reducer

contextAPI로 공유 가능한 값은 상태가 아니어도 데이터라면 어떠한 값이든지 가능함

또한 상태 같은 경우도, useState가 아니라 useReducer를 써도 전혀 문제 없음.

```tsx
//reducer/counterReducer.ts
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

//context/counter/CounterProvider.tsx
import { useReducer } from "react";
import { CounterContext, CounterContextAction } from "./CounterContext";
import counterReducer from "../../reducer/counterReducer";

export default function CounterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [count, countDispatch] = useReducer(counterReducer, 0);
  return (
    <>
      <CounterContextAction value={countDispatch}>
        <CounterContext value={{ count }}>{children}</CounterContext>
      </CounterContextAction>
    </>
  );
}
```

### ContextAPI 2개 적용해보기

보통 성격이 다른 데이터들은 각각 서로 다른 컨텍스트 객체를 활용해서 데이터를 공유함

```tsx
import Count from "./components/Count";
import CountOutside from "./components/CountOutside";
import ThemeButton from "./components/ThemeButton";
import CounterProvider from "./context/counter/CounterProvider";
import ThemeProvider from "./context/theme/ThemeProvider";

export default function App() {
  return (
    <>
      <ThemeProvider>
        <CounterProvider>
          <Count />
          <CountOutside />
          <Theme />
          <ThemeButton />
        </CounterProvider>
      </ThemeProvider>
    </>
  );
}
```

테마 프로바이더에 카운터 프로바이더가 중첩되어 있는 구조

하지만 카운터가 증가한다고 버튼 컴포넌트들이 리렌더링 되거나 하지 않음

카운터 버튼 컴포넌트나 테마 버튼 컴포넌트가 전혀 서로 영향을 받지 않고 리렌더링이 되지 않음

프로바이더끼리 순서가 바뀌어도 서로에게 영향을 미치지 않음

### UserProfile 만들기

```tsx
//settings.d.ts
interface UserPreferences {
  language: "ko" | "en" | "ja";
  fontSize: "small" | "medium" | "large";
  //토글이니까 boolean
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

updateNotifications는 객체 속성 값이니까 매개변수 2개 전달 받아야함

>keyof 연산자 사용해서 노티피케이션의 키만 매개변수로 올 수 있도록 타입 적어주기

```tsx
//context/setting/SettingProvider.tsx
import { useMemo, useState } from "react";
import { SettingContext, SettingContextAction } from "./SettingContext";

//defaultvalue, 객체 만들어서 초기값 지정하기
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
  
  //다시 keyof 사용해주기
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
  
  //리렌더링 예방위해서 메모이제이션, 앱 생성 되었을때 처음 한번만 진행
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

버튼 on/off ui 다르게 적용

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
        //const로 치환해서 리터럴 타입으로 추론 되도록 하기
          {(["small", "medium", "large"] as const).map((size) => (
            <button
              key={size}
              //twMerge 사용
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

twMerge 사용해서 선택 되었을때, 선택 되지 않았을때 구분해서 조건부 렌더링

```tsx
//AlarmSetting.tsx
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
        //keys 메서드 사용해서 notification의 키값 추출해서 사용
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
              //on, off 배경색 변경
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
              //토글 움직이기 translate-x
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

테마 바꾸기

```tsx
//ThemeSetting.tsx
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
        //Preference의 컬러 스키마 값이 반복 접근되는 스키마 값과 같으면 선택된 거고 다르면 선택된게 아니다
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

```tsx
//사용자의 os 환경설정 값 가져오는 메소드 > matchMedia
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");
      }
    } else {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(preferences.colorScheme);
    }
```

언어 설정 바꾸기

```tsx
//useTranslation 커스텀훅
import { useSetting } from "../context/setting/useSetting";
import { SupportedLanguage, translations } from "./i18n";//언어별 객체 파일

export default function useTranslation() {
  const { preferences } = useSetting();
  const lang = preferences.language as SupportedLanguage;
  const t = translations[lang]; //현재 언어값
  return { t, lang };
}
```

**UserProfile useLayoutEffect**

UI 깜빡임 현상: 초기 디자인이 나타났다가 다시 다크 모드로 변경되는 버그

이유: DOM 조작을 useEffect 훅에서 처리하고 있는데 useEffect는 컴포넌트가 화면에 렌더링 되고 난 이후에 실행이 되기 때문에 컴포넌트가 일단 라이트 모드로 그려지고 난 다음에 이펙트 함수에 의해서 값이 변경되고 그제서야 다크모드가 적용됨

해결 방법: useEffect 훅 대신에 useLayoutEffect 훅 사용하기

useLayoutEffect 훅은 컴포넌트가 그려지기 전에 동기적으로 이펙트 함수의 로직이 실행됨

그래서 화면에 그려지기 전에 값들에 대한 결정이 모두 끝나고 컴포넌트를 그리기 때문에 아까처럼 초기 컴포넌트를 렌더링하고 바꾸는 문제가 발생하지 않음!!

scrollTo 메서드를 이용할때도 useEffect 훅 대신 useLayout Effect를 쓰면 버그 없이 자연스럽게 할 수 있음!