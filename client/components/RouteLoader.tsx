import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/slices/UiSlice";

const RouteLoader = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Show loader on route change
    dispatch(setLoading(true));

    // Hide loader after a short delay or when the page is likely rendered
    // In a real app, this might be handled by data fetching in the page component
    // but this ensures the user sees something during transition
    const timer = setTimeout(() => {
      dispatch(setLoading(false));
    }, 500); // 500ms delay to feel "premium" but not slow

    return () => clearTimeout(timer);
  }, [location.pathname, dispatch]);

  return null;
};

export default RouteLoader;
