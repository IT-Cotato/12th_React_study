# 섹션 12. 사이드 이펙트와 컴포넌트 최적화

## 1. useId

### id를 이용한 참조

- 체크박스나 라디오 요소의 텍스트를 클릭하더라도 체크가 되도록 할 수 있음
- 웹 접근성 향상을 위해 사용
  ```tsx
  export default function Checkbox() {
    return (
      <div>
        <input type="checkbox" id="apple" />
        <label htmlFor="apple">사과</label>
      </div>
    );
  }
  ```

### useId 훅

- 위의 방법으로 똑같은 id 값을 가지고 있는 요소를 여러 개 렌더링하면 정상적으로 동작하지 않음
- 이 경우 `useId`를 사용해야 함
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

## 2. useEffect

**배경**

- 컴포넌트는 화면 렌더링 이외에도 여러 Side Effect를 처리함
  - API 통신, 로컬 또는 세션 스토리지 쿠키를 저장하는 작업, 외부 라이브러리와 연동하는 작업 등
- Side Effect를 수행할 때는 useEffect 훅 사용

### **useEffect**

- 매개변수로 이펙트 함수와 의존성 배열을 전달
  - 의존성 배열에 따라 이펙트 함수가 호출됨
- useEffect에서 이펙트 함수를 호출하는 상황
  1. 컴포넌트 생성
  2. 컴포넌트 삭제
  3. 컴포넌트의 상태가 업데이트 될 때
  - 이러한 컴포넌트의 생성, 삭제, 변경을 라이프사이클(생명 주기)라고 함
- 의존성 배열이 다른 경우 서로 다른 useEffect 훅을 여러 번 작성해도 됨
- <StrictMode>를 제거하지 않는 경우 콘솔 메시지가 여러 번 출력됨
  - 내부적으로는 컴포넌트는 생성 삭제 생성이라는 과정을 반복하기 때문
  - 잠재적인 컴포넌트 에러를 찾기 위해 생성과 삭제의 과정을 빠르게 거치는 것

### 예시

```tsx
import { useEffect, useState } from "react";

export default function Checkbox() {
  const [count, setCount] = useState(0);

  **//컴포넌트가 생성될 때만 호출
  useEffect(() => {
    console.log("Count 컴포넌트 생성");**

    **//컴포넌트가 삭제될 때만 호출
    return () => {
      console.log("count 컴포넌트 삭제");
    };**
  }, []);

  **//컴포넌트의 상태가 변경될 때 호출
  useEffect(() => {
    console.log("Count Change: " + count);
  }, [count]); //count라는 상태값이 변경되었을 시에만 호출
  //여러 상태가 변경되었을 때 호출하려면 [count, count2]와 같이 나타냄**

  return (
    <>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount((count) => count + 1)}>증가</button>
    </>
  );
}

```

```tsx
import { useState } from "react";
import Checkbox from "./components/Checkbox";

export default function App() {
  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <button onClick={() => setIsShow((isShow) => !isShow)}>노출 변경</button>
      {isShow && <Checkbox />}
    </>
  );
}
```

## 3. 메모이제이션

### **컴포넌트 리렌더링 조건**

1. 컴포넌트의 정의한 상태가 변경된 경우
2. 컴포넌트로 전달하는 props가 변경되었을 때
3. 부모 컴포넌트가 리렌더링 되었을 때
   - 자식 컴포넌트는 변경된 props나 상태가 없어도 부모 컴포넌트가 리렌더링 된다는 이유로 리렌더링 되는 것 ⇒ **불필요한 리렌더링**

- 불필요한 리렌더링은 성능 저하로 이어질 수 있기 때문에 상황에 따라 방지할 필요가 있음
- 그 방법 중 하나가 React.memo 사용

### React.memo

- 컴포넌트 메모이제이션
- 함수형 컴포넌트를 메모이제이션하여 동일한 props로 다시 렌더링될 경우 이전 결과를 재사용하게 하는 것
- 컴포넌트 자체를 메모리에 저장해두고 이후 동일한 props로 다시 렌더링 요청이 들어오면 컴포넌트 함수를 다시 실행하지 않고 이전 렌더링 결과를 그대로 반환하는 방식
- 하위 컴포넌트가 많은 구조일 수록 성능에 큰 이점을 줌

```tsx
import React from "react";
import ChildB from "./ChildB";

export default **React.memo**(function ChildA() {
  console.log("ChildA");
  return (
    <>
      <h1>ChildA Component</h1>
      <ChildB />
    </>
  );
});
```

### React.memo가 풀리는 순간

- 메모이제이션을 적용해도 적용되지 않는 예외적인 케이스가 있음

1. **React.memo가 사용된 컴포넌트 자체의 상태가 변경되는 경우**

   ```tsx
   import React, { useState } from "react";
   import ChildB from "./ChildB";

   export default React.memo(function ChildA() {
     console.log("ChildA");
     **const [count, setCount] = useState(0);**
     return (
       <>
         <h1>ChildA Component</h1>
         **<button onClick={() => setCount((count) => count + 1)}>증가</button>**
         <ChildB />
       </>
     );
   });

   ```

2. **해당 컴포넌트로 전달되는 props의 값이 변경되는 경우**

   ```tsx
   import React from "react";
   import ChildB from "./ChildB";

   export default React.memo(function ChildA({ count }: { count: number }) {
     console.log("ChildA");
     return (
       <>
         <h1>ChildA Component: {count}</h1>
         <ChildB />
       </>
     );
   });
   ```

   - 이 경우 props의 값이 변경되지 않는다면 메모이제이션이 유지되지만
   - **props의 값이 변경되는 경우 React.memo가 풀림**

**함수를 props로 전달하는 경우**

```tsx
import React from "react";
import ChildB from "./ChildB";

export default React.memo(function ChildA({
  increment,
}: {
  increment: () => void;
}) {
  console.log("ChildA");
  return (
    <>
      <h1>ChildA Component</h1>
      <ChildB />
    </>
  );
});
```

```tsx
import { useState } from "react";
import ChildA from "./components/ChildA";

export default function App() {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount((count) => count + 1);
  };
  return (
    <>
      <h1>count: {count}</h1>
      <button onClick={() => setCount((count) => count + 1)}>증가</button>
      <ChildA increment={increment} />
    </>
  );
}
```

- `increment`라는 함수를 props로 전달
- `count`는 직접 값이 변경되지만 함수도 변경된 것으로 인식하는 이유?
  - 앱 컴포넌트 리렌더링 시 다시 호출되면서 함수가 다시 정의됨
  - 함수는 참조 자료형이기 때문에 함수가 다시 정의되면 참조값이 바뀜
  - **컴포넌트가 리렌더링 될 때마다 참조값이 바뀌고 ChildA 컴포넌트에 새롭게 전달되면서 메모이제이션이 소용이 없게 됨**
    ⇒ use Callback으로 해결 가능

### useCallback

- 함수 메모이제이션

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

- useCallback 훅을 사용해 기존의 함수를 매개변수로 전달
- 콤마를 찍고 의존성 배열 작성
- 의존성 배열이 빈 배열인 경우 해당 함수는 컴포넌트가 생성될 때 한 번만 메모리에 저장이 되고 이후부터는 계속 메모리에 저장된 값을 가져다 쓰게 됨

### useMemo

- 값 메모이제이션
- 예제 코드
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

    // 불필요한 연산을 만들어준 것
    // 3000만개의 배열 데이터를 렌더링 마다 재생성하고 있음
    const selectItems = initialItems.find((item) => item.selected);
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
  - 리렌더링 발생 시 높은 연산비용으로 인해 렉 발생
  - 컴포넌트가 리렌더링 되더라도 배열에 할당되는 값은 변하지 않기 때문에 매번 재계산 될 필요는 없음
- useMemo 훅 사용
  ```tsx
  import { useState, useMemo } from "react";

  const initialItems = new Array(29_999_999).fill(0).map((_, i) => {
    return {
      id: i,
      selected: i === 29_999_998,
    };
  });

  export default function App() {
    const [count, setCount] = useState(0);

    // 불필요한 연산을 만들어준 것
    // 3000만개의 배열 데이터를 렌더링 마다 재생성하고 있음
    **const selectItems = useMemo(
      () => initialItems.find((item) => item.selected),
      []
    );**
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
  - 원하는 값을 리턴하도록 첫 매개변수를 작성
  - 두 번째 매개변수로 의존성 배열 작성
  - 첫 번째 매개변수에서 리턴하는 값을 메모이제이션 하는데 그 기준을 두 번째 매개변수로 전달하는 의존성 배열
  - 여러 상태값을 의존성 배열 내 [count, count2]와 같이 나타낼 수도 있음
    → 이는 값들 중 하나라도 변경이 되면 메모이제이션을 다시 하라는 의미

## 4. 코드 분할 기능

**배경**

- React에서는 앱이 시작될 때 필요한 모든 자바스크립트 코드를 한 번에 로딩
- 특정 컴포넌트가 실제 화면에 렌더링 되지 않더라도 코드에 `import` 되어있고 JSX에 포함되어 있다면 함께 번들에 포함되어 다운로드 됨
- 앱에 포함된 컴포넌트가 많을 수록 초기 번들 크기가 커지고 앱의 첫 로딩 속도가 느려질 수 있음
- 페이지 전환에 따라 보여지는 컴포넌트가 많거나 무거운 라이브러리를 사용하는 경우 문제가 더 두드러짐

⇒ 코드 분할 기능을 통해 해결 가능

### lazy

- React.lazy 함수를 통해 특정 컴포넌트를 필요할 때 비동기적으로 로딩할 수 있음

```tsx
import React from "react";
import { useState } from "react";
// import ChildA from "./components/ChildA";
// import ChildB from "./components/ChildB";
**const ChildA = React.lazy(() => import("./components/ChildA"));
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

- 구조분해 할당으로 불러오는 것도 가능
  ```tsx
  import { lazy, useState } from "react";
  // import ChildA from "./components/ChildA";
  // import ChildB from "./components/ChildB";
  const ChildA = lazy(() => import("./components/ChildA"));
  const ChildB = lazy(() => import("./components/ChildB"));
  ```
- 단점:
  - 컴포넌트가 렌더링 될 때 그제서야 데이터를 다운받아 일부 시간이 오래 걸리는 컴포넌트에서는 최초 로딩 시간이 그만큼 느려짐
  - (네트워크 탭 No throttling에서 인터넷 속도 지연 시간을 늘려볼 수 있음)
  - 컴포넌트에 지연이 생길 경우 화면에 아무것도 뜨지 않을 수도
    ⇒ 이를 대비하여 suspense 내장 컴포넌트 제공

### suspense

- 비동기로 로딩 중일 때 보여줄 대체 컴포넌트를 설정할 수 있게 함
- React에 내장되어 있기 때문에 별도로 컴포넌트 파일을 선언해 줄 필요 없이 불러와 사용하면 됨
  ```tsx
  import { lazy, Suspense, useState } from "react";
  // import ChildA from "./components/ChildA";
  // import ChildB from "./components/ChildB";
  const ChildA = lazy(() => import("./components/ChildA"));
  const ChildB = lazy(() => import("./components/ChildB"));

  export default function App() {
    const [isShow, setIsShow] = useState(false);
    return (
      <>
        <button onClick={() => setIsShow((isShow) => !isShow)}>토글</button>
        {isShow && (
          <>
            **
            <Suspense fallback={<h1>ChildA loading</h1>}>
              <ChildA />
            </Suspense>
            <Suspense fallback={<h1>ChildB loading</h1>}>
              <ChildB />
            </Suspense>**
          </>
        )}
      </>
    );
  }
  ```
  - fallback이라는 속성을 사용해 컴포넌트가 로딩될 때 보여줄 수 있는 대체 UI 작성 가능
    - 컴포넌트나 JSX 문법이 올 수 있음
  - 로딩이 끝난 것부터 화면에 렌더링
    - suspense 사용 안할 시 둘 다 렌더링이 되어야 표시 됨

### error-boundary

- React에서는 에러 발생 시 에러가 있는 컴포넌트뿐만 아니라 그 부모 트리 전체의렌더링도 중단되기 때문에 앱 전체가 멈춘 것처럼 보임
- error boundary를 통해 에러가 발생하더라도 앱 전체가 멈춰지지 않도록 막을 수 있음
- 자바스크립트 에러를 잡아서 대체 UI를 보여주는 React 컴포넌트
  - 과거에는 componentDidCatch, getDerivedStateFrom 에러 메서드를 가진 클래스형 컴포넌트를 직접 구현해서 사용해야 했지만 최근에는 react-error-boundary와 같은 외부 패키지를 사용해 함수형 컴포넌트에서도 간편하게 에러 바운더리를 적용할 수 있음
- 설치
  ```tsx
  npm install react-error-boundary
  pnpm add react-error-boundary
  ```
- 활용
  ```tsx
  import { lazy, Suspense, useState } from "react";
  import { ErrorBoundary } from "react-error-boundary";
  // import ChildA from "./components/ChildA";
  // import ChildB from "./components/ChildB";
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
            **<ErrorBoundary fallback={<div>something went wrong</div>}>
              <Suspense fallback={<h1>childB loading</h1>}>
                <ChildB />
              </Suspense>
            </ErrorBoundary>**
          </>
        )}
      </>
    );
  }
  ```
  - 여러번 사용 가능하며 렌더링 중 에러가 발생한 컴포넌트에서 가장 가까이 있는 에러 바운더리가 실행 됨
  - `fallback`이아닌 `FallbackComponent`를 사용할 수 있음
    ```tsx
    import { lazy, Suspense, useState } from "react";
    import { ErrorBoundary } from "react-error-boundary";
    // import ChildA from "./components/ChildA";
    // import ChildB from "./components/ChildB";
    const ChildA = lazy(() => import("./components/ChildA"));
    const ChildB = lazy(() => import("./components/ChildB"));

    **function Fallback({
      error,
      resetErrorBoundary,
    }: {
      error: Error;
      resetErrorBoundary: () => void;
    }) {
      return (
        <div role="alert">
          <p>something went wrong</p>
          <pre>{error.message}</pre>
          <button onClick={resetErrorBoundary}>retry</button>
        </div>
      );
    }**

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
              <ErrorBoundary **FallbackComponent={Fallback}**>
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
    - `error`와 `resetErrorBoundary`를 인자로 받음
    - 에러 메시지를 디테일하게 제어할 수 있음
