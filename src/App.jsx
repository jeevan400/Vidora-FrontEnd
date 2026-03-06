import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
// import LandingPage from "./pages/LandingPage";
// import Layout from "./Layout";
// import Login from "./pages/login";
// import Register from "./pages/Register";
// import NotFound from "./pages/NotFound";
import LandingPage2 from "./pages/LandingPage2";
import Authentication from "./pages/Authentication";
import { AuthProvider } from "./context/AuthContext";

function App() {
  // const router = createBrowserRouter([
  //   {
  //     path: '/',
  //     element: <Layout/>,
  //     children: [
  //       {
  //         path:"/landingpage",
  //         element: <LandingPage/>
  //       }
  //     ]
  //   }
  // ])

  const router = createBrowserRouter(
    createRoutesFromElements(
      // <Route path="/" element={<Layout />}>
      //   <Route path="/landingpage" element={<LandingPage />} />
      //   <Route path="/login" element={<Login />} />
      //   <Route path="/register" element={<Register />} />
      //   <Route path="*" element={<NotFound />} />
      // </Route>,
      <>
        <Route path="/" element={<LandingPage2 />}></Route>
        <Route path="/auth" element={<Authentication />} />
      </>,
    ),
  );
  return (
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
  );
}

export default App;
