### Redux Toolkit이란?

Redux의 복잡한 설정과 보일러 플레이트 코드를 줄이기 위해 만들어진 Redux의 상위 래퍼 라이브러리

react는 원래 redux 라이브러리를 많이 사용했는데 사용하기가 어렵고 난해해서 사용하기 쉽게 개선된게 redux toolkit

![image.png](attachment:e9cf1d46-a236-4abe-885b-07c18d5de92c:image.png)

redux toolkit은 하나의 스토어에 여러개의 슬라이스를 결합해서 사용

슬라이스: redux toolkit에서 상태, 액션 생성자, 리듀서를 한 파일에서 효율적으로 관리할 수 있게 해주는 개념

### Redux Slice 생성

```tsx
//src/store/features/counter

import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  //slice 객체 만드는 함수
  name: "counterSlice",
  initialState: {
    count: 0,
  },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    reset: (state) => {
      state.count = 0;
    },
  },
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
```

createSlice 함수는 객체를 매개변수로 전달 받는데 이 객체는 필수적으로 사용해야하는 속성들이 몇가지 있음.

1. Name: 해당 slice 객체를 구별할 수 있는 유니크한 이름, 보통은 파일이름으로
2. Initial State: 이 슬라이스 파일에서 공유할 상태값, 일반적으로 객체로 할당
3. Reducers: 실제 상태값을 변화시킬때 사용할 수 있는 로직이 담겨져 있는 메서드 정의, 각 메서드는 매개변수로 state값(initialState의 state값)

```tsx
//src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/counter/counterSlice";
export const store = configureStore({
  reducer: {
    counter: counterSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

//App.tsx
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

작성한 slice파일은 스토어에 리듀서 속성으로 제공

counter도 카운터 속성값으로 counterSlice 사용하겠다고 적어줘야함

App.tsx에서는 프로바이더를 통해서 현재 스토어가 주입되고 있어서 앱 컴포넌트는 리덕스 스토어에서 제공하는 이러한 슬라이스들에 접근해서 값을 가져와서 활용할 수 있게 됨

```tsx
//src/components/CountOutside.tsx

import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function CountOutside() {
  const count = useSelector((state: RootState) => state.counter.count);
  return (
    <>
      <h1>CountOutside: {count}</h1>
    </>
  );
}
```

이 슬라이스에서 제공하고 있는 카운터라는 상태값을 가져오는 법 > useSelector 커스텀 훅
RootState는 store파일에 있는 rootstate

rootstate는 리덕스 스토어에서 제공하고 있는 슬라이스에 해당하는 타입을 자동으로 추론해서 만들어줌

> Redux 스토어에서 제공하고 있는 카운터라는 속성값에 접근해서 counterSlice값에 카운트 속성의 값을 가져오겠다

```tsx
//src/components/CountButton.tsx

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

useDispatch 커스텀 훅을 사용해서 reducer의 메서드들을 호출할 수 있음

### Redux에서의 리렌더링

redux toolkit은 자체적으로 불필요한 리렌더링이 발생하지 않게 최적화해줌
(따로 메모이제이션 해줄 필요 없음)

그러나 이러한 최적화에 대한 이점을 가져오기 위해서 지켜야하는 한가지의 최소한의 코드 작성 원칙이 있음

> 상태값을 가져올때 아래와 같이 가져오고 싶은 상태값을 정확하게 참조해서 가져와야함

```tsx
const count = useSelector((state: RootState) => state.counter.count);

//이렇게 구조분해할당으로 상태값을 가져오는 방법도 있지만 이러면 리렌더링 최적화 안됨
const { count, num } = useSelector((state: RootState) => state.counter);
```

### Redux 액션에 매개변수 전달하기

```tsx
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counterSlice",
  initialState: {
    count: 0,
  },
  reducers: {
    //매개변수는 reducer의 메서드에서 2번째 매개변수를 활용함
    //보통은 action이라는 식별자 이름으로 받음
    //이렇게 객체 형태로 데이터를 묶어주면 여러 값을 전달하는 것도 가능함
    increment: (
      state,
      action: PayloadAction<{ num1: number; num2: number }>,
    ) => {
      state.count += action.payload.num1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    reset: (state) => {
      state.count = 0;
    },
  },
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
```

action이라는 두번째 매개변수에는 payload라는 속성의 값이 내장되어 있는데 그 payload라는 내장되어있는 속성 값에 외부에서 전달한 매개변수의 값이 할당되는 원리

항상 외부에서 전달되는 별도 값은 payload 속성에 들어가게 됨

### Redux Thunk

redux toolkit에서 비동기적으로 상태를 변경하고 싶을때는 createAsyncThunk 함수를 사용해야 함

이 함수를 통해 비동기적인 작업을 정의하고 그 결과에 따라 상태를 갱신하는 reducer를 별도로 정의할 수 있음

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
      state.count -= 1;
    },
    reset: (state) => {
      state.count = 0;
    },
  },

  //비동기 함수로 만든 별도의 reducer함수는 리듀서 속성에는 등록 불가능
  //extraReducers에 등록해야함
  //extraReducers는 내부적으로 builder라는 객체를 가지고 있음
  //pending,fulfilled,rejected 각 상태일때 실행될 로직 설정
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, () => {
        console.log("incrementAsync pending");
      })
      .addCase(
        incrementAsync.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.count += action.payload;
        },
      )
      .addCase(incrementAsync.rejected, () => {
        console.log("incrementAsync rejected");
      });
  },
});

//비동기 reducer함수 정의
export const incrementAsync = createAsyncThunk(
  "counterSlice/incrementAsync",
  async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    throw new Error("error");
    return amount;
  },
);

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
```

createAsyncThunk는 2개의 매개변수를 받음

1. 해당 redux함수의 고유한 이름
2. 비동기 로직이 담겨져 있는 함수(async await 방식으로 코드 작성)

### ReduxSlice 한개 더

```tsx
//src/store/theme/themeSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "themeSlice",
  initialState: {
    theme: "light",
  },
  reducers: {
    changeTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { changeTheme } = themeSlice.actions;
export default themeSlice.reducer;

//src/components/Theme.tsx
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function Theme() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  return (
    <>
      <h1>Theme : {theme}</h1>
    </>
  );
}
```

이런식으로 새로운 슬라이스를 하나 더 정의하고 스토어에 등록해준 뒤 사용해도 서로가 서로의 값에 영향을 주지 않게 사용 가능함

### UserProfile-1(with redux)

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
    //매개변수 2개니까 객체 형태로 묶어서 전달
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

### UserProfile-2(with redux)

실제로 함수 가져와서 컴포넌트에 적용

```tsx
import { Bell } from "lucide-react";
import { twMerge } from "tailwind-merge";
import useTranslation from "../libs/useTranslation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateNotifications } from "../store/features/setting/settingSlice";

export default function AlarmSetting() {
  //useSelector 커스텀 훅으로 값 가져오기
  const notifications = useSelector(
    (state: RootState) => state.setting.notifications,
  );
  //update 함수는 useDispatch로
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-blue-500" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.notifications.label}
          </h2>
        </div>
        <div className="space-y-4">
          {(
            Object.keys(
              notifications,
            ) as (keyof UserPreferences["notifications"])[]
          ).map((key) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300 capitalize">
                {key === "email"
                  ? t.notifications.email
                  : key === "push"
                    ? t.notifications.push
                    : t.notifications.desktop}
              </span>
              {/* On: bg-blue-500 */}
              {/* Off: bg-gray-300 dark:bg-gray-600 */}
              <button
                className={twMerge(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  notifications[key]
                    ? "bg-blue-500"
                    : " bg-gray-300 dark:bg-gray-600",
                )}
                onClick={() =>
                  dispatch(
                    updateNotifications({ key, value: !notifications[key] }),
                  )
                }
              >
                {/* On: translate-x-6  */}
                {/* Off: translate-x-1 */}
                <span
                  className={twMerge(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1",
                    notifications[key] ? "translate-x-6 " : " translate-x-1",
                  )}
                />
              </button>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
```

### UserProfile-3(with Redux)

contextAPI를 사용했을 때는 useLayoutEffect를 사용해서 preferences의 값이 변하면 각각의 값이 처리되도록 작성함

```tsx
useLayoutEffect(() => {
  localStorage.setItem("preferences", JSON.stringify(preferences));

  document.documentElement.style.fontSize = {
    small: "14px",
    medium: "16px",
    large: "18px",
  }[preferences.fontSize];

  if (preferences.colorScheme === "system") {
    document.documentElement.classList.remove("light", "dark");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("light");
    }
  } else {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(preferences.colorScheme);
  }
}, [preferences]);
```

redux toolkit의 경우 각각의 값을 따로따로 이용하고 있어서 사용하고 있는 쪽으로 가서 useLayoutEffect를 적용해줘야 함

```tsx
//src/components/ThemeSetting.tsx

import { Monitor, Moon, Sun } from "lucide-react";
import { twMerge } from "tailwind-merge";
import useTranslation from "../libs/useTranslation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateColorScheme } from "../store/features/setting/settingSlice";
import { useLayoutEffect } from "react";

export default function ThemeSetting() {
  const colorScheme = useSelector(
    (state: RootState) => state.setting.colorScheme,
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (colorScheme === "system") {
      document.documentElement.classList.remove("light", "dark");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");
      }
    } else {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(colorScheme);
    }
  }, [colorScheme]);
  //기존의 useLayoutEffect를 가져와서 preferences가 아니라 colorScheme에 따라 변경되도록 설정

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Sun className="text-blue-500" size={24} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.theme.label}
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(["system", "light", "dark"] as const).map((scheme) => (
            <button
              key={scheme}
              className={twMerge(
                "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors  ",
                colorScheme === scheme
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600",
              )}
              onClick={() => dispatch(updateColorScheme(scheme))}
            >
              {scheme === "system" ? (
                <>
                  <Monitor size={16} />
                  <span>{t.theme.system}</span>
                </>
              ) : scheme === "light" ? (
                <>
                  <Sun size={16} />
                  <span>{t.theme.light}</span>
                </>
              ) : (
                <>
                  <Moon size={16} />
                  <span>{t.theme.dark}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
```
