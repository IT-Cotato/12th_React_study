## **12. 사이드 이펙트와 컴포넌트 최적화**

### **01. useID**

**1) useID란?**

- 폼 관련 요소(체크박스 요소 or 라디오 버튼 요소 )들을 작성할 때 웹 접근성을 향상시켜주기 위해 처리해주는 기법
- ex) 체크박스가 아닌 단어를 클릭했을 때도 체크박스가 작동
- label 태그에 htmlFor라는 속성 사용 **→** 값 일치 시, 참조관계 형성
- 두 번 작성 시 제대로 작동 X **→** 컴포넌트가 렌더링 되었을 때 똑같은 id 값 가지고 있는 요소가 똑같이 두 개 렌더링되어졌기 때문 **→ useId hook 사용**

```tsx
import { useId } from "react";

export default function Checkbox() {
  const uuid = useId();
  return (
    <div>
      <input type="checkbox" id={uuid} />
      <label htmlFor={uuid}>사과</label>
    </div>
  );
}
```

---

### **02. useEffect**

**1) useEffect란?**

- 컴포넌트의 주된 목적: 컴포넌트에서 반환되는 JSX 요소를 바탕으로 화면 렌더링하기!
- Side effect: JSX를 렌더링하는 본래의 목적 이외에 발생하는 모든 부수적인 행동**→ useEffect(effect 함수, 의존성배열([]):** 의존성 배열에 따라 effect 함수 호출
- 생명주기: 컴포넌트의 생성, 삭제, 변경
  - 컴포넌트가 생성될 때 (= 마운트)
  - 컴포넌트가 삭제될 때 (= 언마운트)
  - 컴포넌트가 변경될 때 (= 업데이트)

**2) useEffect 실습 (Count.tsx)**

- effect 함수의 호출은 의존성 배열이 비어 있을 때, 컴포넌트가 생성될 때만 호출
- useEffect 훅을 사용할 때, 의존성 배열을 빈 배열로 두면
  - 일반적인 이펙트 함수: 컴포넌트가 생성될 때 호출
  - 이펙트 함수에서 리턴하는 콜백함수: 컴포넌트가 삭제될 때 호출

```tsx
import { useEffect, useState } from "react";

export default function Checkbox() {
  const [count, setCount] = useState(0);

// 컴포넌트 생성될 때만 호출
  useEffect(() => {
    console.log("Count 컴포넌트 생성");**

// 컴포넌트 삭제 될 때만 호출return () => {
      console.log("count 컴포넌트 삭제");
    };**
  }, []);

// 컴포넌트의 상태가 변경되었을 때만 호출// 콤마(,) 통해 여러개도 호출 가능
  useEffect(() => {
    console.log("Count Change: " + count);
  }, [count]);

  return (
    <>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount((count) => count + 1)}>증가</button>
    </>
  );
}
```

---

### **03. 컴포넌트 리렌더링 조건**

**1) 리렌더링 조건**

- 상태가 변경되었을 때
- 부모 컴포넌트가 리렌더링 되었을 때
- props가 변경되었을 때

---

**2) React.memo**

- 화면이 바뀌지 않았는데 리렌더링 → 불필요한 리렌더링 → 성능 저하
- **React.memo**: 함수형 컴포넌트를 memorization하여 동일한 props로 다시 렌더링될 경우 → **이전 결과 재사용**

```tsx
import React from "react";
import ChildB from "./ChildC";

export default **React.memo**(function ChildA() {
  console.log("ChildB");
  return (
    <>
      <h1>ChildB Component</h1>
      <ChildC />
    </>
  );
});
```

- **React.memo가 풀리는 순간:** 그대로 리렌더링, 재호출 발생
  - 컴포넌트 자체의 상태가 변경
  - 컴포넌트로 전달되는 props 값이 변경

---

### **04. useCallback**

**1) ChildA 컴포넌트가 increment라는 값이 변경되었다고 인식을 하는 이유?**

- Increment가 **함수**이기 때문!
  - 함수는 참조 자료형이기 때문에, 함수가 다시 정의되면 참조값이 바뀌게 됨
  - 바뀌게 된 참조값이 결국 컴포넌트가 리렌더링이 될 때마다 참조값 바뀌고,그 바뀌게 된 참조값이 ChildA 컴포넌트에 계속 새롭게 전달됨즉, ChildA는 항상 새로운 값이 온다고 인식, memorization 소용 X→ useCallback 훅 사용

**2) useCallback 훅이란?**

- 이 훅을 통해 기존의 함수를 매개변수로 전달 (함수를 memorization)
- 의존성 배열을 빈 배열로 할 시, 함수는 컴포넌트가 생성될 때 한 번만 메모리에 저장이 됨→ 이후는 계속 메모리에 저장된 값 사용
- 이제 Increment는 리렌더링이 된다고 하더라도 메모리에 저장된 값 사용하게 됨

```tsx
import { useCallback, useState } from "react";
import ChildA from "./components/ChildA";

export default function App() {
  const [count, setCount] = useState(0);
  **const increment = useCallback(() => {
    setCount((count) => count + 1);
  }, []);**
  return (
    <>
      <h1>count: {count}</h1>
      <button onClick={() => setCount((count) => count + 1)}>증가</button>
      <ChildA increment={increment} />
    </>
  );
}
```

---

### **05. useMemo**

**1) useMemo 훅이란?**

- 값을 memorization 할 때 사용
- 리렌더링 발생 시, memorization 된 값을 가져다 쓰기 때문에 매우 쾌적하게 리렌더링 가능
- 의존성 배열 내 [count, count2, count3] 작성 → 값들 중 하나라도 변경이 되면 memorization 다시 하라는 의미

```tsx
import { useState } from "react";

const initialItems = new Array(29_999_999).fill(0).map((_, i) => {
  return {
    id: i,
    selected: i === 29_999_998,
  };
});

export default function App() {
  const [count, setCount] = useState(0);

  // 불필요한 연산을 만들어줌// 3000만개의 배열 데이터를 렌더링마다 재생const selectItems = initialItems.find((item) => item.selected);
  return (
    <>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount((prevCount) => prevCount + 1)}>
        증가
      </button>
      <p>{selectItems?.id}</p>
    </>
  );
}
```

---

### **06. lazy**

- JSX에 포함되어 있고, 정적인 import문을 통해 로드되는 컴포넌트: 화면에 보이지 않더라도 초기 번들에 포함되어져 있기에 항상 같이 다운로드 됨→ **'코드 분할 기능'**을 통해 해결

**1) lazy란?**

- 특정 컴포넌트를 필요 시 비동기적으로 로딩 가능 → 초기 앱의 로딩 성능 크게 향상

```tsx
import React from "react";
import { useState } from "react";
const ChildA = React.lazy(() => import("./components/ChildA"));
const ChildB = React.lazy(() => import("./components/ChildB"));**

export default function App() {
  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <button onClick={() => setIsShow((isShow) => !isShow)}>토글</button>
      {isShow && (
        <>
          <ChildA />
          <ChildB />
        </>
      )}
    </>
  );
}
```

---

### **07. suspense**

- **lazy 단점**
  - 컴포넌트가 렌더링 될 때 그제서야 데이터 다운
  - 일부 시간 오래 걸리는 컴포넌트는 최초 로딩 시간 느려짐
  - ex) ChildA가 끝나도 나타나지 않고, ChildA, ChildB 둘 다 렌더링 끝나야 둘이 동시에 나타남

**1) Suspense 컴포넌트란?**

- 비동기로 로딩 중일 때 보여줄 대체 컴포넌트를 설정할 수 있게 해줌
- React에 내장되어있기에 별도의 컴포넌트 파일 선언 필요 없이 바로 사용 가능
- '토글' 버튼 누르면 'Loading..' 뜨고, 로딩이 끝난 것부터 화면에 렌더링 됨
- 로딩이 발생하는 동안 fallback이라는 속성에 지정되어져 있는 해당 내용을 대체 UI로써 보여줄 수 있음

```tsx
import { lazy, Suspense, useState } from "react";
const ChildA = lazy(() => import("./components/ChildA"));
const ChildB = lazy(() => import("./components/ChildB"));

export default function App() {
  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <button onClick={() => setIsShow((isShow) => !isShow)}>토글</button>
      {isShow && (
        <>
          <Suspense fallback={<h1>ChildA loading</h1>}>
            <ChildA />
          </Suspense>
          <Suspense fallback={<h1>ChildB loading</h1>}>
            <ChildB />
          </Suspense>
        </>
      )}
    </>
  );
}
```

---

### **07. error-boundary**

- React는 컴포넌트가 렌더링되는 과정에서 발생하는 에러를 매우 심각하게 취급
- 에러가 발생하더라도 앱 전체가 멈춰지지 않게 하기 위해서는? → error-boundary

**1) error-boundary**

- 렌더링 도중에 발생하는 자바스크립트 에러를 잡아서 앱 전체가 멈추지 않도록 방지→ 에러 바운더리에 fallback 속성으로 적혀져 있는 대체 UI가 보여지게 됨
- 대체 UI를 보여주는 특수한 React 컴포넌트
- 함수형 컴포넌트에서도 간편하게 에러 바운더리 적용 가능

**2)** **error-boundary 설치**

```tsx
npm install react-error-boundary
```

```tsx
pnpm add react-error-boundary
```

**3)** **error-boundary 실습**

```tsx
import { lazy, Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
const ChildA = lazy(() => import("./components/ChildA"));
const ChildB = lazy(() => import("./components/ChildB"));

export default function App() {
  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <button onClick={() => setIsShow((isShow) => !isShow)}>토글</button>
      {isShow && (
        <>
          <Suspense fallback={<h1>ChildA loading</h1>}>
            <ChildA />
          </Suspense>
          <ErrorBoundary fallback={<div>something went wrong</div>}>
            <Suspense fallback={<h1>childB loading</h1>}>
              <ChildB />
            </Suspense>
          </ErrorBoundary>
        </>
      )}
    </>
  );
}
```
