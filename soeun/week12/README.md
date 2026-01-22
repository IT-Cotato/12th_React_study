# 섹션 18. React Router v7

## 1. React Router

### 소개

- 리액트 애플리케이션은 싱글 페이지 애플리케이션임
- React Router를 통해 URL 경로에 따른 페이지 전환을 해줄 수 있음

**3가지 학습 모드**

- Declarative: 선언적 모드
  - 가장 기본이 되며 쉬움
- **데이터 모드**
  - 선언적 모드에 데이터 로딩 패칭 기능이 추가된 형태
- 프레임워크 모드
  - 데이터 모드에 폼처리나 기본 UI 제공 등 더웅 풍부한 애플리케이션 구조를 제공

### 설치 및 사용

- 설치 : `npm i react-router`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
```

```tsx
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([{
  path: "/",
  element: <Home />
},
{path: "/about",
  element: <About/>
}])
export default function Router () {
  return (
    <>
      <RouterProvider router={router}>
    </>
  );
}
```

- `createBrowserRouter`를 통해 라우터 인스턴스 객체를 만들어야 함
- 배열을 매개변수로 전달해 객체의 속성값으로 라우트의 경로를 입력하고 설정
- 배열 안 객체를 라우트 객체라고 함
- URL에 따라 경로에서 보여주고 싶은 페이지를 라우트 객체의 정보로 추가하여 페이지 설정
- element에 컴포넌트가 아닌 JSX 문법을 작성해도 됨

## 2. 라우트

### 중첩 라우트

- 라우트 설정 시 `children` 속성을 사용하면 라우트를 중첩시켜 부모자식 관계를 정의할 수 있음
  ```tsx
  import { createBrowserRouter, RouterProvider } from "react-router";
  import Home from "./pages/Home";
  import About from "./pages/About";
  import DashboardHome from "./pages/dashboard/DashboardHome";
  import Dashboard from "./pages/dashboard/Dashboard";

  const router = createBrowserRouter([
    {
      path: "/",
      Component: Home,
    },
    {
      path: "/about",
      Component: About,
    },
    **{
      path: "/dashboard",
      Component: Dashboard,
      children: [
        {
          path: "",
          Component: DashboardHome,
        },
      ],
    },**
  ]);

  export default function Router() {
    return (
      <>
        <RouterProvider router={router} />
      </>
    );
  }
  ```

  - 반드시 Outlet을 불러와야 두 컴포넌트 모두 보임
    ```tsx
    import { Outlet } from "react-router";

    export default function Dashboard() {
      return (
        <>
          <h1>Dashboard Component</h1>
          <Outlet />
        </>
      );
    }
    ```

### 인덱스 라우트

- 중첩 라우트에서 인덱스 라우트로 나타낼 수도 있음
  ```tsx
  import { createBrowserRouter, RouterProvider } from "react-router";
  import Home from "./pages/Home";
  import About from "./pages/About";
  import DashboardHome from "./pages/dashboard/DashboardHome";
  import Dashboard from "./pages/dashboard/Dashboard";

  const router = createBrowserRouter([
    {
      path: "/",
      Component: Home,
    },
    {
      path: "/about",
      Component: About,
    },
    **{
      path: "/dashboard",
      Component: Dashboard,
      children: [
        {
          index: true,
          Component: DashboardHome,
        },
      ],
    },**
  ]);

  export default function Router() {
    return (
      <>
        <RouterProvider router={router} />
      </>
    );
  }
  ```

  - 인덱스 라우트는 별도의 children 속성을 가질 수 없음

```tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardSetting from "./pages/dashboard/DashboardSetting";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/about",
    Component: About,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "setting", //dashboard/setting에서 보여짐
        Component: DashboardSetting,
        children: [
          {
            index: true,
            element: <h1>DashboardSettingHome</h1>,
          },
        ],
      },
    ],
  },
]);

export default function Router() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
```

### 레이아웃 라우트

- 라우트를 중첩화 시키지만 세그먼트가 추가적으로 생기지 않도록 하는 법
  ```tsx
  import { Outlet } from "react-router";

  export default function Default() {
    return (
      <>
        <header>
          <h1>Header</h1>
        </header>
        <Outlet />
        <footer>
          <h1>Footer</h1>
        </footer>
      </>
    );
  }
  ```
  ```tsx
  import { createBrowserRouter, RouterProvider } from "react-router";
  import Home from "./pages/Home";
  import About from "./pages/About";
  import DashboardHome from "./pages/dashboard/DashboardHome";
  import Dashboard from "./pages/dashboard/Dashboard";
  import DashboardSetting from "./pages/dashboard/DashboardSetting";
  import Default from "./pages/layout/Default";

  const router = createBrowserRouter([
    {
      **Component: Default,**
      children: [
        {
          path: "/",
          Component: Home,
        },
        {
          path: "/about",
          Component: About,
        },
        {
          path: "/dashboard",
          Component: Dashboard,
          children: [
            {
              index: true,
              Component: DashboardHome,
            },
            {
              path: "setting", //dashboard/setting에서 보여짐
              Component: DashboardSetting,
              children: [
                {
                  index: true,
                  element: <h1>DashboardSettingHome</h1>,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  export default function Router() {
    return (
      <>
        <RouterProvider router={router} />
      </>
    );
  }
  ```

### 라우트 프리픽스

- 컴포넌트나 엘리먼트 같은 속성을 사용하지 않고 path라는 속성만 이용해 children 속성으로 라우트를 중첩
  ```tsx
  import { createBrowserRouter, RouterProvider } from "react-router";
  import Home from "./pages/Home";
  import About from "./pages/About";
  import DashboardHome from "./pages/dashboard/DashboardHome";
  import Dashboard from "./pages/dashboard/Dashboard";
  import DashboardSetting from "./pages/dashboard/DashboardSetting";
  import Default from "./pages/layout/Default";

  const router = createBrowserRouter([
    {
      Component: Default,
      children: [
        {
          path: "/",
          Component: Home,
        },
        {
          path: "/about",
          Component: About,
        },
        {
          **path: "/group",
          // Component: Dashboard,**
          children: [
            {
              index: true,
              Component: DashboardHome,
            },
            {
              path: "setting", //dashboard/setting에서 보여짐
              Component: DashboardSetting,
              children: [
                {
                  index: true,
                  element: <h1>DashboardSettingHome</h1>,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  export default function Router() {
    return (
      <>
        <RouterProvider router={router} />
      </>
    );
  }
  ```

  - 하위 모든 중첩 라우트가 앞의 path를 붙여야지만 정상적으로 동작하는 상태가 됨
  - 하위 경로에는 모두 / 를 빼야 함

## 3. 세그먼트

### 동적 세그먼트

- URL 경로에서 콜론으로 시작하는 세그먼트는 동적 세그먼트가 되어 매칭된 URL에서 값을 추출하여 사용할 수 이게 제공해주는 라우트를 지정할 수 있음
  ```tsx
  import { createBrowserRouter, RouterProvider } from "react-router";
  import Home from "./pages/Home";
  import About from "./pages/About";
  import DashboardHome from "./pages/dashboard/DashboardHome";
  import DashboardSetting from "./pages/dashboard/DashboardSetting";
  import Default from "./pages/layout/Default";

  const router = createBrowserRouter([
    {
      Component: Default,
      children: [
        {
          path: "/",
          Component: Home,
        },
        {
          path: "/about",
          Component: About,
        },
        {
          path: "/post/**:id**",
          Component: Post,
        },
        {
          path: "/group",
          // Component: Dashboard,
          children: [
            {
              index: true,
              Component: DashboardHome,
            },
            {
              path: "setting", //dashboard/setting에서 보여짐
              Component: DashboardSetting,
              children: [
                {
                  index: true,
                  element: <h1>DashboardSettingHome</h1>,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  export default function Router() {
    return (
      <>
        <RouterProvider router={router} />
      </>
    );
  }
  ```
  ```tsx
  import { useParams } from "react-router";

  export default function Post() {
    const { id } = useParams;
    return (
      <>
        <h1>Post Component</h1>
      </>
    );
  }
  ```
- 여러 개의 동적 세그먼트 값을 불러올 수도 있음

### 옵셔널 세그먼트

- 라우트 객체의 패스 속성에 적은 세그먼트 값을 생략할 수 있게 해줌
- 세그먼트의 마지막 부분에 물음표를 붙여 생략해도 접속할 수 있도록 함
  ```tsx
  {
          path: "/post?/**:id**",
          Component: Post,
        },
  ```
- 항상 먼저 등록된 것을 우선으로 잡음

### 스플랫

- Catcher 또는 Wildcard 라우터를 의미함
- 정의되지 않은 모든 경로를 잡아내기 위한 라우트 지정 방법
- \*를 통해 지정
  ```tsx
  {
          path: "/post/*",
          Component: Post,
        },
  ```
- 404 Not Found 페이지를 처리하기 위해 자주 사용함

## 4. React Router가 적용된 애플리케이션 탐색

### Link

- 리액트 라우터에서 제공해주는 컴포넌트
- A 태그와 사용법이 유사
  ```tsx
  <li>
    <Link to="/">Home</Link>
  </li>
  ```

### NavLink

- 현재 URL과 일치하는 to 속성의 값을 가지고 있는 NavLink 컴포넌트에 active 클래스를 자동으로 붙여줌
- url에 맞춰서 네비게이션 링크를 스타일링 할 수 있게 됨
- 속성이나 children으로 isActive, isPending, isTransition 속성값을 받아 활용할 수 있음
  ```tsx
  import { NavLink, Outlet } from "react-router";

  export default function Default() {
    return (
      <>
        <header>
          <h1>Header</h1>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive, isPending, isTransitioning }) =>
                  [
                    isActive ? "isActive" : "",
                    isPending ? "isPending" : "",
                    isTransitioning ? "isTransition" : "",
                  ].join(" ")
                }
                viewTransition
              >
                {({ isActive, isPending, isTransitioning }) =>
                  [
                    isActive ? "isActive" : "none",
                    isPending ? "isPending" : "",
                    isTransitioning ? "isTransition" : "",
                  ].join(" ")
                }
              </NavLink>
            </li>
          </ul>
        </header>
        <Outlet />
        <footer>
          <h1>Footer</h1>
        </footer>
      </>
    );
  }
  ```

### Form

- 리액트 라우터에서 폼태그와 같은 역할을 하는 폼이라는 컴포넌트를 사용해서 애플리케이션을 탐색할 수도 있음
  ```tsx
  import { Form } from "react-router";

  export default function Login() {
    return (
      <>
        <Form action="/">
          <input type="email" />
          <input type="password" />
          <button>로그인</button>
        </Form>
      </>
    );
  }
  ```

  - 액션 속성을 지정하면 액션이 지정된 라우트 경로로 데이터를 전송하며 페이지 전환까지 가능
  ```tsx
  {
          path: "/login",
          Component: Login,
          action: async ({ request }) => {
            const formData = await request.formData();
            const email = formData.get("email");
            const pw = formData.get("pw");
            console.log(email, pw);
            return { message: "로그인 성공" };
          },
        },
  ```

  - 라우트 경로에서 action 속성을 통해 GET이 아닌 메서드를 사용할 수 있음

### navigate

```tsx
const navigate = useNavigate();
```

- `navigate("/login")`과 같이 사용

## 5. 데이터 패칭

### POST 데이터 요청 후 렌더링

서버에서 응답이 오면 데이터가 보여짐

```tsx
import { useEffect, useState } from "react";
import { Form } from "react-router";
import { axiosInstance } from "../../../api/axios";

export default function Login() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axiosInstance.get("/posts");
      setPosts(data);
    };
  }, []);
  return (
    <>
      <h1>Post Component</h1>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </>
  );
}
```

loader 속성을 사용할 수도 있음

```tsx
			{
        path: "/post-loader",
        Component: PostLoader,
        **loader: async () => {
          const { data } = await axiosInstance.get("/posts");
        },**
      },
```

```tsx
import { useLoaderData } from "react-router";

export default function PostLoader() {
  const posts = useLoaderData();
  return (
    <>
      <h1>PostLoader Component</h1>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </>
  );
}
```

- 데이터 패칭이 끝날 때까지 화면 전환이 일어나지 않음
- 깜빡임이 보이지 않게 됨

반복문으로 작성 가능

```tsx
import { useLoaderData } from "react-router";

interface Posts {
  id: number;
  title: string;
  views: number;
}
export default function PostLoader() {
  const posts: Posts[] = useLoaderData();
  return (
    <>
      <h1>PostLoader Component</h1>
      <ul>
        {posts && posts.map((post) => <li key={post.id}>{post.title}</li>)}
      </ul>
    </>
  );
}
```

### loading

```tsx
{
        path: "/post-loader",
        Component: PostLoader,
        loader: async () => {
          const { data } = await axiosInstance.get("/posts");
          return data;
        },
        **HydrateFallback: PostLoading,**
},
```

### error

```tsx
import { isRouteErrorResponse, useRouteError } from "react-router";

export default function PostError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status}</h1>
        <h1>{error.data.message}</h1>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>알 수 없는 에러</h1>
        <h1>{error.message}</h1>
      </div>
    );
  }
  return (
    <>
      <p>에러 발생</p>
    </>
  );
}
```
