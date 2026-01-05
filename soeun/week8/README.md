# 섹션 13. 전역 상태 관리 - Context API

## 1. Context API

- props drilling: props를 중첩해서 계속 전달하는 패턴

### Context API

- 상태를 포함한 다양한 데이터를 컴포넌트 트리 전역에서 공유할 수 있는 기능
- 먼저 Context 객체를 생성한 뒤 해당 객체를 통해 데이터의 공유 범위와 공유할 데이터를 설정함
  - 해당 Context 객체의 공유 범위에 포함된 다른 컴포넌트들은 Context 객체에서 공유하는 데이터를 가져와 사용할 수 있게 되는 원리
  ```tsx
  const CounterContext = createContext(null);
  ```
  - `createContext()`를 통해 Context 객체 생성
  - 객체에서 공유할 기본값에 해당하는 데이터를 매개변수로 전달
  - TypeScript에서는 기본값으로 인해 에러가 발생하기 쉬워 null 값을 넘기는 것을 가장 추천함
  ```tsx
  import { createContext, useState } from "react";
  import Count from "./components/Count";
  import CountOutside from "./components/CountOutside";

  **type CounterContextType = {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
  };
  export const CounterContext = createContext<CounterContextType>(null);**

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
        **<CounterContext value={{ count, increment, decrement, reset }}>
          <Count />
          <CountOutside />
        </CounterContext>**
      </>
    );
  }

  ```
  - CounterContext 객체의 데이터를 공유할 범위를 지정
  - 타입 에러가 발생하지 않도록 타입 지정
- 공유되는 상태값에 접근하기 위해서는 `useContext` 훅 사용
  ```tsx
  import { useContext } from "react";
  import { CounterContext } from "../App";

  export default function CountOutside() {
    const { count } = useContext(CounterContext)!;
    return (
      <>
        <h1>CountOutside: {count}</h1>
      </>
    );
  }
  ```
  - 컨텍스트 객체 export 하여 import 해오기
  - 구조 분해 할당으로 사용할 값 가져오기
  - null 타입은 구조분해가 불가능하므로 null 아닌 것을 보장하는 연산자 `!` 사용

### 파일 분리

- 컨텍스트 API는 별도의 파일로 관리하는 것이 더 좋음
- src/context 아래 객체와 의미있는 단위로 폴더를 만들어서 관리
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

### 리렌더링

- React.memo 함수나 useCallback 함수를 통해 불필요한 리렌더링을 막을 수 있음
- 컨텍스트 객체 사용 시에 불필요한 리렌더링이 발생함
  - Context API는 공유하는 상태값이 변경 되면 리렌더링 됨
  - 컴포넌트 리렌더링 시, 컨텍스트 객체에서 value 속성으로 제공되고 있는 객체가 매번 새로운 객체값으로 변경
  - value 속성을 메모이제이션해서 해결해야 함
  - 함수는 메모이제이션 해도 괜찮지만, 상태값은 숫자가 변하지 않아 안됨
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

### reducer

- 상태를 useState가 아닌 useReducer로 공유해도 됨
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

### Context API 2개 적용

- 성격이 다른 데이터는 서로 다른 컨텍스트 객체를 사용해 공유해야 함
  ```tsx
  import { createContext } from "react";

  type ThemeContextType = {
    theme: string;
  };
  type ThemeContextActionType = {
    changeTheme: () => void;
  };
  export const ThemeContext = createContext<ThemeContextType | null>(null);
  export const ThemeContextAction =
    createContext<ThemeContextActionType | null>(null);
  ```
  ```tsx
  import { useState } from "react";
  import { ThemeContext, ThemeContextAction } from "./themeContext";

  export default function ThemeProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const [theme, setTheme] = useState("light");
    const changeTheme = () => {
      setTheme((theme) => (theme === "light" ? "dark" : "light"));
    };
    const memoization = useMemo(() => ({ changeTheme }), []);
    return (
      <>
        <ThemeContextAction value={{ changeTheme }}>
          <ThemeContext value={{ theme }}>{children}</ThemeContext>
        </ThemeContextAction>
      </>
    );
  }
  ```
  ```tsx
  import { useContext } from "react";
  import { ThemeContext, ThemeContextAction } from "./ThemeContext";

  export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error("useTheme는 ThemeProvider 안에서만 사용가능합니다.");
    }
    return context;
  }

  export function useThemeAction() {
    const context = useContext(ThemeContextAction);
    if (!context) {
      throw new Error("useTheme는 ThemeProvider 안에서만 사용가능합니다.");
    }
    return context;
  }
  ```
