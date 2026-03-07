import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Authentication from "./pages/Authentication";
import { AuthProvider } from "./context/AuthContext";
import VideoMeetComponent from "./pages/VideoMeetComponent";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/auth" element={<Authentication />} />
        <Route path="/:url" element={<VideoMeetComponent/>}/>
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
