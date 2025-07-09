import { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null); // eslint-disable-line
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
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-emerald-700 mb-4 text-center">
        Your Profile
      </h2>

      {message && (
        <p
          className={`text-center mb-4 ${
            message.toLowerCase().includes("error") ? "text-red-600" : "text-gray-700"
          }`}
        >
          {message}
        </p>
      )}

      {user && (
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {user.firstName} {user.lastName}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {user.role}
          </p>
          <p>
            <span className="font-semibold">Bio:</span> {user.bio || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Skills:</span>{" "}
            {user.skills?.join(", ") || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Goals:</span> {user.goals || "N/A"}
          </p>
        </div>
      )}
    </div>
  );

};

export default Dashboard;
