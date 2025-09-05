import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos } from "../redux/todoSlice";
import { fetchTeams } from "../redux/teamSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const todosState = useSelector((s) => s.todos);
  const teamsState = useSelector((s) => s.teams);

  useEffect(() => {
    dispatch(fetchTeams());
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <h3>Your Teams</h3>
      <ul>
        {teamsState?.teams?.length ? teamsState.teams.map((t) => <li key={t._id || t.id}>{t.name || t}</li>) : <li>No teams</li>}
      </ul>

      <h3>Todos</h3>
      <ul>
        {todosState?.todos?.length ? (
          todosState.todos.map((td) => (
            <li key={td._id || td.id}>
              <strong>{td.title}</strong> — {td.description} {td.completed ? "(Done)" : ""}
            </li>
          ))
        ) : (
          <li>No todos</li>
        )}
      </ul>
    </div>
  );
}
