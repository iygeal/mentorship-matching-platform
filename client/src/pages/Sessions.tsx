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
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Your Sessions</h2>

      {message && <p>{message}</p>}

      {sessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li key={session._id} style={{ marginBottom: "2rem" }}>
              With: <strong>{displayName(session)}</strong> <br />
              Time: {formatDateTime(session.scheduledAt)} <br />
              {session.feedback ? (
                <>
                  Feedback: <em>{session.feedback}</em> <br />
                  {session.rating && <span>Rating: ⭐ {session.rating}/5</span>}
                </>
              ) : (
                <>
                  <em>No feedback yet</em> <br />
                  {showFormFor === session._id ? (
                    <>
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
                        style={{ width: "100%", marginTop: "0.5rem" }}
                      />
                      {role === "mentee" && (
                        <>
                          <br />
                          Rating:{" "}
                          <select
                            value={feedbackData[session._id]?.rating || ""}
                            onChange={(e) =>
                              handleFeedbackChange(
                                session._id,
                                "rating",
                                e.target.value
                              )
                            }
                          >
                            <option value="">--Select--</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </>
                      )}
                      <br />
                      <button
                        onClick={() => submitFeedback(session._id)}
                        style={{ marginTop: "0.5rem" }}
                      >
                        Submit Feedback
                      </button>{" "}
                      <button
                        onClick={() => setShowFormFor(null)}
                        style={{ marginLeft: "0.5rem" }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setShowFormFor(session._id)}>
                      Leave Feedback
                    </button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sessions;
