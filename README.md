This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Create a new [GitHub OAuth App](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/).

Create a `.env` file and set the following environment variables with your GitHub OAuth App Client ID and Client Secret:

```
NEXT_PUBLIC_GITHUB_CLIENT_ID=CLIENT_ID_HERE
GITHUB_CLIENT_SECRET=CLIENT_SECRET_HERE
```

Then, run the development server:

```bash
npm start
```

Open [http://localhost:8888](http://localhost:8888) with your browser to see the result.

![App screenshot](https://github.com/danielddb/nextjs-github-app/blob/master/app.png)
