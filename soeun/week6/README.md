6주차 리액트

# 섹션 11. 할 일 관리 앱

## 세팅

### 프로젝트 생성

```bash
npm create vite@latest
	React
	TypeScript
npm run dev
```

### 11-01 코드 옮기기

\*JSX와 HTML 문법 차이 유의

```tsx
주석
	<--! -->
	{/* */}

camelCase
	fill-rule
	fillRule
	default-checked
	defaultChecked
```

## 컴포넌트 분리

- SvgPencil.tsx 분리
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
        ;
      </>
    );
  }
  ```
- SvgClose.tsx
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
        ;
      </>
    );
  }
  ```
- **Button.tsx**
  ```tsx
  //범용 타입 지정
  //ref 속성을 사용하지 않는 조건에서의 버튼 태그에서 사용할 수 있는 타입을 일괄적으로 지정할 수 있는 react 타입
  type ButtonProps = React.ComponentPropsWithoutRef<"button">;

  export default function Button(props: ButtonProps) {
    //구조분해 할당
    const { children, ...rest } = props;
    return (
      <>
        <button {...rest}>{children}</button>
      </>
    );
  }
  ```
- **Input.tsx**
  ```tsx
  //input 타임으로 라디오와 체크박스는 올 수 없도록
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
- Checkbox.tsx
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
- 그 외 `TodoHeader.tsx`, `TodoEditer.tsx` `TodoList.tsx` 등 컴포넌트 분리
- Todo.tsx
  ```tsx
  import TodoEditer from "./TodoEditer";
  import TodoHeader from "./TodoHeader";
  import TodoList from "./TodoList";

  export default function Todo() {
    return (
      <>
        <div className="todo">
          <TodoHeader />
          {/*할 일 등록 */}
          <TodoEditer />
          {/* 할 일 목록*/}
          <TodoList />
        </div>
      </>
    );
  }
  ```
- `TodoListItem`과 `TodoListEmpty` 컴포넌트도 분리

## 기능 구현

### 할 일 등록 기능 구현

제어 컴포넌트 방식

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

### 할 일 목록 렌더링 기능 구현

등록된 객체가 포함된 배열을 매개변수로 받아 조건부 렌더링

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

### 할 일 완료 및 삭제 기능 구현

`toggleTodo`와 `deleteTodo` 함수 만들기

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
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}) {
  return (
    <>
      {/* 할 일이 완료되면 .todo__item--complete 추가 */}
      <li className={`todo__item ${todo.completed && "todo__item--complete"}`}>
        <Checkbox
          parentClassName="todo__checkbox-group"
          type="checkbox"
          className="todo__checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        >
          {todo.text}
        </Checkbox>
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

### 할 일 수정 기능 구현

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
        <Checkbox
          parentClassName="todo__checkbox-group"
          type="checkbox"
          className="todo__checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        >
          {todo.text}
        </Checkbox>
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

![image.png](attachment:d6e76154-6e5a-45b2-a58e-4835a8867747:image.png)
