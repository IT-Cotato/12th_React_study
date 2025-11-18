### **01. 할 일 관리 앱 만들기 준비**

**1) 프로젝트 생성**

```bash
npm create vite@latest .
```

**2) index.html → App.tsx 옮기기**

- App.tsx를 rfc 초기화 후, index.html 파일에 있는 body 태그 내 내용을 <></> 태그 안으로 붙여넣기
- ctrl + shift + L 단축키를 통해 class → className / checked → defaultChecked / 카멜케이스 등으로 변경
- 주석 처리 다시 진행

**3) font 적용시키기**

- 기존 index.html 내 폰트 링크 복사하기
- 새 index.html의 head 태그 안에 붙여넣기

---

### **02.컴포넌트 분리하기**

**1) svg 분리 (components/svg)**

(1) SvgPencil.tsx

```tsx
export default function SvgPencil() {
  return (
    <>
      <svg
        width="23"
        height="23"
        viewBox="0 0 23 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.45 7.04937L15.9505 10.55L8.34938 18.1514L5.22844 18.4959C4.81064 18.5421 4.45764 18.1888 4.50412 17.771L4.85138 14.6478L12.45 7.04937ZM18.1155 6.52819L16.4719 4.88453C15.9592 4.37182 15.1277 4.37182 14.615 4.88453L13.0688 6.43084L16.5692 9.93145L18.1155 8.38513C18.6282 7.87215 18.6282 7.04089 18.1155 6.52819Z"
          fill="#4F4F4F"
        />
      </svg>
    </>
  );
}
```

(2) SvgClose.tsx

```tsx
export default function SvgClose() {
  return (
    <>
      <svg
        width="15"
        height="16"
        viewBox="0 0 15 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.50002 9.81827L12.9548 15.2731L14.7731 13.4548L9.31829 8L14.7731 2.54518L12.9548 0.726901L7.50002 6.18173L2.04519 0.726902L0.226918 2.54518L5.68174 8L0.226919 13.4548L2.04519 15.2731L7.50002 9.81827ZM7.50002 9.81827L9.31829 8L7.50002 6.18173L5.68174 8L7.50002 9.81827Z"
          fill="#4F4F4F"
        />
        <path
          d="M7.50002 9.81827L9.31829 8L7.50002 6.18173L5.68174 8L7.50002 9.81827Z"
          fill="#4F4F4F"
        />
      </svg>
    </>
  );
}
```

---

**2) Button 분리 (components/html)**

(1) Button.tsx

- 버튼 최대 효율성 → 타입 범용적이게 지정
- WithoutRef : ref 속성을 사용하지 않는 조건에서 버튼 태그 사용할 수 있는 타입을 일괄적으로 지정할 수 있는 react 타입

```tsx
type ButtonProps = React.ComponentPropsWithoutRef<"button">;

export default function Button(props: ButtonProps) {
  const { children, ...rest } = props;
  return (
    <>
      <button {...rest}>{children}</button>
    </>
  );
}
```

(2) Input.tsx

- 버튼 최대 효율성 → 타입 범용적이게 지정
- Input : 타입 속성의 값에 따라 여러가지 값 올 수 있음
- But, 우리는 체크박스, 라디오 버튼 제외 원함 (한 줄 입력 요소만)→ ReactInputType 中 InputHTMLAttribute 지정
- Exclude → ReactInputTyped에서 라디오, 체크박스만 제거한 상태로 타입 생성

```tsx
type ReactInputType = React.InputHTMLAttributes<HTMLInputElement>["type"];
type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
  type?: Exclude<ReactInputType, "radio" | "checkbox">;
};
export default function Input(props: InputProps) {
  const { ...rest } = props;
  return (
    <>
      <input {...rest} />
    </>
  );
}
```

---

**3) Checkbox 분리 (components/html)**

- Checkbox를 커스터마이징 했기 때문에 별도의 컴포넌트로 분리
- 만약 커스터마이징 아니라면, Input 컴포넌트로 처리 가능

(1) Checkbox.tsx

- 타입을 Checkbox만 오거나 오지 않도록 설정

```tsx
type CheckboxProps = Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
  type?: "checkbox";
  parentClassName: string;
};
export default function Checkbox(props: CheckboxProps) {
  const { parentClassName, children, ...rest } = props;
  return (
    <>
      <div className={parentClassName}>
        <input {...rest} />
        <label>{children}</label>
      </div>
    </>
  );
}
```

---

**4) 그 외 컴포넌트 분리**

(1) Header 영역 분리 : components/TodoHeader.tsx

```tsx
export default function TodoHeader() {
  return (
    <>
      <h1 className="todo__title">Todo List</h1>
      <p className="todo__subtitle">Please enter your details to continue.</p>
    </>
  );
}
```

(2) 할 일 리스트 편집 : TodoEditor.tsx

```tsx
import Button from "./html/Button";
import Input from "./html/Input";

export default function TodoEditor() {
  return (
    <>
      <form className="todo__form">
        <div className="todo__editor">
          <Input
            type="text"
            className="todo__input"
            placeholder="Enter Todo List"
          />
          <Button className="todo__button" type="submit">
            Add
          </Button>
        </div>
      </form>
    </>
  );
}
```

(3) 할 일 목록 처리 : TodoList.tsx

```tsx
import TodoListEmpty from "./TodoListEmpty";
import TodoListItem from "./TodoListItem";

export default function TodoList() {
  return (
    <>
      <ul className="todo__list">
        {/* 할 일 목록이 없을 때  */}
        <TodoListEmpty />
        {/* 할 일 목록이 있을 때 */}
        <TodoListItem />
      </ul>
    </>
  );
}
```

(4) Todo.tsx

```tsx
import TodoEditor from "./TodoEditor";
import TodoHeader from "./TodoHeader";
import TodoList from "./TodoList";

export default function Todo() {
  return (
    <>
      <div className="todo">
        <TodoHeader />
        {/* 할 일 등록  */}
        <TodoEditor />
        {/* 할 일 목록  */}
        <TodoList />
      </div>
    </>
  );
}
```

(5) TodoListItem.tsx

```tsx
import Button from "./html/Button";
import Checkbox from "./html/Checkbox";
import SvgClose from "./svg/SvgClose";
import SvgPencil from "./svg/SvgPencil";

export default function TodoListItem() {
  return (
    <>
      {/* 할 일이 완료되면 .todo__item--complete 추가 */}
      <li className="todo__item todo__item--complete">
        <Checkbox
          parentClassName="todo__checkbox-group"
          type="checkbox"
          className="todo__checkbox"
        >
          Eat Breakfast
        </Checkbox>
        {/* 할 일을 수정할 때만 노출 (.todo__checkbox-group은 비노출)  */}
        {/* <input type="text" className="todo__modify-input" />  */}
        <div className="todo__button-group">
          <Button className="todo__action-button">
            <SvgPencil />
          </Button>
          <Button className="todo__action-button">
            <SvgClose />
          </Button>
        </div>
      </li>
    </>
  );
}
```

(6) TodoListEmpty.tsx

```tsx
export default function TodoListEmpty() {
  return (
    <>
      <li className="todo__item todo__item--empty">
        <p className="todo__text--empty">There are no registered tasks</p>
      </li>
    </>
  );
}
```

(7) 정리된 App.tsx

```tsx
import Todo from "./components/Todo";

export default function App() {
  return (
    <>
      <Todo />
    </>
  );
}
```

(+) 현재까지 구현 현황

![](https://blog.kakaocdn.net/dna/CB5FU/dJMcaioaPtD/AAAAAAAAAAAAAAAAAAAAALs6lkNdA_E-_4kWQxzuRf7htzkC279QkzZ6cM37cuUj/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=MCMcKm5C6xCQqPyd5jtvm%2FO1Asw%3D)

---

### **03. 할 일 등록 기능 구현하기**

- TodoEditor : 입력 요소 상태 제어 / Todo : 전체적인 할 일 관리
- TodoEditor 컴포넌트에서 상태 정의 및 관리 진행 → 리렌더링이 TodoEditor 내에서만 일어남 → 다른 컴포넌트 영향 X

(1) TodoEditor.tsx

- submit 이벤트 활용 : input에 엔터키 이벤트 따로 걸지 않아도 이벤트 발생되는 HTML적 특성

```tsx
import { useState } from "react";
import Button from "./html/Button";
import Input from "./html/Input";

export default function TodoEditor({
  addTodo,
}: {
  addTodo: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() === "") return;
    addTodo(text);
    setText("");
  };
  return (
    <>
      <form className="todo__form" onSubmit={handleSubmit}>
        <div className="todo__editor">
          <Input
            type="text"
            className="todo__input"
            placeholder="Enter Todo List"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button className="todo__button" type="submit">
            Add
          </Button>
        </div>
      </form>
    </>
  );
}
```

(2) Todo.tsx

```tsx
import { useState } from "react";
import TodoEditor from "./TodoEditor";
import TodoHeader from "./TodoHeader";
import TodoList from "./TodoList";

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const addTodo = (text: string) => {
    setTodos((todos) => [
      ...todos,
      {
        id: Date.now(),
        text,
        completed: false,
      },
    ]);
  };
  return (
    <>
      <div className="todo">
        <TodoHeader />
        {/* 할 일 등록  */}
        <TodoEditor addTodo={addTodo} />
        {/* 할 일 목록  */}
        <TodoList />
      </div>
    </>
  );
}
```

(3) src/types/todo.d.ts

- 인터페이스는 별도의 타입 파일에 빼서 관리

```tsx
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
```

---

### **04. 할 일 목록 렌더링 기능 구현하기**

(1) TodoEditor.tsx

```tsx
import { useState } from "react";
import Button from "./html/Button";
import Input from "./html/Input";

export default function TodoEditor({
  addTodo,
}: {
  addTodo: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() === "") return;
    addTodo(text);
    setText("");
  };
  return (
    <>
      <form className="todo__form" onSubmit={handleSubmit}>
        <div className="todo__editor">
          <Input
            type="text"
            className="todo__input"
            placeholder="Enter Todo List"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button className="todo__button" type="submit">
            Add
          </Button>
        </div>
      </form>
    </>
  );
}
```

(2) Todo.tsx

```tsx
import { useState } from "react";
import TodoEditor from "./TodoEditor";
import TodoHeader from "./TodoHeader";
import TodoList from "./TodoList";

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const addTodo = (text: string) => {
    setTodos((todos) => [
      ...todos,
      {
        id: Date.now(),
        text,
        completed: false,
      },
    ]);
  };
  return (
    <>
      <div className="todo">
        <TodoHeader />
        {/* 할 일 등록  */}
        <TodoEditor addTodo={addTodo} />
        {/* 할 일 목록  */}
        <TodoList todos={todos} />
      </div>
    </>
  );
}
```

---

### **05. 할 일 완료 및 삭제 기능 구현하기**

(1) TodoList.tsx

```tsx
import TodoListEmpty from "./TodoListEmpty";
import TodoListItem from "./TodoListItem";

export default function TodoList({
  todos,
  toggleTodo,
  deleteTodo,
}: {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}) {
  return (
    <>
      <ul className="todo__list">
        {/* 할 일 목록이 없을 때  */}
        {todos.length === 0 && <TodoListEmpty />}
        {/* 할 일 목록이 있을 때 */}
        {todos.map((todo) => (
          <TodoListItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </>
  );
}
```

(2) Todo.tsx

```tsx
import { useState } from "react";
import TodoEditor from "./TodoEditor";
import TodoHeader from "./TodoHeader";
import TodoList from "./TodoList";

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const addTodo = (text: string) => {
    setTodos((todos) => [
      ...todos,
      {
        id: Date.now(),
        text,
        completed: false,
      },
    ]);
  };
  const toggleTodo = (id: number) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  const deleteTodo = (id: number) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  };
  return (
    <>
      <div className="todo">
        <TodoHeader />
        {/* 할 일 등록  */}
        <TodoEditor addTodo={addTodo} />
        {/* 할 일 목록  */}
        <TodoList
          todos={todos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </>
  );
}
```

(3) TodoListItem.tsx

```tsx
import Button from "./html/Button";
import Checkbox from "./html/Checkbox";
import SvgClose from "./svg/SvgClose";
import SvgPencil from "./svg/SvgPencil";

export default function TodoListItem({
  todo,
  toggleTodo,
  deleteTodo,
}: {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}) {
  return (
    <>
      {/* 할 일이 완료되면 .todo__item--complete 추가 */}
      <li className={`todo__item ${todo.completed && "todo__item--complete"}`}>
        {/* <Checkbox
          parentClassName="todo__checkbox-group"
          type="checkbox"
          className="todo__checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        >
          {todo.text}
        </Checkbox> */}
        {/* 할 일을 수정할 때만 노출 (.todo__checkbox-group은 비노출)  */}
        {/* <input type="text" className="todo__modify-input" />  */}
        <div className="todo__button-group">
          <Button className="todo__action-button">
            <SvgPencil />
          </Button>
          <Button
            className="todo__action-button"
            onClick={() => deleteTodo(todo.id)}
          >
            <SvgClose />
          </Button>
        </div>
      </li>
    </>
  );
}
```

---

### **05. 할 일 완료 및 삭제 기능 구현하기**

(1) TodoListItem.tsx

```tsx
import { useState } from "react";
import Button from "./html/Button";
import Checkbox from "./html/Checkbox";
import SvgClose from "./svg/SvgClose";
import SvgPencil from "./svg/SvgPencil";

export default function TodoListItem({
  todo,
  toggleTodo,
  deleteTodo,
  modifyTodo,
}: {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  modifyTodo: (id: number, text: string) => void;
}) {
  const [isModify, setIsModify] = useState(false);
  const [modifyText, setModifyText] = useState("");
  const modifyHandler = () => {
    setIsModify((isModify) => !isModify);
    setModifyText((modifyText) => (modifyText === "" ? todo.text : modifyText));
    if (modifyText.trim() !== "" && todo.text !== modifyText) {
      modifyTodo(todo.id, modifyText);
    }
  };
  return (
    <>
      {/* 할 일이 완료되면 .todo__item--complete 추가 */}
      <li className={`todo__item ${todo.completed && "todo__item--complete"}`}>
        {!isModify && (
          <Checkbox
            parentClassName="todo__checkbox-group"
            type="checkbox"
            className="todo__checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          >
            {todo.text}
          </Checkbox>
        )}
        {/* 할 일을 수정할 때만 노출 (.todo__checkbox-group은 비노출)  */}
        {isModify && (
          <Input
            type="text"
            className="todo__modify-input"
            value={modifyText}
            onChange={(e) => setModifyText(e.target.value)}
          />
        )}
        <div className="todo__button-group">
          <Button className="todo__action-button" onClick={modifyHandler}>
            <SvgPencil />
          </Button>
          <Button
            className="todo__action-button"
            onClick={() => deleteTodo(todo.id)}
          >
            <SvgClose />
          </Button>
        </div>
      </li>
    </>
  );
}
```

(2) TodoList.tsx

```tsx
import TodoListEmpty from "./TodoListEmpty";
import TodoListItem from "./TodoListItem";

export default function TodoList({
  todos,
  toggleTodo,
  deleteTodo,
  modifyTodo,
}: {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  modifyTodo: (id: number, text: string) => void;
}) {
  return (
    <>
      <ul className="todo__list">
        {/* 할 일 목록이 없을 때  */}
        {todos.length === 0 && <TodoListEmpty />}
        {/* 할 일 목록이 있을 때 */}
        {todos.map((todo) => (
          <TodoListItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            modifyTodo={modifyTodo}
          />
        ))}
      </ul>
    </>
  );
}
```

(3) Todo.tsx

```tsx
import { useState } from "react";
import TodoEditor from "./TodoEditor";
import TodoHeader from "./TodoHeader";
import TodoList from "./TodoList";

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const addTodo = (text: string) => {
    setTodos((todos) => [
      ...todos,
      {
        id: Date.now(),
        text,
        completed: false,
      },
    ]);
  };
  const toggleTodo = (id: number) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  const deleteTodo = (id: number) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  };
  const modifyTodo = (id: number, text: string) => {
    setTodos((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
  };
  return (
    <>
      <div className="todo">
        <TodoHeader />
        {/* 할 일 등록  */}
        <TodoEditor addTodo={addTodo} />
        {/* 할 일 목록  */}
        <TodoList
          todos={todos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          modifyTodo={modifyTodo}
        />
      </div>
    </>
  );
}
```

(+) 실행 결과물

![](https://blog.kakaocdn.net/dna/rVlzX/dJMcaa4KvdR/AAAAAAAAAAAAAAAAAAAAAAAc5lX35VBfT0VcuiP08WwfWmgheOlpkJ6aPZC1KksI/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1764514799&allow_ip=&allow_referer=&signature=2M93S833s4x%2FzsF0KQZFkdC0TTM%3D)
