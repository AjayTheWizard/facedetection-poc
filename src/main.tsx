import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import './index.css'
import HomePage from './routes/home';
import RegisterPage from './routes/register';
import VerifyPage from './routes/verify';

const router = createBrowserRouter([{
  path: "/",
  element: <HomePage />
}, {
  path: "/register",
  element: <RegisterPage />
}, {
  path: "/verify",
  element: <VerifyPage />
}])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
