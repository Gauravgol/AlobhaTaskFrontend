import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams, createTeam, addUserToTeam, removeUserFromTeam } from "../redux/teamSlice";
import { fetchUsers } from "../redux/userSlice";

export default function TeamsPage() {
  const dispatch = useDispatch();
  const { teams, loading: teamsLoading } = useSelector((state) => state.teams);
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [teamForm, setTeamForm] = useState({ name: "" });

  useEffect(() => {
    dispatch(fetchTeams());
    dispatch(fetchUsers());
  }, [dispatch]);


  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const result = await dispatch(createTeam(teamForm));
    if (result.meta.requestStatus === "fulfilled") {
      setTeamForm({ name: "" });
      setShowCreateForm(false);
    }
  };

  const handleAddUserToTeam = async (userId) => {
    const result = await dispatch(addUserToTeam({ teamId: selectedTeam._id, userId }));
    if (result.meta.requestStatus === "fulfilled") {
      setShowAddUserModal(false);
      setSelectedTeam(null);
    }
  };

  const handleRemoveUserFromTeam = async (userId) => {
    if (window.confirm("Are you sure you want to remove this user from the team?")) {
      await dispatch(removeUserFromTeam({ teamId: selectedTeam._id, userId }));
    }
  };

  const getAvailableUsers = () => {
    if (!selectedTeam) return [];
    return users?.filter(user => !selectedTeam?.users?.some(teamUser => teamUser._id === user._id)) || [];
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Teams Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Team
        </button>
      </div>


      {teamsLoading ? (
        <p>Loading teams...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(teams) && teams.length > 0 ? teams.map((team) => (
            <div key={team._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{team.name}</h3>
                <button
                  onClick={() => setSelectedTeam(team)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Manage
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Members ({team.users?.length || 0})</h4>
                <div className="space-y-1">
                  {team.users?.length > 0 ? (
                    team.users.map((user) => (
                      <div key={user._id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{user.name} ({user.email})</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No members</p>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center p-8">
              <p className="text-gray-500">No teams found or teams data is not an array</p>
              <p className="text-sm text-gray-400 mt-2">Check console for debug information</p>
            </div>
          )}
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Team</h3>
            <form onSubmit={handleCreateTeam}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setTeamForm({ name: "" });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Management Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Manage Team: {selectedTeam.name}</h3>
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Current Members</h4>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Add User
                </button>
              </div>
              
              <div className="space-y-2">
                {Array.isArray(selectedTeam?.users) && selectedTeam.users.length > 0 ? (
                  selectedTeam.users.map((user) => (
                    <div key={user._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                        <span className="text-gray-600 ml-2">({user.email})</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveUserFromTeam(user._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No members in this team</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add User to {selectedTeam?.name}</h3>
            <p className="text-sm text-gray-600 mb-4">Select a user to add to this team:</p>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {Array.isArray(getAvailableUsers()) && getAvailableUsers().length > 0 ? (
                getAvailableUsers().map((user) => (
                  <div key={user._id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                    <div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                      <span className="text-gray-600 ml-2">({user.email})</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddUserToTeam(user._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Add
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No available users to add</p>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
