import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { EmployeesPage } from "../pages/EmployeesPage";
import { EmployeeCreatePage } from "../pages/EmployeeCreatePage";
import { EmployeeEditPage } from "../pages/EmployeeEditPage";
import { EmployeeProfilePage } from "../pages/EmployeeProfilePage";
import { OrganizationStructurePage } from "../pages/OrganizationStructurePage";


const router = createBrowserRouter([
  {
    // Routes with MainLayout
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "employees",
        element: <EmployeesPage />,
      },
      {
        path: "employees/create",
        element: <EmployeeCreatePage />,
      },
      {
        path: "employees/:id",
        element: <EmployeeProfilePage />,
      },
      {
        path: "employees/:id/edit",
        element: <EmployeeEditPage />,
      },
      {
        path: "organization-structure",
        element: <OrganizationStructurePage />,
      },
    ],
  },
  {
    // Routes without layout (standalone pages)
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
