/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [message, setMessage] = useState("");
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

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

  const fetchAvailability = async (mentorId: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/v1/availability/${mentorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Could not fetch availability.");
        return;
      }

      setSelectedMentorId(mentorId);
      setAvailability(data.availability || []);
    } catch (err) {
      console.error(err);
      setMessage("Error loading availability.");
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
        body: JSON.stringify({ status }),
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

  const bookSession = async (mentorId: string, slot: any) => {
    const scheduledAt = new Date(); // Optional: calculate proper datetime
    scheduledAt.setHours(Number(slot.startTime.split(":")[0]));
    scheduledAt.setMinutes(Number(slot.startTime.split(":")[1]));

    try {
      const res = await fetch(`${baseUrl}/api/v1/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mentorId,
          scheduledAt,
          notes: "Looking forward to learning!", // optional
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to book session");
        return;
      }

      setMessage("Session booked successfully!");
      setSelectedMentorId(null);
      setAvailability([]);
    } catch (err) {
      console.error(err);
      setMessage("Error booking session.");
    }
  };

  const displayName = (request: any) => {
    if (userRole === "mentee") {
      return `${request.mentor.firstName} ${request.mentor.lastName}`;
    } else {
      return `${request.mentee.firstName} ${request.mentee.lastName}`;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>{userRole === "mentee" ? "Sent Requests" : "Incoming Requests"}</h2>

      {message && <p>{message}</p>}

      <ul>
        {requests.map((req: any) => (
          <li key={req._id} style={{ marginBottom: "1rem" }}>
            To/From: <strong>{displayName(req)}</strong> <br />
            Status: <strong>{req.status}</strong> <br />
            {/* Mentor controls */}
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
            {/* Mentee controls: Book session if accepted */}
            {userRole === "mentee" &&
              req.status === "accepted" &&
              req.mentor?._id && (
                <button onClick={() => fetchAvailability(req.mentor._id)}>
                  Book Session
                </button>
              )}
          </li>
        ))}
      </ul>

      {/* Slot picker */}
      {availability.length > 0 && selectedMentorId && (
        <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <h4>Pick a Slot:</h4>
          <ul>
            {availability.map((slot) => (
              <li key={slot._id}>
                {slot.day}: {slot.startTime} - {slot.endTime}{" "}
                <button
                  onClick={() => bookSession(selectedMentorId, slot)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Book
                </button>
              </li>
            ))}
          </ul>
          <button onClick={() => setAvailability([])}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Requests;
