import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-4">
          <Briefcase className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
          <p className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</p>
          <p className="text-gray-600 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard")} className="px-8">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
