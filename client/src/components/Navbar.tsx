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
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link> |{" "}
      {user?.role === "mentor" && (
        <>
          <Link to="/dashboard">Profile</Link> |{" "}
          <Link to="/role-dashboard">Dashboard</Link> |{" "}
          <Link to="/requests">Requests</Link> |{" "}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
      {user?.role === "mentee" && (
        <>
          <Link to="/dashboard">Profile</Link> |{" "}
          <Link to="/role-dashboard">Dashboard</Link> |{" "}
          <Link to="/mentors">Mentors</Link> |{" "}
          <Link to="/requests">Requests</Link> |{" "}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
      {!user && (
        <>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
