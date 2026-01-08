### Zustand 사용하기

src/store 폴더 만들어서 사용

```tsx
//countStore.ts
import { create } from "zustand";
type CountStore = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

//set함수로 현재 자신의 state값을 참조함
export const useCountStore = create<CountStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

create 함수는 내부적으로 콜백함수를 전달 받음

콜백 함수에서 리턴되는 객체 내용이 하나의 스토어 파일에 정의되는 상태값들이 됨

콜백 함수는 set과 get 함수를 이렇게 매개변수로 전달 받을 수 있음.

`set`은 자신의 스토어 파일의 데이터를 변경할 때 사용하는 상태 변경함수 역할을 하는 함수가 전달됨
useState의 상태 업데이트 함수와 비슷함.

`get`은 자신의 상태값을 가져오는 역할을 하는 함수가 매개변수로 전달됨

이렇게 하면 불필요한 리렌더링 없이 최적화 되어있음

CountOutside, CounterDisplay 컴포넌트는 리렌더링이 되고 있지만 카운터 버튼 컴포넌트는 전혀 영향을 받고 있지 않음

### Zustand 매개 변수

zustand는 외부에서 매개변수를 전달받거나 비동기 함수를 사용할 때도 쉽게 사용 가능함

2개 이상의 매개변수도 문제 없이 받을 수 있음

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
  increment: async (amount: number, amount2: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({ count: state.count + amount + amount2 }));
  },
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

Zustand persist

zustand도 상태이기 때문에 새로 고침하면 값이 유지 되지 않음

보통은 상태 유지를 위해 로컬 스토리지나 세션 스토리지를 사용해야하지만

zustand는 그러한 작업을 대신 처리해주는 미들웨어라는 기능이 있음

미들웨어(middleware)는 스토어의 동작을 확장하거나 가로채서 제어할 수 있도록 도와주는 기능

미들웨어 중에서도 로컬 스토리지나 세션 스토리지 같은 작업을 도와주는 기능을 하는게 persist 미들웨어임

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
  persist(
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
  )
);
```

스토리지에 저장될 키 값과 어떤 방식으로 저장할건지를 지정해주면 됨

기본 값은 로컬 스토리지 저장

### Zustand subscribe With Selector

subscribeWithSelector

특정 상태가 변경될 때를 감지해서 특정 로직을 수행할 수 있는 구독 기능을 사용할 수 있게 해주는 미들웨어

```tsx
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
type CountStore = {
  count: number;
  increment: (amount: number, amount2: number) => void;
  decrement: () => void;
  reset: () => void;
};
export const useCountStore = create(
  subscribeWithSelector(
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

```tsx
import { useEffect } from "react";
import CountGroup from "./CountGroup";
import { useCountStore } from "../store/countStore";

export default function Count() {
  useEffect(() => {
    //특정 상태를 구독
    const unsubscribe = useCountStore.subscribe(
      (state) => state.count,
      (newCount) => {
        console.log("newCount: " + newCount);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <>
      <CountGroup />
    </>
  );
}
```

### Zustand immer

zustand의 상태 업데이트 함수에서는 불변성을 지켜줘야한다는 규칙이 있어서 이렇게 상태 업데이트 함수를 사용할때도 새로운 객체를 만들어서 그 값을 반환하는 형태로 코드를 작성해줘야함

하지만 매번 불변성을 유지하기 위해서 새로운 객체를 반환하는 방식으로 코드를 작성하게 되면 코드가 복잡해지고 가독성이 떨어질 수 있다는 단점이 있음

이를 해결하기 위해서 zustand는 immer라는 미들웨어를 제공함

immer는 사용자가 불변성을 고려하지 않아도 자동으로 불변성 처리를 해주는 미들웨어

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
      //이렇게 immer로 감싸주면 됨! 이러면 불변성을 자동으로 관리해주는 immer사용 가능
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
);
```
