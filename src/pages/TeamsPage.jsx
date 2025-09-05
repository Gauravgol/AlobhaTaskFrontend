import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams, createTeam } from "../redux/teamSlice";

export default function TeamsPage() {
  const dispatch = useDispatch();
  const { teams } = useSelector((s) => s.teams || { teams: [] });

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const addDummyTeam = () => {
    dispatch(createTeam({ name: "New Team " + Date.now() }));
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Teams</h1>
      <button onClick={addDummyTeam}>Create dummy team</button>
      <ul>
        {teams?.length ? teams.map((t) => <li key={t._id || t.id}>{t.name}</li>) : <li>No teams</li>}
      </ul>
    </div>
  );
}
