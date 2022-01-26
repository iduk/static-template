# Webpack + Handlebars Setup

## Goals

---

### Static 환경 구성

- html, js, css 정적인 구성요소를 빠르고 효율적으로 배포할 수 있는 프로젝트형 구조
- 가공한 파일들로 개발이 원활하게 진행될 수 있도록 배포되야 한다.
- 프레임워크를 사용하지 않고 순정으로 진행할 때 활용

---

### 작업환경

- webpack + express 설정으로 작업환경과 배포환경을 설정해줌
- handlebars 템플릿 엔진 활용  
  block 요소를 분리(partial)시켜 호출할 수 있도록 컴파일해줌으로 html을 컴포넌트 형태로 작업 가능
- Sass & Css Modules 사용
