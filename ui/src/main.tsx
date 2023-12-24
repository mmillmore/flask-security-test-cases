import React from 'react';
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  defer
} from "react-router-dom";
import Home from "./Home";
import Layout from "./Layout";
import { AuthLayout } from "./components/AuthLayout";
import { ProtectedLayout } from "./components/ProtectedLayout";
import LoginForm from "./login";
import { getCookieValue } from "./utils";

const getPermissions = () =>
  new Promise((resolve) =>{

    fetch("/admin/current_user", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        'X-XSRF-TOKEN': getCookieValue('XSRF-TOKEN')
      }
    })
    .then((response) => {
      if(!response.ok || response.status!=200){
        resolve([null,null,null]);
      }
      return response.json();
    }).then((data)=>{
      if("roles" in data){
        const userId=data.id
        const roles=data.roles
        const permissions_list = roles.flatMap(({ permissions }) => permissions);
        resolve([permissions_list,userId,data.email]);
      } else {
        resolve([null,null,null]);
      }

    });

  }
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<AuthLayout />}
      loader={() => defer({ userPromise: getPermissions() })}
    >

        <Route path="/login" element={<LoginForm />}/>

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            </Route>
          </Route>
        </Route>
  )
  );

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  )
  