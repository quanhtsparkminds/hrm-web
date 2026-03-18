import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/slices/UiSlice";

const RouteLoader = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // We no longer show the global full-screen loader on every route change
    // to provide a smoother, non-intrusive user experience.
    // Major operations (Login, Signup, Logout) will handle their own loading state.
  }, [location.pathname]);

  return null;
};

export default RouteLoader;
