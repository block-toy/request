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
``` base
npm run api
```

### demo
```jsx
const {data} = useRequest(fetchData) 
```

