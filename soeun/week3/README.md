https://chip-indigo-17c.notion.site/3-28570bff82a0807b92dffb9e27fdc249?source=copy_link

# 섹션 6. 컴포넌트 상태

## 1. 상태가 필요한 이유

- 리액트는 상태 기반의 UI 프레임워크이므로 let이나 const로 선언된 변수가 변경될 때 감지하지 못함
- 특정 값이 변경될 때 화면을 자동으로 업데이트하려면 이를 일반적인 let이나 const 키워드를 사용하는 변수로 선언하지 않고 **상태**를 통해 관리해야 함
- **상태**: 시간이 지남에 따라 변할 수 있는 데이터
- 리액트에서는 useState hook과 useReducer hook으로 상태를 관리함
- **훅(hook)**:
  - 함수형 컴포넌트에서 상태 관리와 생명 주기 기능 및 부가적인 기능을 활용할 수 있도록 하는 것
  - v16.8 훅 도입 이전에는 함수형 컴포넌트에서는 상태를 가질 수 없었음(클래스형 컴포넌트에서만 가능)

## 2. useState

```tsx
const [state, setState] = useState<Type>(initialState);
```

- 초기값(`initialState`)
  - 생략할 수 있음. undefined값을 지정하는 것과 같게 됨
- `<Type>`
  - useState 훅으로 정의할 상태값의 타입을 제네릭으로 지정하는 부분이며 보통 타입 추론이 되기 때문에 생략하는 경우가 많음
  - 만약 초기값과 변경될 데이터의 타입이 다른 경우 반드시 **유니언 타입**으로 명시
    예: `<number | string>`
- `[state, setState]`

  - 상태변수(`state`)는 useState 훅으로 정의할 실제 데이터가 할당될 변수며 일반적으로 초기값이 할당됨
  - 비구조화 할당이기 때문에 state가 아닌 다른 이름으로 지정 가능(보통정의하려는 상태값과 관련있는 식별자로 지정)
  - 상태 업데이트 함수(`setState`)는 상태 변수 값을 변경할 때 사용하는 함수
  - useState 훅은 상태값을 변경할 때 변수의 값을 재할당하듯이 직접 변경하지 않고 반드시 `setState`에 해당하는 상태 업데이트 함수를 통해서 변경해야 함
  - 비구조화할당이므로 setState 외 다른 식별자 지정 가능(보통 상태값 식별자를 prefix로 `set…`와 같이 지정)

  ```tsx
  import { useState } from "react";

  export default function App() {
    const [state, setState] = useState<number>(0); //useState 정의
    const handleSetToTen = () => {
      //이벤트 핸들러
      setState(10);
    };
    return (
      <>
        <h1>state: {state}</h1>
        <button onClick={handleSetToTen}>Set to 10</button>
      </>
    );
  }
  ```

- 리액트가 useState로 선언된 데이터의 값의 변경 사항을 감지하면서 화면을 다시 렌더링함
- 이를 **리렌더링**이라고 하며 리렌더링을 통해 변경사항이 즉시 반영됨
- useState 훅의 사용 횟수는 제한이 없으며 컴포넌트 내에서 상태 데이터가 필요한 만큼 호출하면 됨
  - 식별자가 중복되지 않아야 함
- 미션

  ```tsx
  import { useState } from "react";

  export default function App() {
    const [name, setName] = useState("jack");
    const [age, setAge] = useState<number | string>(20);
    const [gender, setGender] = useState("male");
    const handleUpdate = () => {
      setName("soeun");
      setAge("21");
      setGender("female");
    };
    return (
      <>
        <h1>name: {name}</h1>
        <h1>age: {age}</h1>
        <h1>gender: {gender}</h1>
        <button onClick={handleUpdate}>Update Profile</button>
      </>
    );
  }
  ```

  ![image.png](attachment:b2f01e17-4d81-4225-8731-26fcf59213cf:image.png)
  ![image.png](attachment:9ce26077-2010-464b-be90-79d61fb70388:image.png)

## 3. 상태 업데이트

- 상태 업데이트 함수는 직접 업데이트 방식과 함수형 업데이트 방식으로 나뉨

### 직접 업데이트 방식

- 상태 업데이트 함수의 변경할 상태값을 직접 넣어주는 방식

```tsx
import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  const handleUpdate = () => {
    setCount(count + 1);
  };
  return (
    <>
      <h1>count: {count}</h1>
      <button onClick={handleUpdate}> up </button>
    </>
  );
}
```

- 배치 업데이트:
  - 리액트는 성능 최적화를 위해 한 번의 리렌더링에서 모든 변경사항을 모아서 처리
  - 상태 업데이트 함수를 여러개 호출한다고 여러 리렌더링이 발생하는 것이 아니라 리렌더링 한 번에 모든 상태 업데이트를 모아서 한 번에 처리함
  - 여러개 호출한다고 여러번 반영되지 않음
- 클로저:
  - 상태 업데이트 함수는 기본적으로 비동기임
  - 참조하는 값이 고정

### 함수형 업데이트 방식

- 상태 업데이트 함수의 인수로 함수를 작성하는 방식
- 인수로 작성된 함수의 매개변수에는 항상 최신의 상태값이 넘어오게 됨

```tsx
import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  const handleUpdate = () => {
    setCount((count) => count + 1);
    setCount((count) => count + 1);
    setCount((count) => count + 1);
  };
  return (
    <>
      <h1>count: {count}</h1>
      <button onClick={handleUpdate}> up </button>
    </>
  );
}
```

- 동일하게 배치 업데이트지만 더 이상 클로저에 구애받지 않게 됨
- 이전 값을 참조하길 원할 때 사용
- 미션

  ```tsx
  import { useState } from "react";

  export default function App() {
    const [count, setCount] = useState(0);

    const handleUp = () => {
      setCount((count) => count + 1);
    };
    const handleDown = () => {
      setCount((count) => count - 1);
    };
    const handleReset = () => {
      setCount((count) => 0);
    };
    return (
      <>
        <h1>count: {count}</h1>
        <button onClick={handleUp}> up </button>
        <button onClick={handleDown}> down </button>
        <button onClick={handleReset}> reset </button>
      </>
    );
  }
  ```

## 4. 객체 상태와 배열 상태

### **객체 상태**

- 객체도 상태로 정의할 수 있음

  ```tsx
  import { useState } from "react";

  export default function App() {
    const [userInfo, setUserInfo] = useState({
      name: "jack",
      age: 20,
      gender: "male",
    });

    const handleUpdate = () => {
      setUserInfo({
        ...userInfo, //스프레드 연산자
        name: "soeun",
        gender: "female",
      });
    };
    return (
      <>
        <h1>name: {userInfo.name}</h1>
        <h1>age: {userInfo.age}</h1>
        <h1>gender: {userInfo.gender}</h1>
        <button onClick={handleUpdate}>Update Profile</button>
      </>
    );
  }
  ```

  ```tsx
  import { useState } from "react";

  export default function App() {
    const [userInfo, setUserInfo] = useState({
      name: "jack",
      age: 20,
      gender: "male",
    });

    const handleUpdate = () => {
      setUserInfo((userInfo) => ({
        ...userInfo,
        age: 21,
        gender: "female",
      }));
    };
    return (
      <>
        <h1>name: {userInfo.name}</h1>
        <h1>age: {userInfo.age}</h1>
        <h1>gender: {userInfo.gender}</h1>
        <button onClick={handleUpdate}>Update Profile</button>
      </>
    );
  }
  ```

- 객체의 모든 값을 업데이트 할 때에는 스프레드 연산자 없이 직접 업데이트로 코드 작성하는 것이 효율적

### **중첩 객체 데이터**

- 중첩에서 특정 객체의 속성값 업데이트 하기

```tsx
import { useState } from "react";

export default function App() {
  const [userInfo, setUserInfo] = useState({
    name: "jack",
    age: 20,
    gender: "male",
    contact: {
      email: "jack@example.com",
      phone: "123-456-7890",
    },
    address: {
      home: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001",
      },
      office: {
        street: "456 Business Ave",
        city: "New York",
        zipCode: "10002",
      },
    },
  });

  const handleUpdateUserInfo = () => {
    setUserInfo((userInfo) => ({
      //함수형 업데이트
      ...userInfo,
      name: "mike",
      contact: {
        //contact 객체
        ...userInfo.contact,
        email: "soeun2215562@sm.ac.kr",
      },
      address: {
        home: {
          ...userInfo.address.home,
          street: "111",
        },
        office: {
          ...userInfo.address.office,
          street: "101",
        },
      },
    }));
  };

  return (
    <>
      <pre>{JSON.stringify(userInfo, null, 2)} </pre>
      <button onClick={handleUpdateUserInfo}>UpdateUserInfo</button>
    </>
  );
}
```

- 정리

  ### **1. 함수형 업데이트란?**

  React의 `useState` 훅을 사용할 때, 상태를 업데이트하는 함수(`setState`)에 함수를 인자로 넘기면 **함수형 업데이트**를 사용할 수 있습니다. 이 함수는 인자로 현재 상태의 값을 받아서 업데이트를 수행합니다.
  아래와 같은 상태 데이터를 기준으로 값을 업데이트 하는 방법을 살펴보겠습니다.

  ```php
  const [userInfo, setUserInfo] = useState({
    name: "jack",
    age: 20,
    gender: "male",
    contact: {
      email: "jack@example.com",
      phone: "123-456-7890",
    },
    address: {
      home: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001",
      },
      office: {
        street: "456 Business Ave",
        city: "New York",
        zipCode: "10002",
      },
    },
  });
  ```

  ***

  ### **2. 단일 값 업데이트**

  예를 들어, `userInfo` 객체에서 **name** 속성만 변경하고 싶다면 아래와 같이 작성할 수 있습니다.

  ```jsx
  const handleUpdateUserInfo = () => {
    setUserInfo((userInfo) => ({
      ...userInfo,
      name: "새로운 이름", // 업데이트할 새로운 name 값
    }));
  };
  ```

  위 코드는 이전 상태를 복사한 후, `name` 속성만 새로운 값으로 덮어씌워 업데이트하는 방법을 보여줍니다.

  ***

  ### **3. 중첩된 객체의 값 업데이트**

  React 상태가 중첩된 객체로 구성되어 있다면, 불변성을 유지하기 위해 깊은 복사를 해야 합니다. 예를 들어, `contact` 객체 안의 **email** 속성만 업데이트 하고 싶다면 다음과 같이 할 수 있습니다.

  ```jsx
  const handleUpdateUserInfo = () => {
    setUserInfo((userInfo) => ({
      ...userInfo,
      contact: {
        ...userInfo.contact,
        email: "newemail@example.com", // 업데이트할 새로운 email 값
      },
    }));
  };
  ```

  이 방식은 contact 객체의 다른 속성은 그대로 두고 email만 변경합니다.

  ***

  ### **4. 여러 값 동시에 업데이트하기**

  **(1) home과 office의 street 업데이트**
  두 개의 중첩된 객체인 `address.home`과 `address.office`의 `street` 값을 동시에 변경하려면, 각각의 객체를 복사한 후 원하는 값으로 업데이트합니다.

  ```jsx
  const handleUpdateUserInfo = () => {
    setUserInfo((userInfo) => ({
      ...userInfo,
      address: {
        ...userInfo.address,
        home: {
          ...userInfo.address.home,
          street: "새로운 Home Street", // 업데이트할 home의 street 값
        },
        office: {
          ...userInfo.address.office,
          street: "새로운 Office Street", // 업데이트할 office의 street 값
        },
      },
    }));
  };
  ```

  이 코드는 전체 상태를 복사하면서 address 객체 내부의 home과 office 객체 각각에 대해 street 속성만 업데이트합니다.
  **(2) name과 email 동시에 업데이트**
  여러 값을 한 번에 업데이트할 때는 각 업데이트할 속성을 원하는 값으로 덮어씌워주면 됩니다.

  ```jsx
  const handleUpdateUserInfo = () => {
    setUserInfo((userInfo) => ({
      ...userInfo,
      name: "새로운 이름",// 업데이트할 새로운 name 값contact: {
        ...userInfo.contact,
        email: "newemail@example.com",// 업데이트할 새로운 email 값
      },
    }));
  };

  ```

  이 예제에서는 `name`과 `contact.email`을 동시에 업데이트하여, 기존 상태의 불변성을 유지하면서 원하는 데이터만 수정할 수 있습니다.

  ***

  ### **5. 정리**

  React에서 상태 업데이트 시 함수형 업데이트 방식은 여러 업데이트가 동시에 발생하거나 비동기적으로 처리될 때 최신 상태를 반영할 수 있도록 도와줍니다.

  - **단일 값 업데이트:** 단순히 `name` 같은 값만 변경할 때 사용합니다.
  - **중첩 객체 업데이트:** 객체 내부의 특정 값만 업데이트할 때는 해당 객체를 스프레드 연산자로 전개한 후 변경합니다.
  - **여러 값 동시에 업데이트:** 여러 중첩된 값을 동시에 변경할 때도, 각 객체별로 스프레드 연산자로 전개한 후 유지하면서 원하는 속성만 덮어씌우면 됩니다.
    이처럼 함수형 업데이트를 적절히 활용하면, 복잡한 객체 데이터라고 하더라도 안전하게 상태를 업데이트 할 수 있습니다.

### 배열 상태

- useState 훅으로 배열 데이터를 정의하고 배열 데이터를 업데이트

```tsx
import { useState } from "react";

export default function App() {
  const [fruits, setFruits] = useState(["apple", "banana", "orange"]);
  const handleAddFruit = () => {
    //함수형 업데이트 방식

    //melon 추가
    setFruits((fruits) => [...fruits, "melon"]);
    //setFruits((fruits) => ["melon", ...fruits]); <- 맨 앞에 멜론 추가하는 법

    //이미 있는 값 바꾸기
    setFruits((fruits) =>
      fruits.map((fruit) => (fruit === "apple" ? "grape" : fruit))
    );

    //두 값 사이에 넣기: slice 함수
    setFruits((fruits) => [...fruits.slice(0, 1), "grape", ...fruits.slice(1)]);
  };
  return (
    <>
      <p>{fruits.join(", ")}</p> {/*출력 형식 join */}
      <button onClick={handleAddFruit}>Add Fruits</button>
    </>
  );
}
```

## 5. 컴포넌트와 상태

### 상태 독립성

- useState로 생성한 상태는 각각의 컴포넌트에서 독립적
- 컴포넌트 내에서 정의된 상태값들은 그 컴포넌트 내에서만 유효함
- 리렌더링은 상태가 업데이트된 컴포넌트 내에서만 진행됨

### 상태 끌어올리기

- 컴포넌트 간 상태를 공유하도록 부모/조상 컴포넌트에서 상태를 정의하고 상태와 상태업데이트 함수를 props로 전달
- 상태를 공유하고 공유된 상태를 동일하게 업데이트

```tsx
import { useState } from "react";
import FirstCount from "./components/FirstCount";
import SecondCount from "./components/SecondCount";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      {/*props로 전달 */}
      <FirstCount count={count} setCount={setCount} />
      <SecondCount count={count} setCount={setCount} />
    </>
  );
}
```

```tsx
import { Dispatch, SetStateAction } from "react";

export default function FirstCount({
  count,
  setCount,
}: {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}) {
  return (
    <>
      <h1>FirstCount Component: {count}</h1>
      <button onClick={() => setCount((count) => count + 1)}>Increment</button>
    </>
  );
}
```

![함께 증가됨](attachment:3dbf3df6-686b-4151-8e74-8fd5ea409ad7:image.png)

함께 증가됨

### 캡슐화

- 상태 끌어올리기는 자식 컴포넌트에서 상태 업데이트에 대한 자유도를 주기 때문에 권장되지 않는 방식
  - 예시로 부모 컴포넌트에서 1씩 증가하도록 한 것을 자식 컴포넌트에서 10씩 증가하도록 변경할 수 있음
- 상태 업데이트 함수를 직접 넘겨주는 상태 끌어올리기보다 상태 업데이트 로직을 구현한 함수를 넘겨주는 것이 좋음
- 특정 함수 내부의 상태 업데이트 로직을 구현하는 것을 **캡슐화**라고 함

  ```tsx
  import { useState } from "react";
  import FirstCount from "./components/FirstCount";
  import SecondCount from "./components/SecondCount";

  export default function App() {
    const [count, setCount] = useState(0);
    //캡슐화로 상태 업데이트 로직 구현
    const handleIncrement = () => {
      setCount((count) => count + 1);
    };
    return (
      <>
        {/*props로 전달 */}
        <FirstCount count={count} handleIncrement={handleIncrement} />
        <SecondCount count={count} handleIncrement={handleIncrement} />
      </>
    );
  }
  ```

  ```tsx
  export default function FirstCount({
    count,
    handleIncrement,
  }: {
    count: number;
    handleIncrement: () => void; //상태 업데이트 함수 로직
  }) {
    return (
      <>
        <h1>FirstCount Component: {count}</h1>
        <button onClick={handleIncrement}>Increment</button>
      </>
    );
  }
  ```

- 미션

  - **Count 컴포넌트**: CountDisplay 컴포넌트와 CountButton 컴포넌트의 부모 컴포넌트입니다.
  - **CoutDisplay 컴포넌트:** 카운터의 현재 값을 화면에 표시합니다.
  - **CountButton 컴포넌트:** 카운터 값을 증가, 감소, 리셋할 수 있는 버튼들을 포함합니다.

  ```tsx
  import Count from "./components/Count";

  export default function App() {
    return (
      <>
        <Count />
      </>
    );
  }
  ```

  ```tsx
  import { useState } from "react";
  import CountButton from "./CountButton";
  import CountDisplay from "./CountDisplay";

  export default function App() {
    const [count, setCount] = useState(0);
    const handleIncrement = () => {
      setCount((count) => count + 1);
    };
    const handleDecrement = () => {
      setCount((count) => count - 1);
    };
    const handleReset = () => {
      setCount(0);
    };
    return (
      <>
        <CountDisplay count={count} />
        <CountButton
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
          handleReset={handleReset}
        />
      </>
    );
  }
  ```

  ```tsx
  export default function CountButton({
    handleIncrement,
    handleDecrement,
    handleReset,
  }: {
    handleIncrement: () => void;
    handleDecrement: () => void;
    handleReset: () => void;
  }) {
    return (
      <>
        <button onClick={handleIncrement}>Increment</button>
        <button onClick={handleDecrement}>Decrement</button>
        <button onClick={handleReset}>Reset</button>
      </>
    );
  }
  ```

  ```tsx
  export default function CountDisplay({ count }: { count: number }) {
    return (
      <>
        <h3>count: {count}</h3>
      </>
    );
  }
  ```

- **리액트 훅 공통 규칙**

  ### **리액트 훅 공통 규칙**

  1. **리액트 훅은 use로 시작해야 한다.**
  리액트에서 사용하는 모든 훅은 `use`로 시작합니다.
  `useState`도 리액트 훅의 한 종류이기 때문에 `use`로 시작했습니다.
  이후에 배우는 여러 가지 훅도 `use`로 시작합니다.
  2. **훅은 최상위에서만 호출되어야 한다.**
  훅은 컴포넌트 함수의 최상위에서만 호출해야 합니다.
  조건문이나 반복문 내에서 호출하면 안 됩니다.
  **잘못된 예제:**

  ```jsx
  function MyComponent(props) {
    if (props.isLoggedIn) {
      const [user, setUser] = useState(null); // 조건문 안에서 훅 호출
    }
    return <div>{user}</div>;
  }
  ```

  **올바른 예제:**

  ```jsx
  function MyComponent(props) {
    const [user, setUser] = useState(null);// 최상위에서 호출if (props.isLoggedIn) {
      setUser({ name: 'John' });
    }

    return <div>{user ? user.name : 'Guest'}</div>;
  }
  ```

## 6. useReducer

- useState 훅보다 복잡한 상태 관리를 할 때 효율적

```tsx
const [state, dispatch] = useReducer<Type>(reducer, initialState);
```

- `reducer` 함수
  - 첫 매개변수로 함수 형태의 값을 전달함
  - 현재 상태값을 결정하는 역할을 함
- 두 개의 요소가 포함된 배열을 반환함
  - 첫 요소는 현재 상태 값 `state`
  - 두번째 요소는 리듀서 함수에 전달해서 새로운 상태값을 설정하게 하는 함수 `dispatch`(액션 발생 함수)

```tsx
import { useReducer } from "react";

//reducer 함수 정의
function reducer(count: number, action: { type: string }) {
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

export default function App() {
  const [count, countDispatch] = useReducer(reducer, 0);
  return (
    <>
      <h1>count: {count}</h1>
      <button onClick={() => countDispatch({ type: "DECREMENT" })}>감소</button>
      <button onClick={() => countDispatch({ type: "INCREMENT" })}>증가</button>
      <button onClick={() => countDispatch({ type: "RESET" })}>리셋</button>
    </>
  );
}
```

- 상태값을 변경할 수 있는 로직이 첫 매개변수인 `reducer` 함수 내부에만 있음
- `reducer`는 별도의 파일로 뺄 수 있어 보통 파일로 분리해 사용

# 섹션 7. 반복 렌더링과 조건부 렌더링

## 1. 조건부 렌더링

- 조건에 따라 적절한 UI를 렌더링하는 것

### if

```tsx
export default function App() {
  const isLoggedIn = true;

  if (isLoggedIn) **return <h1>Welcome Back</h1>;**
  else **return <h1>Pls sign up</h1>;**
}
```

```tsx
import GuestView from "./components/GuestView";
import UserView from "./components/UserView";

export default function App() {
  const isLoggedIn = true;

  if (isLoggedIn) **return <UserView />;**
  else **return <GuestView />;
}**

```

- 여러 개의 컴포넌트를 반환할 때 JSX 기본 원칙인 하나의 루트 엘리먼트만 반환해야한다는 것에 주의

  ```tsx
  import GuestView from "./components/GuestView";
  import UserInfoView from "./components/UserInfoView";
  import UserView from "./components/UserView";

  export default function App() {
    const isLoggedIn = true;

    if (isLoggedIn)
      **return (
        <>
          <UserView />
          <UserInfoView />
        </>
      );**
    else return <GuestView />;
  }
  ```

- props로 전달된 값을 참조하여 조건 처리를 하는 것도 가능

  ```tsx
  import Greeting from "./components/Greeting";

  export default function App() {
    const isLoggedIn = true;

    **//props 전달
    return <Greeting isLoggedIn={isLoggedIn} />;**
  }
  ```

  ```tsx
  import GuestView from "./GuestView";
  import UserInfoView from "./UserInfoView";
  import UserView from "./UserView";

  export default function Greeting({ isLoggedIn }: { isLoggedIn: boolean }) {
    if (isLoggedIn)
      return (
        <>
          <UserView />
          <UserInfoView />
        </>
      );
    else return <GuestView />;
  }
  ```

```tsx
import GuestView from "./GuestView";

export default function Greeting({ isLoggedIn }: { isLoggedIn: boolean }) {
  **if (isLoggedIn) return null;**
  else return <GuestView />;
}
```

- 미션

  ```tsx
  import { useState } from "react";
  import LoginStatus from "./components/LoginStatus";

  export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(true);

    //props 전달
    return (
      <LoginStatus
        isLoggedIn={isLoggedIn}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
    );
  }
  ```

  ```tsx
  export default function LoginStatus({
    isLoggedIn,
    handleLogin,
    handleLogout,
  }: {
    isLoggedIn: boolean;
    handleLogin: () => void;
    handleLogout: () => void;
  }) {
    if (isLoggedIn)
      return (
        <>
          <p>welcome</p>
          <button onClick={handleLogout}>logout</button>
        </>
      );
    return (
      <>
        <p>pls login</p>
        <button onClick={handleLogin}>login</button>
      </>
    );
  }
  ```

### switch

```tsx
export default function StatusMessage({ status }: { status: string }) {
  if (status === "login") return <h1>Loading</h1>;
  else if (status === "success") return <h1>data loaded successfully</h1>;
  else if (status === "error") return <h1> Error fetching data</h1>;
  else return <h1>unknown status</h1>;
}
```

```tsx
export default function StatusMessage({ status }: { status: string }) {
  switch (status) {
    case "loading":
      return <h1>Loading</h1>;
    case "success":
      return <h1>data loaded successfully</h1>;
    case "error":
      return <h1> Error fetching data</h1>;
    default:
      return <h1>unknown status</h1>;
  }
}
```

- 미션

  ```tsx
  import { useState } from "react";
  import TrafficLight from "./components/TrafficLight";

  export default function App() {
    const [light, setLight] = useState("red");
    const handleLight = () => {
      setLight((light) => {
        switch (light) {
          case "red":
            return "green";
          case "green":
            return "yellow";
          case "yellow":
            return "red";
          default:
            return "red";
        }
      });
    };
    return (
      <>
        <h1>App Component</h1>
        <TrafficLight light={light} handleLight={handleLight} />
      </>
    );
  }
  ```

  ```tsx
  export default function TrafficLight({
    light,
    handleLight,
  }: {
    light: string;

    handleLight: () => void;
  }) {
    return (
      <>
        <h1>Traffic: {light.toUpperCase()}</h1>
        <button onClick={handleLight}>Change Light</button>
      </>
    );
  }
  ```

### 삼항 연산자

- if문이나 switch문은 주로 return문 밖에서 조건을 처리하여 분기해서 사용하는 것
- 삼항연산자는 return문 내에서 중괄호를 사용하여 조건부 렌더링을 하는 것
- 참일 경우 앞의 요소, 거짓일 경우 그 뒤 요소를 실행

```tsx
export default function App() {
  const isLoggedIn = true;
  return (
    <>
      <h1>**{isLoggedIn ? "welcome back" : "pls sign up"}**</h1>
      **{/*JSX 요소 내부에 작성하는 것이 아니라 JSX요소 자체를 렌더링 */}
      {isLoggedIn ? <p>welcome back</p> : <p>pls sign up</p>}**
    </>
  );
}
```

```tsx
import GuestView from "./components/GuestView";
import UserView from "./components/UserView";

export default function App() {
  const isLoggedIn = true;
  **return <>{isLoggedIn ? <UserView /> : <GuestView />}</>;**
}
```

```tsx
import GuestView from "./components/GuestView";
import UserView from "./components/UserView";

export default function App() {
  const isLoggedIn = true;
  **const components = isLoggedIn ? <UserView /> : <GuestView />**
  return <>**{components}**</>;
}
```

```tsx
import GuestView from "./components/GuestView";
import UserInfo from "./components/UserInfo";
import UserView from "./components/UserView";

export default function App() {
  const isLoggedIn = true;
  **const components = isLoggedIn ? (
    <>
      <UserView /> <UserInfo />
    </>
  ) : (
    <GuestView />
  );**
  return <>{components}</>;
}
```

- 미션

  ```tsx
  import { useState } from "react";

  export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogin = () => {
      setIsLoggedIn(true);
    };
    const handleLogout = () => {
      setIsLoggedIn(false);
    };
    const Log = isLoggedIn ? (
      <>
        <p>환영합니다! 🎉</p>
        <button onClick={handleLogout}>logout</button>
      </>
    ) : (
      <>
        <p>로그인이 필요합니다. 🔐</p>
        <button onClick={handleLogin}>login</button>
      </>
    );
    return <>{Log}</>;
  }
  ```

### && 연산자

`expr1 && expr2`

- `expr1`이 참일 경우 `expr2` 실행
- 참고: `false`, `null`, `NaN`, `0`, `“”`, `‘’`, undefined 등은 거짓으로 평가됨

```tsx
export default function App() {
  const isLoggedin = false;
  return (
    <>
      **{isLoggedin && <h1>welcome</h1>}
      {!isLoggedin && <h1>pls sign up</h1>}**
    </>
  );
}
```

- JSX요소 외 컴포넌트도 렌더링할 수 있으며 fragment 태그로 묶어 컴포넌트를 여러개 렌더링할 수도 있음음
- 미션

  ```tsx
  import { useState } from "react";

  export default function App() {
    const [showNotification, setshowNotification] = useState(false);
    const showingNotification = () => {
      setshowNotification(true);
    };
    const hidingNotification = () => {
      setshowNotification(false);
    };
    return (
      <>
        {showNotification && (
          <>
            <h1>📢 새로운 알림이 도착했습니다!</h1>
            <button onClick={hidingNotification}>알림 닫기</button>
          </>
        )}
        {!showNotification && (
          <button onClick={showingNotification}>알림 보기</button>
        )}
      </>
    );
  }
  ```

## 2. 반복 렌더링

- 데이터 배열을 기반으로 UI 요소를 여러 번 렌더링하는 것

### for

- 반복 렌더링 시에는 그 개별 요소를 구분하는 key라는 props를 추가해야 함

```tsx
export default function App() {
  const fruits = ["apple", "banana", "orange"];
  const items = []; //빈 배열
  **for (let i = 0; i < fruits.length; i++) {
    items.push(<li key={i}>{fruits[i]}</li>);
  }**
  return (
    <>
      <p>Fruits Lists</p>
      <ul>{items}</ul>
    </>
  );
}

```

### map

- 리액트에서는 for문보다는 JavaScript 배열 내장 객체 메서드인 map 메서드를 사용해 새로운 배열을 만들어내는 것을 권장
- 기존의 배열을 순회하여 새로운 배열을 만들게 하는 배열 내장 객체 메서드

```tsx
export default function App() {
  const fruits = ["apple", "banana", "orange"];
  return (
    <>
      <p>Fruits Lists</p>
      <ul>
        {fruits.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
    </>
  );
}
```

- 미션

  ```tsx
  import { useState } from "react";

  export default function App() {
    const [items, setItems] = useState(["사과", "바나나", "오렌지"]);
    const addFruits = () => {
      setItems((items) => [...items, "포도"]);
    };
    const isGrapeAdded = items.includes("포도");
    return (
      <>
        <p>Fruits Lists</p>
        <ul>
          {items.map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ul>
        <button onClick={addFruits} **disabled={isGrapeAdded}**>
          과일 추가
        </button>
      </>
    );
  }

  ```

### key

**고유성**

- 반복해서 렌더링되는 요소에서 key 속성은 반드시 고유해야 함
- 배열 인덱스 번호는 고유한 값이 아니기 때문에 실무에서는 키 속성의 값으로 지정하면 안됨
  - 인덱스 번호는 상황에 따라 달라짐
  - 인위적으로 배열 아이템을 가공해 고유한 값이 있도록 해야 함
- 고유한 값이 있도록 하는 방법: **uuid**

  - npmjs.com에서 uuid 검색
  - 패키지 다운
  - 고유한 id값을 만들어주는 패키지

  ```tsx
  import { useState } from "react";
  **import { v4 as uuidv4 } from "uuid";**

  export default function App() {
    const items = ["사과", "바나나", "오렌지"];
    //items의 map 메서드를 사용해 기존의 아이템을 가공해 새로운 배열로
    **const [fruits, setFruits] = useState(() =>
      items.map((item) => ({
        id: uuidv4(),
        value: item,
      }))
    );**
    const addFruits = () => {
      setFruits([{ id: uuidv4(), value: "포도" }, ...fruits]);
    };
    const isGrapeAdded = items.includes("포도");
    return (
      <>
        <p>Fruits Lists</p>
        <ul>
          {fruits.map((fruit) => (
            <li key={fruit.id}>{fruit.value}</li>
          ))}
        </ul>
        <button onClick={addFruits} disabled={isGrapeAdded}>
          과일 추가
        </button>
      </>
    );
  }
  ```

**유효 범위**

- key 속성의 값은 해당 반복문에서만 유효해야 함
- 즉, 자기자신의 반복 렌더링에서만 key라는 속성의 값이 중복되지 않으면 됨
- 같은 데이터를 여러 번 복사해 반복해 같은 id 값을 가지는 key 속성이 여러 군데에서 사용되어도 문제 없음

### filter

- 특정 배열의 요소를 필터링하는 메서드
- 리액트에서 어떤 배열 요소를 반복 렌더링하기 전 데이터를 걸러내는 용도로 사용
- 배열의 요소만큼 콜백함수를 실행시켜 그 반환값이 참인 것만 새로운 배열로

```tsx
import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: "Apple", category: "Fruit" },
    { id: 2, name: "Carrot", category: "Vegetable" },
    { id: 3, name: "Banana", category: "Fruit" },
    { id: 4, name: "Tomato", category: "Vegetable" },
  ]);

  return (
    <>
      <h3>items list</h3>
      <ul>
        **
        {items
          .filter((item) => item.category === "Vegetable")
          .map((item) => (
            <li key={item.id}>
              {item.category} - {item.name}
            </li>
          ))}
        **
      </ul>
    </>
  );
}
```

```tsx
import { useState } from "react";

export default function App() {
  // 초기 데이터를 설정합니다.
  const [items, setItems] = useState([
    { id: 1, name: "Apple", category: "Fruit" },
    { id: 2, name: "Carrot", category: "Vegetable" },
    { id: 3, name: "Banana", category: "Fruit" },
    { id: 4, name: "Tomato", category: "Vegetable" },
  ]);

  //itemid에 해당하는 것만 삭제하도록
  const handleDelete = (id: number) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <>
      <h3>items list</h3>
      <ul>
        {items
          .filter((item) => item.category === "Vegetable")
          .map((item) => (
            <li key={item.id}>
              {item.category} - {item.name}
              <button>Delete</button>
            </li>
          ))}
      </ul>
    </>
  );
}
```

- 미션

  ```tsx
  import RecipeList from "./components/RecipeList";

  export default function () {
    return (
      <>
        <RecipeList />
      </>
    );
  }
  ```

  ```tsx
  import { useState } from "react";
  import Recipe from "./Recipe";
  import { initialRecipes } from "../data/initialData";

  export default function Reciperecipes() {
    //map 사용 렌더링
    const [recipes, setRecipes] = useState(initialRecipes);
    const handleDelete = (id: string) => {
      setRecipes((recipes) => recipes.filter((recipes) => recipes.id !== id));
    };
    return (
      <>
        <h1>Recipes</h1>
        {recipes.map((recipe) => {
          <Recipe key={recipe.id} {...recipe} handleDelete={handleDelete} />;
        })}
      </>
    );
  }
  ```

  ```tsx
  export default function Recipe({
    id,
    name,
    ingredients,
    handleDelete,
  }: {
    id: string;
    name: string;
    ingredients: string[];
    handleDelete: (id: string) => void;
  }) {
    return (
      <>
        <h2>{name}</h2>
        <ul>
          {ingredients.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
        <button onClick={() => handleDelete}>[삭제]</button>
      </>
    );
  }
  ```

  # 섹션 8. 컴포넌트 스타일링

## 1. 인라인 스타일과 글로벌 스타일

### 인라인 스타일

- jsx 요소와 스타일 속성을 사용해 직접 스타일을 지정하는 방법

```tsx
export default function App() {
  const aStyle = { color: "rgba(0,255,0, 0.2)" };
  return (
    <>
      <h1 style={{ color: "red" }}>Inline Style</h1>
      <h1 style={{ color: "rgba(0,255,0, 0.2)" }}>Inline Style</h1>
      <h1 style={{ color: "#0000ff" }}>Inline Style</h1>
      <h1 style={aStyle}>aa</h1>
    </>
  );
}
```

- css와 비슷하지만 카멜케이스로 작성
  예: font-size → fontSize
- props로 전달

  ```tsx
  import Inline from "./components/Inline";

  export default function App() {
    const isLoggedIn = true;
    const aStyle = { color: isLoggedIn ? "red" : "rgba(0,255,0, 0.2)" };

    return (
      <>
        <Inline aStyle={aStyle} />
      </>
    );
  }
  ```

  ```tsx
  export default function Inline({ aStyle }: { aStyle: { color: string } }) {
    return (
      <>
        <h1 style={aStyle}>Inline Component</h1>
      </>
    );
  }
  ```

- && 연산자는 사용 불가 (boolean 타입 에러)

### 글로벌 스타일

- 외부 스타일링 방식과 유사하게 별도의 css 파일을 만들어 스타일 작성
- `import`로 css 파일을 불러와서 사용(상대경로)
- 리액트에서 import로 불러온 css 파일은 모든 컴포넌트 트리에 영향을 미침
- main.tsx로 import하는 것을 추천

## 2. CSS 모듈

### CSS module

- 특정 컴포넌트에서만 스타일이 공유되게 하는 방법
- 확장자가 module.css로 끝나는 파일에 css를 작성하는 방법
- 파일에 작성하는 스타일은 **클래스 선택자**여야 올바르게 적용됨
- 스타일을 적용할 컴포넌트명 뒤에 module.css를 붙이는 형태로 네이밍
  `Component.module.css`
- 동일하게 import로 불러오지만 css **모듈 객체**를 할당하는 방식으로 불러와야 함
  `import styles from “./App.module.css”`
- 접근은 `{style.title}` 형식으로 접근 ( `“title”`로 접근 불가)
- 클래스가 중복되지 않도록 유니크한 랜덤값으로 변경하기 때문에 일부에만 스타일을 적용할 수 있는 것
- 반드시 클래스 선택자를 사용해야 함
- 컴포넌트 설게 패턴과 호환됨

### Classnames

- CSS 모듈 객체를 매번 활용하면 코드가 길어진다는 단점이 있음
- 이러한 단점을 해결하기 위한 외부 패키지로 Classnames가 있음
- CSS 클래스 이름을 동적으로 조합하고 관리할 수 있도록 도와주는 유틸리티
- npmjs.com에서 classnames 검색해 설치 방법과 사용법 확인

```tsx
import styles from "./App.module.css";

export default function App() {
  return (
    <>
      <button className={'${styles.btn} ${styles["is-active"]}'}>버튼</button>
    </>
  );
}
```

```tsx
import styles from "./App.module.css";
import classNames from "classnames/bind";

export default function App() {
  **const cx = classNames.bind(styles);**
  return (
    <>
      <button className={cx("btn", "is-active")}>버튼</button>
    </>
  );
}
```

- 미션

  ```tsx
  import styles from "./ButtonGroup.module.css";
  import classNames from "classnames/bind";
  import { useState } from "react";

  export default function ButtonGroup({
    initialButtons,
  }: {
    initialButtons: ButtonGroupProps[];
  }) {
    const cx = classNames.bind(styles);
    const initialActiveStates: { [key: string]: boolean } = {};
    initialButtons.forEach((btn) => {
      initialActiveStates[btn.id] = false;
    });
    const [activeStates, setActiveStates] = useState(initialActiveStates);
    const handleToggleActiveButton = (id: number, isDisabled: boolean) => {
      if (isDisabled) return;
      setActiveStates((activeStates) => ({
        ...activeStates,
        [id]: !activeStates[id],
      }));
    };
    const handleResetActiveStates = () => {
      const resetActiveStates: { [key: string]: boolean } = {};
      initialButtons.forEach((btn) => {
        initialActiveStates[btn.id] = false;
      });
      setActiveStates(resetActiveStates);
    };
    return (
      <>
        <h1>Active Count: 0</h1>
        <div>
          {initialButtons.map((btn) => (
            <button
              className={cx("button", {
                active: activeStates[btn.id],
                disabled: btn.isDisabled,
                highlight: btn.id === 2,
              })}
              onClick={() => handleToggleActiveButton(btn.id, btn.isDisabled)}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
          <button className={cx("button")} onClick={handleResetActiveStates}>
            reset
          </button>
        </div>
      </>
    );
  }
  ```

## 3. CSS-IN-JS

- 전통적인 웹 개발: 관심사 분리
  - HTML, CSS, JS를 각 기술의 역할을 구분하여 유지보수성 높임
  - 여러 문제를 발생시킴
  1. 전역 스코프 문제
     - 기존의 CSS는 전역 스코프로 동작하기 때문에 클래스명 충돌 빈번
     - CSS 모듈에서 이런 점을 개선했지만 클래스 선택자만 사용해야 한다는 다른 제한사항 발생
  2. 상태 관리의 어려움
     - UI 상태는 자바스크립트로 작성하는데 스타일은 CSS 파일에서 작성하기 때문에 동적인 상태를 추가하는게 번거롭고 어려움
  3. 유지 보수의 복잡성
     - 프로젝트 규모가 커질수록 어떤 CSS가 어떤 컴포넌트에 영향을 주는지 찾기 어렵고 사용하지 않는 CSS도 완전히 제거하기 어려움
- 위 문제점들을 해결하고자 CSS-in-JS 등장
- 자바스크립트 안에서 CSS 스타일을 정의하고 적용하는 방식
- JS로 개발하는 컴포넌트 개발 방식에 매우 적합하며 동적 스타일링을 쉽게 구현할 수 있음
- 리액트에서는 Styled Components, Emotion, VanillaExtract가 가장 많이 쓰임

이 아래는 양이 너무 많아 다 하지 못해 다음주 과제와 함께 하겠습니다.

## 4. styled-components

## 5. tailwind css

## 6. 이미지 렌더링
