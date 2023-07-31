# request

a tool that combines use hooks to simplify swagger requests

### config file

```json
// root directory :sw.json
{
  "swaggerUrl": "https://demo.xxxx.com/v2/api-docs",
  "host": "http://demo.xxxx.com",
  "mock": true,
  "verifyParams": true,
  "language": "js",
  "requestPath": "@/utils/request",
  "isDefaultExport": true
}
```

### bash 

Insert the following command in the scripts in the package.json file

```
  "prettier_api": "prettier --write src/apis/**/*.ts src/types/**/*.ts",  
  "api": "node api.js && npm run prettier_api"  
```

then run

```base
npm run api
```

### demo

```jsx
const { data } = useRequest(fetchData);
```

### generate request code demo

```typescript
/**
 * url: /account/auth2/login/mobile
 * tags: login-controller
 * summary: auth2手机验证码登录
 */
export const accountAuth2LoginMobile = (
  data: ReqAccountAuth2LoginMobile & ReqAccountAuth2LoginMobile['reqDTO'],
) =>
  request<ResAccountAuth2LoginMobile, ResAccountAuth2LoginMobile['data']>(
    `/easyya-account-user/account/auth2/login/mobile`,
    'post',
    data,
  );
```

### notice

- involving microservices need to modify api.js file
