/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role;
  const baseUrl = "https://mentorship-by-iygeal.onrender.com";

  const fetchRequests = async () => {
    setUserRole(role || "");

    if (!token || !role) {
      setMessage("You must be logged in.");
      return;
    }

    const endpoint =
      role === "mentee" ? "/api/v1/requests/sent" : "/api/v1/requests/received";

    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to fetch requests");
        return;
      }

      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching requests.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const displayName = (request: any) => {
    if (userRole === "mentee") {
      return `${request.mentor.firstName} ${request.mentor.lastName}`;
    } else {
      return `${request.mentee.firstName} ${request.mentee.lastName}`;
    }
  };

  const handleAction = async (id: string, status: "accepted" | "rejected") => {
    try {
      const res = await fetch(`${baseUrl}/api/v1/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }), // lowercase as required
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to update request");
        return;
      }

      setMessage(`Request ${status}.`);
      fetchRequests(); // refresh
    } catch (err) {
      console.error(err);
      setMessage("Error updating request.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>{userRole === "mentee" ? "Sent Requests" : "Incoming Requests"}</h2>

      {message && <p>{message}</p>}

      <ul>
        {requests.map((req: any) => (
          <li key={req._id} style={{ marginBottom: "1rem" }}>
            To/From: <strong>{displayName(req)}</strong> <br />
            Status: <strong>{req.status}</strong> <br />
            {/* Show Accept/Reject if mentor and status is pending */}
            {userRole === "mentor" && req.status === "pending" && (
              <>
                <button
                  onClick={() => handleAction(req._id, "accepted")}
                  style={{ marginRight: "0.5rem" }}
                >
                  Accept
                </button>
                <button onClick={() => handleAction(req._id, "rejected")}>
                  Reject
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Requests;
