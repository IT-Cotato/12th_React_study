# 컴포넌트와 Props

## 01. 데이터 출력

### 1) 기본 데이터 출력

- 앱 컴포넌트의 각 데이터를 변수에 할당
- JSX는 HTML과 다르게 자바스크립트 데이터를 직접 사용하여 브라우저 렌더링 가능
- 문법: `{ 변수명 }` 또는 `{ 표현식 }`
- 단, **논리형, undefined, null, Symbol**은 문자열 변환 후 출력해야 함

### 2) 참조 데이터 출력

```tsx
export default function App() {
  // 참조 자료형 예제
  const referenceArray = [1, 2, 3, 4];
  const referenceObject = { name: "John", age: 30 };
  const referenceFunction = () => "함수의 리턴 값";
  const referenceDate = new Date();
  const referenceRegExp = /react/i;
  const referenceMap = new Map([
    ["key1", "value1"],
    ["key2", "value2"],
  ]);
  const referenceSet = new Set([1, 2, 3, 4]);

  return (
    <>
      <h2>참조 자료형 출력</h2>
      <p>배열: {referenceArray}</p>
      <p>객체: {JSON.stringify(referenceObject)}</p>
      <p>함수: {referenceFunction.toString()}</p>
      <p>Date 객체: {referenceDate.toString()}</p>
      <p>정규식: {referenceRegExp.toString()}</p>
      <p>Map: {JSON.stringify(Array.from(referenceMap))}</p>
      <p>Set: {JSON.stringify(Array.from(referenceSet))}</p>
    </>
  );
}
```

- 배열: 요소 각각 평가 → 값 그대로 출력
- 객체: React는 표현식으로 객체 출력 불가 → `JSON.stringify` 사용
- 함수: `toString()` 메서드로 문자열 변환
- Date 객체: `toString()` 메서드로 변환
- 정규식: `toString()` 메서드로 변환
- Map: `Array.from()`으로 변환 후 `JSON.stringify`
- Set: `Array.from()`으로 변환 후 `JSON.stringify`

---

## 02. 컴포넌트에 데이터 전달하기

- React는 **부모 → 자식** 방향으로만 데이터 전달 가능

### 1) 컴포넌트에 데이터 전달

**App.tsx**

```tsx
import User from "./components/User";

export default function App() {
  return (
    <>
      <User name="Jeongbam" age={22} />
    </>
  );
}
```

**User.tsx**

```tsx
export default function User(props: { name: string; age: number }) {
  console.log(props);
  return (
    <>
      <div>
        <p>name: {props.name}</p>
        <p>age: {props.age}</p>
      </div>
    </>
  );
}
```

- props는 객체 형태로 전달됨
- 타입 지정 필요: `(props: { name: string; age: number })`
- 관례상 변수명은 `props`를 사용

---

## 03. 스프레드 연산자 활용

```tsx
<User2 {...userObj} />

// 동일한 효과
<User2 name="jack" age={20} gender="male" />
```

- 객체 속성을 전개해서 컴포넌트에 전달 가능
- 에러 메시지를 통해 타입을 빠르게 파악할 수 있음

---

## 04. Props vs Children

### 1) Children

- React 타입으로 지정 필요

- **ReactElement**: JSX 요소만 허용
- **ReactNode (추천)**: 문자열, 숫자, null, undefined, JSX 요소까지 전부 허용

---

# 컴포넌트와 이벤트

## 01. 이벤트

- 이벤트: 사용자와의 상호작용으로 발생하는 사건
- 이벤트 속성: 사용자 동작에 반응하기 위해 요소에 추가하는 속성
- 이벤트 핸들러: 이벤트 발생 시 실행되는 함수

```html
<button onClick="...">클릭</button>
```

- JSX에서는 모든 이벤트 속성이 **camelCase**로 작성됨

### 예시

**App.tsx**

```tsx
import Button from "./components/Button";

export default function App() {
  return (
    <>
      <Button />
    </>
  );
}
```

**Button.tsx**

```tsx
export default function Button() {
  const handleClick = () => alert("클릭 이벤트 발생");
  return (
    <>
      <button onClick={handleClick}>클릭</button>
    </>
  );
}
```

- 공식 레퍼런스: [React Events](https://ko.react.dev/reference/react-dom/components/common)

---

## 02. 이벤트 핸들러

### 1) 이벤트 핸들러 실습

```tsx
export default function Button() {
  const handleClick = (value: string) => alert(value);
  return (
    <>
      <button onClick={() => handleClick("HELLO")}>클릭</button>
      {/* 아래 코드는 실행 즉시 경고창 */}
      <button onClick={alert("World")}>클릭</button>
    </>
  );
}
```

### 2) 다양한 작성 방법

```tsx
export default function Button() {
  const handleClick = () => alert("click!!");
  return (
    <>
      <button onClick={() => alert("click!")}>클릭1</button>
      <button onClick={handleClick}>클릭2</button>
      <button onClick={() => handleClick()}>클릭3</button>
    </>
  );
}
```

- 별도의 함수 정의 후 활용하는 방식 추천

---

### 3) 이벤트 핸들러와 props

**App.tsx**

```tsx
import Button from "./components/Button";

export default function App() {
  return (
    <>
      <Button message="Playing!">Play Movie</Button>
      <Button message="Uploading!">Upload Image</Button>
    </>
  );
}
```

**Button.tsx**

```tsx
export default function Button(props: {
  message: string;
  children: React.ReactNode[];
}) {
  const handleClick = () => alert(props.message);
  return (
    <>
      <button onClick={handleClick}>{props.children}</button>
    </>
  );
}
```

---

### 4) 이벤트 핸들러를 props로 전달하기

**App.tsx**

```tsx
import Button from "./components/Button";

export default function App() {
  const handleClick = (message: string) => alert(message);
  return (
    <>
      <Button handleClick={handleClick} message="Playing">
        Play Movie
      </Button>
      <Button
        handleClick={(message: string) => alert(message)}
        message="Uploading!"
      >
        Upload Image
      </Button>
    </>
  );
}
```

**Button.tsx**

```tsx
export default function Button({
  handleClick,
  message,
  children,
}: {
  handleClick: (message: string) => void;
  message: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <button onClick={() => handleClick(message)}>{children}</button>
    </>
  );
}
```

---

## 03. 이벤트 객체

```tsx
export default function Button() {
  const handleClick = (
    message: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log(message);
    console.log(event);
  };

  const handleClick2 = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log("handleClick2");
    console.log(event);
  };

  return (
    <>
      <button onClick={(event) => handleClick("click", event)}>클릭</button>
      <button onClick={handleClick2}>클릭2</button>
    </>
  );
}
```

- 이벤트 발생 시 브라우저가 자동 생성
- React에서는 원본 DOM 이벤트를 감싼 **SyntheticEvent** 제공
- 매개변수를 같이 전달할 경우 이벤트 객체도 명시적으로 넘겨야 함

---

## 04. 이벤트 전파

- 이벤트 발생 시 DOM을 따라 전달되는 과정
- 단계: **캡쳐링 → 타깃 → 버블링**
- 버블링: 타깃에서 시작해 상위 요소로 올라감
- 캡쳐링: 최상위 요소에서 타깃까지 내려감

---

## 05. 실습 코드

**App.tsx**

```tsx
import Button from "./components/Button";

export default function App() {
  const handleClick = (message: string) => alert(message);
  return (
    <>
      <Button handleClick={handleClick} message="로그인이 되었습니다">
        Login
      </Button>
      <Button handleClick={handleClick} message="로그아웃이 되었습니다">
        Logout
      </Button>
    </>
  );
}
```

**Button.tsx**

```tsx
export default function Button({
  message,
  handleClick,
  children,
}: {
  children: React.ReactNode;
  message: string;
  handleClick: (message: string) => void;
}) {
  return (
    <>
      <button onClick={() => handleClick(message)}>{children}</button>
    </>
  );
}
```
