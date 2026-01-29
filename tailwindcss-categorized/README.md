# tailwindcss-categorized

cn(), cva() 함수 내부의 복잡한 클래스들을 의미 있는 카테고리별로 자동 정렬해주는 ESLint 플러그인입니다.

## 설치

```bash
npm install -D eslint-plugin-tailwindcss-categorized
```

## 설정

```ts
import tailwindCategorized from 'tailwindcss-categorized';

export default tseslint.config([
  {
    plugins: {
      'tailwindcss-categorized': tailwindCategorized,
    },
    rules: {
      'tailwindcss-categorized/ordering': 'error',
    },
  }
]);
```
