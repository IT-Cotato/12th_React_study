# 계산기 만들기 실습

### **01. 계산기 만들기 준비**

**1) 프로젝트 생성**

```
npm create vite@latest .
```

**2) Tailwind 설치**

```
npm install tailwindcss @tailwindcss/vite
```

**3) tailwindcss 플러그인 등록 (vite.config.ts)**

```
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**4) import tailwindcss**

(1) src/styles/tailwind.css

```
@import "tailwindcss";
```

(2) src/styles/index.css

```
@import "./tailwind.css";
```

**5) index.css 경로 수정 (src/main.tsx)**

```
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'// 이 부분 경로 수정import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**6) App.tsx 변경사항 적용 테스트 (src/main.tsx)**

```
export default function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello World!</h1>
    </>
  );
}
```

![](https://blog.kakaocdn.net/dna/dmGIcU/dJMcagKzHqn/AAAAAAAAAAAAAAAAAAAAABeB8El3fxKGm_KZIyHWY4lSPxO3SdHWcnpqYduCFaPN/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=cvxPnkyqrq1tTI%2FyevNhN7L8X2I%3D)

---

### **02. 계산기 리팩토링**

**1) 컴포넌트 분리**

→ 반복되는 요소 깔끔하게 보이도록 코드 정리

(1) src/App.tsx

```
import Calculator from "./components/Calculator";

export default function App() {
  return (
    <>
      <Calculator />
    </>
  );
}
```

(2) src/components/Calculator.tsx

```
import CalculatorButton from "./CalculatorButton";

export default function Calculator() {
  const handleClear = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    console.log(e.currentTarget.value);
  };
  const handleOperator = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    console.log(e.currentTarget.value);
  };
  const handleNum = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    console.log(e.currentTarget.value);
  };
  const handleDot = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    console.log(e.currentTarget.value);
  };
  const buttonConfigs = [
    { value: "C", className: "calc-clear", onClick: handleClear },
    { value: "/", className: "calc-operator", onClick: handleOperator },
    { value: "1", className: "calc-num", onClick: handleNum },
    { value: "2", className: "calc-num", onClick: handleNum },
    { value: "3", className: "calc-num", onClick: handleNum },
    { value: "*", className: "calc-operator", onClick: handleOperator },
    { value: "4", className: "calc-num", onClick: handleNum },
    { value: "5", className: "calc-num", onClick: handleNum },
    { value: "6", className: "calc-num", onClick: handleNum },
    { value: "+", className: "calc-operator", onClick: handleOperator },
    { value: "7", className: "calc-num", onClick: handleNum },
    { value: "8", className: "calc-num", onClick: handleNum },
    { value: "9", className: "calc-num", onClick: handleNum },
    { value: "-", className: "calc-operator", onClick: handleOperator },
    { value: ".", className: "calc-dot", onClick: handleDot },
    { value: "0", className: "calc-num", onClick: handleNum },
    { value: "=", className: "calc-result", onClick: handleOperator },
  ];
  return (
    <>
      <div className="bg-[#1f1f1f] flex items-center justify-center h-screen">
        <article className="w-[282px] border border-[#333] bg-[#ccc] p-1">
          <form
            className="grid grid-cols-[repeat(4, 65px)] auto-rows-[65px] gap-1"
            name="forms"
          >
            <input type="text" className="calc-input" name="output" readOnly />
            {buttonConfigs.map((button) => (
              <CalculatorButton key={button.value} {...button} />
            ))}
          </form>
        </article>
      </div>
    </>
  );
}
```

(2) src/components/CalculatorButton.tsx

```
export default function CalculatorButton({
  value,
  className,
  onClick,
}: {
  value: string;
  className: string;
  onClick: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
}) {
  return (
    <>
      <input
        type="button"
        className={className}
        value={value}
        onClick={onClick}
      />
    </>
  );
}
```

---

### **03. 계산기 타입 빼기**

**POINT**

**: 직접 타입 지정하기**

**: 버튼에 대한 배열 객체를 직접 타입을 지정하는 방식으로 변경하기**

**1) 타입 추론에 의해 추론된 타입을 그대로 복사**

![](https://blog.kakaocdn.net/dna/SVcN4/dJMcaiVVym3/AAAAAAAAAAAAAAAAAAAAANh9JWQOtG9B-4kS6El5dTRTQtO3P1pVa-mQ8bfbnc1Q/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=R6PMj%2FGBrZIW21VsssssEKbcVSc%3D)

**2) d.ts 파일 생성 (src/types/props.d.ts)**

: d.ts 파일에 정의한 타입은 전역적으로 인식 O  → 별도의 export 없이 다른 파일에서 사용 가능

```
type ButtonConfigs = {
  value: string;
  className: string;
  onClick: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
};
```

**3) 타입 지정**

: 객체 형태로 타입을 지정했기에, '객체들이 모여있는 배열'이라는 의미로 타입 지정

: 아래와 같은 데이터를 사용해서 props로 데이터를 전달할 때, props 각체 타입 편리하게 지정 가능

<CalculatorButton key={button.value} {...button} />

(1) src/components/Calculator.tsx

```
const buttonConfigs : ButtonConfigs[] = [// 이 부분 수정
```

(2) src/components/CalculatorButton.tsx

```
export default function CalculatorButton({
  value,
  className,
  onClick,
}: ButtonConfigs) {// 이 부분 수정
```

---

### **04. 계산기 기능 - (1) 숫자 입력 받기**

**POINT**

**: 리액트의 상태를 하나 정의**

**: 그 상태에 기반하여 계산기 UI에 표시되어져 있는 버튼 클릭**

**: 클릭한 버튼의 값을 상태에 저장**

**: 저장된 상태 값을 입력 요소를 통해 보여주**

**1) 'calculatorState' 식별자 활용해서 상태 변수 정의 (src/components/Calculator.tsx)**

```
import { useState } from "react";
import CalculatorButton from "./CalculatorButton";

export default function Calculator() {
  const [calculatorState, setCalculatorState] = useState({
    currentNumber: "0",// 현재 입력/표시되는 숫자
    previousNumber: "",// 이전에 입력된 숫자
    operation: null,// 현재 선택된 연산자 ("+", "-", "/", "*")
    isNewNumber: true,// 새로운 숫자 입력 여부
  });
```

**2) 타입 지정**

(1) src/types/props.d.ts

```
type CalculatorState = {// 이 부분 추가
    currentNumber: string;
    previousNumber: string;
    operation: null | string;
    isNewNumber: boolean;
}
```

![](https://blog.kakaocdn.net/dna/c04QPS/dJMcajN4f7N/AAAAAAAAAAAAAAAAAAAAAOCQxWdkrvh-yjNISc0-qwdTIquxcO9_ySg47CWrUPLb/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=lEc1aT9dUXlVoukHI3IJFVt5vDU%3D)

(2) src/components/Calculator.tsx

```
export default function Calculator() {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({// generic으로 타입 지정
    currentNumber: "0",
    previousNumber: "",
    operation: null,
    isNewNumber: true,
  });
```

**3) 버튼을 클릭했을 때, 클릭한 숫자 값을 상태에 업데이트**

```
// 0 - 9까지 클릭했을 때 실행되는 함수const handleNum = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    console.log(e.currentTarget.value);
    const value = e.currentTarget.value;// 문자열 데이터 값으로 넘어옴
    setCalculatorState((calculatorState) => ({
      ...calculatorState,
      currentNumber: calculatorState.isNewNumber
        ? value
        : calculatorState.currentNumber + value,
      isNewNumber: false,
    }));
  };
```

```
<input
	type="text"
    className="calc-input"
    name="output"
    readOnly
    value={calculatorState.currentNumber}// 이 부분 추가
/>
```

**4) 작동 확인**

![](https://blog.kakaocdn.net/dna/cbZzfV/dJMcajmZTSH/AAAAAAAAAAAAAAAAAAAAAETY3qvXBK4ZzW5J53VjIN7elq2HlhK769hh-SfcXiCl/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=Z%2BKWsYnBMJqM7hAckCqBgtTBLm8%3D)

![](https://blog.kakaocdn.net/dna/bgDjAA/dJMcabP2cVy/AAAAAAAAAAAAAAAAAAAAAFm1HXSW1eLtaZT_wznIuQM4u7-vT_hY4AT2JnboIMWr/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=iPjlAYZlXLXiZNM2dFW561Dv%2FLw%3D)

---

### **04. 계산기 기능 - (2) 연산자**

**POINT**

**: 계산기 UI에서 연산자 버튼 클릭 시, 수행되는 로직**

**1) 버튼을 클릭했을 때, 연산자 로직 실행 (src/components/Calculator.tsx)**

```
// "+", "-", "/", "*", "=" 클릭했을 때 실행되는 함수const handleOperator = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    console.log(e.currentTarget.value);
    const operator = e.currentTarget.value;
    setCalculatorState((calculatorState) => {
        const current = parseFloat(calculatorState.currentNumber);
        if (operator === "=") return { ...calculatorState, isNewNumber: true };
        return {
            currentNumber: "",
            previousNumber: current.toString(),
            operation: operator,
            isNewNumber: true,
        }
    });
  };
```

**2) F12 Components로 연산자 로직 실행 확인**

![](https://blog.kakaocdn.net/dna/dDUNmn/dJMcafdPtc5/AAAAAAAAAAAAAAAAAAAAAGLqj1uJK1ZEZ03SpnsUTC5QU2arU95gHmjf2ygJsXtO/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=M6nghXJimh3Wl8fdJLrFVK8Yez8%3D)

**3) result(=) 실행 함수 추가** **(src/components/Calculator.tsx)**

```
// "+", "-", "/", "*", "=" 클릭했을 때 실행되는 함수const handleOperator = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    console.log(e.currentTarget.value);
    const operator = e.currentTarget.value;
    setCalculatorState((calculatorState) => {
      const current = parseFloat(calculatorState.currentNumber);

// 아래 부분 추가if (calculatorState.previousNumber && calculatorState.operation) {
        const prev = parseFloat(calculatorState.previousNumber);
        const result = performCalculation(
          prev,
          current,
          calculatorState.operation
        );
        return operator === "="
          ? {
              currentNumber: result.toString(),
              previousNumber: "",
              operation: null,
              isNewNumber: true,
            }
          : {
              currentNumber: "",
              previousNumber: result.toString(),
              operation: operator,
              isNewNumber: true,
            };
      } else if (operator === "=")
        return { ...calculatorState, isNewNumber: true };
      return {
        currentNumber: "",
        previousNumber: current.toString(),
        operation: operator,
        isNewNumber: true,
      };
    });
  };
```

**4) performCalculation 함수 정의 (src/components/Calculator.tsx)**

```
const performCalculation = (
  prev: number,
  current: number,
  operation: string
) => {
  switch (operation) {
    case "+":
      return prev + current;
    case "-":
      return prev - current;
    case "*":
      return prev * current;
    case "/":
      return prev / current;
    default:
      return current;
  }
};
```

**5) F12 Components로 result(=) 로직 실행 확인**

![](https://blog.kakaocdn.net/dna/bu0fMj/dJMcagX6XM5/AAAAAAAAAAAAAAAAAAAAAL6708c0iCk_4uBPHA8A_BuHJhzMcnFfATi7NLtq-YpG/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=RVUzBnBaNg26lK5vH2X%2F3eqQfuk%3D)

![](https://blog.kakaocdn.net/dna/bdP9as/dJMcabJgDHu/AAAAAAAAAAAAAAAAAAAAAKeYY7oVS6S4aJMeFwx8Q8tYN1HMq0nCCZJqcESnDcrh/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=A7eBP9JWnfsUKIkyIJW7cHyeS9E%3D)

---

### **04. 계산기 기능 - (3) 소수점**

**POINT**

**: 계산기 UI에서 소수점(.) 버튼 클릭 시, 수행되는 로직**

**1) 버튼을 클릭했을 때, 소수점 로직 실행** **(src/components/Calculator.tsx)**

```
// . 클릭했을 때 실행되는 함수const handleDot = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    console.log(e.currentTarget.value);
    setCalculatorState((calculatorState) => {
      if (calculatorState.currentNumber.includes(".")) return calculatorState;
      return {
        ...calculatorState,
        currentNumber: calculatorState.currentNumber + ".",
        isNewNumber: false,
      };
    });
  };
```

**2) F12 Components로 소수점 로직 실행 확인**

![](https://blog.kakaocdn.net/dna/AvzKd/dJMcadAjDYp/AAAAAAAAAAAAAAAAAAAAAB26qEGwUQw_KPa6vfk4ITYfHGREtijVuHD-Ces9sc3A/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=Od%2F1Sogei1ls%2FCcmDYM8GuLFebk%3D)

---

### **04. 계산기 기능 - (4) 클리어**

**POINT**

**: 계산기 UI에서 C 버튼 클릭 시, 수행되는 로직**

**1) 버튼을 클릭했을 때, 클리어 로직 실행** **(src/components/Calculator.tsx)**

(1) 개선 전 코드 : 중복된 코드가 보임

```
export default function Calculator() {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    currentNumber: "0",// 현재 입력/표시되는 숫자
    previousNumber: "",// 이전에 입력된 숫자
    operation: null,// 현재 선택된 연산자 ("+", "-", "/", "*")
    isNewNumber: true,// 새로운 숫자 입력 여부
  });

// 'C'를 클릭했을 때 실행되는 함수const handleClear = () => {
    setCalculatorState({
      currentNumber: "0",// 현재 입력/표시되는 숫자
      previousNumber: "",// 이전에 입력된 숫자
      operation: null,// 현재 선택된 연산자 ("+", "-", "/", "*")
      isNewNumber: true,// 새로운 숫자 입력 여부
    });
  };
```

(2) 개선 후 코드 : 별도의 변수로 빼기

```
const initialData: CalculatorState = {
  currentNumber: "0",// 현재 입력/표시되는 숫자
  previousNumber: "",// 이전에 입력된 숫자
  operation: null,// 현재 선택된 연산자 ("+", "-", "/", "*")
  isNewNumber: true,// 새로운 숫자 입력 여부
};
export default function Calculator() {
  const [calculatorState, setCalculatorState] =
    useState<CalculatorState>(initialData);

// 'C'를 클릭했을 때 실행되는 함수const handleClear = () => {
    setCalculatorState(initialData);
  };
```

**2) F12 Components로 클리어 로직 실행 확인**

![](https://blog.kakaocdn.net/dna/beXaXF/dJMcabicjU1/AAAAAAAAAAAAAAAAAAAAAOWCour75bChRnDNKYCENjMUmFpxm0NfoMJiVKutLJCG/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=ykJJSZbyMOhE%2FOz1Lnd3Bfmfwmo%3D)

---

### **06. 버그 수정**

**1) 연산 기호 두 번 연속 클릭 시, NaN 오류 발생**

→ 연산 기호 두 번 들어올 시, 아무것도 하지 않고 원래 값을 유지

```
if (calculatorState.currentNumber === "" && operator)
            return calculatorState;
```

---

### **07. 마무리**

**1) 컴포넌트 외부, 내부 작성 차이**

- 외부 : React와 관련되어 있는 어떤 기능도 사용 X 함수 (ex. performCalculator)
- 내부 : React와 관련되어 있는 기능들을 활용하는 함수 (전부 상태 업데이트 함수 or 이벤트 핸들러 참조)

**2) utils 같은 폴더에 따로 파일을 만들어서 관리해도 좋음**

---

### **+. 리액트 개발자 도구 설치**

**1) Chrome 웹스토어 방문**

![](https://blog.kakaocdn.net/dna/kIPm8/dJMcaaKmibs/AAAAAAAAAAAAAAAAAAAAAAnWxA2qZqlEdu96-o1Zk1jaeiG653E5QmEieQJQkxpE/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=m82Yjy0Oa3oYegUXlK%2BH6BUO%2B%2Fc%3D)

**2) React Developer Tools 설치**

![](https://blog.kakaocdn.net/dna/ch21SV/dJMcacakWKZ/AAAAAAAAAAAAAAAAAAAAALfrQbMvc_53L12jIo1gjZUksYQlMmNOBVf_dmgHpz2o/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=eLMHOFgHPwMpifWvj3qkBNSjb2M%3D)

**3) 고정**

![](https://blog.kakaocdn.net/dna/Sj3f8/dJMcajtLwvm/AAAAAAAAAAAAAAAAAAAAAF6dKtDuC_mTHPSO4jgFpzW4q0I6vT7bTzQWOMcTSvRe/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=WV7rYg9EjxDb6fFFmoFnNtRrYBs%3D)

**4) Profiler, Component 확인 가능**
