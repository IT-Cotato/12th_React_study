# 섹션 17. 데이터 통신 심화

## 1. useTransition

- React 18부터 도입된 훅으로, 초기에는 상태 업데이트를 낮은 우선순위의 트랜지션으로 처리하는데 사용
  - 트랜지션: React.JS에서 낮은 우선순위로 코드를 처리함
  - 더 중요한 작업이 끝나고 여유가 있을 때 처리
- React 19부터 비동기 함수도 처리할 수 있도록 기능 확장
- 호출 시 두 개의 요소를 가진 배열을 반환
  ```tsx
  const [isPending, startTransition] = useTranstion();
  ```
  - 첫 번째 요소는 현재의 트랜지션 값이 진행 중인 것이 있을 시 true값 나타내는 isPending이라는 상태값
  - 두 번째는 코드를 트랜지션으로 실행할 수 있게 해주는 함수
    - 해당 함수로 작성한 코드는 React에서 낮은 우선순위로 처리
  - `startTransition`으로 감싸 실행된 코드는 React에 의해 비긴급 업데이트로 분류되어 그동안 isPending 값이 자동으로 true로 설정됨
  - 작업이 완료되면 다시 false로 변경

### 사용

```tsx
import axios from "axios";
import { useEffect, useState, useTransition } from "react";

interface Post {
  id: number;
  title: string;
  views: number;
}
export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    **startTransition(async () => {
      const { data } = await axios.get("http://localhost:3000/posts");
      setPosts(data);
    });**
  }, []);

  if (isPending) return <h3>loading..</h3>;
  return (
    <>
      <h3>useTransition</h3>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}
```

- 과거엔 isLoading 상태를 정의했지만 useTranstion 훅 사용으로 isPending이 그 역할을 하기에 따로 상태 정의를 하지 않아도 됨

## 2. useActionState

- 클라이언트 기반 라이브러리에서는 액션 속성을 주로 서버에서 처리하기 때문에 form 태그의 action 속성을 거의 사용하지 않았음
- React 18부터 useActionState 훅을 통해 사용 가능
- 폼의 액션 결과를 기반으로 상태를 업데이트 할 수 있도록 해줌
- 기본 사용법
  ```tsx
  const [state, formAction, isPending] = useActionState(fn, initialState);
  ```
  - 첫 매개변수로 액션 발생 시 실행할 함수 작성
  - 두번째 매개변수로 상태 초기값 지정
  - 세가지 요소를 포함한 배열을 반환함
    - 현재 상태값, formAction 함수, 액션이 처리 중인지 여부를 나타내는 상태값
  - 사용 시 구조분해 할당을 통해 폼 액션 함수를 추출하고 이를 JSX의 폼 태그의 액션 속성으로 할당하여 사용할 수 있음

### 사용

```tsx
import { useActionState } from "react";

export default function App() {
  //구조분해 할당이므로 이름을 다르게 지정해도 됨
  const [count, formAction, isPending] = useActionState((count) => {
    return count + 1;
  }, 0);
  return (
    <>
      <form action={formAction}>
        <h1>count = {count}</h1>
        <button type="submit">증가</button>
      </form>
    </>
  );
}
```

- 폼 태그는 일반적으로 제출되면 브라우저가 페이지를 새로고침하면서 데이터를 서버로 전송하는 기본 동작을 수행
- 액션 속성에 폼 액션의 값을 넣어주면 React가 이벤트를 가로채고 해당 액션 함수로 데이터를 전달함
- 페이지가 새로고침 되지 않고 클라이언트에서 상태가 갱신되는 방식으로 동작
- 폼 제출 이벤트는 발생하지만 브라우저 기본동작이 실행되지 않고 React가 Form action 함수를 통해 직접 처리하게 되는 것

**비동기**

```tsx
import { useActionState } from "react";

export default function App() {
  //구조분해 할당이므로 이름을 다르게 지정해도 됨
  const [count, formAction, isPending] = useActionState(async (count) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return count + 1;
  }, 0);
  return (
    <>
      <form action={formAction}>
        <h1>count = {count}</h1>
        <button type="submit">증가</button>
        {isPending && <p>제출중..</p>}
      </form>
    </>
  );
}
```

**비제어 컨트롤러 방식**

- form 자체의 데이터는 form 특성으로 묶인 form 요소의 객체 데이터를 의미
- form 자체의 데이터를 활용해서 비제어 컨트롤러 방식으로 폼 요소의 값을 가져올 수 있음
  ```tsx
  import { useActionState } from "react";

  export default function App() {
    //구조분해 할당이므로 이름을 다르게 지정해도 됨
    const [count, formAction, isPending] = useActionState(
      async (count: number, formData: FormData) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const amount = Number(formData.get("amount"));
        return count + 1;
      },
      0
    );
    return (
      <>
        <form action={formAction}>
          <h1>count = {count}</h1>
          <input type="number" name="amount" />
          <button type="submit" disabled={isPending} formAction={formAction}>
            증가
          </button>
          {isPending && <p>제출중..</p>}
        </form>
      </>
    );
  }
  ```
  - 폼 액션 발생 시 실행되는 함수에는 폼 데이터가 전달되므로 그 데이터를 활용하면 됨

**form action**

- form 태그의 action 속성에 함수만 직접 할당해서 사용할 수도 있음
- useActionState처럼 자동으로 상태값이나 isPending 같은 로딩 상태가 제공되지는 않음 → 모두 직접 구현해야 함
- 단순한 작업을 빠르게 처리하고 싶을 때 적함
  ```tsx
  import { useState } from "react";

  export default function App() {
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (formData: FormData) => {
      const email = formData.get("email");
      const pw = formData.get("pw");

      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
      console.log(`login success ${email}/${pw}`);
    };
    return (
      <>
        <form action={}>
          <input type="email" name="email" autoComplete="off" />
          <input type="password" name="pw" />
          <button type="submit">로그인</button>
        </form>
      </>
    );
  }
  ```
  - 로그인 성공 시 사용자 입력 폼도 초기화 됨

## 3. useFormStatus

- 컴포넌트가 분리되어 있는 상황에서도 상위 Form 요소의 상태 정보를 하위 컴포넌트에서 손쉽게 가져올 수 있음

```tsx
const { pending, data, method, action } = useFormStatus();
```

- 매개변수 없이 호출하며 내부적으로 4가지 속성을 포함한 객체를 반환함
  - pending: 폼이 제출되어 액션이 처리 중임을 true/false로 반환
  - data: 제출된 폼 데이터 객체에 대한 참조 값
  - method: GET, POST 중 현재 폼에서 사용 중인 전송 방식 나타냄
  - action: 현재 실행 중인 액션 함수에 대한 참조 값
- 네 속성은 구조분해 할당으로 개별적으로 꺼내 사용할 수 있으며 이를 활용하면 자식 컴포넌트에서도 상위 폼의 상태를 실시간으로 확인 가능
  ```tsx
  import { useFormStatus } from "react-dom";

  type ButtonProps = React.ComponentPropsWithoutRef<"button">;

  export default function Button({ children, ...props }: ButtonProps) {
    const { pending, data, method, action } = useFormStatus();
    console.log(pending);
    console.log(data);
    console.log(method);
    console.log(action);
    return (
      <>
        <button {...props}>{children}</button>
      </>
    );
  }
  ```
  ![콘솔로 속성 확인](attachment:32193921-72ec-4282-81f5-4e3c88cb9acd:image.png)
  콘솔로 속성 확인

## 4. useOptimistic

- 낙관적 업데이트
  - 서버의 응답을 기다리지 않고 사용자 인터페이스를 먼저 업데이트하는 기법
  - 서버 요청이 성공할 것이라고 가정하는 것이기 때문에 실패 시 롤백 로직 구현이 필요함
  - 리액트 19에서는 useOptimistic 훅을 통해 쉽게 낙관적 업데이트를 구현할 수 있음

```tsx
useOptimistic(state, (currentState, optimisticVlaue) => {});
```

- 첫 매개변수는 초기 상태값으로 서버 응답을 기다리기 전 기본적으로 보여지게 될 상태값임
- 두 번째는 낙관적 업데이트 시 상태를 어떻게 바꿀지 정의하는 함수
- 두 값이 포함된 배열 반환 `[optimisticState, addOptimistic]`
  - 현재 낙관적 상태 값
    - 낙관적 업데이트가 발생하지 않았을 때 현재 초기 값의 상태와 같고 업데이트 진행 중일 시 업데이트 함수의 반환값 사용됨
  - 낙관적 업데이트를 실행할 때 호출되는 함수로, 인자로 넘긴 값이 업데이트 함수의 매개변수로 전달됨
- 서버 응답 실패 시 롤백 기능 내장

### 사용

```tsx
import axios from "axios";
import { Heart } from "lucide-react";
import { startTransition, useEffect, useOptimistic, useState } from "react";

interface Posts {
  id: number;
  isLike: boolean;
}
export default function App() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticPosts, addOptimisticPosts] = useOptimistic(
    posts,
    (statePosts, value) => {
      return statePosts.map((statePost) =>
        statePost.id === id
          ? { ...statePost, isLike: !statePost.isLike }
          : statePosts
      );
    }
  );
  const updateLike = (id: number, isLike: boolean) => {
    startTransition(async () => {
      addOptimisticPosts(id);
      try {
        const { data } = await axios.patch(
          `http://localhost:3000/posts/${id}`,
          {
            isLike: !isLike,
          }
        );
        setPosts((posts) =>
          posts.map((post) => (post.id === data.id ? data : post))
        );
      } catch {
        console.error("tq");
      }
    });
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get("http://localhost:3000/posts");
        setPosts(data);
      } catch (e) {
        console.error("error" + e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);
  if (isLoading) return <p>is loading...</p>;
  return (
    <>
      {/* fill: 'none', stroke: 'currentColor' */}
      {/* fill: 'rgb(255,0,0)', stroke: 'rgb(255,0,0)' */}
      {posts.map((post) => (
        <Heart
          key={post.id}
          fill={post.isLike ? "rgb(255,0,0" : "none"}
          stroke={post.isLike ? "rgb(255,0,0" : "current color"}
          onClick={() => updateLike(post.id, post.isLike)}
        />
      ))}
    </>
  );
}
```

## 5. use + suspense

- 리액트 19에서 데이터 통신을 보다 간결하게 처리할 수 있도록 use 훅이 도입
  - Promise 객체를 동기함수처럼 사용할 수 있게 해주는 기능을 함
  - 매개변수로 Promise 객체를 전달
- use Hook은 반드시 Suspense 컴포넌트와 함께 사용
  - 컴포넌트에서 비동기 처리가 완료될 때까지 대기하게 하는 동아 fallback 속성에 지정된 Loading UI를 표시하게 하는 역할

### 사용

```tsx
import { Suspense } from "react";
import { axiosInstance } from "./api/axios";
import Posts from "./Posts";

async function fetchPosts() {
  const { data } = await axiosInstance.get("/posts");
  return data; //Promise 객체
}

export default function App() {
  return (
    <>
      {/* Suspense로 감싸줌 */}
      <Suspense fallback={<p>loading...</p>}>
        <h1>App Component</h1>
        <Posts promise={fetchPosts()} />
      </Suspense>
    </>
  );
}
```

```tsx
import { use } from "react";

export default function Posts({
  promise,
}: {
  promise: Promise<
    {
      id: number;
      titel: string;
      views: number;
    }[]
  >;
}) {
  const posts = **use(promise);**
  return (
    <>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </>
  );
}
```

### error boundary

- useHook과 suspense를 조합해서 사용하는 경우 데이터 요청이 실패하면 앱 전체가 crash됨
- 이를 해결해기 위해 error boundary 사용
- 자바스크립트 오류를 처리하기 위한 컴포넌트
- 원래는 클래스 컴포넌트에 생명주기 메서드가 필요하기 때문에 클래스 컴포넌트로 작성해서 사용해야 하지만 더 쉽게 외부 패키지를 적용할 수도 있음

**react-error-boundary**

```tsx
//설치
npm install react-error-boundary
```

```tsx
import { Suspense } from "react";
import { axiosInstance } from "./api/axios";
import Posts from "./Posts";
import { ErrorBoundary } from "react-error-boundary";

async function fetchPosts() {
  const { data } = await axiosInstance.get("/posts");
  return data; //Promise 객체
}

export default function App() {
  return (
    <>
      **
      <ErrorBoundary fallback={<p>Error!</p>}>
        **
        {/* Suspense로 감싸줌 */}
        <Suspense fallback={<p>loading...</p>}>
          <h1>App Component</h1>
          <Posts promise={fetchPosts()} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
```

- fallback 대신 FallbackComponent로 컴포넌트를 불러올 수도 있음
  ```tsx
  export default function Error({
    error,
    resetErrorBoundary,
  }: {
    error: Error;
    resetErrorBoundary: () => void;
  }) {
    return (
      <>
        <div>
          <h2>Something went wrong:</h2>
          <p>{error.message}</p>
          <button onClick={resetErrorBoundary}>Reset</button>
        </div>
      </>
    );
  }
  ```
  - 컴포넌트가 아닌 함수도 사용 가능
  - 다양한 속성값 사용 가능

### 팁

- 로딩이 0.5초보다 짧은 경우 보여주지 않게 할 수 있음
  ```tsx
  import { useEffect, useState } from "react";

  export default function Loading() {
    const [isShow, setIsShow] = useState(false);
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsShow(true);
      }, 500); //0.5초 이후 true 인 경우만 렌더링
      return () => clearTimeout(timer);
    }, []);
    return (
      <>
        <p> loading... </p>
      </>
    );
  }
  ```

## 6. 영화 애플리케이션

### tmdb

- 무료 영화 api
- api docuentation에서 토큰 제작해 API 키 발급
- API Reference에서 무료 사용 가능 API 목록 확인 가능
- 사용 방법도 참고할 수 있음
  ```tsx
  import { useEffect, useState } from "react";
  import MovieHeader from "./MovieHeader";
  import MovieList from "./MovieList";
  import MovieMain from "./MovieMain";
  import { axiosInstance } from "../../api/axios";
  import { useInView } from "react-intersection-observer";

  export default function Movie() {
    const [nowData, setNowData] = useState<MovieType[]>([]);
    const [nowLoading, setNowLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [nowError, setNowError] = useState<Error | null>(null);
    const { ref } = useInView({
      threshold: 0.5,
      rootMargin: "200px",
      onChange: (inView: boolean) => {
        if (inView && !nowLoading && hasMore) {
          setPage((page) => page + 1);
        }
      },
    });
    useEffect(() => {
      const controller = new AbortController();
      const { signal } = controller;
      const fetchCategory = async (
        endpoint: string,
        setData: React.Dispatch<React.SetStateAction<MovieType[]>>,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setError: React.Dispatch<React.SetStateAction<Error | null>>
      ) => {
        setLoading(true);
        setError(null);

        // await new Promise((resolve) =>
        //   setTimeout(
        //     resolve,
        //     [3000, 4000, 5000, 6000, 7000][Math.floor(Math.random() * 5)]
        //   )
        // );
        try {
          const {
            data: { results, total_pages },
          } = await axiosInstance.get(`/${endpoint}?page=${page}`, {
            signal,
          });
          setHasMore(page < total_pages);
          if (page === 1) setData(results);
          else setData((data) => [...data, ...results]);
        } catch (e) {
          if (e instanceof Error && e.name !== "CanceledError") setError(e);
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      };
      fetchCategory("now_playing", setNowData, setNowLoading, setNowError);
      return () => controller.abort();
    }, [page]);
    return (
      <>
        <MovieHeader />
        <MovieMain />
        <MovieList
          title="Now Playing"
          movies={nowData}
          loading={nowLoading}
          error={nowError}
        />
        <div ref={ref}></div>
      </>
    );
  }
  ```
  ```tsx
  export default function MovieError({ error }: { error: Error }) {
    return (
      <>
        <div className="w-full py-18">
          <div className="flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-14 h-14 dark:text-gray-400 mb-4"
            >
              <path
                fill="currentColor"
                d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"
              ></path>
              <rect
                width="176"
                height="32"
                x="168"
                y="320"
                fill="currentColor"
              ></rect>
              <polygon
                fill="currentColor"
                points="210.63 228.042 186.588 206.671 207.958 182.63 184.042 161.37 162.671 185.412 138.63 164.042 117.37 187.958 141.412 209.329 120.042 233.37 143.958 254.63 165.329 230.588 189.37 251.958 210.63 228.042"
              ></polygon>
              <polygon
                fill="currentColor"
                points="383.958 182.63 360.042 161.37 338.671 185.412 314.63 164.042 293.37 187.958 317.412 209.329 296.042 233.37 319.958 254.63 341.329 230.588 365.37 251.958 386.63 228.042 362.588 206.671 383.958 182.63"
              ></polygon>
            </svg>
            <p className="text-xl text-rose-500">{error.message}</p>
          </div>
        </div>
      </>
    );
  }
  ```
