import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogs } from "../redux/logSlice";

export default function LogsPage() {
  const dispatch = useDispatch();
  const { logs } = useSelector((s) => s.logs || { logs: [] });

  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  return (
    <div style={{ padding: 24 }}>
      <h1>System Logs</h1>
      <ul>
        {logs?.length ? logs.map((l) => (
          <li key={l._id || l.id}>
            [{new Date(l.timestamp).toLocaleString()}] <strong>{l.action}</strong> — {l.description} (actor: {l.actor?.name || l.actor})
          </li>
        )) : <li>No logs</li>}
      </ul>
    </div>
  );
}
