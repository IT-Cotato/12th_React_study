5주차 리액트

# 섹션 10. 폼 다루기

## 1. 폼

- 사용자가 데이터를 입력하고 제출할 수 있도록 하는 UI 요소
- 텍스트 필드, 체크 박스, 라디오 버튼, 드롭 다운 목록 등 여러 입력 요소를 포함
- **제어 컴포넌트 방식**과 **비제어 컴포넌트 방식**으로 나뉨
  - 제어 컴포넌트 방식: React의 **상태**를 활용해서 Form 요소를 제어하는 방식
  - 비제어 컴포넌트 방식: React 상태를 사용하지 않고 DOM 자체에서 상태를 관리하게 하는 방법

## 2. 제어 컴포넌트

### 한 줄 입력

```tsx
import { useState } from "react";

export default function Input() {
  //상태 정의해 사용
  const [input, setInput] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  return (
    <>
      <form>
        <h1>Input: {input} </h1>
        <input type="text" value={input} onChange={handleInputChange} />
      </form>
    </>
  );
}
```

- 상태 변수 `input`의 값을 `value` 속성의 값에 할당하면 속성값이 변경되지 않음
  - `onChange`와 같은 이벤트 핸들러와 함께 사용하거나
  - `readOnly`, `disabled` 등의 속성으로 업데이트를 할 필요가 없도록 해야 함
- 여러 개의 입력 요소 - 상태 코드 복수 정의
  ```tsx
  import { useState } from "react";

  export default function Input() {
    //상태 정의해 사용
    const [input, setInput] = useState("");
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    };
    //input 요소가 두 개인 경우 상태 코드 하나 더 필요
    const [pw, setPw] = useState("");
    const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPw(e.target.value);
    };
    return (
      <>
        <form>
          <h1>Input: {input} </h1>
          <input type="text" value={input} onChange={handleInputChange} />
          <input type="password" value={pw} onChange={handlePwChange} />
        </form>
      </>
    );
  }
  ```
- 여러 개의 입력 요소 - 객체 상태
  ```tsx
  import { use, useState } from "react";

  export default function Input() {
    const [formState, setFormState] = useState({
      email: "",
      password: "",
    });
    const handleFormStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((formState) => ({
        ...formState,
        [e.target.name]: e.target.value,
      }));
    };
    return (
      <>
        <form>
          <h1>Input: {input} </h1>
          <input
            type="text"
            name="email"
            value={input}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            value={pw}
            onChange={handlePwChange}
          />
        </form>
      </>
    );
  }
  ```

### 체크박스

```tsx
import { useState } from "react";

export default function Input() {
  const [chk1, setChk1] = useState(false);
  const handleChkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChk1(e.target.checked);
  };
  return (
    <>
      <input
        type="checkbox"
        id="item1"
        checked={chk1}
        onChange={handleChkChange}
      />
      <label htmlFor="item1">
        아이템 1({chk1 ? "선택됨" : "선택되지 않음"})
      </label>
    </>
  );
}
```

- 이벤트 속성을 사용하지 않으면 에러 발생
  - `onChange`와 같은 이벤트 핸들러와 함께 사용하거나
  - `readOnly`, `disabled` 등의 속성으로 업데이트를 할 필요가 없도록 해야 함
- 여러 개의 체크박스 - 상태 코드 복수 정의
  ```tsx
  import { useState } from "react";

  export default function Input() {
    const [chk1, setChk1] = useState(false);
    const handleChkChange = (e: ChangeEvent<HTMLInputElement>) => {
      setChk1(e.target.checked);
    };

    const [chk2, setChk2] = useState(false);
    const handleChk2Change = (e: ChangeEvent<HTMLInputElement>) => {
      setChk2(e.target.checked);
    };
    return (
      <>
        <div>
          <input
            type="checkbox"
            id="item1"
            checked={chk1}
            onChange={handleChkChange}
          />
          <label htmlFor="item1">
            아이템 1({chk1 ? "선택됨" : "선택되지 않음"})
          </label>
        </div>
        <div>
          <input
            type="checkbox"
            id="item2"
            checked={chk2}
            onChange={handleChk2Change}
          />
          <label htmlFor="item2">
            아이템 2({chk2 ? "선택됨" : "선택되지 않음"})
          </label>
        </div>
      </>
    );
  }
  ```
- 여러 개의 체크박스 - 객체 상태
  ```tsx
  import { useState } from "react";

  export default function Input() {
    const [formState, setFormState] = useState({
      chk1: false,
      chk2: false,
    });
    const handleFormStateChange = (e: ChangeEvent<HTMLInputElement>) => {
      setFormState((formState) => ({
        ...formState,
        [e.target.name]: e.target.chcked,
      }));
    };
    return (
      <>
        <div>
          <input
            type="checkbox"
            id="item1"
            name="chk1"
            checked={formState.chk1}
            onChange={handleFormStateChange}
          />
          <label htmlFor="item1">
            아이템 1({formState.chk1 ? "선택됨" : "선택되지 않음"})
          </label>
        </div>
        <div>
          <input
            type="checkbox"
            id="item2"
            name="chk2"
            checked={formState.chk2}
            onChange={handleFormStateChange}
          />
          <label htmlFor="item2">
            아이템 2({formState.chk2 ? "선택됨" : "선택되지 않음"})
          </label>
        </div>
      </>
    );
  }
  ```

### 라디오

```tsx
import { useState } from "react";

export default function Radio() {
  const [selectedValue, setSelectedValue] = useState("option1");
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value);
  };
  return (
    <div>
      <label>
        <input
          type="radio"
          name="option"
          value="option1"
          checked={selectedValue === "option1"}
          onChange={handleRadioChange}
        />
        옵션 1
      </label>
      <label>
        <input
          type="radio"
          name="option"
          value="option2"
          checked={selectedValue === "option2"}
          onChange={handleRadioChange}
        />
        옵션 2
      </label>
      <label>
        <input
          type="radio"
          name="option"
          value="option3"
          checked={selectedValue === "option3"}
          onChange={handleRadioChange}
        />
        옵션 3
      </label>
    </div>
  );
}
```

- `onChange`와 같은 이벤트 핸들러 사용 필요
- 객체 상태 하나를 통해 여러 개 요소를 제어할 수 있지만 라디오 버튼 하나 당 상태가 하나만 필요하기 때문에 여러 개의 상태로 나타내도 비교적 괜찮음
  ```tsx
  import { useState } from "react";

  export default function Radio() {
    const [formState, setFormState] = useState({
      option: "",
      color: "",
    });
    const handleFormStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((formState) => ({
        ...formState,
        [e.target.name]: e.target.value,
      }));
    };
    return (
      <section>
        <div>
          <label>
            <input
              type="radio"
              name="option"
              value="option1"
              checked={formState.option === "option1"}
              onChange={handleFormStateChange}
            />
            옵션 1
          </label>
          <label>
            <input
              type="radio"
              name="option"
              value="option2"
              checked={formState.option === "option2"}
              onChange={handleFormStateChange}
            />
            옵션 2
          </label>
          <label>
            <input
              type="radio"
              name="option"
              value="option3"
              checked={formState.option === "option3"}
              onChange={handleFormStateChange}
            />
            옵션 3
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="color"
              value="color1"
              checked={formState.color === "color1"}
              onChange={handleFormStateChange}
            />
            컬러 옵션 1
          </label>
          <label>
            <input
              type="radio"
              name="color"
              value="color2"
              checked={formState.color === "color2"}
              onChange={handleFormStateChange}
            />
            컬러 옵션 2
          </label>
          <label>
            <input
              type="radio"
              name="color"
              value="color3"
              checked={formState.color === "color3"}
              onChange={handleFormStateChange}
            />
            컬러 옵션 3
          </label>
        </div>
      </section>
    );
  }
  ```

### 여러 줄 입력

```tsx
import { useState } from "react";

export default function Input() {
  const [text, setText] = useState("");
  const handleTextChange = (e: React.ChangeEvent**<HTMLTextAreaElement>**) => {
    setText(e.target.value);
  };
  return (
    <>
      <textarea value={text} onChange={handleTextChange} />
      <p>입력된 텍스트: </p>
    </>
  );
}

```

- 객체 상태
  ```tsx
  import { useState } from "react";

  export default function Input() {
    const [formState, setFormState] = useState({
      desc: "",
      introduce: "",
    });
    const handleFormStateChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setFormState((formState) => ({
        ...formState,
        [e.target.name]: e.target.value,
      }));
    };
    return (
      <>
        <textarea
          name="desc"
          value={formState.desc}
          onChange={handleFormStateChange}
        />
        <p>입력된 텍스트: {formState.desc}</p>

        <textarea
          name="introduce"
          value={formState.introduce}
          onChange={handleFormStateChange}
        />
        <p>입력된 텍스트: {formState.introduce}</p>
      </>
    );
  }
  ```

## 3. 비제어 컴포넌트

- React 상태를 사용하지 않고 DOM 자체에서 폼 입력 값을 관리하는 방법
- DOM에 직접 접근하여 값을 제어
- useRef 훅을 사용해야 함
  ```tsx
  const ref = useRef<Type>(initialState);
  ```
  - DOM 요소에 대한 참조를 생성할 수 있는 훅으로 초기값을 받아 Ref 객체를 반환
  - 타입 생략 가능

### 한 줄 입력

```tsx
import { useRef } from "react";

export default function Input() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <form>
      <input type="text" ref={inputRef} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

- 상태의 입력값을 제어하지 않기 때문에 사용자가 입력한 값을 실시간으로 가져올 수는 없음
- 단순히 연결되어 있는 참조 값을 활용해 그 입력 요소에 무슨 값이 입력이 되었는지만 가져오는 것
  ```tsx
  import { useRef } from "react";

  export default function Input() {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      //value 속성의 값이 있는 경우 출력
      console.log(inputRef.current?.value);
    };
    return (
      <form>
        <input type="text" ref={inputRef} />
        <button type="submit">Submit</button>
      </form>
    );
  }
  ```
  - 제어 컴포넌트 방식처럼 입력된 값을 실시간으로 출력할 순 없지만 필요 시 입력 요소에 무슨 값이 입력되었는지는 알 수 있음
  - ref 객체의 current 속성에 참조해 value라는 속성 값에 접근하면 됨
- 제어하려는 입력 요소 하나 당 ref 객체 하나가 필요함

### 체크박스

```tsx
import { useRef } from "react";

export default function Checkbox() {
  const privacyRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(privacyRef.current?.checked);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="checkbox" ref={privacyRef} />
          <label>아이템 1</label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

- 체크 여부에 따른 if문으로 작성할 수도 있음
  ```tsx
  import { useRef } from "react";

  export default function Checkbox() {
    const privacyRef = useRef<HTMLInputElement>(null);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const privacy = privacyRef.current?.checked;
      if (!privacy) {
        alert("동의해주세요");
        return;
      }
      console.log(privacyRef.current?.checked);
    };
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div>
            <input type="checkbox" ref={privacyRef} />
            <label>아이템 1</label>
          </div>
          <button type="submit">Submit</button>
        </form>
      </>
    );
  }
  ```
- 여러 개의 체크박스 생성을 위해선 `useRef` 추가 생성 필요
  - 이벤트 핸들러는 하나여도 됨
- 어떤 체크박스를 선택했는지 파악하고 싶은 경우 ref 객체를 배열로 정의해야 함
  ```tsx
  import { useRef } from "react";

  export default function Checkbox() {
    const fruitsRef = useRef<HTMLInputElement[]>([]);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const selectedFruits = fruitsRef.current
        .filter((fruit) => fruit.checked)
        .map((fruit) => fruit.value);
      console.log(selectedFruits);
    };
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="checkbox"
              value={"1"}
              ref={(el) => {
                fruitsRef.current[0] = el!;
              }}
            />
            <label>아이템 1</label>
          </div>
          <div>
            <input
              type="checkbox"
              value={"2"}
              ref={(el) => {
                fruitsRef.current[1] = el!;
              }}
            />
            <label>아이템 2</label>
          </div>
          <div>
            <input
              type="checkbox"
              value={"3"}
              ref={(el) => {
                fruitsRef.current[2] = el!;
              }}
            />
            <label>아이템 3</label>
          </div>
          <button type="submit">Submit</button>
        </form>
      </>
    );
  }
  ```

### 라디오

- 비제어 컴포넌트로 제어하기 까다로운 요소임
  - 비제어 컴포넌트 방식에서는 ref 하나당 입력 요소 하나를 연결해야 함
  - 제시된 값 중 하나만 선택이 되어야 하는데 라디오 버튼의 개수마다 ref 객체를 일일이 다 지정해야 하기 때문에 번거로움
  - 해당 값이 선택되었는지도 전부 파악 필요

⇒ 조금 다른 접근 필요

- FormData 객체를 사용해 get 메서드를 통해 값을 가져오는 방식으로 작성해야 함

```tsx
import { useRef } from "react";

export default function Radio() {
  const formElRef = useRef<HTMLFormElement>(null);
  //사용자가 선택한 값을 일괄적으로 가져오도록하는 방법
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    **const formData = new FormData(formElRef.current!);**
    console.log(formData.get("option"));
  };
  return (
    <form ref={formElRef} onSubmit={handleSubmit}>
      <div>
        <label>
          <input type="radio" name="option" value="option1" defaultChecked />
          옵션 1
        </label>
      </div>

      <div>
        <label>
          <input type="radio" name="option" value="option2" />
          옵션 2
        </label>
      </div>

      <div>
        <label>
          <input type="radio" name="option" value="option3" />
          옵션 3
        </label>
      </div>

      <button type="submit">제출</button>
    </form>
  );
}
```

- `defaultChecked` 속성을 통해 선택한 상태로 지정 가능

### 여러 줄 입력

```tsx
import { useRef } from "react";

export default function Textarea() {
  const descRef = useRef**<HTMLTextAreaElement>**(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(descRef.current?.value);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea name="desc" ref={descRef} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

- 한 줄 입력 요소와 타입만 다름

### 일괄 제어

- 각각의 요소의 값을 가져오지 않고 form 데이터 객체를 통해 한 번에 가져오기
- FormData 객체에 내장되어 있는 `get` 메소드를 통해 가능

```tsx
import { useRef } from "react";

export default function UserInfoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  **const handleSUbmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const name = formData.get("name");
      const email = formData.get("email");
      const gender = formData.get("gender");
      //여러 개 가져오기
      const skills = formData.getAll("skills");
      const bio = formData.get("bio");
      console.log({name, email, gender, skills, bio});
    }
  };**
  return (
    <div className="user-info">
      <h1 className="user-info__title">User Information</h1>
      <form className="user-info__form" ref={formRef} onSubmit={handleSUbmit}>
        <div className="form-group">
          <label className="form-group__label" htmlFor="name">
            이름:
          </label>
          <input
            className="form-group__input"
            type="text"
            id="name"
            name="name"
          />
        </div>

        <div className="form-group">
          <label className="form-group__label" htmlFor="email">
            이메일:
          </label>
          <input
            className="form-group__input"
            type="email"
            id="email"
            name="email"
          />
        </div>

        <div className="form-group form-group--radio">
          <label className="form-group__label">성별:</label>
          <label className="form-group__radio">
            <input
              type="radio"
              id="male"
              name="gender"
              value="남성"
              defaultChecked
            />
            남성
          </label>
          <label className="form-group__radio">
            <input type="radio" id="female" name="gender" value="여성" />
            여성
          </label>
        </div>

        <div className="form-group form-group--checkbox">
          <label className="form-group__label">기술 관심:</label>
          <label className="form-group__checkbox">
            <input type="checkbox" name="skills" value="JavaScript" />
            JavaScript
          </label>
          <label className="form-group__checkbox">
            <input type="checkbox" name="skills" value="React" />
            React
          </label>
          <label className="form-group__checkbox">
            <input type="checkbox" name="skills" value="Node.js" />
            Node.js
          </label>
        </div>

        <div className="form-group">
          <label className="form-group__label" htmlFor="bio">
            자기소개:
          </label>
          <textarea
            className="form-group__textarea"
            id="bio"
            name="bio"
            placeholder="자기소개를 작성해주세요"
          ></textarea>
        </div>

        <button className="user-info__submit" type="submit">
          제출
        </button>
      </form>
    </div>
  );
}
```

- 제약
  - 반드시 form 태그로 묶여있어야 함
  - 입력 요소의 참조값이 따로 형성되지 않기 때문에 각각의 입력 요소를 개별적으로 조작할 수 없음
    ⇒ 개별적으로 조작하기 위해선 반드시 별도의 ref 객체를 생성해 특정 요소와 연결해 줘야 함

## 4. 고급

### 제어 컴포넌트 vs 비제어 컴포넌트

https://velog.io/@yukyung/React-%EC%A0%9C%EC%96%B4-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EC%99%80-%EB%B9%84%EC%A0%9C%EC%96%B4-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90-%ED%86%BA%EC%95%84%EB%B3%B4%EA%B8%B0

### ref 전달

- ref 객체는 JSX 요소와 참조 관계를 형성하는 것이기 때문에 자바스크립트의querySelector() 메서드와 동일한 역할을 함
- ref 객체는 `<form>` 요소 외에도 `<div>`, `<p>`, `<strong>` 등의 모든 JSX 요소와 참조 관계를 형성하여 DOM을 조작할 수 있음
- 주의: 만약 ref 객체 사용 시 컴포넌트로 ref 객체를 전달하고 그 ref 객체를 ref 속성으로 할당하려는 경우 ref 속성을 자식 컴포넌트로 전달할 때 **React18과 19에서 문법이 다름**

**React19**

- 일반적인 컴포넌트의 props를 전달하듯이 ref 받아 활용
  ```tsx
  import { RefObject } from "react";

  export default function UserInfoForm({
    ref,
  }: {
    ref: RefObject<HTMLInputElement | null>;
  }) {
    return (
      <>
        <input type="text" ref={ref} />
      </>
    );
  }
  ```
  ```tsx
  import { useRef } from "react";
  import UserInfoForm from "./components/UserInfoForm";

  export default function App() {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      inputRef.current?.focus();
    };
    return (
      <>
        <form onSubmit={handleSubmit}>
          <UserInfoForm ref={inputRef} />
          <button type="submit">제출</button>
        </form>
      </>
    );
  }
  ```

**React18**

- React18로 다운그레이드 필요
  ```tsx
  npm install react@18 react-dom@18 @types/react-dom@18
  ```
- 일반적인 props 전달처럼 처리 불가능
- `forwardRef`라는 함수 사용 필요
  ```tsx
  import { forwardRef } from "react";

  export default forwardRef<HTMLInputElement>(function UserInfoForm(_, ref) {
    return (
      <>
        <input type="text" ref={ref} />
      </>
    );
  });
  ```
  - 함수형 컴포넌트를 구성하던 함수를 forward ref의 매개변수로 전달
  - 타입을 `<HTMLInputElement>` 등 ref 객체 요소로 작성
  - props 전달 시 타입 명시 필요(위 코드에선 생략)
  - 언더바는 props를 사용하지 않고 ref 객체만을 전달하고 있어 대체한 것 (미작성 시 에러 발생)

### **커스텀** 훅

- 제어 컴포넌트 방식으로 form 요소를 제어하려면 상태와 상태 업데이트 함수 한 세트가 value 속성에 할당되어야 함
  ⇒ 제어 컴포넌트로 제어해야하는 상태가 여러 개인 경우 코드가 길어짐
- 커스텀 훅은 리액트에서 제공하는 훅을 조합하여 나만의 훅을 만드는 것
- 폼 요소를 제어하는 것 외에도 다양하게 활용될 수 있음
- 보통 `src/hooks/use…` 파일로 정의
  ```tsx
  import { useState } from "react";

  export default function useInput(initialValue = "") {
    const [value, setValue] = useState(initialValue);
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    return {
      value,
      handleValueChange,
    };
  }
  ```
  ```tsx
  **import useInput from "./hooks/useInput";**

  export default function App() {
    **const { value: email, handleValueChange: handleEmailChange } = useInput("");
    const { value: password, handleValueChange: handlePasswordChange } =
      useInput("");
    const { value: name, handleValueChange: handleNameChange } = useInput("");**

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log({ email, password, name });
    };

    return (
      <>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={handleNameChange}
          />
          <button type="submit">제출</button>
        </form>
      </>
    );
  }
  ```

## 5. 밸리데이션

- Form 요소의 값을 검증하는 것

### 기본 밸리데이션

- HTML 태그가 갖는 기본 속성을 가지고 밸리데이션을 하는 것
- JSX 요소는 결국 HTML로 변환되기 때문에 HTML 태그가 가지는 속성 그대로 대부분 사용 가능함
  ```tsx
  import useInput from "./hooks/useInput";

  export default function App() {
    const { value: email, handleValueChange: handleEmailChange } = useInput("");
    const { value: password, handleValueChange: handlePasswordChange } =
      useInput("");
    const { value: name, handleValueChange: handleNameChange } = useInput("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log({ email, password, name });
    };

    return (
      <>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={handleEmailChange}
            **required**
          />
          <button type="submit">제출</button>
        </form>
      </>
    );
  }
  ```
  ```tsx
  required //필수 요소로 함
  minLength={4} //최소 길이 설정
  maxLength={10} //최대 길이 설정
  ```

### 커스텀 밸리데이션

- 밸리데이션을 위한 별도의 함수를 정의하는 것
- 밸리데이션을 함과 동시에 내가 원하는 대로 코드를 핸들링 할 수 있다는 차별점
  ```tsx
  import useInput from "./hooks/useInput";

  export default function App() {
    const { value: email, handleValueChange: handleEmailChange } = useInput("");
    const { value: password, handleValueChange: handlePasswordChange } =
      useInput("");
    const { value: name, handleValueChange: handleNameChange } = useInput("");

    //이메일을 매개변수로 받는 함수를 통해
    const validateEmail = (email: string) => {
      if (!email) return "이메일을 입력하세요";
      if (!/^[a-zA-Z0-9._%+\-]+@(gmail\.com|naver\.com)$/.test(email))
        return "gmail과 naver만 가능합니다";
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const emailError = validateEmail(email);
      if (emailError) {
        alert(emailError);
        return;
      }
      console.log({ email, password, name });
    };

    return (
      <>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={handleNameChange}
          />
          <button type="submit">제출</button>
        </form>
      </>
    );
  }
  ```
- 커스텀 밸리데이션을 별도의 파일로 만들어 불러오는 것도 가능

### 커스텀 훅과 통합

- 커스텀 밸리데이션과 커스텀 훅을 통합할 수 있음
  ```tsx
  import { useState } from "react";

  export default function useInput(
    initialValue = "",
    validateFn: (value: string) => string | undefined
  ) {
    const [error, setError] = useState("");
    const [value, setValue] = useState(initialValue);
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setError(validateFn(e.target.value) || "");
    };

    return {
      value,
      handleValueChange,
      error,
    };
  }
  ```
  ```tsx
  import useInput from "./hooks/useInput";
  import {
    validateEmail,
    validateName,
    validatePassword,
  } from "./utils/validation";

  export default function App() {
    const {
      value: email,
      handleValueChange: handleEmailChange,
      error: emaiError,
    } = useInput("", validateEmail);
    const {
      value: password,
      handleValueChange: handlePasswordChange,
      error: passwordError,
    } = useInput("", validatePassword);
    const {
      value: name,
      handleValueChange: handleNameChange,
      error: nameError,
    } = useInput("", validateName);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // 이메일 검증
      if (emailError) {
        alert(emailError);
        return;
      }

      // 비밀번호 검증
      if (passwordError) {
        alert(passwordError);
        return;
      }

      // 이름 검증
      if (nameError) {
        alert(nameError);
        return;
      }
      console.log({ email, password, name });
    };

    return (
      <>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          {emaiError && <p>{emaiError}</p>}
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {passwordError && <p>{passwordError}</p>}
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={handleNameChange}
            required
          />
          {nameError && <p>{nameError}</p>}
          <button type="submit">제출</button>
        </form>
      </>
    );
  }
  ```
