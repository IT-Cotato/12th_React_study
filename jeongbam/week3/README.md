# 컴포넌트 상태

---

## 01. useState

### 1) 상태(State)

- 상태는 시간에 따라 변할 수 있는 데이터로, 컴포넌트 내에서 관리되는 값이다.
- 함수형 컴포넌트에서는 `useState` React Hook을 사용하여 상태를 정의한다.

> React Hook: 함수형 컴포넌트에서 상태 관리, 생명 주기 제어, 부가 기능을 사용할 수 있게 도와주는 기능

```tsx
const [state, setState] = useState<Type>(initialState);
```

| 구분           | 설명                       | 예시                             |
| -------------- | -------------------------- | -------------------------------- |
| `initialState` | 상태의 초깃값              | `0`, `""`, `{}` 등               |
| `Type`         | 상태값의 타입              | `number`, `string`, `boolean` 등 |
| `state`        | 실제 상태 값이 할당된 변수 | `count`                          |
| `setState`     | 상태값을 업데이트하는 함수 | `setCount`                       |

- 상태 데이터는 값이 바뀌면 즉시 반영(리렌더링)된다.
- `let` / `const` 변수와 달리, 상태는 화면에 자동 반영된다.
- 타입스크립트에서는 자동 타입 추론이 이루어지므로, 같은 타입일 경우 제네릭 타입 생략이 가능하다.

---

### 예제: 상태 정의하기

```tsx
import { useState } from "react";

export default function App() {
  const [name, setName] = useState("jeongbam");
  const [age, setAge] = useState(22);
  const [gender, setGender] = useState("female");

  const handleUpdateProfile = () => {
    setName("jeongbam");
    setAge(22);
    setGender("female");
  };

  return (
    <>
      <p>name: {name}</p>
      <p>age: {age}</p>
      <p>gender: {gender}</p>
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </>
  );
}
```

---

## 02. 상태 업데이트 (State Update)

### 1) 상태 업데이트 방식

- 상태를 변경할 때는 `setState` 함수를 사용한다.
- 함수형 업데이트(Function Update)는 상태 변경 함수의 인수로 함수를 전달하는 방식이다.

```tsx
setState((state) => state + 1);
```

> `state`는 항상 최신 상태 값을 보장한다.

- 변경될 값이 현재 상태를 참조한다면 함수형 업데이트를 사용한다.
- 이전 상태를 참조하지 않는다면 일반적인 업데이트 방식을 사용한다.

---

### 예제: 카운터 앱 만들기

```tsx
import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount((count) => count + 1);
  const handleDecrement = () => setCount((count) => count - 1);
  const handleReset = () => setCount(0);

  return (
    <>
      <h1>count: {count}</h1>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
      <button onClick={handleReset}>Reset</button>
    </>
  );
}
```

**목표**

- `useState` 훅 사용법 이해
- 이벤트 핸들링을 통한 상태 변경과 리렌더링 경험

---

## 03. 상태 (State)

### 1) 상태 독립성

- `useState`로 정의된 상태는 컴포넌트마다 독립적이다.
- 한 컴포넌트의 상태 변경은 다른 컴포넌트에 영향을 주지 않는다.
- 리렌더링도 해당 상태가 정의된 컴포넌트 내부에서만 발생한다.

### 2) 상태 끌어올리기 (Lifting State Up)

- 여러 컴포넌트가 동일한 상태를 공유해야 할 경우  
  → 공통 부모 컴포넌트에서 상태를 정의하고  
  → 상태와 업데이트 함수를 props로 전달한다.

### 3) 캡슐화 (Encapsulation)

- 상태 업데이트 함수를 직접 넘기기보다는, 상태 변경 로직을 포함한 함수를 정의해 넘기는 것이 바람직하다.
- 예: 숫자 상태를 1 증가시키는 로직을 외부에서 직접 호출하지 않고 내부 함수로 감싸 캡슐화.

---

## 04. useReducer

### 1) 개념

```tsx
const [state, dispatch] = useReducer<Type>(reducer, initialState);
```

| 구성요소       | 설명                                  |
| -------------- | ------------------------------------- |
| `state`        | 현재 상태 값                          |
| `dispatch`     | 액션을 발생시키는 함수 (reducer 호출) |
| `reducer`      | 상태 업데이트 로직이 담긴 함수        |
| `initialState` | 초기 상태 값                          |
| `Type`         | 상태값의 타입                         |

- `useReducer`는 `[현재 상태, dispatch 함수]` 배열을 반환한다.
- 타입스크립트에서는 타입 추론을 통해 제네릭 타입을 생략하는 경우가 많다.

---

### 예제: 카운터 리듀서 구현

#### (1) `components/Count.tsx`

```tsx
import { useReducer } from "react";
import CountButton from "./CountButton";
import CountDisplay from "./CountDisplay";
import counterReducer from "../reducer/counterReducer";

export default function Count() {
  const [count, countDispatch] = useReducer(counterReducer, 0);
  return (
    <>
      <CountDisplay count={count} />
      <CountButton countDispatch={countDispatch} />
    </>
  );
}
```

#### (2) `components/CountButton.tsx`

```tsx
import { ActionDispatch } from "react";

export default function CountButton({
  countDispatch,
}: {
  countDispatch: ActionDispatch<[action: { type: string }]>;
}) {
  return (
    <>
      <button onClick={() => countDispatch({ type: "INCREMENT" })}>
        Increment
      </button>
      <button onClick={() => countDispatch({ type: "DECREMENT" })}>
        Decrement
      </button>
      <button onClick={() => countDispatch({ type: "RESET" })}>Reset</button>
    </>
  );
}
```

#### (3) `components/CountDisplay.tsx`

```tsx
export default function CountDisplay({ count }: { count: number }) {
  return <h1>{count}</h1>;
}
```

#### (4) `reducer/counterReducer.tsx`

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

## 요약

| 구분            | 핵심 포인트                        |
| --------------- | ---------------------------------- |
| `useState`      | 간단한 상태 정의 및 업데이트       |
| `useReducer`    | 복잡한 상태 변경 로직 관리         |
| 상태 끌어올리기 | 여러 컴포넌트 간 상태 공유         |
| 캡슐화          | 상태 업데이트 로직을 함수로 감싸기 |

---

# 반복 렌더링과 조건부 렌더링

---

## 01. 반복 렌더링

### 개요

- 데이터 배열을 기반으로 동일한 UI 패턴을 여러 번 렌더링하는 기법.
- React에서는 배열을 원하는 요소 배열로 가공한 뒤, JSX에서 중괄호로 출력하는 패턴이 표준적이다.

### 1) for

- 반복 대상이 담긴 배열을 준비하고, JSX 요소를 누적해 배열로 만든 뒤 반환하는 방식.
- 배열을 JSX 중괄호에 넣으면 각 요소가 개별 평가되어 그대로 나열된다.
- 실무에서는 JSON 같은 순수 값 배열을 다루는 경우가 많아 가독성과 선언성이 좋은 `map`을 주로 사용.

### 2-1) map

- `map`은 기존 배열을 순회하며 새로운 배열을 만드는 표준 메서드.
- 선언적이며 JSX와 결합하기 쉬워 React에서 가장 권장되는 반복 렌더링 방식.

```tsx
// 예시: map으로 리스트 렌더링
function List({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

### 2-2) (미션) map 메서드를 활용한 리스트 렌더링

- `useState`로 문자열 배열 상태를 만들고, `map`으로 `<li>` 리스트를 렌더링한다. 버튼으로 아이템을 1회 추가하고 중복 추가를 방지한다.

---

## 02. 조건부 렌더링

### 개요

- 조건에 따라 서로 다른 UI를 선택적으로 렌더링하는 기법.
- if, switch, 삼항 연산자, 논리 AND 연산자 등 여러 패턴이 있으며 상황에 맞게 선택한다.

### 1-1) if

- return 바깥에서 분기하여 여러 컴포넌트를 조건에 따라 선택해 반환할 때 사용.
- React Fragment(`<>...</>`)로 여러 엘리먼트를 한 번에 묶어 반환 가능.
- 상위에서 받은 props를 조건으로 삼아 분기 처리 가능.

```tsx
function Panel({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) return null;
  return (
    <>
      <h2>Title</h2>
      <p>Content</p>
    </>
  );
}
```

#### (미션) 로그인 상태에 따른 화면 렌더링

- `useState`로 로그인 여부를 관리하고, if 분기로 로그인/비로그인 화면을 각각 렌더링한다. 로그인/로그아웃 버튼으로 상태를 전환한다.

### 2-1) switch

- 특정 단일 값에 대한 다중 분기가 반복될 때 가독성을 높이기 위해 사용.
- if 체인이 길어질 때 대체 수단으로 유용.

```tsx
function StatusView({
  status,
}: {
  status: "idle" | "loading" | "success" | "error";
}) {
  switch (status) {
    case "loading":
      return <p>Loading...</p>;
    case "success":
      return <p>Done</p>;
    case "error":
      return <p>Error</p>;
    default:
      return <p>Idle</p>;
  }
}
```

#### (미션) 신호등 색상에 따른 화면 렌더링

- `useState`로 `"red" | "yellow" | "green"` 상태를 관리하고, 버튼 클릭 시 switch로 다음 색상으로 전환한다. 색상에 따라 다른 텍스트를 표시한다.

### 3-1) 삼항 연산자

- 하나의 return 문 안에서 인라인으로 조건부 렌더링을 처리할 때 사용.
- 간단한 2분기 표현에 적합하며 과도한 중첩은 지양.

```tsx
function Greeting({ isLoggedIn }: { isLoggedIn: boolean }) {
  return <h1>{isLoggedIn ? "Welcome" : "Please sign in"}</h1>;
}
```

#### (미션) 삼항 연산자를 활용한 조건부 렌더링

- `isLoggedIn` 상태를 삼항으로 분기하여 환영 메시지와 로그인 유도 메시지를 토글한다. 버튼으로 상태를 전환한다.

### 4-1) && 연산자

- `expr1 && expr2`: 왼쪽이 참일 때만 오른쪽을 평가해 렌더링.
- 거짓으로 평가되는 값: `false`, `null`, `NaN`, `0`, 빈 문자열, `undefined`.

\```tsx
function Notice({ show }: { show: boolean }) {
return <>{show && <div className="notice">New notice</div>}</>;
}
\```

#### (미션) && 연산자를 활용한 알림 메시지 표시

- `showNotification`이 참일 때만 알림을 렌더링한다. 보기/닫기 버튼으로 상태를 토글한다.

---

## 03. key 속성

### 1) key 속성 고유하게 하기

- 리스트 렌더링에서 `key`는 형제 요소 간 고유해야 한다.
- 인덱스를 key로 사용하는 것은 데이터 추가/삭제/정렬 시 재조정 문제를 유발하므로 지양.
- 데이터의 안정적인 식별자(예: id)를 key로 사용.

```tsx
// 권장: 안정적인 식별자를 key로 사용
items.map((item) => <Row key={item.id} item={item} />);
```

### 2) key 속성의 유효 범위

- key의 고유성은 해당 반복 구간(동일 부모 하의 형제 목록) 내에서만 요구된다.
- 서로 다른 리스트 블록 간에는 동일한 key 값이 있어도 무방하다.

---

## 04. filter

### 1) filter란?

- 배열에서 콜백 조건을 만족하는 요소만 걸러 새로운 배열을 만드는 표준 메서드.
- 렌더링 전에 데이터 전처리(예: 특정 카테고리만 노출)에 자주 사용되며, `map`과 조합해 사용.

```tsx
// 예시: vegetable 카테고리만 노출
const vegetables = items.filter((v) => v.category === "vegetable");
return (
  <ul>
    {vegetables.map((v) => (
      <li key={v.id}>{v.name}</li>
    ))}
  </ul>
);
```
