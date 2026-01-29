# 섹션 14. 전역상태관리 - Redux Toolkit

## 1. Redux Toolkit(RTK) 시작하기

- Redux의 복잡한 설정과 보일러 플레이트 코드를 줄이기 위해 만들어진 Redux의 상위 래퍼 라이브러리
- React에서는 Redux 라이브러리를 많이 사용했지만 사용이 어려워 더 쉽게 개선한 것이 Redux Toolkit

### 설치

```tsx
npm install @reduxjs/toolkit react-redux
```

### Redux Stor**e 생성**

**Redux Store**

- RTK에서 애플리케이션의 상태를 저장하고 관리하는 중앙 저장소 역할

```tsx
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
```

### React로 제공

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
```

## 2. Redux Slice

### 슬라이스 생성

- RTK에서 상태, 액션 생성자, 리듀서를 한 파일에서 효율적으로 관리할 수 있게 해주는 개념
- RTK에서는 하나의 스토어에 여러 개의 슬라이스를 결합하여 사용

```tsx
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counterSlice",
  initialState: {
    count: 0,
  },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count += 1;
    },
    reset: (state) => {
      state.count = 0;
    },
  },
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
```

- `createSlice`로 슬라이스 객체 생성
- 필수적으로 사용해야 하는 속성 `name`, `initialState`, `reducers`가 있음
  - `name`: 슬라이스 객체를 구별하기 위한 유니크한 이름
  - `initialState`:
    - 슬라이스 파일에서 공유할 상태값
    - 숫자, 문자, 논리형, 배열 ,객체 등의 다양한 값 할당이 가능하지만 일반적으로 객체로 할당
  - `reducers`:
    - 상태값을 변환할 때 사용할 수 있는 메서드 지정
    - 메서드의 함수 값의 매개변수 값으로 stater값을 전달 받음

### 리듀서 속성으로 제공

- 작성한 슬라이스 파일은 스토어에 리듀서 속성으로 제공해야 함

```tsx
import { configureStore } from "@reduxjs/toolkit";
**import counterSlice from "./features/counter/counterSlice";**
export const store = configureStore({
  reducer: {
    **counter: counterSlice,**
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
```

### 활용

```tsx
import { useSelector } from "react-redux";
**import { RootState } from "../store/store";**

export default function CountOutside() {
  const count = useSelector((state: RootState) => state.counter.count);
  return (
    <>
      <h1>CountOutside: {count}</h1>
    </>
  );
}
```

- `useSelector` 커스텀 훅을 통해 상태값 가져오기
  - 내부적으로 state 값을 제공하는데 RootState 타입을 사용하면 스토어 파일에 있는 RootState가 가져와짐
- `RootState`는 `store.ts`에서 가져오는 것 유의
  - Redux Store에서 제공하고 있는 슬라이스에 해당하는 타입을 자동으로 추론해줌

```tsx
import { useDispatch } from "react-redux";

export default function CountButton() {
  const dispatch = useDispatch();
  return (
    <>
      <button onClick={() => dispatch({ type: "counterSlice/decrement" })}>
        감소
      </button>
      <button onClick={() => dispatch({ type: "counterSlice/reset" })}>
        리셋
      </button>
      <button onClick={() => dispatch({ type: "counterSlice/increment" })}>
        증가
      </button>
    </>
  );
}
```

- `useDispatch` 커스텀 훅을 통해 함수를 가져옴
- `슬라이스이름/함수` 형태로 가져오기
- import를 통해 아래와 같이 간략하게 나타낼 수도 있음
  ```tsx
  import { useDispatch } from "react-redux";
  import {
    decrement,
    increment,
    reset,
  } from "../store/features/counter/counterSlice";

  export default function CountButton() {
    const dispatch = useDispatch();
    return (
      <>
        <button onClick={() => dispatch(decrement())}>감소</button>
        <button onClick={() => dispatch(reset())}>리셋</button>
        <button onClick={() => dispatch(increment())}>증가</button>
      </>
    );
  }
  ```

## 3. Redux 추가

### 리렌더링 최적화

- RTX로 작업한 애플리케이션 코드는 Context API와 다르게 불필요한 리렌더링이 발생하지 않음
- RTX 자체적으로 최적화를 하기 때문
- 가져오고 싶은 상태값을 `state.counter.count`와 같이 정확하게 참조해서 가져오는 것이 중요함
  ```tsx
  const { count, num } = useSelector((state: RootState) => state.counter);
  ```

  - 위와 같이 슬라이스의 참조값만 작성하고 비구조화 할당해서 가져올 수도 있지만
  - 이 경우 RTX에서 제공하는 리렌더링에 대한 최적화가 불가해짐
    ⇒ 불필요한 리렌더링이 발생하게 됨

### 외부에서 매개변수 전달하기

```tsx
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counterSlice",
  initialState: {
    count: 0,
  },
  reducers: {
    increment: (state, **action:PayloadAction<number>**) => {
      state.count += **action.payload**;
    },
    //여러 개 객체로 전달받기
    decrement: (
	    state,
	    **action: PayloadAction<{num1: number; num2:number}>**
	  ) => {
      state.count += **action.payload.num1**;;
    },
    reset: (state) => {
      state.count = 0;
    },
  },
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
```

- 외부에서 매개변수를 받으려면 `reducers`의 메서드의 두 번째 매개변수를 활용
- action이라는 식별자 이름으로 내부에 정의되어 있는 타입인 PayloadAction을 가져오고, generic으로 외부에서 받을 매개변수의 타입을 `<number>`와 같이 작성
- payload에 외부에서 전달한 매개변수의 값이 할당되는 원리
- `action.paylod`를 메서드 내에서 참조하면 외부에서 전달한 값을 받아 메서드 내부에서 활용 가능
- 한 개의 값만 전달할 수 있음
- 여러 개의 값을 전달하려면 객체 형태로 데이터를 묶어야 함

### Redux DevTools

- 크롬을 사용하는 경우 Redux DevTools를 활용할 수 있음
- Redux 상태를 쉽게 디버깅 할 수 있도록 기능을 제공해주는 개발자 도구
- 크롬 웹스토어에서 설치할 수 있음
- 어떤 함수에 의해 상태값이 변경 되었는지 콘솔에서 확인할 수 있음
  - 해당 값이 실행된 상태로 돌아갈 수 있음
  - 해당 값이 실행된 코드를 스킵할 수도 있음
- 그 외 다양한 단축 버튼 제공

### Redux Thunk

- 비동기적으로 상태를 변경하고 싶을 때 `createAsyncThunk` 함수를 사용
- 비동기적으로 작업을 정의하고 결과에 따라 상태를 갱신하는 Reducer를 별도로 작성할 수 있음

```tsx
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counterSlice",
  initialState: {
    count: 0,
  },
  reducers: {
    increment: (
      state,
      action: PayloadAction<{ num1: number; num2: number }>,
    ) => {
      state.count += action.payload.num1;
    },
    decrement: (state) => {
      state.count += 1;
    },
    reset: (state) => {
      state.count = 0;
    },
  },
  **extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, () => {
        console.log("pending");
      })
      .addCase(
        incrementAsync.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.count += action.payload;
        },
      )
      .addCase(incrementAsync.rejected, () => {
        console.log("rejected");
      });
  },**
});

export **const incrementAsync = createAsyncThunk(
  "counterSlice/incrementAsync",
  async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return amount;
  },
);**

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
```

- `createAsyncThunk` 함수에 두 가지 매개변수 전달
  - 해당 Redux 함수의 고유한 이름
    - 관례적으로 슬라이스에 지정된 name과 변수명을 조합해 지정
  - 비동기 로직이 담긴 함수
    - async await 방식으로 작성
- `createAsyncThunk` 함수를 `extraReducers` 속성에 등록
  - 내부적으로 `builder`라는 객체를 제공
  - `builder`: `addCase` 메서드를 통해 비동기 리듀서 함수의 각 상태(Pending, Fulfilled, Rejejcted)에 따른 Reducer 함수를 등록하는 객체

**사용**

```tsx
import { useDispatch } from "react-redux";
import {
  decrement,
  increment,
  incrementAsync,
  reset,
} from "../store/features/counter/counterSlice";
import { AppDispatch } from "../store/store";

export default function CountButton() {
  const dispatch = useDispatch**<AppDispatch>**();
  return (
    <>
      <button onClick={() => dispatch(decrement())}>감소</button>
      <button onClick={() => dispatch(reset())}>리셋</button>
      <button onClick={() => dispatch(**incrementAsync(10)**)}>증가</button>
    </>
  );
}
```

- `incrementAsync` 함수를 import해서 사용
- extraReducer 사용 시에는 `<AppDispatch>` 타입을 사용해야 함

### 슬라이스 추가

- 새로운 슬라이스 파일을 만들고 스토어에 추가

```tsx
import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/counter/counterSlice";
**import themeSlice from "./features/theme/themeSlice";**
export const store = configureStore({
  reducer: {
    counter: counterSlice,
    **theme: themeSlice,**
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
```

- 사용 방식은 동일
  ```tsx
  import { useSelector } from "react-redux";
  import { RootState } from "../store/store";

  export default function Theme() {
    const theme = useSelector((state: RootState) => state.theme.theme);
    return (
      <>
        <h1>Theme:{theme} </h1>
      </>
    );
  }
  ```
  ```tsx
  import { useDispatch } from "react-redux";
  import { changeTheme } from "../store/features/theme/themeSlice";

  export default function ThemeButton() {
    const dispatch = useDispatch();
    return (
      <>
        <button onClick={() => dispatch(changeTheme())}>ThemeButton</button>
      </>
    );
  }
  ```

  - Context API와 동일하게 서로의 상태 값에 영향을 주지 않음

## 4. 실습

### UserProfile

```tsx
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const settingSlice = createSlice({
  name: "settingSlice",
  initialState: {
    language: "ko",
    fontSize: "medium",
    notifications: {
      email: false,
      push: false,
      desktop: false,
    },
    colorScheme: "system",
  },
  reducers: {
    updateLanguage: (
      state,
      action: PayloadAction<UserPreferences["language"]>,
    ) => {
      state.language = action.payload;
    },
    updateFontSize: (
      state,
      action: PayloadAction<UserPreferences["fontSize"]>,
    ) => {
      state.fontSize = action.payload;
    },
    updateNotifications: (
      state,
      action: PayloadAction<{
        key: keyof UserPreferences["notifications"];
        value: boolean;
      }>,
    ) => {
      state.notifications[action.payload.key] = action.payload.value;
    },
    updateColorScheme: (
      state,
      action: PayloadAction<UserPreferences["colorScheme"]>,
    ) => {
      state.colorScheme = action.payload;
    },
  },
});

export const {
  updateColorScheme,
  updateFontSize,
  updateLanguage,
  updateNotifications,
} = settingSlice.actions;
export default settingSlice.reducer;
```
