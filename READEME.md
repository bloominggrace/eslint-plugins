# ESLint Plugins

## 플러그인 종류

### tailwind-class-order

cn(), cva() 내부의 클래스를 카테고리별로 정렬하는 플러그인입니다.

#### 적용 방법

```js
// eslint.config.mjs
import tailwindClassOrder from 'tailwind-class-order';

export default tseslint.config([
  {
    plugins: {
      'tailwind-class-order': tailwindClassOrder,
    },
    rules: {
      'tailwind-class-order/order': 'warn',
    },
  },
]);
```
