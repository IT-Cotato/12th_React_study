### **01. Zustand란?**

- Redux나 Context API 보다 **더 적은 코드**와 **직관적인 방식**으로 상태 관리 가능
- 외부에서 매개변수를 전달받거나 비동기 함수를 사용할 때도 매우 쉽게 코드 처리 가능

---

### **02. Zustand 사용하기**

**1) Zustand 설치**

```tsx
npm install zustand
```

![](https://blog.kakaocdn.net/dna/cum4Xy/dJMcaiPrPig/AAAAAAAAAAAAAAAAAAAAAGXtUQJKYO_LiGA3S2nhpG_ZPXSk-tEenEfckWKNEJlc/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1767193199&allow_ip=&allow_referer=&signature=JA7AimNW00LJfxsZBncQfQ5Rogk%3D)

---

**2) src/store 폴더 생성**

- Zustand를 활용하여 하나의 상태들을 관리할 수 있는 하나의 단위
- count 관련 정의 → countStore.ts 생성

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

- zustand는 보통 커스텀 북처럼 'useXXXStore'이라는 이름으로 지어주는 것이 관례
- 스토어 파일 만들 때는 zustand의 create 함수 사용
- 콜백 함수에서 리턴되는 객체 내용 : 하나의 스토어 파일에 정의되는 상태값이 됨
  - **set** : 자신의 스토어 파일의 데이터를 변경할 때 사용하는 **상태 변경 함수 역할**을 하는 함수가 전달
  - **get** : 자신의 상태값을 가져오는 역할을 하는 함수가 매개변수로 전달

![](https://blog.kakaocdn.net/dna/FCmzm/dJMcabv4pqp/AAAAAAAAAAAAAAAAAAAAADruxEZbBBpLOpckhD79fVdc_V92HwaAw7lTSReg8hW9/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1767193199&allow_ip=&allow_referer=&signature=BikrPFjw87V4A8PbvTZ0m6IQO3E%3D)

- 콘솔 로그 : Outside 컴포넌트와 Counter Display 컴포넌트는 리렌더링, 카운터 버튼 컴포넌트는 전혀 영향 X

---

### **03. Zustand 매개 변수**

- 증가시키고자 하는 숫자를 매개변수로 전달 받고 싶을 때→ 전달하고 싶은 숫자를 매개변수로 적어주면 됨 (CountButton.tsx)

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
      // 아래와 같이 매개변수 작성
      <button onClick={() => increment(5, 10)}>증가</button>
    </>
  );
}
```

- 그 후 해당 increment라는 메서드를 재정의 (countStore.ts)→ increment는 웹에서 전달받은 amount 수치만큼 숫자 증가

```tsx
import { create } from "zustand";
type CountStore = {
  count: number;
  // 타입 재정의
  increment: (amount: number, amount2: number) => void;
  decrement: () => void;
  reset: () => void;
};
export const useCountStore = create<CountStore>((set) => ({
  count: 0,
  // 숫자값을 전달받을 수 있도록 코드 작성
  // 이 로직에서 amount 값을 활용할 수 있도록 코드 작성
  // 비동기로 구현 원할 시, 아래와 같이 객체 형태로 작성
  increment: async (amount: number, amount2: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({ count: state.count + amount + amount2 }));
  },
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

---

### **04. Zustand persist**

- 상태를 새로고침해도 유지 → Zustand에서는 '**미들웨어**' 사용
- **미들웨어** : 어떤 하나의 기능을 지칭 X, 스토어의 동작 확장 or 가로채서 제어할 수 있도록 도와주는 기능

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
  // persist 미들웨어로 전체 감싸기
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
    // 객체 지정하기
    {
      name: "count-storage",
      storage: createJSONStorage(() => sessionStorage), // 세션스토리지
    }
  )
);
```

- **persist 미들웨어 사용법 (countStore.ts)**
  - persist라는 미들웨어로 전체 감싸주기
  - 매개변수로 콤마를 찍어서 객체 지정, 스토리지에 저장될 키 값 적어주기→ 저장 후, Prettier가 자동 포매팅
  - 단, 미들웨어 중첩 사용 시, 타입 에러 발생!→ 기존의 create 함수 다음에 generic으로 타입 적어줬던 부분 옆에 ()

![](https://blog.kakaocdn.net/dna/CELjc/dJMcaaqogfi/AAAAAAAAAAAAAAAAAAAAALYJHrvUgKfonJVaoitvfZ7aPBI7svrjhp4kTNL-KUMl/img.gif?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1767193199&allow_ip=&allow_referer=&signature=%2Fv6sujeTbDuesGPS0TlOYyHvfWc%3D)

- 값이 유지되는 이유 : **PersistedMiddleWare**에 의해 **현재 상태 값**이 **로컬 스토리지**에 잘 저장되고 있기 때문
- 로컬 스토리지를 사용하기 싫다면 **세션 스토리지** 사용!

```tsx
storage: createJSONStorage(() => sessionStorage), // 세션스토리지
```

---

### **05. Zustand subscribeWithSelector**

- 특정 상태가 변경될 때를 감지해서 특정 로직을 수행할 수 있는 구독 기능을 사용할 수 있게 해주는 미들웨어

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

- persist를 sunscribeWithSelector 미들웨어 함수로 감싸기
- 미들웨어를 적용함으로써, 해당 스토어에 상태를 구독하여 변경사항을 감지할 때마다 특정 로직을 수행하는 코드 작성 가능

```tsx
import { useEffect } from "react";
import CountGroup from "./CountGroup";
import { useCountStore } from "../store/countStore";

export default function Count() {
  // useEffect는 Count의 컴포넌트가 생성될 때 한번만 실행되도록
  useEffect(() => {
    // unscribe라는 변수에다가 카운트 스토어의 subscribe 메서드를 사용해서 특정 상태에서 구독
    const unsubscribe = useCountStore.subscribe(
      // 첫째, state로 내가 감시할 상태 적어주기
      // 둘째, 상태가 변경되었을 때 실행된 callback 함수 적어주기 : callback 함수에는 변경된 최신값 들어오게 됨
      (state) => state.count,
      (newCount) => {
        console.log("newCount: " + newCount);
      }
    );
    // 클린업 함수에서 컴포넌트가 해제될 때 unsubscribe를 호출하여 메모리에서 해제하는 코드 작성
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

- useCounterStore에서 count라는 상태를 구독하고 있다가, count라는 상태의 어떤 변화가 발생하게되면, 해당 콜백함수 실행!

![](https://blog.kakaocdn.net/dna/d1j4Qv/dJMb99Syug5/AAAAAAAAAAAAAAAAAAAAAFVxbLa5cuKiWRq8UTdbZp0iKv_fXLVSs8LgP1GTLLIS/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1767193199&allow_ip=&allow_referer=&signature=CnDMTgABg4hOmJJ5vWxoqvJXqYM%3D)

---

### **06. Zustand immer**

- Zustand의 상태 업데이트 함수에서는 불변성을 지켜줘야한다는 규칙 존재→ 상태 업데이트 함수를 사용할 때도 새로운 객체를 만들어서 그 값을 반환하는 형태로 코드 작성
- 하지만, 매번 불변성 유지를 위해 새로운 객체 반환 방식으로 코드 작성은 가독성 떨어짐→ Zustand immer

---

**1) Zustand immer란?**

- 사용자가 불변성을 고려하지 않아도 자동으로 불변성 처리해주는 미들웨어 (불변성 자동 관리)

---

**2) Zustand immer 사용법**

(1) immer 패키지 설치

```tsx
npm install immer
```

![](https://blog.kakaocdn.net/dna/bNn99l/dJMcacIwvL9/AAAAAAAAAAAAAAAAAAAAAJr9lV6Z59Zh7hbT-FWwBoAk_bAdqVKm-n2q74orxo8b/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1767193199&allow_ip=&allow_referer=&signature=%2BiDt5V1cXc4qOBpsMOZotOlQi00%3D)

(2) immer 사용법

- 실제로 Set 함수가 Callback 함수로 전달되는 함수의 덩어리, 영역 자체를 immer라는 미들웨어로 감싸기

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

---

### **07. Zustand devtools**

- Zustand에 원래는 devtools 내장 X, but 원하면 Redux DevTools와 연동하여 상태 추적 가능
- 사용법 : devtools라는 함수를 Zustand 미들웨어에서 import 해온 뒤, 전체를 devtools로 감싸주기
