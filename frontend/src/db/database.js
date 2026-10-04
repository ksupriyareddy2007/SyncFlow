import Dexie from "dexie";

export const db = new Dexie("SyncFlowDB");

db.version(2).stores({
  tasks: "id, title, completed, updatedAt, syncStatus, version",
});