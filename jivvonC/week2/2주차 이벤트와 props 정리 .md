# 4. 컴포넌트와 Props

### 조상, 부모, 자식, 자손

조상: 부모의 부모 컴포넌트

형제: 같은 부모 컴포넌트 공유 > 단, 같은 레벨에 있다고 다 형제 컴포넌트 아님(부모가 같아야)

자손: 자식의 자식(손주) 컴포넌트

### 기본 데이터 출력하기

출력 vs 렌더링

공통점: 변수에 저장된 데이터가 실제 화면에 표시되는 과정

JSX에서의 렌더링은 {변수 또는 표현식} 

```jsx
export default function App () {
  const primitiveString = "Hello";
  const primitiveNumber = 42;
  const primitiveBoolean = false;
  const primitiveUndefined = undefined;
  const primitiveNull = null;
  const primitiveSymbol = Symbol("mySymbol");
  const primitiveBigInt = 903409309402n;

  return (
    <>
      <h1>기본 자료형 출력</h1>
      <p>문자: {primitiveString}</p>
      <p>숫자: {primitiveNumber}</p>
      <p>논리형: {primitiveBoolean}</p> //출력 안됨
      <p>undefined: {String(primitiveUndefined)}</p> //출력 안됨
      <p>null: {primitiveNull}</p> //출력 안됨
      <p>Symbol: {primitiveSymbol}</p> //출력 안됨
      <p>BigInt: {primitiveBigInt}></p>
    </>
  );
}
```

**예외**

`논리형`: 리액트는 논리형 값을 렌더링 가능한 요소로 취급하지 않음!

논리형 값을 화면에 보이게 하려면 논리형 값을 문자열로 변경해서 출력을 해야함

**Solution**: wrapper 객체를 이용해서 toString() 메소드 사용하기

```jsx
<p> 논리형: {primitiveBoolean.toString()} </p>
```

`undefined`, `null`, `Symbol`: 화면에 출력하려면 문자열로 변경해야함

근데 별도의 wrapper 객체가 없어서 문자열로 변경하려면 자바스크립트 내장 함수인 String을 사용해야 함
**Solution**: 

```jsx
<p> undefined: {String(primitiveUndefined} </p>
<p> null: {String(primitiveNull)}</p> 
<p> Symbol: {String(primitiveSymbol)}</p> 
```

### 참조 자료형 출력하기

```jsx
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
      <p>배열: {referenceArray}</p> //출력 가능
      <p>객체: {referenceObject}</p> // 출력 안됨
      <p>함수: {referenceFunction} </p>//출력 안됨
      <p>Date 객체: {referenceDate} </p> //출력 안됨
      <p>정규식: {referenceRegExp} </p> //출력 안됨
      <p>Map: {referenceMap} </p> //그냥 일렬로 출력됨 + 에러남
      <p>Set: {referenceSet} </p> //그냥 일렬로 출력됨 + 에러남
    </>
  );
}
```

`배열`: 중괄호 안에 배열을 넣게 되면 배열 안에 있는 요소를  각각 평가하여서 그대로 화면에 렌더링

, 콤마와 같은 것들이 드러나지 않고 각각의 요소가 일렬로 출력됨

`객체`: 리액트는 객체로 되어있는 것은 표현식으로 출력하지 못함

예를 들어 API의 응답값 같은 경우에는 그 안에 객체가 있는지 뭐가 있는지 알 수 없으니 그냥 가져왔다가 객체 있어서 오류 날 수 있음

그래서 객체를 렌더링 하려면 JSON 객체에 stringify라는 메서드를 사용하여서 객체 데이터를 stringify로 string 문자열로 바꾼 다음에 출력 해야함 > JSON 문자열로 바꿔서

**Solution**:

```jsx
<p>객체: {JSON.stringify(referenceObject)}</p>
```

`함수`, `Date 객체`, `정규식`: 문자열로 변경해야 렌더링 가능

**Solution**:

```jsx
<p>함수: {referenceFunction.toString()} </p>
<p>Date 객체: {referenceDate.toString()} </p>
<p>정규식: {referenceRegExp.toString()} </p>
```

`Map`, `Set` : 그냥 렌더링하면 일렬로 나옴 + 에러남 (Using Map as children is not supported)

**Solution**:

```jsx
//array에 from 함수를 써서 배열 형태로 만들고 JSON string 문자열로 만들어서 출력
<p>Map: {JSON.stringify(Array.from(referenceMap))} </p>
<p>Set: {JSON.stringify(Array.from(referenceSet))} </p>
```

### 태그의 속성 값에 바인딩하기

리액트에서는 **JSX** 문법을 사용하여 HTML과 유사한 방식으로 태그를 작성하지만,

데이터 바인딩을 위해 중괄호 `{}`를 사용하여 자바스크립트 값을 속성에 전달할 수 있습니다.

1. **동적으로** `src` **속성 값 설정하기 (이미지)**

이미지 태그에서 `src` 속성에 동적으로 값을 전달하는 예시입니다.

```jsx
export default function App() {
  const imageUrl = "https://example.com/image.jpg";
  return (
    <div>
      <img src={imageUrl} alt="Example" />
    </div>
  );
}

```

위 예제에서 `src={imageUrl}`은 `imageUrl` 변수를 `src` 속성 값으로 전달합니다.

이 방법으로 외부 데이터를 기반으로 이미지 소스를 동적으로 바꿀 수 있습니다.

2. **동적으로** `href` **속성 값 설정하기 (링크)**

링크 태그에서 `href` 속성에 동적으로 값을 설정하는 예시입니다.

```jsx
export default function App() {
  const url = "https://www.example.com";

  return (
    <div>
      <a href={url} target="_blank" rel="noopener noreferrer">
        Visit Example
      </a>
    </div>
  );
}
```

위 예제에서는 `href` 속성에 `url` 변수를 사용하여 링크를 동적으로 설정하고 있습니다.

이처럼 태그의 속성에 중괄호를 사용하면 데이터의 값을 전달할 수 있다는 사실도 알아두면 되겠습니다.

### 컴포넌트에 데이터 전달하기

React에서

부모 컴포넌트 > 자식 컴포넌트 데이터 전달 ⭕️

부모 컴포넌트 > 자손 컴포넌트 데이터 전달 ❌

자식 컴포넌트 > 부모, 조상 컴포넌트 데이터 전달 ❌

형제 컴포넌트 > 형제 컴포넌트 데이터 전달 ❌

데이터 전달하기: 컴포넌트의 속성으로 값을 넘겨주기

```jsx
//App.tsx
import User from "./components/User";

export default function App () {
  return (
    <>
      <User name="Jack" age="20"/> //name이라는 속성으로 jack이라는 데이터 넘기기
    </>
  );
}

//User.tsx
export default function User (props) {
 console.log(props); //이러면 객체 형태로 출력됨 > 객체 형태로 전달 된다!
  return (
    <>
      <h1>User Component</h1>
    </>
  );
}
```

이때 속성의 값을 큰따옴표, 작은 따옴표로 넘기면 “문자열”이 됨

그래서 원래 형태로 보내고 싶으면 {} 중괄호 안에 넣어줘야  함

컴포넌트의 props로 전달된 값들은  자식 컴포넌트에서 매개변수로 받아서 활용할 수 있음

매개변수의 이름은  마음대로 지어도 상관 없지만 관례상 props라는 이름을 많이 이용함

부모 컴포넌트에서 전달한 props는 props의 개수에 상관없이 모두 객체 형태로 전달됨

타입스크립트 기반 react에서는 이러한 매개변수의 타입을 올바르게 지정해줘야 타입에러가 발생하지 않음

```jsx
//User.tsx
export default function User (props: {name:string; age:number}) {
 console.log(props); //이러면 객체 형태로 출력됨 > 객체 형태로 전달 된다!
  return (
    <>
      <p> name: {props: name}</p>
      <p> age: {props: age}</p>
    </>
  );
}
```

### 컴포넌트에 데이터 전달하기 2

다양한  자료형의 값을 props로 전달하기

```jsx
//App.tsx
import PrintValue from "./components/printValue";

export default function App () {
  const numberValue = 42;
  const stringValue = "Hello World";
  const booleanValue = true;
  const arrayValue = [1, 2, 3, 4];
  const objectValue = { name: "John Doe", age: 30 };
  const handleClick = () => alert("버튼이 클릭되었습니다!");

  return (
  <>
  //보통 컴포넌트에 데이터 전달할 때 속성의 식별자와 변수의 식별자가 같지 않아도 상관없지만 같으면 가독성 높음
  <PrintValue 
  numberValue={numberValue} 
  stringValue={stringValue} 
  booleanValue={booleanValue}
  arrayValue={arrayValue}
  objectValue={objectValue}
  handleClick={handleClick}/> 
  </>
  );
}

//PrintValue.tsx
export default function PrintValue (props: {
    //타입 지정
    numberValue: number;
    stringValue: string;
    booleanValue: true | false;
    arrayValue: number[];
    objectValue: {name: string, age: number};
    handleClick: () => void;
    }) {
    console.log(props);
  return (
    <>
      <p>number: {props.numberValue}</p>
      <p>string: {props.stringValue}</p>
      <p>boolean: {props.booleanValue.toString()}</p>
      <p>array: {props.arrayValue}</p>
      <p>object: {JSON.stringify(props.objectValue)}</p>
      <p>function: {props.handleClick.toString()}</p>
    </>
  );
}
```

부모 컴포넌트가 전달한 props를 자식 컴포넌트는 객체로 받기 때문에 관례상 자식 컴포넌트의 props라는 이름의 매개변수를 props 객체라고 부르기도 함

부모는 props가 몇개든 하나의 객체로 넘기니까 props.numberValue처럼 자식이 알아서 필요한거 빼서 쓰기

### 비구조화 할당하기

비구조화 할당: 위에서 한 것처럼 그냥 ‘props:’ 하는게 아니라 부모 컴포넌트에서 전달한 props를 바로 분리

분리한  것에 대한 타입도 1:1로 지정

**매개변수에서 비구조화 할당**

```jsx
//PrintValue.tsx
export default function PrintValue ({
    numberValue,
    stringValue,
    booleanValue,
    arrayValue,
    objectValue,
    handleClick,
    }:{
    numberValue: number;
    stringValue: string;
    booleanValue: true | false;
    arrayValue: number[];
    objectValue: {name: string, age: number};
    handleClick: () => void;
    })

    {
  return (
    <>
    //이제 props. 안해도 됨!
      <p>number: {numberValue}</p>
      <p>string: {stringValue}</p>
      <p>boolean: {booleanValue.toString()}</p>
      <p>array: {arrayValue}</p>
      <p>object: {JSON.stringify(objectValue)}</p>
      <p>function: {handleClick.toString()}</p>
    </>
  );
}
```

만약 매개변수 쪽에 코드가 길어지는 것을 원하지 않으면?

**함수 내부에서 비구조화 할당** 

```jsx
//PrintValue.tsx
export default function PrintValue (props: {
    //타입 지정
    numberValue: number;
    stringValue: string;
    booleanValue: true | false;
    arrayValue: number[];
    objectValue: {name: string, age: number};
    handleClick: () => void;
    }) {

  const {
     numberValue,
     stringValue,
     booleanValue,
     arrayValue,
     objectValue,
     handleClick,
  } = props;
  return (
    <>
      <p>number: {props.numberValue}</p>
      <p>string: {props.stringValue}</p>
      <p>boolean: {props.booleanValue.toString()}</p>
      <p>array: {props.arrayValue}</p>
      <p>object: {JSON.stringify(props.objectValue)}</p>
      <p>function: {props.handleClick.toString()}</p>
    </>
  );
}
```

### 타입 쉽게 알아내기

props의 타입을 쉽게 유추하는 법

전제 조건: 자식 컴포넌트에서 props를 받기 위한 매개변수를 모두 제거해줘야 함

```jsx
//PrintValue.tsx
export default function PrintValue (props: {
    //타입 지정
    numberValue: number;
    stringValue: string;
    booleanValue: true | false;
    arrayValue: number[];
    objectValue: {name: string, age: number};
    handleClick: () => void;
    }) {
    console.log(props);
  return (
    <>
      <p>number: {props.numberValue}</p>
      <p>string: {props.stringValue}</p>
      <p>boolean: {props.booleanValue.toString()}</p>
      <p>array: {props.arrayValue}</p>
      <p>object: {JSON.stringify(props.objectValue)}</p>
      <p>function: {props.handleClick.toString()}</p>
    </>
  );
}

//이 상태에서 app.tsx의 이부분을 드래그 했을때의 정보를 복붙해서 넣으면 된다...
  <PrintValue 
  numberValue={numberValue} 
  stringValue={stringValue} 
  booleanValue={booleanValue}
  arrayValue={arrayValue}
  objectValue={objectValue}
  handleClick={handleClick}/> 
  
 //이렇게!
 export default function PrintValue (props:{ 
 numberValue: number; 
 stringValue: string; 
 booleanValue: boolean; 
 arrayValue: number[]; 
 objectValue: { name: string; age: number; }; 
 handleClick: () => void; }) {
    console.log(props);
  return (
    <>
      <p>number: {props.numberValue}</p>
      <p>string: {props.stringValue}</p>
      <p>boolean: {props.booleanValue.toString()}</p>
      <p>array: {props.arrayValue}</p>
      <p>object: {JSON.stringify(props.objectValue)}</p>
      <p>function: {props.handleClick.toString()}</p>
    </>
  );
}
 
```

### 타입 정의 하는 방법

타입스크립트 기반의 리액트에서는 props 객체의 타입을 반드시! 지정해야 함

하지만 컴포넌트에 전달되는 props가 많아질 경우 각 props의 타입을 일일히 다 쓰면 코드의 가독성 떨어짐

Solution

인터페이스나 타입 별칭으로 타입 정의를 분리하기

인터페이스 사용

```jsx
interface PrintValueProps{
    numberValue: number; 
    stringValue: string; 
    booleanValue: boolean; 
    arrayValue: number[]; 
    objectValue: { name: string; age: number; }; 
    handleClick: () => void;
}

export default function PrintValue (props: PrintValueProps) {
    console.log(props);
  return (
    <>
      <p>number: {props.numberValue}</p>
      <p>string: {props.stringValue}</p>
      <p>boolean: {props.booleanValue.toString()}</p>
      <p>array: {props.arrayValue}</p>
      <p>object: {JSON.stringify(props.objectValue)}</p>
      <p>function: {props.handleClick.toString()}</p>
    </>
  );
}
```

타입 사용

```jsx
type PrintValueProps = {
    numberValue: number; 
    stringValue: string; 
    booleanValue: boolean; 
    arrayValue: number[]; 
    objectValue: { name: string; age: number; }; 
    handleClick: () => void;
}

export default function PrintValue (props: PrintValueProps) {
    console.log(props);
  return (
    <>
      <p>number: {props.numberValue}</p>
      <p>string: {props.stringValue}</p>
      <p>boolean: {props.booleanValue.toString()}</p>
      <p>array: {props.arrayValue}</p>
      <p>object: {JSON.stringify(props.objectValue)}</p>
      <p>function: {props.handleClick.toString()}</p>
    </>
  );
}
```

bit로 생성한  리액트 애플리케이션은 기본 타입 스크립트 설정에서   "include": ["src"] 가 되어있음

그래서 별도의 d.ts 확장자를 가지고 있는 파일에 타입 정의를 분리할 수 있음

```jsx
//types/props.d.ts
type PrintValueProps = {
    numberValue: number; 
    stringValue: string; 
    booleanValue: boolean; 
    arrayValue: number[]; 
    objectValue: { name: string; age: number; }; 
    handleClick: () => void;
}

//이런식으로 분리해둬도 따로 export 없이 PrintValue.tsx에서 바로 사용 가능함
//PrintValue.tsx
export default function PrintValue (props: PrintValueProps) {
    console.log(props);
  return (
    <>
      <p>number: {props.numberValue}</p>
      <p>string: {props.stringValue}</p>
      <p>boolean: {props.booleanValue.toString()}</p>
      <p>array: {props.arrayValue}</p>
      <p>object: {JSON.stringify(props.objectValue)}</p>
      <p>function: {props.handleClick.toString()}</p>
    </>
  );
}

```

### 스프레드 연산자 활용하기

객체 데이터를 전달 할 때, 중첩해서 비구조화 할당하면 깔끔하게 만들 수 있음

```jsx
export default function User ({
userObj: {name, age, gender},
}:{
userObj: {name: string; age:number; gender: string};
}) {
  return (
    <>
      <p>name: {name}</p>
      <p>age: {age}</p>
      <p>gender: {gender}</p>
    </>
  );
}
```

하지만 더 깔끔하게 만들고 싶다? > 전개 연산자 이용하기

전개 연산자

객체의 속성을 하나하나 전개해서 컴포넌트에 전달하겠다

```jsx
import User from "./components/User";
import User2 from "./components/User2";

export default function App () {
  const userObj = {
    name: "jack",
    age: 20,
    gender: "male",
  }

  return (
  <>
  <User userObj={userObj}/>
  <User2 {...userObj} />  //전개 연산자....1
  <User2 name={"jack"} age={20} gender={"male"} /> ....2
  //1과 2는 완전히 같은 코드!
  </>
  );
}
```

이렇게 전달해주면 자식 컴포넌트 입장에서는 비구조화 할당만 하면 됨

### children

react에서는 컴포넌트에 데이터를 전달할 때 props를 이용해서 전달하는 방법도 있지만 

children을 사용해서도 전달 가능함

예를 들어 버튼 컴포넌트가 다음과 같이 있을때

```jsx
//Button.tsx

export default function Button () {
  return (
    <>
      <button>Login</button>
    </>
  );
}
```

이 컴포넌트를 계속 재사용 할 수 있으려면 안에 텍스트도 용도에 맞게 바꿀 수 있어야함

```jsx
//App.tsx
export default function App () {
  return (
  <>
   <Button>Login</Button>
  </>
  );
}

//Button.tsx...........비구조화 할당❌
export default function Button ({props}) {
  return (
    <>
      <button>{props.children}</button>
    </>
  );
}

//Button.tsx..........비구조화 할당⭕️
export default function Button ({children}: {children: React.ReactElement}) {
  return (
    <>
      <button>{children}</button>
    </>
  );
}
```

children을 사용하면 좋은점

콘텐츠가 무엇이든 children이라는 props 속성으로 그대로 전달됨

근데 타입스크립트니까 children도 타입 지정해줘야함

방법1: React의 ReactElement 타입

```jsx
export default function Button ({children}: {children: React.ReactElement}) {
  return (
    <>
      <button>{children}</button>
    </>
  );
}
```

React의 ReactElement 타입 > JSX 요소만 허용하는 타입

이 컴포넌트에 전달되는 children 콘텐츠가 반드시 JSX요소여야지만 허용됨 > 문자열, 숫자, null, undefined 같은거 안됨

방법2: React의 ReactNode타입

```jsx
export default function Button ({children}: {children: React.ReactNode}) {
  return (
    <>
      <button>{children}</button>
    </>
  );
}
```

 React의 ReactNode타입 > 문자열, 숫자, null, undefined를 포함해서 JSX요소까지 전부 다 허용하는 범용적인 타입

### **Props vs Children**

컴포넌트에 데이터를 전달하는 방법은 크게 두 가지입니다.

- 컴포넌트의 props로 전달하기
- 컴포넌트의 children으로 전달하기

그러면 컴포넌트에 데이터를 전달할 때는 어떤 경우에 어떤 방법을 사용해야 할까요?

팀이나 조직의 규칙에 따라서 충분히 달라질 수 있지만,

보편적으로는 아래와 같은 기준으로 각각의 방법을 선택할 수 있습니다.

**✅ JSX 요소의 속성에 사용되는 경우**

JSX 요소의 속성에 사용되는 값은 props로 전달합니다.

예를 들면 id, className와 같은 속성이 있습니다.

```jsx
function Button({ id, className }: { id: string; className: string }) {
  return (
    <button id={id} className={className}>
      버튼
    </button>
  );
}

export default function App() {
  return (
    <>
      <Button id="btn" className="btn btn-primary" />
    </>
  );
}
```

**✅ JSX 요소의 콘텐츠에 사용되는 경우**

JSX 요소에서 콘텐츠에 사용되는 경우는 children으로 전달합니다.

```jsx
function Button({ children }: { children: React.ReactNode }) {
  return <button>{children}</button>;
}

export default function App() {
  return (
    <>
      <Button>
        <span>✅</span> 성공
      </Button>
    </>
  );
}
```

### 미션🔥

```jsx
//App.tsx
import UserProfile from "./components/UserProfile";

export default function App () {
  const userObj = {
    name: "jiwon",
    age: 22,
    isAdmin: true,
  }
    const userObj2 = {
    name: "elena",
    age: 22,
    isAdmin: false,
  }

  return (
  <>
  <UserProfile {...userObj}/>
  <UserProfile {...userObj2}/>
  </>
  );
}

//UserProfile.tsx
export default function UserProfile (props: { name: string; age: number; isAdmin: boolean; }) {
    return (
    <>
      <p>이름: {props.name}</p>
      <p>나이: {props.age}</p>
      <p>{props.isAdmin ? "관리자 계정": "일반 사용자"}</p>
    </>
  );
}
```

<br>
<br>
# 5. 컴포넌트와 이벤트

### 이벤트 연결하기

이벤트: 사용자와 상호작용으로 발생하는 일련의 사건

Ex. 마우스 드래그, 키보드 입력 등

React 이벤트 기본 문법

```jsx
<JSXElement 이벤트속성="이벤트핸들러">
```

`이벤트 속성`: React 컴포넌트에서 사용자 동작에 반응하기 위해 요소에 추가하는 속성 

`이벤트 핸들러`: 사용자 동작이 발생했을 때 실행되는 함수

html 이벤트 속성은 소문자로 작성되지만 JSX에서는 camelCase로 작성해야 함 ex.onClick

JSX에서는 모든 이벤트 속성 camelCase로 작성함

이벤트 연결하기

```jsx
export default function Button () {
    const handleClick = () => alert("클릭 이벤트 발생");
  return (
    <>
      <button onClick={handleClick}>클릭</button>
    </>
  );
}
```

### 이벤트 속성 파악하기

리액트 공식 웹사이트에서 API 참고서 확인

[공통 컴포넌트 (예: div) – React](https://ko.react.dev/reference/react-dom/components/common)

### 이벤트 핸들러에게 매개변수 전달하기

```jsx
export default function Button () {
    const handleClick = (value: string) => alert(value);
  return (
    <>
      <button onClick={handleClick("Hello")}>클릭</button>
    </>
  );
}
```

이렇게 작성하게 되면 handleClick은 onClick이벤트의 핸들러로서 동작하는게 아니라 호출하는 용도로 사용됨

>JSX 요소가 렌더링 되면 즉시 핸들 클릭이라는 함수가 호출 되어버림

```jsx
export default function Button () {
    const handleClick = (value: string) => alert(value);
  return (
    <>
      <button onClick={() => handleClick("Hello")}>클릭</button>
    </>
  );
}
```

이렇게 해야 이벤트 핸들러로서 동작함

### 이벤트 핸들러 방법 추천

이벤트 핸들러를 작성하는 방법은 여러가지가 있음

셋 다 가능!

```jsx
export default function Button () {
    const handleClick = () => alert("click"); //이처럼 별도의 이벤트 핸들러 이용이 좋음
  return (
    <>
      <button onClick={() => alert("Hello")}>클릭</button> //비추
      <button onClick={handleClick}>클릭2</button> //방법1
      <button onClick={() => handleClick()}>클릭3</button> //방법2
    </>
  );
}
```

매개 변수가 없으면 첫번째, 있으면 2번째 방법으로 하기!

### 이벤트 핸들러에서 props 읽기

이벤트 핸들러는 컴포넌트 내부에서 선언되기 때문에 해당 컴포넌트의 props에 접근할 수 있음

Children과 Props로 전달되는 데이터의 기준

내가 컴포넌트로 전달하는 데이터를 그 특정 요소의 콘텐츠로 활용할 거라면 Children

콘텐츠가 아니라 속성이나 다른 부분에서 이용할 거면 Props를 선택

```jsx
//App.tsx
import Button from "./components/Button";

export default function App () {
  return (
  <>
<Button message="Playing">Play Movie</Button>
<Button message="Uploading">Upload Image</Button>
  </>
  );
}

//Button.tsx
export default function Button (props: {
    message: string;
    children: React.ReactNode;
}) {
    const handleClick = () => alert(props.message);
  return (
    <>
      <button onClick={handleClick}>{props.children}</button>
    </>
  );
}
```

비구조화 할당한 버전

```jsx
export default function Button ({message, children}: {
    message: string;
    children: React.ReactNode;
}) {
    const handleClick = () => alert(message);
  return (
    <>
      <button onClick={handleClick}>{children}</button>
    </>
  );
}
```

### 이벤트 핸들러를 props로 전달하기

컴포넌트의 props로 함수도 전달할 수 있음

부모 컴포넌트에서 props로 이벤트 핸들러로 활용할 함수를 정의해서 전달해줘도 됨

```jsx
//App.tsx
import Button from "./components/Button";

export default function App () {
  return (
  <>
<Button handleClick={(message:string) => alert(message)} message="Playing">Play Movie</Button>
<Button handleClick={(message:string) => alert(message)} message="Uploading">Upload Image</Button>
  </>
  );
}

//Button.tsx
export default function Button ({handleClick, message, children}: {
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

### 이벤트 객체 배우기-1

이벤트 객체

- 이벤트가 발생했을때 브라우저가 자동으로 생성하여 이벤트 핸들러 함수에 전달하는 객체
- 이벤트와 관련된 다양한 정보를 포함하고 있는 객체
- 예를 들어, 이벤트가 발생한 장소, 마우스 좌표, 키보드 입력값 등 다양한 정보

리액트에서의 이벤트 객체는 합성 이벤트 객체를 지원함

합성 이벤트 객체

- React.JS가 원본 DOM 이벤트 객체를 감싸 최적화한 React.JS 전용 이벤트 객체
- 원본 DOM 이벤트 객체를 감싸(래핑) 최적화한 리액트 전용 이벤트 객체

이벤트 핸들러에 그 어떠한 매개변수를 전달하고 있지 않아도 React는 암묵적으로 이벤트 핸들러에 이벤트 객체라는 것을 전달함

```jsx
export default function Button () {
    const handleClick = (message: string) => {
        console.log(message);
        console.log(event); //출력 안됨
    };
  return (
    <>
    //이렇게 화살표 함수로 감싸면 이 화살표 함수 자체로 이벤트 객체가 전달되고 있는것
      <button onClick={() => handleClick('click!')}>클릭</button>
    </>
  );
}
```

이렇게  하면 객체로서의 event가 출력됨!

```jsx
export default function Button () {
    const handleClick = (message: string, event) => {
        console.log(message);
        console.log(event);
    };
  return (
    <>
      <button onClick={(event) => handleClick('click!', event)}>클릭</button>
    </>
  );
}
```

React 이벤트 객체를 두번째처럼 명시적으로 넘겨서 확인하는 것과 그냥 함수 내부에 있는 이벤트 객체를 암묵적으로 활용하는 건 이렇게 서로 다른  객체

>명시적으로 이벤트 객체를 잘 넘겨줘야한다

event객체의 타입이 궁금하다면?

event에 마우스 올리면 어떤 타입일지 유추해줌

그거 복붙해서 타입 부분에 넣어주면 된다

### 이벤트 객체 배우기-2

이벤트 객체는  이벤트 핸들러에 암묵적으로 전달되지만 매개변수를 전달할 경우에는 명시적으로 전달해야 한다

부모 컴포넌트에서 이벤트 핸들러를 전달했을 경우에는 어떻게?

```jsx
//App.tsx
import Button from "./components/Button";

export default function App () {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(event);
    };
  return (
  <>
<Button handleClick={handleClick}/>
  </>
  );
}

//Button.tsx

```

```jsx
//App.tsx
import Button from "./components/Button";

export default function App () {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(event);
    };
  return (
  <>
<Button handleClick={handleClick}/>
  </>
  );
}

//Button.tsx
export default function Button ({
     handleClick,
     }:{
     handleClick:(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
     }) {

  return (
    <>
      <button onClick={handleClick}>클릭</button>
    </>
  );
}
```

여기서는 부모가 handleClick을 넘겨줬고 전달한 props에 대한 타입 때문에 어쩔 수 없이 Button.tsx쪽에서도 타입 명시를 해준거지만 실제로 얘를 사용할 때는 암묵적으로 이벤트 객체가 전달되기 됨

>부모 컴포넌트에서 props를 전달하는 경우여도 사용할 때는 암묵적으로 이벤트 객체가 전달된다!

```jsx
//App.tsx
import Button from "./components/Button";

export default function App () {
    const handleClick = (
      message: string,
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(message);
        console.log(event);
    };
  return (
  <>
<Button handleClick={handleClick}/>
  </>
  );
}

//Button.tsx
export default function Button ({
    handleClick,
}:{
    handleClick:(message: string,event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void}) {

  return (
    <>
      <button onClick={(event) => handleClick("Hello", event)}>클릭</button>
    </>
  );
}
```

그래서 이렇게 매개 변수가 있어도 이벤트 객체를 명시적으로 전달해줘야 한다

명시적으로 전달?

전달 받은걸 사용할때 직접 이벤트 객체를 함수 인자로 넣어줘야 한다!

호출할 때 event를 직접 인자로 넣어줘야  한다!

```jsx
<button onClick={(event) => handleClick("Hello", event)}>클릭</button>
```

이벤트 객체를 명시적으로 넣지 않으면

```jsx
// Button.tsx
export default function Button({ handleClick }: {
  handleClick: (message: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
  return (
    <button onClick={() => handleClick("Hello")}>클릭</button>
  );
}
```

이런 코드가 있을때 (event빠짐)

handleClick(”Hello”) 만 호출한 상태, 

근데 handleClick의 타입 정의는 `(message: string, event: React.MouseEvent) => void`

그래서 이벤트 객체가 없다! > 타입스크립트 에러

```jsx
Expected 2 arguments, but got 1.
```

이벤트 객체 전달 방식

| 상황 | 코드 | 이벤트 객체 전달 방식 |
| --- | --- | --- |
| 암묵적 전달 | `tsx <button onClick={handleClick}>클릭</button>` | React가 `handleClick(event)`를 **자동 호출**하면서 이벤트 객체를 **자동으로 넣어줌** |
| 명시적  전달(추가 매개변수 있) | `tsx <button onClick={(event) => handleClick("Hello", event)}>클릭</button>` | 우리가 직접 `event`를 인자로 넣어줘야 함!! 아니면 오류! |
| 명시적 전달(추가 매개변수 없) | `tsx <button onClick={(event) => handleClick(event)}>클릭</button>` | 추가 인자는 없지만, 우리가 `event`를 직접 받아서 넘기는 방식. React가 자동으로 넣어주는 걸 우리가 한 번 받아서 넘겨주는 것 |

명시적으로 매개변수 이름을 지어줘야 코드 가독성 높아짐!!

### 이벤트 객체 배우기-3

React에서 이벤트 객체는 원본 DOM 이벤트를 랩핑하여 React에서 최적화한 Synthetic Event 객체를 제공함

Synthetic Event 객체를 제공함으로써 브라우저마다 다른 네이티브 동작을 일관되게 다룰 수 있도록 지원함!

이벤트 객체는 원본 DOM 이벤트를 랩핑한거니까 원본 DOM을 참조할 수 있는 Native Event라는 속성을 항상 제공함. 결국 버튼을 클릭했을 때 발생하는 클릭 이벤트는 원본 DOM 이벤트로 따지면 포인터 이벤트인데 실제로는 Synthetic 이벤트 객체로 제공하니까 콘솔에서 보면 출력이 되고 있음..!!

이벤트 객체를 다루면서 필요한 주요 속성들은 이미 Synthetic 이벤트 객체의 주요 속성들로 구현이 되어 있음.

### 버블링

이벤트 전파: DOM에서 이벤트가 발생했을때 이벤트가 전달되는 과정

이벤트 전파의 3단계

1. 캡쳐링: 부모로부터 이벤트가 발생한 타겟 요소까지 순차적으로 전달되는 단계
2. 타겟: 타겟요소에 도달한 이벤트는 타겟 단계에 들어가게 됨
3. 버블링: 다시 부모 요소로 순차적으로 이벤트 전달

React.js나 자바스크립트 모두 기본 이벤트 전파 방식은 버블링

기본 이벤트 전파방식을 바꾸고 싶으면 별도 처리 필요

```jsx
export default function Table () {
  return (
    <>
      <table border={1} onClick={()=> console.log("table")}>
        <tbody onClick={()=> console.log("tb")}>
        <tr onClick={()=> console.log("tr")}>
            <td onClick={()=> console.log("td")}>Mike</td>
        </tr>
        </tbody>
      </table>
    </>
  );
}
```

이런식으로 코드 작성하고 테이블 클릭해보면 td, tr, tb, table 순서로 출력됨

index.html의 body에도 onClick 넣으면 거기까지도 이벤트 전파됨

그래서 설계구조 상 같은 이벤트를 중첩해서 구성을 하게 되면 이렇게 예기치 않은 부모 요소의 이벤트까지 호출될 가능성이 있어서 이런 이벤트 버블링을 막는 방법을 써야함

>이벤트 객체에 내장되어 있는 stopPropagation이라는 메서드 사용하기

```jsx
//이러면 이벤트 버블링 차단됨!! td만 출력!
export default function Table () {
  return (
    <>
      <table border={1} onClick={()=> console.log("table")}>
        <tbody onClick={()=> console.log("tb")}>
        <tr onClick={()=> console.log("tr")}>
            <td 
            onClick={(event)=> {event.stopPropagation();
            console.log("td");}}>
                Mike</td>
        </tr>
        </tbody>
      </table>
    </>
  );
}
```

모든 상황에서 꼭  stopPropagation이 필요한건 아니고 같은 이벤트가 중첩될 때만!

### 캡쳐링

캡쳐링은 버블링과는 다르게 기본적으로 적용되지 않음

그래서 캡쳐링을 사용하려면 코드 처리를 해주어야함

react에서는 캡쳐링을 구현하기 위해 기존의 이벤트 속성 뒤에 캡쳐라는 프리픽스를 붙여줌

```jsx
export default function Table () {
  return (
    <>
      <table border={1} onClickCapture={()=> console.log("table")}>
        <tbody onClickCapture={()=> console.log("tb")}>
        <tr onClickCapture={()=> console.log("tr")}>
            <td 
            onClickCapture={(event)=> {
            console.log("td");}}>
                Mike</td>
        </tr>
        </tbody>
      </table>
    </>
  );
}
```

이렇게 하면 캡처링으로 이벤트 전파가 진행되고 table, tb, tr, td 순으로 출력됨

### 이벤트 기본 동작 익히기

모든 html 태그는 기본적인 동작을 가지고 있음. 이는 JSX도 마찬가지
JSX로 작성된 요소가 결국에는 HTML로 변환되기 때문

EX) a태그는 클릭하면 href에 있는 링크 페이지로 이동하는 기본 동작이 있음, a태그는 기본적으로 클릭 이벤트를 처리하기 때문

기본동작을 막는 방법 > 이벤트 객체의 preventDefault 메서드 사용하기

```jsx
//이러면 a태그 눌러도 이동 안함
export default function App () {
  return (
    <>
      <a
       href="https://www.youtube.com/"
       onClick={(event) => event.preventDefault()}>
       유튜브
       </a>
    </>
  );
}
```

이벤트가 발생했을 때 우리가 명시적으로 설정한 핸들러가 실행되면서 브라우저의 기본 동작보다 우선순위를 가지기 때문

### 미션🔥

```jsx
//App.tsx
import React from "react";
import Button from "./Components/Button";

export default function App () {
  return (
    <>
<Button handleClick={(message:string) => alert(message)} message="sleepy">sleep</Button>
    </>
  );
}

//Button.tsx
export default function Button ({handleClick, message, children
}: {
  message: string;
  children: React.ReactNode;
  handleClick: (message: string) => void;
}) {
  return (
    <>
      <button onClick={() => handleClick(message)}>{children}</button>
    </>
  );
}
```
