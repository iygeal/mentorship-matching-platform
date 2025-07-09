import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-emerald-700 text-white px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-center sm:justify-start">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        {user?.role === "mentor" && (
          <>
            <Link to="/dashboard" className="hover:underline">
              Profile
            </Link>
            <Link to="/role-dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/requests" className="hover:underline">
              Requests
            </Link>
            <Link to="/availability" className="hover:underline">
              Availability
            </Link>
            <Link to="/sessions" className="hover:underline">
              Sessions
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-emerald-700 px-3 py-1 rounded hover:bg-gray-100 ml-2"
            >
              Logout
            </button>
          </>
        )}

        {user?.role === "mentee" && (
          <>
            <Link to="/dashboard" className="hover:underline">
              Profile
            </Link>
            <Link to="/role-dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/mentors" className="hover:underline">
              Mentors
            </Link>
            <Link to="/requests" className="hover:underline">
              Requests
            </Link>
            <Link to="/sessions" className="hover:underline">
              Sessions
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-emerald-700 px-3 py-1 rounded hover:bg-gray-100 ml-2"
            >
              Logout
            </button>
          </>
        )}

        {!user && (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
