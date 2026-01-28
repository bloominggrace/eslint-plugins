# tailwindcss-categorized

cn(), cva() 내부의 클래스를 카테고리별로 정렬하는 플러그인입니다.

## 설치

```bash
npm install -D eslint-plugin-tailwindcss-categorized
```

## 적용 방법

```js
// eslint.config.mjs
import tailwindCategorized from 'tailwind-categorized';

export default tseslint.config([
  plugins: {
      'tailwind-categorized': tailwindCategorized,
    },
    rules: {
      'tailwind-categorized/order': 'warn',
    },
]);
```
