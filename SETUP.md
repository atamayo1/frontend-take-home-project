# Classkick Frontend Engineering Take Home Project

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Node version
```
Ensure node: '>=16.8.0'
```

## Getting Started

First, install the dependencies:
```
npm ci
```


Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/)


Internal Documentation Summary for Canvas Component: canvasRef Reference: Used to access the canvas's drawing context, allowing for efficient operations without the need for repeated DOM lookups.

State Handling: Each state has a clear purpose and how it affects the behavior of the component is documented (e.g., drawing to control whether the user is drawing, tool to select the current tool, textBoxes to store positions and text, etc.).

Function Comments: Explains what each function does (startDrawing, draw, stopDrawing) and how it interacts with states and the canvas reference.

useEffect Effects: Documents how effects initialize the canvas and redraw its contents when the relevant states change.