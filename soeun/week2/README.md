# 2주차 리액트

## 섹션 4: 컴포넌트와 Props

### 1. 컴포넌트 간의 관계

- 조상, 부모, 자식, 자손, 형제 컴포넌트
- 부모의 부모 컴포넌트는 조상 컴포넌트
- 부모가 다르면 형제 컴포넌트가 될 수 없음

### 2. 데이터 출력

**기본 데이터 출력**

- jsx는 html과 다르게 자바스크립트의 데이터를 직접 사용하여 브라우저에 렌더링(출력)할 수 있음
  - 변수에 저장된 데이터가 실제 화면에 출력되는 것을 말함
- jsx에서는 중괄호 안에 변수나 표현식을 넣어주면 할당된 값이 바로 출력됨
  ```tsx
  export default function App() {
    // 기본 자료형
    const primitiveString = "Hello, World!";
    const primitiveNumber = 42;
    const primitiveBoolean = false;
    const primitiveUndefined = undefined;
    const primitiveNull = null;
    const primitiveSymbol = Symbol("mySymbol");
    const primitiveBigInt = 9007199254740991n;

    return (
      <>
        <h2>기본 자료형 출력</h2>
        <p>문자열: {primitiveString}</p>
        <p>숫자: {primitiveNumber}</p>
        <p>논리형: {primitiveBoolean.toString()}</p>
        <p>undefined: {String(primitiveUndefined)}</p>
        <p>null: {String(primitiveNull)} </p>
        <p>symbol: {String(primitiveSymbol)}</p>
        <p>BigInt: {primitiveBigInt}</p>
      </>
    );
  }
  ```
  - 리액트는 논리형 값을 렌더링 가능한 값으로 취급하지 않음
    - 논리형 값을 화면에 보이게 하려면 문자열로 변경해서 출력해야 함
  - undefined, null, symbol도 문자열로 변경해서 출력해야 함
    - 별도의 wrapper 객체가 없기 때문에 자바스크립트 내장함수인 `String()`을 이용해야 함
  - ES11에서 새롭게 추가된 BigInt라는 기본 자료에 해당하는 숫자는 중괄호 안에 넣으면 됨

**참조 데이터 출력**

- 배열, 객체, 함수, 정규식, 맵, set
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
  - 배열: 중괄호 안에 넣으면 배열 전체가 출력됨
    - 리액트는 배열 내의 값을 각각 평가해서 그 값을 직접 html로 변환하여 렌더링
    - 각각의 값을 그대로 렌더링하여 출력하기 때문에 쉼표 등은 출력되지 않음
  - 객체: JSON 객체의 `stringify` 메서드를 사용해 string 문자열로 변경한 다음에 출력
    - JSON 문자열로 출력
    - 그냥 중괄호에 넣을 시 에러 발생
    - 표현식으로 출력할 수 없음
  - 함수: wrqpper 객체가 존재하기 때문에 toString 메서드를 사용하여 문자열로 변경
  - date 객체: 마찬가지로 객체이므로 그냥 출력할 수 없음
  - 정규식: 문자열로 변경해야 함
  - Map:
    1. Array 내장 객체에 from 메서드를 사용해 map 데이터를 변환
    2. JSON 객체의 stringify 메서드로 바이너리로 변환한 데이터를 문자열로 변환
    - 중괄호 안에 넣는 경우 배열로 취급되어 일자로 출력되지만 에러를 발생시킴
  - Set: Map 과 동일

### 3. 태그의 속성 값에 바인딩

- 리액트에서는 JSX 문법을 사용하여 HTML과 유사한 방식으로 태그를 작성하지만 데이터 바인딩을 위해 중괄호를 사용하여 자바스크립트 값을 속성에 전달할 수 있음

**동적으로 속성 값 설정하기**

1. 이미지

```tsx
export default function App() {
  const imageUrl = "https://example.com/image.jpg";
  return (
    <div>
      <img src={imageUrl} alt="Example" />
    </div>
  );
}
```

1. 링크

```tsx
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

### 4. 컴포넌트에 데이터 전달

- 리액트에서는 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달할 수 있음
- 부모에서 자식으로만 가능
- 컴포넌트의 props로 전달된 값들은 자식 컴포넌트에서 매개변수로 받아서 활용할 수 있음
  - 매개변수의 이름은 자바스크립트 함수 규칙에 따라 마음대로 지어줄 수 있지만 관례상 props라는 이름 사용
- props는 모두 객체 형태로 전달됨
- TypeScript에서는 타입에러를 방지하기 위해 매개변수의 타입을 올바르게 지정해야 함

**예시 코드: 자식 컴포넌트에 데이터 전달**

```tsx
import User from "./components/User";

export default function App() {
  return (
    <>
      //User로 데이터 전달 //""로 지정하면 문자열이 됨 //{20}은 숫자로 전달됨
      <User name="Jack" age={20} />
      <User name="Hey" age={30} /> //재사용
    </>
  );
}
```

```tsx
export default function User(props: { name: string; age: number }) {
  //타입지정
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

- name과 age라는 속성의 값을 User 컴포넌트로 전달하는 코드
- 속성을 properties라고 하기 때문에 리액트에서 컴포넌트로 데이터를 전달하는 것을 자식 컴포넌트에 props를 전달한다고 함

**예시 코드: 다양한 자료형에 데이터 전달하기**

```tsx
import PrintValue from "./components/PrintValue";

export default function App() {
  const numberValue = 42;
  const stringValue = "Hello World";
  const booleanValue = true;
  const arrayValue = [1, 2, 3, 4];
  const objectValue = { name: "John Doe", age: 30 };
  const handleClick = () => alert("버튼이 클릭되었습니다!");

  return (
    <>
      <PrintValue
        numberValue={numberValue}
        stringValue={stringValue}
        booleanValue={booleanValue}
        arrayValue={arrayValue}
        objectValue={objectValue}
        handleClick={handleClick}
      />
      /**속성 식별자 = {변수명} 형태*/
    </>
  );
}
```

```tsx
export default function PrintValue(prop: {
  numberValue: number;
  stringValue: string;
  booleanValue: true | false;
  arrayValue: number[];
  objectValue: { name: string; age: number }; //객체
  handleClick: () => void;
}) {
  console.log(props);
  return (
    <>
      <p> number: {props.numberValue} </p>
      <p> string: {props.stringValue} </p>
      <p> boolean: {props.booleanValue.toString()} </p> //문자열로
      <p> array: {props.arrayValue} </p>
      <p> object: {JSON.stringify(props.objectValue)} </p> //객체라 중괄호로 X
      <p> function: {props.handleClick.toString()} </p>
    </>
  );
}
```

- 가독성을 위해 변수 이름과 속성 식별자를 같게 설정

**비구조화 할당**

- props를 사용하지 않고 바로 비구조화
  ```tsx
  export default function PrintValue({
    //비구조화 분리
    numberValue,
    stringValue,
    booleanValue,
    arrayValue,
    objectValue,
    handleClick,
  }: {
    //분리한 것에 대한 타입 지정
    numberValue: number;
    stringValue: string;
    booleanValue: true | false;
    arrayValue: number[];
    objectValue: { name: string; age: number }; //객체
    handleClick: () => void;
  }) {
    console.log();
    return (
      <>
        <p> number: {numberValue} </p>
        <p> string: {stringValue} </p>
        <p> boolean: {booleanValue.toString()} </p> //문자열로
        <p> array: {arrayValue} </p>
        <p> object: {JSON.stringify(objectValue)} </p> //객체라 중괄호로 X
        <p> function: {handleClick.toString()} </p>
      </>
    );
  }
  ```
- 함수 내부에서 비구조화 할당
  ```tsx
  export default function PrintValue(props: {
    numberValue: number;
    stringValue: string;
    booleanValue: true | false;
    arrayValue: number[];
    objectValue: { name: string; age: number }; //객체
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
        <p> number: {numberValue} </p>
        <p> string: {stringValue} </p>
        <p> boolean: {booleanValue.toString()} </p> //문자열로
        <p> array: {arrayValue} </p>
        <p> object: {JSON.stringify(objectValue)} </p> //객체라 중괄호로 X
        <p> function: {handleClick.toString()} </p>
      </>
    );
  }
  ```
- 스프레드 연산자 사용
  ```tsx
  export default function User({
    userObj,
  }: {
    userObj: { name: string; age: number; gender: string };
  }) {
    return (
      <>
        <p>name:{userObj.name}</p>
        <p>age:{userObj.age}</p>
        <p>gender:{userObj.gender}</p>
      </>
    );
  }
  ```
  ```tsx
  export default function User({
    userObj: { name, age, gender },
  }: {
    userObj: { name: string; age: number; gender: string };
  }) {
    return (
      <>
        <p>name:{name}</p>
        <p>age:{age}</p>
        <p>gender:{gender}</p>
      </>
    );
  }
  ```
  - 비구조화 할당 중첩 시 코드가 간결하지 않아 전개 연산자를 통해 전달하는 방법
  ```tsx
  import User from "./components/User";
  import User2 from "./components/User2";

  export default function App() {
    const userObj = {
      name: "jack",
      age: 20,
      gender: "male",
    };

    return (
      <>
        <User userObj={userObj} />
        <User2 {...userObj} />
        //전개연산자 //아래와 위가 같게 전달됨
        <User2 name={"jack"} age={20} gender={"male"} />
      </>
    );
  }
  ```
  ```tsx
  export default function User2({
    name,
    age,
    gender,
  }: {
    name: string;
    age: number;
    gender: string;
  }) {
    return (
      <>
        <p>name:{name}</p>
        <p>age:{age}</p>
        <p>gender:{gender}</p>
      </>
    );
  }
  ```

### 5. 타입 지정

**타입 알아내기**

- props의 타입을 쉽게 유추하여 적용할 수 있는 방법
- 먼저 자식 컴포넌트에서 props를 받기 위한 매개변수를 모두 제거
- 부모 컴포넌트에서 오류메시지를 확인하면 타입이 나와있음
  ![image.png](attachment:c1dff6f2-cc72-4fba-bf3b-a9096e4f7b34:image.png)
- 이를 복사해서 사용

**타입 정의**

- props 객체의 타입은 반드시 지정해야 함
- 컴포넌트에 전달되는 props가 많을 때 모두 개별적으로 명시하면 코드의 가독성이 떨어짐
- 인터페이스나 타입 별칭으로 타입 정의를 분리하면 코드를 더 깔끔하게 유지할 수 있음
  ```tsx
  interface PrintValueProps {
    numberValue: number;
    stringValue: string;
    booleanValue: boolean;
    arrayValue: number[];
    objectValue: { name: string; age: number };
    handleClick: () => void;
  }

  export default function PrintValue(props: PrintValueProps) {
    console.log(props);
    return (
      <>
        <p> number: {props.numberValue} </p>
        <p> string: {props.stringValue} </p>
        <p> boolean: {props.booleanValue.toString()} </p> //문자열로
        <p> array: {props.arrayValue} </p>
        <p> object: {JSON.stringify(props.objectValue)} </p> //객체라 중괄호로 X
        <p> function: {props.handleClick.toString()} </p>
      </>
    );
  }
  ```
  ```tsx
  type PrintValueProps {
    numberValue: number;
    stringValue: string;
    booleanValue: boolean;
    arrayValue: number[];
    objectValue: { name: string; age: number };
    handleClick: () => void;
  }

  export default function PrintValue(props: PrintValueProps) {
    console.log(props);
    return (
      <>
        <p> number: {props.numberValue} </p>
        <p> string: {props.stringValue} </p>
        <p> boolean: {props.booleanValue.toString()} </p> //문자열로
        <p> array: {props.arrayValue} </p>
        <p> object: {JSON.stringify(props.objectValue)} </p> //객체라 중괄호로 X
        <p> function: {props.handleClick.toString()} </p>
      </>
    );
  }

  ```
- Vite로 생성한 리액트 애플리케이션은 기본 TypeScript 설정에서 `“include”: [”src”]` 를 기본적으로 포함하기 때문에 별도에 d.ts 확장자를 가지고 있는 파일에 타입 정의를 분리할 수도 있음
  - types 폴더 내에 props.d.ts라고 지정하면 자동으로 인식함
  - 이 방식 추천
  ```tsx
  type PrintValueProps {
    numberValue: number;
    stringValue: string;
    booleanValue: boolean;
    arrayValue: number[];
    objectValue: { name: string; age: number };
    handleClick: () => void;
  }
  ```

### 6. children

- 리액트에서는 props 말고도 children을 사용해서 컴포넌트에 데이터를 전달할 수 있음
- 이해를 위한 html 문법
  - html에는 컨텐츠가 있는 문법 형식과 컨텐츠가 없는 문법 형식이 있음
  - 콘텐츠가 있는 문법 예시
    - `<p></p>`
    - 시작 태그와 종료 태그 사이를 콘텐츠라고 함
    - 콘텐츠가 있는 경우 시작 태그와 종료 태그가 함께 사용되어야 함
  - 콘텐츠가 없는 문법 예시
    - `<br />`
    - 시작과 종료 태그를 사용하지 않아도 되며 셀프클로징 `/>` 하면 됨
- 컴포넌트 렌더링 시 콘텐츠가 없는 문법 형식 `<Button text="Login" />` 을 사용해 왔지만 콘텐츠가 있는 문법 형식으로도 작성할 수 있음
- `<Button>Login</Button>`
- 콘텐츠가 있는 형식에서의 콘텐츠는 컴포넌트의 자식 컴포넌트로 전달된다는 차이점이 있음
- 전달 시에는 children이라는 예약된 props 속성으로만 받을 수 있음

```tsx
import Button from "./components/ui/Button";

export default function App() {
  return (
    <>
      <Button>
        <em>Login</em>
      </Button>
    </>
  );
}
```

```tsx
export default function Button(props) {
  return (
    <>
      <button>{props.children}</button>
    </>
  );
}
```

```tsx
export default function Button({ children }) {
  return (
    <>
      <button>{children}</button>
    </>
  );
}
```

- children에서 콘텐츠는 단순 문자열 외 태그를 사용하는 형태로도 작성 가능
- 컨텐츠 전체가 children이라는 특별한 props 속성으로 그대로 전달됨
- children에 해당하는 타입을 반드시 지정해야 함
  - 일반적으로 TypeScript에서 제공하는 타입이 아닌 React에서 제공하는 React 타입으로 지정해야 함
  ```tsx
  export default function Button({
    children,
  }: {
    children: React.ReactElement;
  }) {
    return (
      <>
        <button>{children}</button>
      </>
    );
  }
  ```
  - JSX 요소만 허용하는 타입 → children(컨텐츠)가 반드시 JSX 요소여야 함
  - 문자열, 숫자, null, undefined 등은 허용되지 않음
  ```tsx
  export default function Button({ children }: { children: React.ReactNode }) {
    return (
      <>
        <button>{children}</button>
      </>
    );
  }
  ```
  - 더 범용적인 타입으로 문자열, 숫자, null, undefined와 JSX요소 모두 허용

**Props vs Children 언제 어떤 것 사용?**

props: JSX 요소의 속성에 사용되는 경우

```tsx
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

children: JSX 요소의 콘텐츠에 사용되는 경우

```tsx
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

- **미션**
  UserProfile 컴포넌트 만들기
  ```tsx
  interface UserProfileProps {
    name: string;
    age: number;
    isAdmin: boolean;
  }

  function UserProfile({ name, age, isAdmin }: UserProfileProps) {
    return (
      <div
        style={{ border: "1px solid black", padding: "10px", margin: "10px" }}
      >
        <p>이름: {name}</p>
        <p>나이: {age}</p>
        <p>{isAdmin ? "관리자 계정" : "일반 사용자"}</p>
      </div>
    );
  }

  export default function App() {
    return (
      <div>
        <h1>사용자 목록</h1>
        <UserProfile name="Alice" age={30} isAdmin={true} />
        <UserProfile name="Bob" age={25} isAdmin={false} />
      </div>
    );
  }
  ```

## 섹션 5: 컴포넌트와 이벤트

### 1. 이벤트

- 프로그래밍에서 사용자와의 상호작용으로 인해 발생하는 일련의 사건을 의미
- 예: 마우스 이벤트, 키보드 이벤트
- 기본 문법: `<JSXElement 이벤트속성=”이벤트핸들러”>`
  - 이벤트 속성: React 컴포넌트에서 사용자 동작에 반응하기 위해 요소에 추가하는 속성
  - 이벤트 핸들러: 사용자 동작이 발생했을 때 실행되는 함수
- JSX에서는 이벤트 속성을 camelCase로 작성해야 함
  - html 태그도 이벤트 속성을 지원하지만 소문자로 작성
  - 또 일부 JSX 이벤트 속성은 html 이벤트 속성과 이름이 달라 주의해야 함
  ```tsx
  export default function Button() {
    const handleClick = () => alert("클릭 이벤트 발생"); //이벤트 핸들러
    return (
      <>
        **<button onClick={handleClick}>click</button>**
      </>
    );
  }
  ```
- 리액트 공식 사이트 우상단 `API 참고서 → 컴포넌트 → common` 에서 이벤트 레퍼런스들이 정리되어 있음 ([링크](https://ko.react.dev/reference/react-dom/components/common))

### 2. 매개변수 전달

- 이벤트 핸들러도 자바스크립트 함수이기 때문에 매개변수를 전달할 수 있음

```tsx
export default function Button() {
  const handleClick = (value: string) => alert("클릭 이벤트 발생"); //value는 식별자
  return (
    <>
      <button onClick={() => handleClick("Hello")}>click</button>
      {/*함수에 감싸진 형태로 작성해야 함*/}

      <button onClick={handleClick("hello")}>click</button>
      {/* handleClick 함수에 값을 전달하는 잘못된 예시
      이렇게 작성하게 되면 이벤트 속성의 핸들러로써 동작하지 않고
      호출하는 용도로 사용됨 -> 즉시 핸들클릭이라는 함수가 호출*/}
    </>
  );
}
```

- 별도의 이벤트 핸들러를 담당하는 함수를 정의하여 이벤트 핸들러 함수를 이용하여 다음과 같이 이벤트를 연결하는 방법도 있음
  ```tsx
  export default function Button() {
    const handleClick = (value: string) => alert("클릭 이벤트 발생"); //value는 식별자
    return (
      <>
        <button onClick={handleClick}>click</button>
      </>
    );
  }
  ```
- 동일하게 이벤트 핸들러 함수를 활용하지만 화살표 함수로 감싸서 호출하는 방법도 있음
  ```tsx
  export default function Button() {
    const handleClick = (value: string) => alert("클릭 이벤트 발생"); //value는 식별자
    return (
      <>
        <button onClick={() => handleClick()}>click</button>
      </>
    );
  }
  ```
- 3가지 방법 모두 가능하지만 별도의 이벤트 핸들러 함수를 정의하는 것을 가장 추천함
  ```tsx
  export default function Button() {
    const handleClick = () => alert("click!");
    return (
      <>
        {/* <button onClick={() => alert("click")}>클릭</button> */}
        <button onClick={handleClick}>클릭2</button>
        <button onClick={() => handleClick()}>클릭3</button>
      </>
    );
  }
  ```
- 또 매개변수가 있는 경우 화살표 함수로 감싸면 됨

### 3. props

**이벤트 핸들러에서 props 읽기**

- 이벤트 핸들러는 컴포넌트 내부에서 선언되기 때문에 해당 컴포넌트의 props에 접근할 수 있음
  ```tsx
  import Button from "./components/ui/Button";

  export default function App() {
    return (
      <>
        <Button message="Playing!"> Play Movie</Button>
        <Button message="Uploading!"> Upload Image</Button>
      </>
    );
  }
  ```
  ```tsx
  export default function Button(props: {
    message: string;
    children: React.ReactNode;
  }) {
    const handleClick = () => alert("props.message");
    return (
      <>
        <button onClick={handleClick}>{props.children}</button>
      </>
    );
  }
  ```
  ```tsx
  export default function Button( { message, children}:{
    message,
    children,
  }:{
    message:string;
    children: React.ReactNode;
  }
  ) {
    const handleClick = () => alert(message);
    return (
      <>
        <button onClick={handleClick}>{children}</button>
      </>
    );
  }
  ```
  - 내가 컴포넌트로 전달하는 데이터를 그 특정 요소의 콘텐츠로 활용할 것이라면 children
  - 콘텐츠가 아닌 속성 등이면 props

**이벤트 핸들러를 props로 전달하기**

- 컴포넌트의 props로 함수도 전달할 수 있기 때문에 이벤트 핸들러를 props로 전달해서 활용할 수 있음
- 이벤트 핸들러로 활용할 함수를 직접 정의하지 않고 부모 컴포넌트에서 props로 정의해 전달해줘도 됨

```tsx
import Button from "./components/ui/Button";

export default function App() {
  return (
    <>
      <Button handleClick={() => alert{"Playing"}}> Play Movie</Button>
      <Button handleClick={() => alert{"Uploading"}}> Upload Image</Button>
    </>
  );
}
```

```tsx
export default function Button({
  handleClick,
  children,
}: {
  handleClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <button onClick={handleClick}>{children}</button>
    </>
  );
}
```

- 매개변수를 받도록 하고 싶은 경우
  ```tsx
  import Button from "./components/ui/Button";

  export default function App() {
    return (
      <>
        <Button handleClick={(message:string) => alert{message}}> Play Movie</Button>
      </>
    );
  }
  ```
  ```tsx
  export default function Button({
    handleClick,
    children,
  }: {
    handleClick: () => void;
    children: React.ReactNode;
  }) {
    return (
      <>
        <button onClick={() => handleClick("play!")}>{children}</button>
      </>
    );
  }
  ```
- ***

### 4. 이벤트 객체

- 이벤트가 발생했을 때 브라우저가 자동으로 생성하여 이벤트 핸들러 함수에 전달하는 객체
- 이벤트와 관련된 다양한 정보를 포함하고 있음
- 예: 이벤트가 발생한 요소, 마우스 좌표, 키보드 입력 값 등
- 리액트에서 이벤트 객체는 합성(synthetic) 이벤트 객체를 지원함
  - 리액트가 원본 DOM이벤트를 래핑해 최적화한 리액트 전용 이벤트 객체를 합성 이벤트라고 함
- 이벤트 핸들러에 매개변수를 전달하지 않아도 리액트에서는 암묵적으로 이벤츠 핸들러에 이벤트 객체라는 것을 전달함
- 명시적으로 매개변수를 전달하게 되면 매개변수로 암묵적인 이벤트 객체가 전달되지 않음
  - 화살표 함수를 감쌀 땐 화살표 함수 자체로 이벤트 객체가 전달되는 것임
  - 명시적으로 이벤트 객체를 받아서 매개변수와 함께 전달하고 전달한 것을 두번째 매개변수로 받도록 처리하면 다시 리액트에서 제공하는 합성이벤트 객체를 확인할 수 있음
- 명시적으로 전달하는 것과 암묵적으로 활용하는 것이 서로 다른 객체라는 것을 이해하는 것이 중요함

![image.png](attachment:cfc96683-f34e-4193-8740-418b37fc5026:image.png)

- 매개변수가 필요없는 경우

![image.png](attachment:daf9a683-e6ba-4931-88f2-337b2ae73ca0:image.png)

- 타입추론에 의해 쉽게 파악할 수 있음

⇒ 이벤트 객체는 이벤트 핸들러에 암묵적으로 전달되지만 매개변수를 전달하는 경우에는 명시적으로 전달해야함

- 부모 컴포넌트에서 이벤트 핸들러를 전달할 수도 있음
- SyntheticBaseEvent는 원본 DOM을 참조할 수 있는 `nativeEvent`라는 속성을 항상 제공

### 5. 이벤트 전파

- DOM에서 이벤트가 발생했을 때 이벤트가 전달되는 과정
- 캡처링, 타겟, 버블링의 3가지 단계로 구성됨
  - 특정 td 태그에서 이벤트가 발생하면 부모로부터 이벤트가 발생한 타겟 요소까지 순차적으로 전달되는 캡처링 단계로 들어감
  - 타겟요소에 도달한 이벤트는 타겟 단계에 들어가게 되고 이후 다시 부모 요소로 이벤트를 순차적으로 전달하는 버블링 단계로 들어감
  ![image.png](attachment:c3f268d0-b3aa-465e-bb57-772f99850594:image.png)

**버블링**

- 리액트에서 기본 이벤트 전파 방식은 버블링
  → 캡처링으로 사용하고 싶으면 별도의 코드 처리 필요
- html에서도 전파가 발생함
- 불필요한 부모 이벤트를 불러오는 걸 막기 위해서는 이벤트 객체에 내장되어 있는 `stopPropagation` 메서드 사용 → 이벤트 버블링이 즉시 차단됨

**캡쳐링**

- 버블링과는 다르게 기본적으로 적용되고 있지 않음
- 의도적으로 코드처리 해 사용해야 함
- 기존의 이벤트 속성 뒤에 `Capture`라는 프리픽스를 붙이면 됨

**이벤트 기본 동작 막기**

- 이벤트 객체의 `preventDefault` 메서드 호출
- 명시적으로 설정한 핸들러가 브라우저의 기본 동작보다 우선순위를 가지기 때문
