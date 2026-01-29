### ReactRouter

라이브러리이면서 프레임워크의 성격 또한 가지고 있음

React 애플리케이션에서 페이지 전환을 가능하게 해주는 역할을 함

Data Mode: 선언적 모드 + 데이터 패칭 기능

```tsx
//src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);

//src/routes/pages/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/about",
    Component: About,
  },
]);

//path라는 경로에 component라는 컴포넌트를 렌더링해라

export default function Router() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
//RouterProvider라는 reactrouter에서 제공하는 컴포넌트 사용
//이 컴포넌트의 라우터라는 속성 값으로 생성한 라우터 객체를 넣어줌
//이 라우터 속성의 값으로 url 전환됨
```

### React Router v7 기본

```tsx
//src/routes/pages/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardSetting from "./pages/dashboard/DashboardSetting";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    Component: About,
    //이렇게 컴포넌트 속성으로 전달하면 JSX문법은 사용 불가능
  },
  {
    path: "/dashboard",
    Component: Dashboard,
    children: [
      {
        index: true, // 인덱스 라우트
        Component: DashboardHome,
      },
      {
        path: "setting", // /dashboard/setting
        Component: DashboardSetting,
        children: [
          {
            path: "custom", // /dashboard/setting/custom
            element: <h1>DashboardSetting Home</h1>,
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

element 속성의 값은 컴포넌트 엘리먼트를 직접 전달하거나 JSX문법을 직접적으로 작성해도 상관 없음

### React Router v7 중첩 라우트와 인덱스 라우트

```tsx
//src/routes/pages/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardSetting from "./pages/dashboard/DashboardSetting";
import Default from "./pages/layouts/Default";
import DashboardLayout from "./pages/layouts/DashboardLayout";

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
        Component: DashboardLayout,
        children: [
          {
            path: "/dashboard",
            Component: Dashboard,
            children: [
              {
                index: true, // 인덱스 라우트(별도로 children속성 가질 수 없음)
                //path: "", //  이렇게도 작성 가능
                Component: DashboardHome,
              },
              {
                //중첩되어 있는 route의 path에는 /를 넣지 않음!
                path: "setting", // /dashboard/setting
                Component: DashboardSetting,
                children: [
                  {
                    path: "custom", // /dashboard/setting/custom
                    element: <h1>DashboardSetting Home</h1>,
                  },
                ],
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

//src/routes/pages/dashboard/Dashboard.tsx
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <Outlet />
      //이런식으로 반드시 자식 컴포넌트에 outlet컴포넌트를 넣어줘야함
    </>
  );
}
```

### ReactRouter v7 레이아웃 라우트

route를 중첩화 시키되 세그먼트가 추가적으로 생기지 않길 원하는 경우

> 레이아웃 라우트

```tsx
//src/routes/pages/layouts/Default.tsx
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

//src/routes/pages/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardSetting from "./pages/dashboard/DashboardSetting";
import Default from "./pages/layouts/Default";

//이렇게 default레이아웃을 만들고 나머지 페이지 라우팅을 children으로 넣어버리면
//모든 페이지에 기본으로 default의 내용이 들어가게 됨
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
        //라우트 프리픽스
        path: "/group",
        // Component: DashboardLayout,
        children: [
          {
            path: "dashboard",
            Component: Dashboard,
            children: [
              {
                index: true, // 인덱스 라우트
                Component: DashboardHome,
              },
              {
                path: "setting", // /dashboard/setting
                Component: DashboardSetting,
                children: [
                  {
                    path: "custom", // /dashboard/setting/custom
                    element: <h1>DashboardSetting Home</h1>,
                  },
                ],
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

### ReactRouter v7 동적 세그먼트

```tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardSetting from "./pages/dashboard/DashboardSetting";
import Default from "./pages/layouts/Default";
import Post from "./pages/post/Post";
import PostDetail from "./pages/post/PostDetail";

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
        //블로그 형태의 게시물일때 이렇게 식별자로 구분해서 동적 렌더링 가능
        path: "/post/:id",
        Component: Post,
      },
      {
        path: "/post/:id/detail/:detail",
        Component: PostDetail,
      },
      {
        path: "/group",
        // Component: DashboardLayout,
        children: [
          {
            path: "dashboard",
            Component: Dashboard,
            children: [
              {
                index: true, // 인덱스 라우트
                Component: DashboardHome,
              },
              {
                path: "setting", // /dashboard/setting
                Component: DashboardSetting,
                children: [
                  {
                    path: "custom", // /dashboard/setting/custom
                    element: <h1>DashboardSetting Home</h1>,
                  },
                ],
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

### ReactRouter v7 옵셔널 세그먼트

라우트 객체의 path 속성에 적은 세그먼트의 값을 생략할 수 있게 해주는 방법

```tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardSetting from "./pages/dashboard/DashboardSetting";
import Default from "./pages/layouts/Default";
import Post from "./pages/post/Post";
import PostDetail from "./pages/post/PostDetail";

const router = createBrowserRouter([
  {
    Component: Default,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        //세그먼트의 마지막 부분에 물음표를 붙여서 사용
        //특정 세그먼트를 생략하더라도 해당 라우트에 접속 가능
        path: "/:locale?/about",
        Component: About,
      },
      {
        path: "/post?/:id?",
        Component: Post,
      },
      {
        path: "/post/:id/detail/:detail",
        Component: PostDetail,
      },
      {
        path: "/group",
        // Component: DashboardLayout,
        children: [
          {
            path: "dashboard",
            Component: Dashboard,
            children: [
              {
                index: true, // 인덱스 라우트
                Component: DashboardHome,
              },
              {
                path: "setting", // /dashboard/setting
                Component: DashboardSetting,
                children: [
                  {
                    path: "custom", // /dashboard/setting/custom
                    element: <h1>DashboardSetting Home</h1>,
                  },
                ],
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

### ReactRouter v7 스플랫

스플랫: React 라우터에서 Catcher 또는 WildCard 라우터

정의되지 않은 모든 경로를 잡아내기 위한 라우트 지정 방법

패스 속성의 값에 \*를 해서 스플랫을 지정함

```tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardSetting from "./pages/dashboard/DashboardSetting";
import Default from "./pages/layouts/Default";
import Post from "./pages/post/Post";
import PostDetail from "./pages/post/PostDetail";

const router = createBrowserRouter([
  {
    Component: Default,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/:locale?/about",
        Component: About,
      },
      {
        //post로 시작하는 모든 경로는 여기로
        path: "/post/*",
        Component: Post,
      },
      {
        //위에서 post로 시작하는걸 다 잡아버려서 아래의 경로는 절대 라우팅 되지 않음
        path: "/post/:id/detail/:detail",
        Component: PostDetail,
      },
      {
        path: "/group",
        // Component: DashboardLayout,
        children: [
          {
            path: "dashboard",
            Component: Dashboard,
            children: [
              {
                index: true, // 인덱스 라우트
                Component: DashboardHome,
              },
              {
                path: "setting", // /dashboard/setting
                Component: DashboardSetting,
                children: [
                  {
                    path: "custom", // /dashboard/setting/custom
                    element: <h1>DashboardSetting Home</h1>,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        //지정하지 않은 경로로 접근했을때
        path: "*",
        element: <h1>404 Not Found!</h1>,
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

### ReactRouter v7 Navlink, link

```tsx
//src/routes/pages/layouts/Default.tsx

import { Link, Outlet } from "react-router";

export default function Default() {
  return (
    <>
      <header>
        <h1>Header</h1>
      </header>
      <ul>
	      <li>
	      <Link to="/">Home</Link>
	      </li>
        <li>
        <Link to="/about">About</Link>
        </li>
      <Outlet />
      <footer>
        <h1>Footer</h1>
      </footer>
    </>
  );
}

```

Link 태그는 기존 a 태그와 같이 사용 가능함

Navlink는 여러가지 상태들을 제공해주는 링크를 적용할 수 있게 해주는 컴포넌트

Navlink는 기본적으로 현재 url과 일치하는 to 속성의 값을 가지고 있는 내부 링크 컴포넌트에 active라는 클래스를 자동으로 붙여줌

> url에 맞춰서 내비게이션 링크를 스타일링 할때 유용

Navlink는 속성이나 children으로 isActive, isPending, isTransition이라는 속성값들을 받아서 활용할 수 있음

isActive: 해당 url과 나의 경로가 같으면 true

isPending: 이 페이지를 이동하는데 있어서 로딩이 걸리면 true

isTransition: 이 페이지를 이동하는데 transition으로 적용한 효과가 적용되고 있다 true

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
              //부드러운 전환효과
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

### ReactRouter v7 <Form>

action 태그 사용

```tsx
//이렇게 작성하면 submit과 함께 데이터 전송+페이지 이동
<Form action="/">
  <input type="email" name="email" autoComplete="off" />
  <input type="password" name="pw" />
  <button type="submit">로그인</button>
</Form>
```

```tsx
import { Form, useActionData } from "react-router";

export default function Login() {
  const data = useActionData();
  return (
    <>
      {/* <form></form> */}
      <Form method="post">
        <input type="email" name="email" autoComplete="off" />
        <input type="password" name="pw" />
        <button type="submit">로그인</button>
      </Form>
      //action에서 반환한 값 출력
      <p>{data && data.message}</p>
    </>
  );
}

//index.tsx
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

### ReactRouter v7 loader 속성으로 데이터 패칭

```tsx
//이렇게 데이터를 받아와서 보여주기 가능
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../api/axios";

export default function Post() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axiosInstance.get("/posts");
      setPosts(data);
    };
    fetchPosts();
  }, []);
  return (
    <>
      <h1>Post Component</h1>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </>
  );
}
```

```tsx
//index.tsx
      {
        path: "/post-loader",
        Component: PostLoader,
        loader: async () => {
          const { data } = await axiosInstance.get("/posts");
          return data;
        },
      },

 //loader라는 속성은 비동기 함수를 값으로 설정할 수 있음
 //data를 post요청을 하고 리턴해줌

 //PostLoader.tsx
 import { useLoaderData } from "react-router";

interface Posts {
  id: number;
  title: string;
  views: number;
}
export default function PostLoader() {
//리턴해준 데이터를 posts에 저장함
//postloader는 클릭했을때 데이터 패칭이 끝날때까지 화면 전환이 일어나지 않음
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

### React Router v7 loader+loading

hydrateFallback 속성으로 데이터 패칭을 기다리는 로딩 동안 보여줄 대체 ui를 추가할 수 있음

```tsx
     //index.tsx
      {
        path: "/post-loader",
        Component: PostLoader,
        loader: async () => {
          const { data } = await axiosInstance.get("/posts");
          return data;
        },
        HydrateFallback: PostLoading,
      },

      //PostLoading.tsx
      export default function PostLoading() {
  return (
    <>
      <p>Loading..</p>
    </>
  );
}
```

이건 해당 라우트 경로 안에서 새로고침을 하는 경우에만 적용됨

```tsx
//Default.tsx
import { NavLink, Outlet } from "react-router";

export default function Default() {
  return (
    <>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/post">Post</NavLink>
        </li>
        <li>
          //다른 라우트에서 해당 라우트로 이동했을때 보여주는 방법
          <NavLink to="/post-loader">
            {({ isPending }) =>
              isPending ? "Post-Loader(Loading..)" : "Post-Loader"
            }
          </NavLink>
        </li>
      </ul>
      <Outlet />
    </>
  );
}
```

### ReactRouter v7 loading+error

```tsx
//index.tsx
      {
        path: "/post-loader",
        Component: PostLoader,
        loader: async () => {
          const { data } = await axiosInstance.get("/posts");
          return data;
        },
        HydrateFallback: PostLoading,
        errorElement: <PostError />,
      },
```

errorElement를 사용해서 에러 발생시 보여줄 컴포넌트 설정 가능

```tsx
//PostError.tsx
import { isRouteErrorResponse, useRouteError} from "react-router"

export default function PostError () {
    const error = useRouteError();

    if(isRouteErrorResponse(error)){
        return {
            <div>
            <h1>{error.status}</h1>
            <h1>{error.data.message}</h1>
            </div>
        }
    }
  return (
    <>
      <h1>PostError Component</h1>
    </>
  );
}
```

useRouteError라는 커스텀 훅을 사용해서 에러 객체를 가져오고

isRouteErrorResponse를 사용해서 리스폰스 관련된 에러인지를 확인하고 에러 메시지를 이렇게 렌더링 가능
