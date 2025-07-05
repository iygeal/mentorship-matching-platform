import { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Not authenticated. Please log in.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "https://mentorship-by-iygeal.onrender.com/api/v1/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Failed to fetch user profile.");
          return;
        }

        setUser(data.user);
        setMessage("");
      } catch (err) {
        console.error(err);
        setMessage("Error fetching profile.");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Dashboard</h2>
      {message && <p>{message}</p>}
      {user && (
        <div>
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Bio:</strong> {user.bio || "N/A"}
          </p>
          <p>
            <strong>Goals:</strong> {user.goals || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
