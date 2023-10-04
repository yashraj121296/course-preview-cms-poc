
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

To Run in production mode

```bash
npm start
# or
yarn start
```


[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/preview/code=YourCourseCode](http://localhost:3000/api/preview/code=YourCourseCode). This endpoint can be edited in `pages/api/preview.js`.

You Need to add following variable in your local env file-:
```
CONTENTFUL_SPACE_ID = {Your contenful Space ID}
CONTENTFUL_ACCESS_TOKEN = {Contenful access token }
CONTENTFUL_PREVIEW_ACCESS_TOKEN = {Contenful preview access token}
```
