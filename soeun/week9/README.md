# 섹션 15. 전역상태관리 - Zustand

## 1. Zustand

### 사용하기

- 전역상태관리 라이브러리 중 하나
- Redux Toolkit이나 Context API보다도 적은 코드와 직관적인 방식으로 상태를 관리할 수 있음
- 패키지 설치
  ```tsx
  npm install zustand
  ```
- store
  - zustand를 활용하여 하나의 상태를 관리할 수 있는 하나의 단위
  ```tsx
  import { create } from "zustand";
  type CountStore = {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
  };
  export const useCountStore = create<CountStore>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
  }));
  ```
  - zustand의 create 함수 사용해서 제작
  - create 함수는 내부적으로 콜백 함수를 전달받아 리턴받는 객체 내용이 하나의 스토어 파일에 정의되는 상태값들이 됨
  - 콜백 함수는 set 과 get 함수를 매개변수로 전달받을 수 있음
    - set은 자신의 스토어 파일의 데이터를 변경할 때 사용하는 상태 변경 함수 역할을 하는 함수가 전달
    - get은 자신의 상태값을 가져오는 역할을하는 함수가 매개변수로 전달

### 매개변수

- zustand는 외부에서 매개변수를 전달받거나 비동기 함수를 사용할 때도 코드 처리가 쉬움
  ```tsx
  import { useCountStore } from "../store/countStore";

  export default function CountButton() {
    console.log("CountButton");
    const increment = useCountStore((state) => state.increment);
    const decrement = useCountStore((state) => state.decrement);
    const reset = useCountStore((state) => state.reset);
    return (
      <>
        <button onClick={decrement}>감소</button>
        <button onClick={reset}>리셋</button>
        <button onClick={() => **increment(5, 10)**}>증가</button>
      </>
    );
  }
  ```
  ```tsx
  import { create } from "zustand";
  type CountStore = {
    count: number;
    increment: (amount: number, amount2: number) => void;
    decrement: () => void;
    reset: () => void;
  };
  export const useCountStore = create<CountStore>((set) => ({
    count: 0,
    **increment: async (amount: number, amount2: number) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => ({ count: state.count + amount + amount2 }));
    },**
    decrement: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
  }));

  ```
  - 매개변수를 2개 전달할 수도 있음

### persist

- zustand도 상태이기 때문에 새로고침하면 값이 유지되지 않음
- 유지되기 위해서는 로컬 스토리지나 세션 스토리지 등을 활용해야 함
- 다른 전역상태관리 라이브러리와 다르게 zustand는 미들웨어에서 해당 작업을 대신 처리

⇒ persist 미들웨어

```tsx
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type CountStore = {
  count: number;
  increment: (amount: number, amount2: number) => void;
  decrement: () => void;
  reset: () => void;
};
export const useCountStore = create<CountStore>()(
  **persist(
    (set) => ({
      count: 0,
      increment: (amount: number, amount2: number) => {
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        set((state) => ({ count: state.count + amount + amount2 }));
      },
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: "count-storage",
      storage: createJSONStorage(() => sessionStorage), // 세션스토리지
    }
  )**
);
```

- 콜백 함수를 persist라는 미들웨어로 감싸고 두 번째 매개변수로 콤마를 찍어 스토리에 저장될 키값 작성
- 상태값이 로컬 스토리지에 잘 저장이 되게 됨
- 세션 스토리지를 사용하고 싶은 경우 storage 옵션 속성 작성

### subscribeWithSelector

- 유용한 또 다른 미들웨어
- 특정 상태가 변경될 때를 감지해서 특정 로직을 수행할 수 있는 구독 기능을 사용할 수 있게 해줌
  ```tsx
  import { create } from "zustand";
  import {
    createJSONStorage,
    persist,
    **subscribeWithSelector,**
  } from "zustand/middleware";
  type CountStore = {
    count: number;
    increment: (amount: number, amount2: number) => void;
    decrement: () => void;
    reset: () => void;
  };
  export const useCountStore = create(
    **subscribeWithSelector(**
      persist<CountStore>(
        (set) => ({
          count: 0,
          increment: (amount: number, amount2: number) => {
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            set((state) => ({ count: state.count + amount + amount2 }));
          },
          decrement: () => set((state) => ({ count: state.count - 1 })),
          reset: () => set({ count: 0 }),
        }),
        {
          name: "count-storage",
          storage: createJSONStorage(() => sessionStorage),
        }
      )
    )
  );
  ```
  - 전체 부분을 감싸서 작성
  - 미들웨어가 적용되면 해당 스토어에 상태를 구독해 변경사항을 감지할 때마다 특정 로직을 수행하도록 할 수 있음

### immer

- 불변성 유지를 위해 새로운 객체를 반환하는 방식으로 매번 코드를 작성하면 코드가 복잡하고 가독성이 떨어짐
- 이를 해결하기 위한 미들웨어
- 사용자가 불변성을 고려하지 않아도 자동으로 불변성 처리를 해주는 미들웨어
- 패키지 설치 필요
  ```tsx
  npm install immer
  ```
  ```tsx
  import { create } from "zustand";
  import {
    createJSONStorage,
    persist,
    subscribeWithSelector,
  } from "zustand/middleware";
  import { immer } from "zustand/middleware/immer";
  type CountStore = {
    count: number;
    increment: (amount: number, amount2: number) => void;
    decrement: () => void;
    reset: () => void;
  };
  export const useCountStore = create<CountStore>()(
    subscribeWithSelector(
      persist(
        **immer((set) => ({**
          count: 0,
          increment: (amount: number, amount2: number) => {
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            set((state) => {
              **state.count += amount + amount2;
            })**;
          },
          decrement: () =>
            set((state) => {
              **state.count -= 1;**
            }),
          reset: () =>
            set((state) => {
              state.count = 0;
            }),
        })),
        {
          name: "count-storage",
          storage: createJSONStorage(() => sessionStorage), // 세션스토리지
        }
      )
    )
  );
  ```
  - set 함수가 콜백 함수로 전달되는 함수의 영역만 이머라는 미들웨어로 감쌈
  - 자동으로 됨

### devtools

- zustand는 가벼운 라이브러리로 devtools가 내장되어 있지 않음
- 필요 시 redux dev tools와 연동하여 상태를 추적할 수 있음
- `devtools` import 해 전체 감싸기
  ```tsx
  import { create } from "zustand";
  import {
    createJSONStorage,
    persist,
    subscribeWithSelector,
  } from "zustand/middleware";
  import { immer } from "zustand/middleware/immer";
  type CountStore = {
    count: number;
    increment: (amount: number, amount2: number) => void;
    decrement: () => void;
    reset: () => void;
  };
  export const useCountStore = create<CountStore>()(
    devtools(
      subscribeWithSelector(
        persist(
          immer((set) => ({
            count: 0,
            increment: (amount: number, amount2: number) => {
              // await new Promise((resolve) => setTimeout(resolve, 1000));
              set((state) => {
                state.count += amount + amount2;
              });
            },
            decrement: () =>
              set((state) => {
                state.count -= 1;
              }),
            reset: () =>
              set((state) => {
                state.count = 0;
              }),
          })),
          {
            name: "count-storage",
            storage: createJSONStorage(() => sessionStorage), // 세션스토리지
          }
        )
      )
    )
  );
  ```
  - zustand로 인해 변경된 상태가 redux toolkit의 devtools를 사용했을 때처럼 잘 나타남
    - state, diff 값 등 확인 가능
  - `Enabled` 속성을 `First`로 바꾸면 개발모드에서만 devtools를 사용하도록 할 수 있음
  ```tsx
  {
  	enabled: import meta.env.MODE === 'development',
  }
  ```
