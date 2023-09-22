import { createRoot } from 'react-dom/client';
import App from 'pages/App';
import * as serviceWorkerRegistration from 'serviceWorkerRegistration';
import reportWebVitals from 'reportWebVitals';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import DataPanel from 'layout/DataPanel'
// const root = createRoot(document.getElementById("root") as HTMLElement);

// root.render(<App />);

const root = createRoot(document.getElementById("root") as HTMLElement);
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "data",
        element: <DataPanel />
      }
    ]
  },
]);

root.render(<RouterProvider router={router} />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

