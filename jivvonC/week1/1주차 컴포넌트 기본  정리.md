# 3. 컴포넌트 기본

### 컴포넌트란?

UI를 구성하는 독립적이고 재사용 가능한 작은 단위

컴포넌트의 장점은 재사용 가능하다는 점과 유지보수를 간단하게 해준다는 점! 
(컴포넌트만 수정하면 인스턴스들 다 자동 수정)

컴포넌트의 구성 요소

- props(property)
부모 컴포넌트에서 자식 컴포넌트로 전달되는 데이터
자식 컴포넌트는 프로퍼티 값을 읽어오는 것만 가능하지 수정하지 못함.
- state
컴포넌트 내부에서 관리하고 업데이트할 수 있는 데이터

부모 컴포넌트의 state와 자식 컴포넌트의 state는 완전히 별개!
각각 자기가 내부적으로 관리하고 서로의 state값 직접 접근 불가 <br>
단, 부모 > 자식으로 데이터를 내려주려면 props를 사용해야함!

```jsx
function Child({ parentCount }) {
  const [childCount, setChildCount] = React.useState(0);

  return (
    <div>
      <p>부모 state: {parentCount}</p>
      <p>자식 state: {childCount}</p>
      <button onClick={() => setChildCount(childCount + 1)}>
        자식 +1
      </button>
    </div>
  );
}

function Parent() {
  const [parentCount, setParentCount] = React.useState(0);

  return (
    <div>
      <h1>부모 컴포넌트</h1>
      <p>부모 state: {parentCount}</p>
      <button onClick={() => setParentCount(parentCount + 1)}>
        부모 +1
      </button>

      <Child parentCount={parentCount} /> //
    </div>
  );
}
```

이 코드에서 부모 버튼을 누르면 부모 값만 증가!
자식 버튼을 누르면 자식 값만 증가!

두 state는 서로 별개!

단, 부모 state를 자식 컴포넌트에게 props로 넘겨줬기에 자식이 부모의 state값을 읽을 수는 있음.


### 컴포넌트의 종류

- 함수형 컴포넌트
“리액트에서 화면(UI)를 반환하는 함수”
즉, jsx 코드를 리턴하는 함수가 함수형 컴포넌트!
입력값(props)를 받기도 하고 안 받기도 함!

```jsx
//스니펫: rfc
export default function App() {
    return (
     <>
      <h1>App Component</h1>
     </>
    );
}
```

         또한, 함수형 컴포넌트는 화살표 함수로도 정의 가능!

```jsx
//ex.1 props가 없는 함수형 컴포넌트
const NameBox = () => {
  const name = "test";
  return <div>{name}</div>;
};

//ex.2 props가 있는 함수형 컴포넌트
const Greeting = ({name}) => {
  return <h1>Hello, {name}!</h1>;
 };
```

- 클래스형 컴포넌트

```jsx
//스니펫: rcc
import React, { Component } from 'react'

export default class App extends Component {
  render() {
    return (
      <div>
        
      </div>
    )
  }
}
```

클래스로 정의하는 컴포넌트로 render() 함수에서 jsx 코드를 반환함!
ui+상태(state)로 옛날 방식의 컴포넌트! (요즘은 함수형씀)

함수형 컴포넌트와 다르게 render함수를 이용해 리턴

extends 키워드를 사용하여 react의 component 클래스를  상속해야 함

함수형보다 문법 복잡, 가독성 떨어짐

훅 등장 이후로는 잘 사용 안함

상태관리는 this.state로!
props접근은 this.props로!

그렇다면 둘의 차이점은?

| 구분 | 클래스형 | 함수형 |
| --- | --- | --- |
| 정의 | class Counter extends Component | function Counter() |
| 상태 | this.state, this.setState | useState |
| 화면 렌더링| render() 안에서 리턴 | 함수가 리턴 |
| 라이프사이클 | componentDidMount등 개별 메서드 | useEffect |
| 가독성 | 굉장히 길어질 수도 있음🥺| 간결, 직관적, 깔끔 |

### 함수형 컴포넌트의 조건

1. 함수로 작성되어야 함
2. return으로 JSX 요소나 null 반환
아무것도 안하거나 undefined를 리턴하거나 그냥 return;만 있으면 안됨 <br>(아무것도 리턴(렌더링) 안하고 싶으면 null 반환)

### React.Fragment

JSX는 반드시 하나의 root요소로 반환되어야 한다

```jsx
//스니펫: rfc
export default function App() {
    return (
     <> //이게 무슨 의미인지!!
      <h1>App Component</h1>
     </>
    );
}
```

JSX는 여러개의 root요소가 있으면 에러가 남
그래서 <div>나 다른 그룹핑 태그로 묶어줘야함

근데 문제점..!

```jsx
export default function App() {
    return (
     <div>
      <h1>App Component</h1>
     </div>
    );
}
```

이런 코드가 있다고 했을때 
묶는 용도로 사용한 div인데 이 div태그 자체도 화면에 나타나버림!!

그러면 단순히 묶는 용도라면
Fragment 컴포넌트 사용

```jsx
import React from "react";

export default function App () {
  return (
    <React.Fragment>
      <h1>App Component</h1>
    </React.Fragment>
  );
}
```

이러면 묶어주기용 부모 태그는 화면에 렌더링 되지 않음!

```jsx
export default function App() {
    return (
     <> //이렇게 작성해도 React.Fragment사용하는 것과 같은 의미!
      <h1>App Component</h1>
     </>
    );
}
```

### 새로운 컴포넌트 만들기

1. 대문자로 시작하는 tsx파일 만들기 
ex. Header.tsx
2. rfc 같은 스니펫 사용하면 대략 이런 형태!

```jsx
export default function Header () {
  return (
    <>
      <h1>Header Component</h1>
    </>
  );
}
```

1. export로 내보냈으니까 App.tsx에서 만든 파일을 import해주고 root 요소 안에 넣어주면 끝!

```jsx
import React from "react";
import Header from "./Header";

export default function App () {
  return (
    <React.Fragment>
      <h1>App Component</h1>
      <Header/>
    </React.Fragment>
  );
}
```

### 컴포넌트 트리 이해하기

컴포넌트 트리?

컴포넌트들이 계층적으로 구성된 구조

루트 컴포넌트를 기준으로 여러개의 컴포넌트들이 연결되면서 화면이 구성됨

App.tsx가 루트 컴포넌트 역할!

그래서 새로운 컴포넌트를 화면에 렌더링 하려면 app 컴포넌트와 연결해줘야함

어떻게?
App 컴포넌트 안에 넣어서 자식 컴포넌트로 만들기

이렇게 부모 자식 관계가 쌓이면서 트리 구조가 된다 > 컴포넌트 트리

### 루트 컴포넌트에 대한 고찰

main.tsx에서는 createRoot함수를 사용하여 id가 ‘root’인 요소를 root 컨테이너로 생성한 후 render 함수를 통해 app 컴포넌트를 렌더링 함

App 컴포넌트: 실제로 UI 렌더링하는 역할 ( react의 root 컴포넌트)

StrictMode: 개발 모드에서 잠재적인 문제를 감지하기 위한 레퍼 컴포넌트 > 얘는 root가 아님
레퍼 컴포넌트는 실제로 UI를 직접 렌더링 하지는 않음
StrictMode는 내부에 꼭 app 컴포넌트만 있어야 하는게 아니라 여러 컴포넌트 동시에 렌더링도 가능함!

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Header from './Header.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header/>
    <App />
  </StrictMode>
)
```

근데 이렇게 하면 상태관리나 데이터 흐름 추적이 어려워져서 단일 최상위 컴포넌트를 유지하는게 좋음

### 컴포넌트에 대한 이모저모

함수의 작성 방법

1. 함수 선언문 방식

```jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";

export default function App () {
  return (
    <>
    <h1>App Component</h1>
      <Header/>
      <Home/>
      <Footer/>
    </>
  );
```

1. 함수 표현식 방식

```jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
const App = function App () {
  return (
    <>
    <h1>App Component</h1>
      <Header/>
      <Home/>
      <Footer/>
    </>
  );
  
 export default App;
```

app이라는 변수에 함수를 할당하고 변수에는 바로 export default를 할 수 없어서 마지막에 해줌

1. 화살표 함수 방식

```jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
const App = () => 
  (
    <>
    <h1>App Component</h1>
      <Header/>
      <Home/>
      <Footer/>
    </>
  );
  
 export default App;
```

셋 중 어떤 방식을 사용하든 렌더링에는 문제 없음

리액트 공식문서에서는 함수 선언문 형식을 주로 사용

export default가  아니라 그냥 export로 내보내면 import할 때 

```jsx
import {Header} from "./Header";
```

이런 식으로 중괄호로 묶어서 내보내야 함!
이러면 이름 마음대로 지정할 수 없음
아니면 as 사용해서 별칭 만들어주기

```jsx
import {Header as MyHeader} from "./Header";
```

굳이 export로 내보낼 필요 없다…
그냥 export default 쓰는게 좋음!

파일 이름과 식별자 이름 통일

root 컴포넌트의 이름은 꼭 app일  필요 없음

다른 이름으로 하고 싶으면 바꿔도 됨

main.tsx 안에서 render 함수 안에 단일 컴포넌트로 들어있기만 하면 상관 없음

### components 폴더

컴포넌트는 src 폴더 안에 만들기

근데 많아지면 보통 Components 라는 폴더를 src 안에 만들어서 app.tsx , main.tsx 제외하고는 다 거기에 넣음

### 추가 리서치

타입 스크립트 vs 자바스크립트

자바스크립트의 단점을 보완하기 위해 나온게 타입스크립트

자바스크립트는 동적 타입  언어로 실행시간에 타입이 결정되어 런타임 오류 가능성 있음.

타입스크립트는 정적 타입 언어로 미리 타입 지정, 컴파일 시에 타입 체크 > 컴파일 단계에서 오류 잡아내기 가능

타입스크립트의 타입이란?

데이터가 어떤 종류인지 미리 정의 하는것

```jsx
let age: number = 25;       // 숫자만 가능
let name: string = "지원";  // 문자열만 가능
let isAdmin: boolean = true; // true/false만 가능
let scores: number[] = [100,95,80]; //숫자 배열만 가능

//parameter도 타입 미리 지정
function add(x: number, y: number): number {
  return x + y;
}
```

이렇게  age라는 변수는 숫자만 가능! 이라고 선언 단계에서부터 미리 정해두는 것

```jsx
//앞에서 이미 age는 숫자 타입이라고 선언했으니 다음과 같은 코드는 오류남
age = 'happy';
```

왜 타입을 미리 정의하는걸까?

자바스크립트의 경우, 선언할 때 자료형 명시가 필수가 아님.
그래서 다음과 같은 문제가 생길 수 있음!

```jsx
function plus(a,b){
    var c = a+b			//1.runtime err 발생

    return c
}

var a =1
var b ="aa"				

console.log("a+b=" +plus(a,b))
```

자바스크립트는 동적 타입 언어라 런타임에 타입 검사를 하게 되고(컴파일까지 다 하고 잘 돌다가 1번 지점에서 멈춰버림)  그 때서야 오류를 발견함.

하지만 같은 코드라고 할때,
타입스크립트는 정적 타입  언어로 컴파일할 때 타입 검사를 하고, 프로그램이 돌아가기 전에 오류를 잡아냄.

따라서 타입스크립트를 사용하면 타입을 선언 단계에서 명시해 컴파일 단계에서 미리 선언 될 수 없는 변수를 차단, 코드가 돌다가 이유없이 죽어버리는 현상을 방지 할 수 있음!

| 구분 | 자바스크립트 (JavaScript) | 타입스크립트 (TypeScript) |
| --- | --- | --- |
| 언어 성격 | 동적 타입 언어 (Dynamic typing) | 정적 타입 언어 (Static typing, JS의 상위 집합) |
| 실행 방식 | 브라우저/Node.js에서 바로 실행 가능 | JS로 **컴파일 후** 실행해야 함 |
| 타입 검사 | 런타임에 오류 발견 | 컴파일 단계에서 오류 발견 가능 |
| 문법 | 비교적 간단, 자유로움 | 엄격한 문법, 타입 정의 필요 |
| 도구 지원 | JS만으로도 가능, 다양한 라이브러리 풍부 | VSCode 등 IDE에서 강력한 자동완성/에러체크 지원 |
| 학습 곡선 | 낮음 (빠르게 시작 가능) | 다소 높음 (타입 시스템 학습 필요) |

자바스크립트 

장점

- 쉬운 접근성
- 유연성 > 한 변수를 여러 자료형을 넣어가며 사용 가능
- 풍부한 생태계

단점

- 타입 안전성 부족 > 이유 모르는 런타임 에러 발생 가능성…
- 규모가 커질수록 코드가 명확하지 않으면 타입 혼란 가능성 있음
- IDE 자동완성 한계 > 타입 정보가 불명확해 도구 지원이 제한적

타입스크립트

장점

- 정적 타입  검사 > 런타임 가기 전에 미리 오류를 잡아낼 수 있음
- 가독성 높음 >  어떤 타입의 데이터가 들어가고 리턴되는지 바로 알 수 있음
- 유지보수성 향상
- 도구 지원 강화 > IDE에서 자동완성, 리팩토링, 코드  탐색 지원
- 최신 JS 기능 지원

단점

- 초기 설정 필요: tsconfig 설정, 빌드 과정이 추가됨
- 타입 시스템이나 제네릭  같은 새로운 문법 학습 필요
- 생산성 낮음…  > 낮은 유연성으로 변수 여러개 필요, 자바스크립트로는 4줄이면 끝날게 10줄 넘어갈 수도 있음.(any 사용이라는 해결 방법 있음)
- 개발 속도 저하 가능성 > 하지만 타입이 명확해지면 장기적으로는 안전성 더 높음

작은 프로젝트나 빠른 결과물을 원하면 자바스크립트로 충분하지만
대규모 프로젝트거나 협업, 유지보수가 지속적으로 이루어져야하는 경우 타입스크립트를 사용하는 것이 이상적임.