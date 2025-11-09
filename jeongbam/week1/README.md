# 컴포넌트 기본

---

## 01. 컴포넌트

### 1) 컴포넌트란?

- UI를 구성하는 **독립적이고 재사용 가능한 작은 단위**이다.
- 리액트 애플리케이션은 여러 개의 컴포넌트를 조합하여 구성된다.

---

### 2) 컴포넌트 종류

#### (1) 함수형 컴포넌트 (Functional Component) — **추천 방식**

```tsx
export default function App() {
  return (
    <>
      <h1>App Component</h1>
    </>
  );
}
```

#### (2) 클래스 컴포넌트 (Class Component)

```tsx
import React, { Component } from "react";

export default class App extends Component {
  render() {
    return (
      <>
        <h1>App Component</h1>
      </>
    );
  }
}
```

- `render()` 메서드를 사용하여 JSX를 반환한다.
- `extends` 키워드를 사용해 `Component`를 상속한다.

---

### 3) 함수형 컴포넌트의 조건

- `undefined` 반환은 허용되지 않는다 → 반드시 **`null` 또는 JSX 요소 반환**
- **하나의 루트 요소만 반환**해야 한다.
  - 여러 요소를 묶기 위해 `div` 또는 **Fragment**를 사용한다.
- `div`로 묶는 경우 화면에 실제로 렌더링되므로, 렌더링되지 않는 그룹핑을 원할 경우 **Fragment** 사용.

---

### 4) React의 Fragment

#### 기본 문법

```tsx
import React from "react";

export default function App() {
  return (
    <React.Fragment>
      <h1>App Component</h1>
      <h1>App Component</h1>
    </React.Fragment>
  );
}
```

#### 단축 문법

```tsx
export default function App() {
  return (
    <>
      <h1>App Component</h1>
      <h1>App Component</h1>
    </>
  );
}
```

- `<React.Fragment></React.Fragment>`와 `<> </>`는 동일한 기능을 한다.
- Fragment는 화면에 렌더링되지 않으며, **루트 요소 요건을 만족**시킨다.

---

## 02. 컴포넌트 실습 및 개념

### 1) 새로운 컴포넌트 만들기

- 파일 이름은 반드시 **첫 글자를 대문자**로 한다.  
  예: `Header.tsx`

- `App` 컴포넌트에서 `Header` 컴포넌트를 불러와 배치한다.

```tsx
import Header from "./Header";

export default function App() {
  return (
    <>
      <Header />
    </>
  );
}
```

---

### 2) 컴포넌트 트리 (Component Tree)

- 리액트 앱은 **컴포넌트들이 계층적으로 구성된 트리 구조**로 되어 있다.
- React는 이 트리를 기반으로 브라우저 DOM을 렌더링한다.
- 반드시 하나의 **루트 컴포넌트(App.tsx)** 가 존재해야 한다.
- App 컴포넌트가 Header 등을 포함하면서 **부모-자식 관계**를 형성한다.

> `import` 문으로 컴포넌트를 불러와 JSX 안에 배치하면  
> 트리 구조가 완성된다.

---

### 3) 루트 컴포넌트 (Root Component)

- 앱의 최상위 컴포넌트로, 모든 다른 컴포넌트의 부모 역할을 한다.
- `main.tsx`에서 `createRoot` 함수로 지정된다.

```tsx
// main.tsx 예시
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- `id="root"`인 DOM 요소를 루트 컨테이너로 사용한다.
- `StrictMode`는 개발용 감싸기 컴포넌트로, 여러 루트 컴포넌트를 동시에 렌더링할 수 있으나  
  일반적으로 **하나의 App 컴포넌트**만 루트로 두는 것이 권장된다.

---

## 03. 컴포넌트 FAQ

### 1) 함수 작성 방법

#### (1) 함수 선언문 (추천 방식)

```tsx
import Header from "./Header";
import Home from "./Home";
import Footer from "./Footer";

export default function App() {
  return (
    <>
      <h1>App Component</h1>
      <Header />
      <Home />
      <Footer />
    </>
  );
}
```

#### (2) 함수 표현식

```tsx
import Header from "./Header";
import Home from "./Home";
import Footer from "./Footer";

const App = function App() {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
};

export default App;
```

#### (3) 화살표 함수

```tsx
import Header from "./Header";
import Home from "./Home";
import Footer from "./Footer";

const App = () => (
  <>
    <Header />
    <Home />
    <Footer />
  </>
);

export default App;
```

---

### 2) 식별자 = 파일 이름?

- 식별자는 파일 이름과 동일한 경우가 많지만, 이는 **관례일 뿐 강제는 아님**.
- `export default`로 내보내는 경우, **import 시 다른 이름으로 지정 가능**.

```tsx
// Header.tsx 파일을 MyHeader로 불러오기
import MyHeader from "./Header";
import Home from "./Home";
import Footer from "./Footer";

export default function App() {
  return (
    <>
      <h1>App Component</h1>
      <MyHeader />
      <Home />
      <Footer />
    </>
  );
}
```

---

### 3) 루트 컴포넌트는 반드시 App?

- 아니오.
- `main.tsx`의 `render()` 함수에서 어떤 컴포넌트를 전달하느냐에 따라  
  그 컴포넌트가 루트 역할을 한다.

> 예를 들어 `Home` 컴포넌트를 `render(<Home />)`로 전달하면  
> Home이 루트 컴포넌트가 된다.

---

## 04. 컴포넌트 폴더 및 파일 관리

- 보통 `App` 컴포넌트를 제외한 나머지 컴포넌트들은  
  `components/` 폴더를 만들어 별도로 관리한다.
