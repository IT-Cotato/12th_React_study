### **01. 폼 다루기란?**

**1) 폼**

- 리액트에서 폼은 사용자가 데이터 입력하고 제출할 수 있도록 하는 UI 요소
- 여러 입력 요소 (텍스트 필드, 체크박스, 라디오 버튼, 드롭다운 목록)
- 제어 컴포넌트 방식: 리액트의 상태를 활용해서 폼 요소를 제어하는 방식
- 비제어 컴포넌트 방식: 리액트 상태 사용 X, DOM 자체에서 상태를 관리하는 방식

---

### **02. 제어 컴포넌트**

**1) 한 줄 입력 요소 (components/controlled/ Input.tsx)**

- 사용자가 폼 요소에 어떤 값을 입력했는지 알아내고 그것을 조작하는 것에 초점
- 제어 컴포넌트 방식에서 ‘상태’를 이용하는 이유 → 인풋 요소에 어떤 값이 입력되었는지를 알아내기 위해
- 제어 컴포넌트 방식에 의거해서 입력 요소의 상태를 제어할 수 있음

```jsx
import { useState } from "react";

export default function Input() {
  const [input, setInput] = useState("aaa");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const [pw, setPw] = useState("aaa");
  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
  };

  return (
    <>
      <form>
        <h1>
          Input: {input} / {pw}{" "}
        </h1>
        <input type="text" value={input} onChange={handleInputChange} />
        <input type="password" value={pw} onChange={handlePwChange} />
      </form>
    </>
  );
}
```

- 가독성 측면) 상황에 따라 상태 하나만 정하고, 그 하나의 상태만 가지고 여러 개 입력 요소 제어

```jsx
import { useState } from "react";

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
        <h1>
          Input: {formState.email} / {formState.password}{" "}
        </h1>
        <input
          type="text"
          name="email"
          value={formState.email}
          onChange={handleFormStateChange}
        />

        <input
          type="text"
          name="password"
          value={formState.password}
          onChange={handleFormStateChange}
        />
      </form>
    </>
  );
}
```

---

**2) 체크박스 (components/controlled/Checkbox.tsx)**

- 체크박스 여러개 제어 원할 시, 체크박스 하나 당 각 상태를 만들어줌

```jsx
import { useState } from "react";

export default function Checkbox() {
  const [formState, setFormState] = useState({
    chk1: false,
    chk2: false,
  });
  const handleFormStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((formState) => ({
      ...formState,
      [e.target.name]: e.target.checked,
    }));
  };
  return (
    <div>
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
    </div>
  );
}
```

---

**3) 라디오 (components/controlled/Radio.tsx)**

- 여러개의 선택지 중 하나만 체크하도록

```jsx
import { useState } from "react";

export default function Radio() {
  const [selectedValue, setSelectedValue] = useState("option1");//디폴트 선택const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

- 하나의 상태로 여러 종류의 라디오 버튼을 제어하고 싶다면

```jsx
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

---

**4) 여러 줄 입력 요소**

- 한 줄 입력 요소 : HTMLInput / 여러 줄 입력 요소 : HTMLTextAreaElement 로 타입 지정

```jsx
import { useState } from "react";

export default function Textarea() {
  const [text, setText] = useState("");
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  return (
    <div>
      <textarea value={text} onChange={(e) => handleTextChange(e)} />
      <p>입력된 텍스트:</p>
    </div>
  );
}
```

---

**실습) 유저 정보**

![](https://blog.kakaocdn.net/dna/bgMNaT/dJMcacuFW9K/AAAAAAAAAAAAAAAAAAAAAA6gBdN4JA1YZ2uPfdpfqQgOdYntu39Or7tgwq91DIku/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=LKnwAvhlQNcyv39o1DDFOPy6rqw%3D)

```jsx
import { useState } from "react";

export default function UserInfoForm() {
  const [name, setName] = useState("");
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const [email, setEmail] = useState("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const [gender, setGender] = useState("");
  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value);
  };
  const [skills, setSkills] = useState<string[]>([]);
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkills((skills) =>
      e.target.checked
        ? [...skills, value]
        : skills.filter((skill) => skill != value)
    );
  };
  const [bio, setBio] = useState("");
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("폼 제출:", { name, email, gender, skills, bio });
  };

  return (
    <div className="user-info">
      <h1 className="user-info__title">User Information</h1>
      <form className="user-info__form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-group__label" htmlFor="name">
            이름:
          </label>
          <input
            className="form-group__input"
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
        </div>

        <div className="form-group">
          <label className="form-group__label" htmlFor="email">
            이메일:
          </label>
          <input
            className="form-group__input"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        <div className="form-group form-group--radio">
          <label className="form-group__label">성별:</label>
          <label className="form-group__radio">
            <input
              type="radio"
              id="male"
              value="남성"
              name="gender"
              checked={gender === "남성"}
              onChange={handleGenderChange}
            />
            남성
          </label>
          <label className="form-group__radio">
            <input
              type="radio"
              id="female"
              value="여성"
              name="gender"
              checked={gender === "여성"}
              onChange={handleGenderChange}
            />
            여성
          </label>
        </div>

        <div className="form-group form-group--checkbox">
          <label className="form-group__label">기술 관심:</label>
          <label className="form-group__checkbox">
            <input
              type="checkbox"
              value="JavaScript"
              checked={skills.includes("JavaScript")}
              onChange={handleSkillsChange}
            />
            JavaScript
          </label>
          <label className="form-group__checkbox">
            <input
              type="checkbox"
              value="React"
              checked={skills.includes("React")}
              onChange={handleSkillsChange}
            />
            React
          </label>
          <label className="form-group__checkbox">
            <input
              type="checkbox"
              value="Node.js"
              checked={skills.includes("Node.js")}
              onChange={handleSkillsChange}
            />
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
            placeholder="자기소개를 작성해주세요"
            value={bio}
            onChange={handleBioChange}
          ></textarea>
        </div>

        <button className="user-info__submit" type="submit">
          제출
        </button>
      </form>

      <div className="preview">
        <h2 className="preview__title">실시간 입력값</h2>
        <p className="preview__item">이름: {name} </p>
        <p className="preview__item">이메일: {email}</p>
        <p className="preview__item">성별: {gender} </p>
        <p className="preview__item">기술 관심: {skills.join(", ")} </p>
        <pre>{bio}</pre>
      </div>
    </div>
  );
}
```

---

### **03. 비제어 컴포넌트**

- 리액트 상태를 사용하지 않고 DOM 자체에서 폼 입력 값을 관리하는 방식
- const ref = useRef<Type>(initialState) / 즉, 'useRef'라는 훅을 사용해야 함
- useRef<Type>는 타입 추론에 의해서 generic 타입 부분은 생략 가능
- 비제어 컴포넌트는 상태 사용 X, ref 객체를 사용함
- 제어 컴포넌트와 다르게 실시간으로 사용자가 입력한 값을 가져올 수 X → 상태의 입력값을 별도로 제어하지 않기 때문→ 연결되어 있는 참조 값을 활용해서 ref 객체로 그것을 가져옴

---

**1) 한 줄 입력 요소**

- 제어하려고 하는 입력 요소 하나 당 ref 객체를 하나씩 생성해주는 것이 더 권장된 방법

```jsx
import { useRef } from "react";

export default function Input() {
  const inputRef = useRef < HTMLInputElement > null;
  const pwRef = useRef < HTMLInputElement > null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputRef.current?.value);
    console.log(pwRef.current?.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={inputRef} />
      <input type="password" ref={pwRef} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

**2) 체크박스**

- 비제어 컴포넌트는 실시간이 아니기에 특정 핸들러or 특정 함수 내부에서 해당 요소 체크 여부 확인해야 함

```jsx
import { useRef } from "react";

export default function Checkbox() {
  const privacyRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const fruitsRef = useRef<HTMLInputElement[]>([]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

// 체크박스의 요소 중 무엇을 선택했는지 궁금한 경우const selectedFruits = fruitsRef.current
      .filter((fruit) => fruit.checked)
      .map((fruit) => fruit.value);

    console.log(selectedFruits);

// 체크박스 체크 여부만 알고싶은 경우const privacy = privacyRef.current?.checked;
    if (!privacy) {
      alert("개인정보에 동의해주세요");
      return;
    }

// 경고창 출력을 원하는 경우const terms = termsRef.current?.checked;
    if (!terms) {
      alert("약관동의에 동의해주세요");
      return;
    }
    console.log(privacyRef.current?.checked);
    console.log(termsRef.current?.checked);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="checkbox" ref={privacyRef} />
          <label>개인정보동의</label>
        </div>
        <div>
          <input type="checkbox" ref={termsRef} />
          <label>약관동의</label>
        </div>
        <div>
          <input
            type="checkbox"
            value={"사과"}
            ref={(el) => {
              fruitsRef.current[0] = el!;
            }}
          />
          <label>사과</label>
        </div>
        <div>
          <input
            type="checkbox"
            value={"바나나"}
            ref={(el) => {
              fruitsRef.current[1] = el!;
            }}
          />
          <label>바나나</label>
        </div>
        <div>
          <input
            type="checkbox"
            value="오렌지"
            ref={(el) => {
              fruitsRef.current[2] = el!;
            }}
          />
          <label>오렌지</label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

---

**3) 라디오**

- 비제어 컴포넌트로 제어하기 까다로움
- 이유) 제시되어 있는 값 중 하나만 선택, ref 객체 하나 당 입력 요소 하나 연결 → 10개면 10개에 해당하는 ref 객체 일일이 다 연결
- formData : 사용자가 선택한 값 일괄적으로 가져오기
- defaultChecked : 미리 체크되어져 있도록

```jsx
import { useRef } from "react";

export default function Radio() {
  const formElRef = useRef<HTMLFormElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(formElRef.current!);
    console.log(formData.get("option"))
  };
  return (
    <form ref={formElRef} onSubmit={handleSubmit}>
      <div>
        <label>
          <input type="radio" name="option" value="option1" />
          옵션 1
        </label>
      </div>
      <div>
        <label>
          <input type="radio" name="option" value="option2" defaultChecked />
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

---

**4) 여러 줄 입력 요소**

- 한 줄 입력 요소와 다른점 : 타입을 HTMLTextAreaElement로 작성

```jsx
import { useRef } from "react";

export default function Textarea() {
  const descRef = useRef < HTMLTextAreaElement > null;
  const handleSubmit = (e: RecordingState.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

---

**5) 미션을 활용한 일괄 제어법**

- 단순히 값만 가져온다는 점에서는 form 데이터 객체를 통해 한번에 가져오기 가능
- 비제어 컴포넌트에서는 실시간 핸들링 불가 → 실시간으로 보여주는 영역 제거
- 제약사항
  - 반드시 form이라는 태그로 묶여있어야 함 : form 데이터 객체 생성 및 메서드를 통해 값 가져오기 가능
  - 각각의 입력 요소를 개별적으로 조작 불가능 → 조작 원하면 반드시 별도의 ref 객체 생성 후 특정 요소와 연결

![](https://blog.kakaocdn.net/dna/cf0InM/dJMcajtNJWS/AAAAAAAAAAAAAAAAAAAAADDsL7f-j2pn2JCMLqubrhyLjVDmErMEZ3NdfWEsNSCp/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=jBr%2FW1AmvOeIw8YhLENaOChpqUI%3D)

```jsx
import { useRef } from "react";

export default function UserInfoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const name = formData.get("name");
      const email = formData.get("email");
      const gender = formData.get("gender");
// getAll : 여러 개 가져오기const skills = formData.getAll("skills");
      const bio = formData.get("bio");

// 개별 조작 원하는 경우if(name === "") {
      alert("이름을 입력하세요");
      nameRef.current?.focus();
      return;
      }

      console.log({ name, email, gender, skills, bio });
    }
  };
  return (
    <div className="user-info">
      <h1 className="user-info__title">User Information</h1>
      <form className="user-info__form" ref={formRef} onSubmit={handleSubmit}>
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

---

### **04. 폼 제어 고급**

**1) ref 전달하기**

- ref 객체는 JSX 요소와 참조 관계를 연결할 때 사용할 수 있는 객체
- ref 객체틑 자바스크립트로 따지면 querySelector() 메서드와 역할 동일
- form 요소가 아니어도 div, p, strong 등 모든 JSX 요소의 참조 관계를 형성하여 DOM 조작 가능
- ref 속성을 자식 컴포넌트로 전달할 때, React 18과 React 19에서의 문법이 다름
- **React 18** : **ref 일반적인 props 전달하듯이 전달 불가 → forward ref 사용**

**(1) App.tsx**

```jsx
export default function App() {
  const inputRef = useRef < HTMLInputElement > null;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    inputRef.current?.foucus();
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input ref={inputRef} />
        <button type="submit">제출</button>
      </form>
    </>
  );
}
```

**(2) components/input.tsx**

```jsx
import { RefObject } from "react";

export default function Input({
  ref,
}: {
  ref: RefObject<HTMLInputElement | null>,
}) {
  return (
    <>
      <input type="text" ref={ref} />
    </>
  );
}
```

---

**2) 커스텀 훅**

- 리액트에서 제공하는 훅을 조합하여 나만의 훅을 만드는 것을 의미
- 폼 요소 제어 목적 외에 다양하게 활용 가능

![](https://blog.kakaocdn.net/dna/ch71JL/dJMcahbGrM9/AAAAAAAAAAAAAAAAAAAAANxRB76TX-ai08S2XjCWbJV57ICmIWt12imHNCX6Kujs/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=75Ba31KMzXVRJaS5GJKuQsjdRx4%3D)

**(1) src/hooks/useInput.tsx**

```jsx
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

**(2) App.tsx**

- 상태랑 이벤트 핸들러를 한줄로 해결

```jsx
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

---

### **05. 벨리데이션**

**1) 기본**

- Validation : React에서 Form 요소의 값을 검증하는 것
- 기본 Validation : HTML이 가지는 기본 속성을 가지고 검증하는 것

![](https://blog.kakaocdn.net/dna/b6Z38Q/dJMcahirU2n/AAAAAAAAAAAAAAAAAAAAAMZJyCA9snKUNZsfZIptU1sNG3RzaycpqrQf8URpMrE2/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=4oiUHi0jMNb10Yk3iNMVC%2B21u5E%3D)

- required : 필수 입력
- minLength : 최소 입력
- maxLength : 최대 입력

```jsx
<input
  type="password"
  placeholder="password"
  value={password}
  onChange={handlePasswordChange}
  minLength={4}
  maxLength={6}
  required
/>
```

---

**2) 커스텀**

- 커스텀 Validaion : Validation을 위한 별도의 함수를 정의하는 것
- 원하는대로 코드 핸들링 가능 (원하는대로 에러 처리도 가능)

**(1) Validation을 하는 함수들이 정의 되어져 있는 별도 파일 관리 (src/utils/validation.ts)**

```jsx
export const validateEmail = (email: string) => {
  if (!email) return "이메일은 필수입니다.";
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
    return "유효한 이메일 주소를 입력하세요.";
  if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|naver\.com)$/.test(email)) {
    return "이메일 주소는 gmail.com 또는 naver.com 형식만 허용됩니다.";
  }
};

export const validatePassword = (password: string) => {
  if (!password) return "비밀번호는 필수입니다.";
  if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
  if (!/[A-Za-z]/.test(password))
    return "비밀번호에는 최소한 하나의 영문자가 포함되어야 합니다.";
  if (!/[0-9]/.test(password))
    return "비밀번호에는 최소한 하나의 숫자가 포함되어야 합니다.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "비밀번호에는 최소한 하나의 특수문자가 포함되어야 합니다.";
};

export const validateName = (name: string) => {
  if (!name) return "사용자 이름은 필수입니다.";
  if (name.length < 3 || name.length > 20)
    return "사용자 이름은 3~20자 사이여야 합니다.";
  if (!/^[A-Za-z0-9]+$/.test(name))
    return "사용자 이름은 영문자와 숫자만 포함해야 합니다.";
};
```

---

**3) 커스텀 훅 통합 (useInput.tsx)**

```jsx
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
    error: emailError,
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

// 이메일 검증if (emailError) {
      alert(emailError);
      return;
    }

// 비밀번호 검증if (passwordError) {
      alert(passwordError);
      return;
    }

// 이름 검증if (nameError) {
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
        // 이메일 에러가 있을 때마다 이메일 에러를 내보냄
        {emailError && <p>{emailError}</p>}
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        // 패스워드 에러가 있을 때마다 패스워드 에러를 내보냄
        {passwordError && <p>{passwordError}</p>}
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={handleNameChange}
          required
        />
        // 네임 에러가 있을 때마다 네임 에러를 내보냄
        {nameError && <p>{nameError}</p>}
        <button type="submit">제출</button>
      </form>
    </>
  );
}
```
