
import { useEffect, useState } from "react";
import { db } from "./db/database";

const API_URL = "https://clever-gratitude-production-147c.up.railway.app/api/tasks";

const uiStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: Inter, Arial, Helvetica, sans-serif;
    background: #f4f6fb;
    color: #111827;
  }

  button,
  input {
    font-family: inherit;
  }

  .syncflow-app {
    min-height: 100vh;
  }

  .syncflow-header {
    background: #111827;
    color: white;
    padding: 18px 7%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
.delete-button {
  border: 1px solid #fecaca;
  background: #fff;
  color: #dc2626;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  padding: 7px 10px;
  border-radius: 7px;
}

.delete-button:hover {
  background: #fee2e2;
}
  .syncflow-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 800;
  }

  .syncflow-logo {
    font-size: 24px;
  }

  .connection-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
  }

  .status-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #22c55e;
  }

  .status-dot.offline {
    background: #ef4444;
  }

  .syncflow-container {
    width: min(1050px, 90%);
    margin: 0 auto;
    padding: 48px 0 35px;
  }

  .workspace-label {
  color: #6366f1;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.2px;
  margin-bottom: 8px;
}

.hero-title {
  margin: 0;
  font-size: clamp(30px, 5vw, 48px);
  line-height: 1.15;
  letter-spacing: -1.2px;
  color: #111827;
}

.hero-text {
  margin: 10px 0 22px;
  color: #6b7280;
  max-width: 650px;
  line-height: 1.5;
  font-size: 15px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}


  .stat-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .stat-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    font-size: 20px;
  }

  .stat-number {
    font-size: 25px;
    font-weight: 800;
  }

  .stat-label {
    color: #6b7280;
    font-size: 12px;
    margin-top: 2px;
  }

  .add-section {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 18px;
    margin-bottom: 28px;
  }

  .add-row {
    display: flex;
    gap: 10px;
  }

  .task-input {
    flex: 1;
    min-width: 0;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    padding: 12px 14px;
    outline: none;
    font-size: 14px;
  }

  .task-input:focus {
    border-color: #6366f1;
  }

  .primary-button {
    border: none;
    border-radius: 10px;
    background: #111827;
    color: white;
    padding: 0 20px;
    font-weight: 700;
    cursor: pointer;
  }

  .primary-button:hover {
    background: #1f2937;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 800;
  }

  .task-count {
    color: #6b7280;
    font-size: 12px;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .secondary-button {
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
    border-radius: 9px;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .secondary-button:hover {
    background: #f9fafb;
  }

  .task-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .task-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 15px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .task-checkbox {
    width: 18px;
    height: 18px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .task-content {
    flex: 1;
    min-width: 0;
  }

  .task-title {
    font-size: 14px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  .task-title.completed {
    color: #9ca3af;
    text-decoration: line-through;
  }

  .task-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .edit-button,
  .delete-button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
    padding: 5px;
  }

  .edit-button:hover {
    background: #f3f4f6;
    border-radius: 7px;
  }

  .delete-button:hover {
    background: #fee2e2;
    border-radius: 7px;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 5px;
    font-size: 10px;
    font-weight: 700;
  }

  .status-synced {
    color: #16a34a;
  }

  .status-pending {
    color: #d97706;
  }

  .edit-row {
    display: flex;
    gap: 8px;
    width: 100%;
  }

  .edit-input {
    flex: 1;
    border: 1px solid #6366f1;
    border-radius: 8px;
    padding: 9px 11px;
    outline: none;
  }

  .save-button {
    border: none;
    background: #16a34a;
    color: white;
    border-radius: 8px;
    padding: 0 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .cancel-button {
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 8px;
    padding: 0 13px;
    cursor: pointer;
  }

  .conflict-section {
    margin-top: 28px;
  }

  .conflict-card {
    background: white;
    border: 1px solid #f59e0b;
    border-radius: 15px;
    padding: 18px;
    margin-bottom: 12px;
  }

  .conflict-title {
    font-weight: 800;
    margin-bottom: 14px;
  }

  .conflict-versions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .version-box {
    background: #f9fafb;
    border-radius: 10px;
    padding: 13px;
  }

  .version-label {
    font-size: 11px;
    font-weight: 800;
    color: #6b7280;
    margin-bottom: 6px;
  }

  .version-title {
    font-size: 13px;
    font-weight: 700;
  }

  .version-info {
    font-size: 10px;
    color: #9ca3af;
    margin-top: 4px;
  }

  .conflict-actions {
    display: flex;
    gap: 10px;
    margin-top: 14px;
  }

  .keep-button {
    flex: 1;
    border: none;
    border-radius: 9px;
    padding: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .keep-mine {
    background: #111827;
    color: white;
  }

  .keep-server {
    background: #e5e7eb;
    color: #111827;
  }

  .syncflow-activity {
    margin-top: 30px;
  }

  .activity-subtitle {
    color: #9ca3af;
    font-size: 11px;
    margin-top: 3px;
  }

  .syncflow-activity-card {
    background: #ffffff;
    border: 1px solid #e4e7ed;
    border-radius: 14px;
    overflow: hidden;
  }

  .syncflow-activity-item {
    min-height: 54px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 11px;
    border-bottom: 1px solid #eef0f3;
  }

  .syncflow-activity-item:last-child {
    border-bottom: none;
  }

  .syncflow-activity-icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    font-size: 14px;
  }

  .syncflow-activity-content {
    flex: 1;
    min-width: 0;
  }

  .syncflow-activity-message {
    color: #374151;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .syncflow-activity-time {
    margin-top: 2px;
    color: #9ca3af;
    font-size: 9px;
  }

  .syncflow-activity-empty {
    padding: 18px;
    color: #6b7280;
    font-size: 12px;
    text-align: center;
  }

  .activity-empty-title {
    font-weight: 700;
    color: #374151;
  }

  .activity-empty-text {
    margin-top: 4px;
    color: #9ca3af;
    font-size: 11px;
  }

  .footer {
    text-align: center;
    color: #9ca3af;
    font-size: 11px;
    margin-top: 35px;
  }

  @media (max-width: 700px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .add-row {
      flex-direction: column;
    }

    .primary-button {
      height: 42px;
    }

    .section-header {
      align-items: flex-start;
      gap: 12px;
      flex-direction: column;
    }

    .conflict-versions {
      grid-template-columns: 1fr;
    }

    .conflict-actions {
      flex-direction: column;
    }

    .task-card {
      align-items: flex-start;
    }
  }
`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [newTask, setNewTask] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [activityLog, setActivityLog] = useState([]);
  const [lastSynced, setLastSynced] = useState(null);

  const addActivity = (message, type = "info") => {
    const newActivity = {
      id: Date.now() + Math.random(),
      message,
      type,
      time: new Date().toLocaleTimeString(),
    };

    setActivityLog((prev) => [newActivity, ...prev].slice(0, 4));
  };

  const loadTasks = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) return;

      const serverTasks = await response.json();

      const localTasks = await db.tasks.toArray();
      const localMap = new Map(
        localTasks.map((task) => [task.id, task])
      );

      const merged = serverTasks.map((serverTask) => {
        const local = localMap.get(serverTask.id);

        if (
          local &&
          (local.syncStatus === "pending" ||
            local.syncStatus === "conflict")
        ) {
          return local;
        }

        return {
          ...serverTask,
          syncStatus: "synced",
        };
      });

      await db.tasks.bulkPut(merged);

      const finalTasks = await db.tasks.toArray();
      setTasks(finalTasks);

      // If tasks are already synchronized after refresh,
      // show a useful status instead of "Not synced yet".
      const hasSyncedTasks = finalTasks.some(
        (task) => task.syncStatus === "synced"
      );

      if (hasSyncedTasks) {
        setLastSynced(new Date());
      }
    } catch (error) {
      console.error("Load tasks failed:", error);
    }
  };

  const syncTasks = async (showActivity = true) => {
    if (!navigator.onLine) return;

    const pendingTasks = await db.tasks
      .where("syncStatus")
      .equals("pending")
      .toArray();

    let syncedCount = 0;
    let conflictCount = 0;

    for (const task of pendingTasks) {
      try {
        const response = await fetch(`${API_URL}/${task.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });

        if (response.status === 409) {
          const serverTask = await response.json();

          await db.tasks.put({
            ...task,
            syncStatus: "conflict",
            serverVersion: serverTask,
          });

          conflictCount++;
          continue;
        }

        if (response.ok) {
          const savedTask = await response.json();

          await db.tasks.put({
            ...savedTask,
            syncStatus: "synced",
          });

          syncedCount++;
        }
      } catch (error) {
        console.error("Sync failed:", error);
      }
    }

    if (syncedCount > 0) {
      const time = new Date();

      setLastSynced(time);

      if (showActivity) {
        addActivity(
          `${syncedCount} change${
            syncedCount > 1 ? "s" : ""
          } synchronized`,
          "success"
        );
      }
    }

    if (conflictCount > 0 && showActivity) {
      addActivity(
        `${conflictCount} conflict${
          conflictCount > 1 ? "s" : ""
        } detected`,
        "conflict"
      );
    }

    setTasks(await db.tasks.toArray());
  };

  useEffect(() => {
    loadTasks();

    const handleOnline = () => {
      setIsOnline(true);

      addActivity("Connection restored", "online");

      setTimeout(() => {
        syncTasks(true);
      }, 300);
    };

    const handleOffline = () => {
      setIsOnline(false);

      addActivity(
        "You're offline — changes will sync later",
        "offline"
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const addTask = async () => {
    const title = newTask.trim();

    if (!title) return;

    const task = {
      id: Date.now(),
      title,
      completed: false,
      updatedAt: Date.now(),
      version: 0,
      syncStatus: "pending",
    };

    await db.tasks.add(task);

    setTasks(await db.tasks.toArray());
    setNewTask("");

    if (navigator.onLine) {
      await syncTasks(true);
    }
  };

  const toggleTask = async (task) => {
    const updatedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: Date.now(),
      syncStatus: "pending",
    };

    await db.tasks.put(updatedTask);
    setTasks(await db.tasks.toArray());

    if (navigator.onLine) {
      await syncTasks(true);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTitle("");
  };

  const saveEditedTask = async (task) => {
    const title = editingTitle.trim();

    if (!title) return;

    const updatedTask = {
      ...task,
      title,
      updatedAt: Date.now(),
      syncStatus: "pending",
    };

    await db.tasks.put(updatedTask);

    setTasks(await db.tasks.toArray());
    cancelEditing();

    if (navigator.onLine) {
      await syncTasks(true);
    }
  };

  const deleteTask = async (task) => {
    await db.tasks.delete(task.id);

    setTasks(await db.tasks.toArray());

    if (navigator.onLine && task.version > 0) {
      try {
        const response = await fetch(
          `${API_URL}/${task.id}?version=${task.version}`,
          {
            method: "DELETE",
          }
        );

        if (response.status === 409) {
          const serverTask = await response.json();

          await db.tasks.put({
            ...task,
            syncStatus: "conflict",
            serverVersion: serverTask,
          });

          setTasks(await db.tasks.toArray());

          addActivity("1 conflict detected", "conflict");
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const keepMyVersion = async (task) => {
    if (!task.serverVersion) return;

    const resolvedTask = {
      ...task,
      version: task.serverVersion.version,
      syncStatus: "pending",
      serverVersion: undefined,
      updatedAt: Date.now(),
    };

    await db.tasks.put(resolvedTask);

    setTasks(await db.tasks.toArray());

    addActivity(
      "Conflict resolved — kept your version",
      "success"
    );

    if (navigator.onLine) {
      await syncTasks(false);
    }
  };

  const keepServerVersion = async (task) => {
    if (!task.serverVersion) return;

    const serverTask = {
      ...task.serverVersion,
      syncStatus: "synced",
    };

    await db.tasks.put(serverTask);

    setTasks(await db.tasks.toArray());

    addActivity(
      "Conflict resolved — kept server version",
      "success"
    );

    setLastSynced(new Date());
  };

  const refreshTasks = async () => {
    await loadTasks();

    if (navigator.onLine) {
      await syncTasks(true);
    }
  };

  const visibleTasks = tasks.filter(
    (task) => task.syncStatus !== "conflict"
  );

  const conflictTasks = tasks.filter(
    (task) => task.syncStatus === "conflict"
  );

  const pendingCount = tasks.filter(
    (task) => task.syncStatus === "pending"
  ).length;

  const getActivityIcon = (type) => {
    if (type === "success") return "✓";
    if (type === "conflict") return "⚠";
    if (type === "offline") return "📡";
    if (type === "online") return "🌐";
    return "↻";
  };

  return (
    <>
      <style>{uiStyles}</style>

      <div className="syncflow-app">
        <header className="syncflow-header">
          <div className="syncflow-brand">
            <span className="syncflow-logo">⚡</span>
            <span>SyncFlow</span>
          </div>

          <div className="connection-status">
            <span
              className={`status-dot ${
                !isOnline ? "offline" : ""
              }`}
            ></span>

            {isOnline ? "Online" : "Offline"}
          </div>
        </header>

        <main className="syncflow-container">
          <div className="workspace-label">
            YOUR WORKSPACE
          </div>

          <h1 className="hero-title">
            Manage your tasks anywhere.
          </h1>


          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">✓</div>

              <div>
                <div className="stat-number">
                  {tasks.length}
                </div>

                <div className="stat-label">
                  Total Tasks
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">↻</div>

              <div>
                <div className="stat-number">
                  {pendingCount}
                </div>

                <div className="stat-label">
                  Pending Changes
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">!</div>

              <div>
                <div className="stat-number">
                  {conflictTasks.length}
                </div>

                <div className="stat-label">
                  Conflicts
                </div>
              </div>
            </div>
          </div>

          <section className="add-section">
            <div className="add-row">
              <input
                className="task-input"
                placeholder="What needs to be done?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTask();
                  }
                }}
              />

              <button
                className="primary-button"
                onClick={addTask}
              >
                ＋ Add Task
              </button>
            </div>
          </section>

          <section>
            <div className="section-header">
              <div>
                <div className="section-title">
                  Your Tasks
                </div>

                <div className="task-count">
                  {tasks.length}{" "}
                  {tasks.length === 1 ? "task" : "tasks"}
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className="secondary-button"
                  onClick={() => syncTasks(true)}
                >
                  ↻ Sync Now
                </button>

                <button
                  className="secondary-button"
                  onClick={refreshTasks}
                >
                  ⟳ Refresh
                </button>
              </div>
            </div>

            <div className="task-list">
              {visibleTasks.map((task) => {
                const isEditing =
                  editingTaskId === task.id;

                return (
                  <div className="task-card" key={task.id}>
                    {isEditing ? (
                      <div className="edit-row">
                        <input
                          className="edit-input"
                          value={editingTitle}
                          onChange={(e) =>
                            setEditingTitle(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              saveEditedTask(task);
                            }

                            if (e.key === "Escape") {
                              cancelEditing();
                            }
                          }}
                          autoFocus
                        />

                        <button
                          className="save-button"
                          onClick={() =>
                            saveEditedTask(task)
                          }
                        >
                          Save
                        </button>

                        <button
                          className="cancel-button"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          className="task-checkbox"
                          type="checkbox"
                          checked={task.completed}
                          onChange={() =>
                            toggleTask(task)
                          }
                        />

                        <div className="task-content">
                          <div
                            className={`task-title ${
                              task.completed
                                ? "completed"
                                : ""
                            }`}
                          >
                            {task.title}
                          </div>

                          {task.syncStatus === "synced" && (
                            <div className="status-badge status-synced">
                              ✓ Synced
                            </div>
                          )}

                          {task.syncStatus === "pending" && (
                            <div className="status-badge status-pending">
                              ↻ Pending
                            </div>
                          )}
                        </div>

                        <div className="task-actions">
                          <button
                            className="edit-button"
                            title="Edit task"
                            onClick={() =>
                              startEditing(task)
                            }
                          >
                            ✎
                          </button>

                          <button
                            className="delete-button"
                            title="Delete task"
                            onClick={() =>
                              deleteTask(task)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {visibleTasks.length === 0 &&
                conflictTasks.length === 0 && (
                  <div className="syncflow-activity-empty">
                    No tasks yet. Add your first task above.
                  </div>
                )}
            </div>
          </section>

          {conflictTasks.length > 0 && (
            <section className="conflict-section">
              <div className="section-header">
                <div>
                  <div className="section-title">
                    Conflicts Need Attention
                  </div>

                  <div className="task-count">
                    Different versions were detected.
                  </div>
                </div>
              </div>

              {conflictTasks.map((task) => (
                <div
                  className="conflict-card"
                  key={task.id}
                >
                  <div className="conflict-title">
                    Task: {task.title}
                  </div>

                  <div className="conflict-versions">
                    <div className="version-box">
                      <div className="version-label">
                        YOUR VERSION
                      </div>

                      <div className="version-title">
                        {task.title}
                      </div>

                      <div className="version-info">
                        {task.completed
                          ? "✓ Completed"
                          : "○ Active"}{" "}
                        · Version {task.version}
                      </div>
                    </div>

                    <div className="version-box">
                      <div className="version-label">
                        SERVER VERSION
                      </div>

                      <div className="version-title">
                        {task.serverVersion?.title}
                      </div>

                      <div className="version-info">
                        {task.serverVersion?.completed
                          ? "✓ Completed"
                          : "○ Active"}{" "}
                        · Version{" "}
                        {task.serverVersion?.version}
                      </div>
                    </div>
                  </div>

                  <div className="conflict-actions">
                    <button
                      className="keep-button keep-mine"
                      onClick={() =>
                        keepMyVersion(task)
                      }
                    >
                      Keep My Version
                    </button>

                    <button
                      className="keep-button keep-server"
                      onClick={() =>
                        keepServerVersion(task)
                      }
                    >
                      Keep Server Version
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}

          <section className="syncflow-activity">
            <div className="section-header">
              <div>
                <div className="section-title">
                  Sync Activity
                </div>

                <div className="activity-subtitle">
                  Important synchronization events
                </div>
              </div>
            </div>

            <div className="syncflow-activity-card">
              {activityLog.length === 0 ? (
                <div className="syncflow-activity-empty">
                  <div className="activity-empty-title">
                    Everything is up to date
                  </div>

                  <div className="activity-empty-text">
                    No recent synchronization events.
                  </div>
                </div>
              ) : (
                activityLog.map((activity) => (
                  <div
                    className="syncflow-activity-item"
                    key={activity.id}
                  >
                    <div className="syncflow-activity-icon">
                      {getActivityIcon(activity.type)}
                    </div>

                    <div className="syncflow-activity-content">
                      <div className="syncflow-activity-message">
                        {activity.message}
                      </div>

                      <div className="syncflow-activity-time">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="footer">
            {lastSynced
              ? `Last synced ${lastSynced.toLocaleTimeString()}`
              : "Ready to synchronize"}
            {" • "}
            SyncFlow · Offline-first by design
          </div>
        </main>
      </div>
    </>
  );
}

export default App;

