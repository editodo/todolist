# React Native (Expo) 프로젝트 가이드 for EditoTodo

안녕하세요! React Native가 처음이신 사용자분을 위해 프로젝트 구조와 주요 파일들을 쉽게 설명해 드릴게요.

## 📂 폴더 구조 설명

이 `client` 폴더 안에는 앱과 웹을 동시에 실행하기 위한 모든 코드가 들어있습니다.

```text
client/
├── assets/            # 🖼️ 이미지, 폰트, 아이콘 등을 저장하는 곳
│   ├── adaptive-icon.png  # 앱 아이콘 (안드로이드/iOS)
│   └── ...
├── components/        # 🧩 재사용 가능한 조각들 (버튼, 헤더 등)
│   └── ...            # (우리가 앞으로 만들 것들이에요)
├── App.js             # 🚦 앱의 시작점! 여기서 화면이 시작됩니다.
├── app.json           # ⚙️ 앱 설정 파일 (앱 이름, 버전, 가로/세로 모드 등)
└── package.json       # 📦 설치된 라이브러리 목록 (npm install로 설치된 것들)
```

## 🚀 주요 개념 (쉽게 이해하기)

### 1. View (뷰)
- HTML의 `<div>`와 같습니다.
- 화면에 네모난 공간(박스)을 만들 때 사용해요.
- 예: `<View style={styles.container}> ... </View>`

### 2. Text (텍스트)
- HTML의 `<span>`, `<p>`, `<h1>` 등을 모두 대신합니다.
- 글자는 반드시 `<Text>` 태그 안에 넣어야 해요.
- 예: `<Text>안녕하세요!</Text>` (O), `View` 안에 그냥 글자 쓰기 (X)

### 3. StyleSheet (스타일시트)
- CSS와 거의 똑같지만, 자바스크립트 객체로 씁니다.
- `background-color` -> `backgroundColor` (카멜 케이스 사용)
- 예:
  ```javascript
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff', // 하얀색 배경
      alignItems: 'center',    // 가운데 정렬
    },
  });
  ```

## 🛠️ 실행 방법

터미널에서 `client` 폴더로 이동 후 아래 명령어를 입력하세요:

1.  **웹으로 보기 (추천)**:
    ```bash
    npx expo start --web
    ```
2.  **모바일로 보기**:
    - 스마트폰에 'Expo Go' 앱을 설치하세요.
    - `npx expo start` 입력 후 나오는 QR 코드를 찍으면 내 폰에서 바로 실행됩니다!

---
*앞으로 작업하면서 코드가 추가될 때마다 주석(설명)을 꼼꼼히 달아드릴게요!*
