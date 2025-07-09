/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

const Sessions = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [feedbackData, setFeedbackData] = useState<
    Record<string, { feedback: string; rating?: number }>
  >({});
  const [showFormFor, setShowFormFor] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role;
  const baseUrl = "https://mentorship-by-iygeal.onrender.com";

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/v1/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to fetch sessions.");
        return;
      }

      setSessions(data.sessions || []);
    } catch (err) {
      console.error(err);
      setMessage("Error loading sessions.");
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const displayName = (session: any) => {
    if (role === "mentee") {
      return `${session.mentor.firstName} ${session.mentor.lastName}`;
    } else {
      return `${session.mentee.firstName} ${session.mentee.lastName}`;
    }
  };

  const handleFeedbackChange = (
    sessionId: string,
    field: "feedback" | "rating",
    value: string
  ) => {
    setFeedbackData((prev) => ({
      ...prev,
      [sessionId]: {
        ...prev[sessionId],
        [field]: field === "rating" ? Number(value) : value,
      },
    }));
  };

  const submitFeedback = async (sessionId: string) => {
    const body = feedbackData[sessionId];
    if (!body || !body.feedback) {
      setMessage("Feedback is required.");
      return;
    }

    try {
      const res = await fetch(
        `${baseUrl}/api/v1/sessions/${sessionId}/feedback`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to submit feedback.");
        return;
      }

      setMessage("Feedback submitted successfully.");
      setShowFormFor(null);
      fetchSessions();
    } catch (err) {
      console.error(err);
      setMessage("Error submitting feedback.");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <ul className="space-y-6">
      {sessions.map((session) => (
        <li
          key={session._id}
          className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm"
        >
          <p>
            <span className="font-semibold">With:</span> {displayName(session)}
          </p>
          <p>
            <span className="font-semibold">Time:</span>{" "}
            {formatDateTime(session.scheduledAt)}
          </p>

          {session.feedback ? (
            <div className="mt-2">
              <p>
                <span className="font-semibold">Feedback:</span>{" "}
                <em>{session.feedback}</em>
              </p>
              {session.rating && (
                <p>
                  <span className="font-semibold">Rating:</span> ⭐{" "}
                  {session.rating}/5
                </p>
              )}
            </div>
          ) : (
            <div className="mt-2">
              <p className="italic text-gray-600">No feedback yet</p>
              {showFormFor === session._id ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    rows={3}
                    placeholder="Write your feedback..."
                    value={feedbackData[session._id]?.feedback || ""}
                    onChange={(e) =>
                      handleFeedbackChange(
                        session._id,
                        "feedback",
                        e.target.value
                      )
                    }
                    className="w-full border rounded px-3 py-2"
                  />

                  {role === "mentee" && (
                    <div>
                      <label className="font-semibold mr-2">Rating:</label>
                      <select
                        value={feedbackData[session._id]?.rating || ""}
                        onChange={(e) =>
                          handleFeedbackChange(
                            session._id,
                            "rating",
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="">--Select--</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-x-2">
                    <button
                      className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700"
                      onClick={() => submitFeedback(session._id)}
                    >
                      Submit Feedback
                    </button>
                    <button
                      className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                      onClick={() => setShowFormFor(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700"
                  onClick={() => setShowFormFor(session._id)}
                >
                  Leave Feedback
                </button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Sessions;
