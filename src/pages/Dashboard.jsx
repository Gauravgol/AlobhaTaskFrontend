import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos, createTodo, updateTodo, deleteTodo, shareTodoAccess } from "../redux/todoSlice";
import { fetchTeams } from "../redux/teamSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const todosState = useSelector((state) => state.todos);
  const teamsState = useSelector((state) => state.teams);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [sharingTodo, setSharingTodo] = useState(null);
  const [filters, setFilters] = useState({});
  
  const [todoForm, setTodoForm] = useState({
    title: "",
    description: "",
    teamId: "",
    completed: false
  });

  useEffect(() => {
    dispatch(fetchTeams());
    dispatch(fetchTodos(filters));
  }, [dispatch, filters]);

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    const result = await dispatch(createTodo(todoForm));
    if (result.meta.requestStatus === "fulfilled") {
      setTodoForm({ title: "", description: "", teamId: "", completed: false });
      setShowCreateForm(false);
    }
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateTodo({ id: editingTodo._id, todoData: todoForm }));
    if (result.meta.requestStatus === "fulfilled") {
      setEditingTodo(null);
      setTodoForm({ title: "", description: "", teamId: "", completed: false });
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      await dispatch(deleteTodo(todoId));
    }
  };

  const handleShareTodo = async (userIds) => {
    const result = await dispatch(shareTodoAccess({ id: sharingTodo._id, userIds }));
    if (result.meta.requestStatus === "fulfilled") {
      setSharingTodo(null);
    }
  };

  const canEditTodo = (todo) => {
    return todo.creator === user._id || todo.allowedEditors?.includes(user._id);
  };

  const startEdit = (todo) => {
    setEditingTodo(todo);
    setTodoForm({
      title: todo.title,
      description: todo.description,
      teamId: todo.team,
      completed: todo.completed
    });
  };

  const startShare = (todo) => {
    setSharingTodo(todo);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Todo
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
            <select
              value={filters.team || ""}
              onChange={(e) => setFilters({ ...filters, team: e.target.value || undefined })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Teams</option>
              {Array.isArray(teamsState?.teams) && teamsState.teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.completed || ""}
              onChange={(e) => setFilters({ ...filters, completed: e.target.value || undefined })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All</option>
              <option value="false">Pending</option>
              <option value="true">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by title..."
              value={filters.title || ""}
              onChange={(e) => setFilters({ ...filters, title: e.target.value || undefined })}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Teams Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">Your Teams</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(teamsState?.teams) && teamsState.teams.length > 0 ? (
            teamsState.teams.map((team) => (
              <div key={team._id} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800">{team.name}</h4>
                <p className="text-sm text-gray-600">{team.users?.length || 0} members</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No teams found</p>
          )}
        </div>
      </div>

      {/* Todos Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Todos</h3>
        {todosState?.loading ? (
          <p>Loading todos...</p>
        ) : Array.isArray(todosState?.todos) && todosState.todos.length > 0 ? (
          <div className="space-y-4">
            {todosState.todos.map((todo) => (
              <div key={todo._id} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{todo.title}</h4>
                    <p className="text-gray-600 mt-1">{todo.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Team: {teamsState?.teams?.find(t => t._id === todo.team)?.name || "Unknown"}</span>
                      <span>Status: {todo.completed ? "Completed" : "Pending"}</span>
                      <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {canEditTodo(todo) && (
                      <>
                        <button
                          onClick={() => startEdit(todo)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => startShare(todo)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Share
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No todos found</p>
        )}
      </div>

      {/* Create/Edit Todo Modal */}
      {(showCreateForm || editingTodo) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingTodo ? "Edit Todo" : "Create Todo"}
            </h3>
            <form onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={todoForm.title}
                  onChange={(e) => setTodoForm({ ...todoForm, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={todoForm.description}
                  onChange={(e) => setTodoForm({ ...todoForm, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <select
                  value={todoForm.teamId}
                  onChange={(e) => setTodoForm({ ...todoForm, teamId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select a team</option>
                  {Array.isArray(teamsState?.teams) && teamsState.teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todoForm.completed}
                    onChange={(e) => setTodoForm({ ...todoForm, completed: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Completed</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingTodo ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTodo(null);
                    setTodoForm({ title: "", description: "", teamId: "", completed: false });
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

      {/* Share Todo Modal */}
      {sharingTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Share Todo: {sharingTodo.title}</h3>
            <p className="text-sm text-gray-600 mb-4">Select team members to share edit access with:</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {Array.isArray(teamsState?.teams) && teamsState.teams
                .find(t => t._id === sharingTodo.team)
                ?.users?.filter(u => u._id !== user._id)
                ?.map((member) => (
                  <label key={member._id} className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={sharingTodo.allowedEditors?.includes(member._id)}
                      className="mr-2"
                    />
                    <span className="text-sm">{member.name} ({member.email})</span>
                  </label>
                ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                  const selectedUserIds = Array.from(checkboxes)
                    .filter(cb => cb.checked)
                    .map(cb => {
                      const label = cb.nextElementSibling;
                      const userId = Array.isArray(teamsState?.teams) ? teamsState.teams
                        .find(t => t._id === sharingTodo.team)
                        ?.users?.find(u => u.name === label.textContent.split(' (')[0])?._id : undefined;
                      return userId;
                    })
                    .filter(Boolean);
                  handleShareTodo(selectedUserIds);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Share
              </button>
              <button
                onClick={() => setSharingTodo(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
