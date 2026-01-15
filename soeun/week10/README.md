# 섹션 16. 데이터 통신

## 1. 데이터 패칭 기초 개념

### 데이터 통신

- 컴포넌트가 서버에 외부 데이터를 요청하고, 그 응답을 받아 상태로 반영하여 UI를 업데이트하는 과정
- API
  - 데이터 통신을 통해서 서버의 데이터를 요청할 때 사용하는 개념
  - 클라이언트가 서버와 통신하기 위한 통신 규칙
  - 일반적으로 많이 사용되는 API 종류에는 REST API와 GraphQL이 있음
- REST API
  - 주소로서 데이터를 구분하는 API 설계 방식
  ```tsx
  https://api.example.com/user/1?lang=ko
  ```
- HTTP(S) 통신
  - 내부적으로 메서드를 사용하여 데이터 통신의 역할을 구분함
  - GET: 데이터 요청
  - POST: 데이터 추가
  - PUT, PATCH: 데이터 수정
    - 어떤 데이터를 수정할 지 알려주기 위해 마지막에 고유한 id값을 그대로 넣어야 함
    - 이론적으로 PUT은 전체 데이터 변경, PATCH는 일부 데이터 변경이지만 실무에서는 구분하지 않고 사용함
  - DELETE: 데이터 삭제

## 2. json-server

- JSON 파일 하나만 있으면 바로 실행해 볼 수 있는 가짜 REST API 서버 도구

### 설치

```tsx
npm install json-server@0.17.3
```

- package.json 파일에서 설치를 확인할 수 있음

```tsx
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "server": "npx json-server server/db.json"
  },
```

```tsx
{
  "posts": [
    { "id": "1", "title": "a title", "views": 100 },
    { "id": "2", "title": "another title", "views": 200 }
  ],
  "comments": [
    { "id": "1", "text": "a comment about post 1", "postId": "1" },
    { "id": "2", "text": "another comment about post 1", "postId": "1" }
  ],
  "profile": {
    "name": "typicode"
  }
}
```

- `npm run server`를 통해 json-server 실행

### Thunder Client 활용

- VSC extention으로 REST API의 호출을 쉽게 테스트해볼 수 있음
- `New Request`를 통해 새로운 Request 창을 열어, 호출하고 싶은 API의 경로를 입력한 뒤 Send 버튼을 누르면 됨
  ![image.png](attachment:dce696fd-665d-49c8-8dc8-1f894be95404:image.png)
- HTTP 메서드로 데이터 조회, 수정, 삭제, 추가 가능

### 추가 기능

**페이징 기능**

- json 서버는 데이터를 요청할 때 Query String으로 `_page` 를 붙이면 페이징 처리가 되도록 설계되어 있음
  ```tsx
  http://localhost:3000/posts?_page=1
  ```
  - 한 페이지 당 기본값은 10개
  - 수정을 하려면 `_limit` Query String을 붙이면 됨
  ```tsx
  http://localhost:3000/posts?_page=1&_limit=3
  ```

**검색**

- `q` 쿼리스트링을 통해 검색
  ```tsx
  http://localhost:3000/posts?q=Post#22
  ```

**딜레이**

- json-server 0.17.3 버전까지만 지원함
  ```tsx
  "scripts": {
      "dev": "vite",
      "build": "tsc -b && vite build",
      "lint": "eslint .",
      "preview": "vite preview",
      "server": "npx json-server server/db.json",
      "delay": "npx json-server server/db.json --delay 2000"
    },
  ```
  - 모든 요청이 2초의 지연 시간을 가지게 됨

## 2. fetch

**basic**

- 리액트에서 모든 데이터 통신은 side effect로 취급됨
- side effect를 처리할 때 사용할 수 있는 useEffect Hook 사용 가능
- 데이터 통신을 위해 웹에서 제공하는 내장함수인 fetch 사용
  ```tsx
  import { useEffect } from "react";

  export default function Fetch() {
    useEffect(() => {
      //컴포넌트가 생성될 때 최초로 1회만 API 데이터 통신을 하는 코드 추가
      fetch("http://localhost:3000/posts");
    }, []); //의존성 배열 빈 배열로 지정
    return (
      <>
        <h3>Fetch</h3>
      </>
    );
  }
  ```
  ![image.png](attachment:672699b6-c81f-49b3-8951-d7939942f7b1:image.png)
  - strict 모드이기 때문에 네트워크 통신이 두번씩 발생함
- 데이터 통신의 결과를 화면에서 렌더링하려면 Promisethen 방식으로 데이터 통신의 결과를 then이라는 메서드를 사용해서 받아야 함
  ```tsx
  import { useEffect } from "react";

  export default function Fetch() {
    useEffect(() => {
      //컴포넌트가 생성될 때 최초로 1회만 API 데이터 통신을 하는 코드 추가
      fetch("http://localhost:3000/posts").then((response) =>
        console.log(response)
      );
    }, []); //의존성 배열 빈 배열로 지정
    return (
      <>
        <h3>Fetch</h3>
      </>
    );
  }
  ```
  ![image.png](attachment:8dbc0df8-694e-4cad-bfe4-32da10c2dcbe:image.png)
  - [Prototype] 객체 내 json이라는 메서드는 서버에서 json 문자열로 응답된 데이터를 자바스크립트가 이해할 수 있는 객체나 배열로 파싱해주는 역할을 하는 메서드임
- json() 메서드 활용
  ```tsx
  import { useEffect } from "react";

  export default function Fetch() {
    useEffect(() => {
      //컴포넌트가 생성될 때 최초로 1회만 API 데이터 통신을 하는 코드 추가
      fetch("http://localhost:3000/posts")
        .then((response) => {
          console.log(response);
          return response.json(); //자바스크립트가 이해할 수 있는 배열/객체로 변환되어 다시 리턴
        })
        .then((data) => console.log(data));
    }, []); //의존성 배열 빈 배열로 지정
    return (
      <>
        <h3>Fetch</h3>
      </>
    );
  }
  ```
  ![image.png](attachment:aa301adb-0145-4275-8500-7542ba250d93:image.png)

```tsx
import { useEffect, useState } from "react";
interface Posts {
  id: number;
  title: string;
  views: number;
}
export default function Fetch() {
  const [posts, setPosts] = useState<Posts[]>([]);
  useEffect(() => {
    //컴포넌트가 생성될 때 최초로 1회만 API 데이터 통신을 하는 코드 추가
    fetch("http://localhost:3000/posts")
      .then((response) => {
        console.log(response);
        return response.json(); //자바스크립트가 이해할 수 있는 배열/객체로 변환되어 다시 리턴
      })
      .then((data) => setPosts(data));
  }, []); //의존성 배열 빈 배열로 지정
  return (
    <>
      <h3>Fetch</h3>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}
```

**loading**

- 데이터 통신 시 화면에 표시되는 데이터가 새로고침 시 깜빡거림
  - 컴포넌트가 화면에 그려진 이후 useEffect의 이펙트 함수가 실행됨
  - 이펙트 함수 내부의 fetch API도 비동기로 동작하기 때문에 데이터를 요청하고 받아 상태에 세팅하기까지 시간에 텀이 있기 때문
- 응답 지연에 대비하고 깜빡이는 현상을 없애기 위한 방법
  ```tsx
  import { useEffect, useState } from "react";
  interface Posts {
    id: number;
    title: string;
    views: number;
  }
  export default function Fetch() {
    const [posts, setPosts] = useState<Posts[]>([]);
    **const [isLoading, setIsLoading] = useState(false);**
    useEffect(() => {
      **setIsLoading(true);**
      //컴포넌트가 생성될 때 최초로 1회만 API 데이터 통신을 하는 코드 추가
      fetch("http://localhost:3000/posts")
        .then((response) => {
          console.log(response);
          return response.json(); //자바스크립트가 이해할 수 있는 배열/객체로 변환되어 다시 리턴
        })
        .then((data) => setPosts(data))
        **.finally(() => {
          setIsLoading(false);
        });**
    }, []); //의존성 배열 빈 배열로 지정

    **if (isLoading) return <p>Loading...</p>;**

    return (
      <>
        <h3>Fetch</h3>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </>
    );
  }
  ```
  - JSON 서버에서 지연을 주고 다시 가동해보면 로딩 화면을 볼 수 있음

**error**

- 에러가 발생하는 경우
- 도메인에 해당하는 API 자원이 없는 404 에러
  - response 객체에서 에러를 잡아야 함
  - OK 속성 활용
  ```tsx
  import { useEffect, useState } from "react";
  interface Posts {
    id: number;
    title: string;
    views: number;
  }
  export default function Fetch() {
    const [posts, setPosts] = useState<Posts[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
      setIsLoading(true);
      //컴포넌트가 생성될 때 최초로 1회만 API 데이터 통신을 하는 코드 추가
      fetch("http://localhost:3000/posts")
        .then((response) => {
          **if (!response.ok) throw new Error("네트워크 통신 오류");**
          return response.json(); //자바스크립트가 이해할 수 있는 배열/객체로 변환되어 다시 리턴
        })
        .then((data) => setPosts(data))
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, []); //의존성 배열 빈 배열로 지정

    if (isLoading) return <p>Loading...</p>;

    return (
      <>
        <h3>Fetch</h3>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </>
    );
  }
  ```
- 도메인 자체가 틀렸을 때의 네트워크 에러
  ```tsx
  import { useEffect, useState } from "react";
  interface Posts {
    id: number;
    title: string;
    views: number;
  }
  export default function Fetch() {
    const [posts, setPosts] = useState<Posts[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
      setIsLoading(true);
      //컴포넌트가 생성될 때 최초로 1회만 API 데이터 통신을 하는 코드 추가
      fetch("http://localhost:3000/posts")
        .then((response) => {
          console.log(response);
          return response.json(); //자바스크립트가 이해할 수 있는 배열/객체로 변환되어 다시 리턴
        })
        .then((data) => setPosts(data))
        **.catch((e) => {
          console.log(e);
        })**
        .finally(() => {
          setIsLoading(false);
        });
    }, []); //의존성 배열 빈 배열로 지정

    if (isLoading) return <p>Loading...</p>;

    return (
      <>
        <h3>Fetch</h3>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </>
    );
  }

  ```

```tsx
import { useEffect, useState } from "react";
interface Posts {
  id: number;
  title: string;
  views: number;
}
export default function Fetch() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    setIsLoading(true);
    setError("");
    fetch("http://localhost:3000/posts")
      .then((response) => {
        if (!response.ok) throw new Error("네트워크 통신 오류");
        return response.json();
      })
      .then((data) => setPosts(data))
      .catch((e) => {
        console.log(e);
        setError(e instanceof Error ? e.message : "Unknown Error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h3>Fetch</h3>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}
```

**signal**

- 데이터 요청을 취소하는 기능
- Abort 인스턴스 객체 필요
- fetch 함수의 두 번째 매개변수는 객체로 여러 옵션 속성을 지정할 수 있음
  ```tsx
  import { useEffect, useState } from "react";
  interface Posts {
    id: number;
    title: string;
    views: number;
  }
  export default function Fetch() {
    const [posts, setPosts] = useState<Posts[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
      **const controller = new AbortController();**
      setIsLoading(true);
      setError("");
      fetch("http://localhost:3000/posts", **{
        signal: controller.signal,
      }**)
        .then((response) => {
          if (!response.ok) throw new Error("네트워크 통신 오류");
          return response.json();
        })
        .then((data) => setPosts(data))
        .catch((e) => {
          console.log(e);
          setError(e instanceof Error ? e.message : "Unknown Error");
        })
        .finally(() => {
          setIsLoading(false);
        });

      **return () => controller.abort();**
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <>
        <h3>Fetch</h3>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </>
    );
  }
  ```

**async**

- 데이터 통신 시 promise-then 방식이 아닌 async/await 방식을 사용할 수 있음
- useEffect 훅 자체의 이펙트 함수는 async로 지정할 수 없게 설계되어 있지만 이펙트 함수 내 async로 정의된 함수 재정의는 가능함
  ```tsx
  import { useEffect, useState } from "react";
  interface Posts {
    id: number;
    title: string;
    views: number;
  }
  export default function Fetch() {
    const [posts, setPosts] = useState<Posts[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
      const controller = new AbortController();
      //함수 정의
      const fetchPosts = async () => {
        setIsLoading(true);
        setError("");
        try {
          const response = await fetch("http://localhost:3000/posts", {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error("네트워크 통신 오류");
          const data = await response.json();
          setPosts(data);
        } catch (e) {
          if (e instanceof Error && e.name !== "AbortError")
            setError(e.message);
        } finally {
          if (!controller.signal.aborted) setIsLoading(false);
        }
      };
      fetchPosts();
      return () => controller.abort();
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <>
        <h3>Fetch</h3>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </>
    );
  }
  ```

**crud**

- GET 외에 POST, PUT, PATCH, DELETE 등의 메서드를 사용하는 요청
  ```tsx
  export default function FetchCrud() {
    const fetchGet = async () => {
      const response = await fetch("http://localhost:3000/posts");
      const data = await response.json();
      console.log(data);
    };
    const fetchPost = async () => {
      const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "a new title",
          views: 155,
        }),
      });
      const data = await response.json();
      console.log(data);
    };
    const fetchPut = async () => {
      const response = await fetch("http://localhost:3000/posts/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "a modify title",
          views: 155,
          //id는 넘겨주지 않아도 됨
        }),
      });
      const data = await response.json();
      console.log(data);
    };
    const fetchPatch = async () => {
      const response = await fetch("http://localhost:3000/posts/1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "a patch title",
        }),
      });
      const data = await response.json();
      console.log(data);
    };
    const fetchDelete = async () => {
      await fetch("http://localhost:3000/posts/101", {
        method: "DELETE",
      });
    };
    return (
      <>
        <button onClick={fetchGet}>GET</button>
        <button onClick={fetchPost}>POST</button>
        <button onClick={fetchPut}>PUT</button>
        <button onClick={fetchPatch}>PATCH</button>
        <button onClick={fetchDelete}>DELETE</button>
      </>
    );
  }
  ```

## 3. axios

- 데이터 요청 시 fetch API가 아닌 axios 라이브러리를 활용할 수도 있음

```tsx
 npm install axios
```

- fetch와는 다르게 response 객체를 받아 JSON 메소드로 자바스크립트에서 사용 가능한 형태로 변형할 필요 없이 자동으로 변환이 됨
  ```tsx
  import axios from "axios";
  export default function AxiosCrud() {
    const fetchGet = async () => {
      //구조분해 할당
      const { data, status } = await axios.get("http://localhost:3000/posts");
      console.log(data, status);
    };
    const fetchPost = async () => {
      const { data } = await axios.post("http://localhost:3000/posts", {
        title: "a axios data",
        views: 50,
      });
      console.log(data);
    };
    const fetchPut = async () => {
      const { data } = await axios.put("http://localhost:3000/posts/101", {
        title: "a axios modify data",
        views: 100,
      });
      console.log(data);
    };
    const fetchPatch = async () => {
      const { data } = await axios.patch("http://localhost:3000/posts/101", {
        title: "a axios modify data 2",
        views: 40,
      });
      console.log(data);
    };
    const fetchDelete = async () => {
      const { data, status } = await await axios.delete(
        "http://localhost:3000/posts/101"
      );
      console.log(data, status);
    };
    return (
      <>
        <button onClick={fetchGet}>GET</button>
        <button onClick={fetchPost}>POST</button>
        <button onClick={fetchPut}>PUT</button>
        <button onClick={fetchPatch}>PATCH</button>
        <button onClick={fetchDelete}>DELETE</button>
      </>
    );
  }
  ```
- fetch 대신 axios 사용한 모습
  ```tsx
  import { useEffect, useState } from "react";
  import axios from "axios";
  interface Posts {
    id: number;
    title: string;
    views: number;
  }
  export default function Axios() {
    const [posts, setPosts] = useState<Posts[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
      const controller = new AbortController();
      const axiosPosts = async () => {
        setIsLoading(true);
        setError("");
        try {
          const { data } = await axios.get("http://localhost:3000/posts", {
            signal: controller.signal,
          });
          setPosts(data);
        } catch (e) {
          if (e instanceof Error && e.name !== "CanceledError")
            setError(e.message);
        } finally {
          if (!controller.signal.aborted) setIsLoading(false);
        }
      };

      axiosPosts();

      return () => controller.abort();
    }, []);

    if (error) return <p>Error: {error}</p>;

    return (
      <>
        <h3>Axios</h3>
        <ul>
          {isLoading ? (
            <p>Loading... </p>
          ) : (
            posts.map((post) => <li key={post.id}>{post.title}</li>)
          )}
        </ul>
      </>
    );
  }
  ```

**instance**

- axios는 기본 설정이 미리 적용된 인스턴스 객체를 간편하게 생성할 수 있는 기능을 제공함
- create 메서드의 객체 속성으로 초기 설정값을 옵션으로 넘겨줄 수 있음
  ```tsx
  import axios from "axios";

  export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000,
    headers: {
      "Content-Type": "applicaation/json",
    }, //기본 설정이므로 생략 가능
  });
  ```
  ```tsx
  await axiosInstance.get("http://... 와 같이 불러옴
  ```
