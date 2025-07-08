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
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-emerald-700 text-center">
        {userRole === "mentee" ? "Sent Requests" : "Incoming Requests"}
      </h2>

      {message && <p className="text-center text-red-600 mb-4">{message}</p>}

      <ul className="space-y-6">
        {requests.map((req: any) => (
          <li key={req._id} className="border-b pb-4">
            <p>
              <span className="font-semibold">To/From:</span>{" "}
              {displayName(req)}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className="capitalize">{req.status}</span>
            </p>

            {/* Mentor controls */}
            {userRole === "mentor" && req.status === "pending" && (
              <div className="mt-2 space-x-2">
                <button
                  className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700"
                  onClick={() => handleAction(req._id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleAction(req._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            )}

            {/* Mentee controls */}
            {userRole === "mentee" &&
              req.status === "accepted" &&
              req.mentor?._id && (
                <button
                  onClick={() => fetchAvailability(req.mentor._id)}
                  className="mt-2 inline-block bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700"
                >
                  Book Session
                </button>
              )}
          </li>
        ))}
      </ul>

      {/* Slot picker */}
      {availability.length > 0 && selectedMentorId && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-2">Pick a Slot:</h4>
          <ul className="space-y-2">
            {availability.map((slot) => (
              <li key={slot._id}>
                {slot.day}: {slot.startTime} - {slot.endTime}{" "}
                <button
                  className="ml-2 bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded"
                  onClick={() => bookSession(selectedMentorId, slot)}
                >
                  Book
                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 text-sm text-gray-600 hover:text-gray-800 underline"
            onClick={() => setAvailability([])}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );

};

export default Requests;
