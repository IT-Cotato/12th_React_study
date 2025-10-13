# 12th_React_study

12기 코테이토 React 스터디 1번 팀 입니다. <br/>
매주 Inflearn 타입스크립트로 배우는 리액트(React.js) : 기초부터 최신 기술까지 완벽하게 강의를 듣고,
배운 내용을 정리하고 팀원들과 학습한 것을 나누고 있습니다. <br/>
학습이 끝나고 배운 내용을 바탕으로 추가 활동을 진행할 예정입니다.

---

| 전지원 | 박소은 | 이정원 | 정예찬 |
|:------:|:------:|:------:|:------:|
| <img src="https://github.com/jivvonC.png" width="150" height="150" /> | <img src="https://github.com/soeun-727.png" width="150" height="150" /> | <img src="https://github.com/jeongbam.png" width="150" height="150" /> | <img src="https://github.com/metjyc.png" width="150" height="150" /> |
| [@Jiwon Chon](https://github.com/jivvonC) | [@soeun-727](https://github.com/soeun-727) | [@jeongbam](https://github.com/jeongbam) | [@metjyc](https://github.com/metjyc) |
| 12기 FE | 12기 FE | 12기 FE | 12기 FE |

---

## 🗓️ 스터디 일정

- **정기 모임**: 매주 화요일 오후 11시
- **진행 방식**: 비대면 디스코드
- **과제 제출**: 매주 화요일 정기 모임 전까지

---

## 📖 학습 커리큘럼

총 20개의 섹션을 매주 협의 하에 나눠서 진행 중

---

## 🧭 스터디 진행 방식

매주 정해진 섹션을 모두 학습한 후에 개인 노션, 기술 블로그 등에 배운 내용을 정리해서 기록. <br/>
깃허브에 정리한 내용 올리기. <br/>
디스코드를 통해서 팀원들과 자신이 학습하고 정리한 내용을 공유, 그 외에 찾아본 내용 나누기.

---

## 🧑‍💻 GitHub 운영 방식

**1. 초기 설정**


  - 스터디 저장소를 로컬로 clone
  
    ```bash
    git clone https://github.com/IT-Cotato/12th_React_study.git
    ```

  - 정리 내용 제출 전 본인 깃허브 핸들명으로 브랜치를 생성

    ```bash
    git checkout -b [본인 깃허브 핸들명]/week[n]
    ```
  - 본인의 기본 디렉토리 구조를 생성

    ```bash
    mkdir -p [본인 깃허브 핸들명]/week1
    ```

    
**2. 학습 내용 업로드**

  - 학습 내용을 [본인 깃허브 핸들명]/week[n] 안에 md 형식으로 작성 후 커밋




**3. 커밋 및 PR 생성**

  - 커밋

    ```bash
    git add .
    git commit -m "[Docs] 정예찬 n주차 제출"
    git push origin [본인 깃허브 핸들명]/week[n]
    ```

  - GitHub에서 develop 브랜치로 PR을 생성

  - PR 제목은 "[n주차] 이름" 형식으로 작성

## 📁 디렉토리 구조

```bash
/
├── README.md                        
├── 📁 [Jiwon Chon]/                    # 전지원 제출물
│   ├── 📁 week01/                   
│   │   ├── 📄 1주차 컴포넌트 기본 정리.md
│   │
│   ├── 📁 week02/
│   │   ├── 📄 2주차 이벤트와 props 정리.md
│   │   └── ...
│   └── ...
│
├── 📁 [soeun-727]/                 # 박소은 제출물
│   ├── 📁 week01/
│   └── ...
│
├── 📁 [jeongbam]/             # 이정원 제출물
│   ├── 📁 week01/
│   └── ...
│
├── 📁 [metjyc]/                     # 정예찬 제출물
│   ├── 📁 week01/
│   └── ...
│
└── 
```

**4. 다음 과제 세팅**

  - PR이 merge된 후, 최신 develop 브랜치를 pull

    ```bash
    git checkout develop
    git pull origin develop
    git checkout -b [본인 깃허브 핸들명]/week[n+1]
    ```

 - 해당 주차의 폴더를 생성
    ```bash
    mkdir -p [본인 깃허브 핸들명]/week[n+1]
    ```


