# SyncFlow

## Offline-First Task Manager

SyncFlow is a task management application designed for situations where the internet may not always be available.

Users can create, edit, complete, and delete tasks even when they are offline. The changes are saved locally and automatically synchronized with the server when the internet connection is restored.

The application also detects conflicting changes and gives the user the choice of which version to keep.

**Work first. Sync later.**

## Live Demo

Live Application: https://syncflow-production-6e18.up.railway.app

Source Code: https://github.com/ksupriyareddy2007/SyncFlow

## Key Features

SyncFlow supports the main operations a user would expect from a task manager.

* Create tasks
* Edit tasks
* Mark tasks as completed
* Delete tasks
* Work without an internet connection
* Store changes locally
* Track pending changes
* Detect when the connection is restored
* Automatically synchronize changes
* Detect conflicting versions of a task
* Let the user choose between the local and server version
* Support offline access through PWA features

## Architecture

The application follows an offline-first architecture.

![SyncFlow Architecture](screenshots/architecture.png)

The frontend is built with React and communicates with the Spring Boot backend through REST APIs.

When a user creates or changes a task, the application first stores the change locally using IndexedDB. If the internet is available, the change is synchronized with the backend.

When the user is offline, the change remains stored locally and is marked as pending. Once the connection is restored, SyncFlow sends the pending changes to the backend.

The backend uses Spring Boot and stores the synchronized tasks in an H2 database.

## Major Technical Decisions

### React and Vite

React was used to build the user interface, while Vite provides a fast development and build environment.

### IndexedDB and Dexie

IndexedDB is used to store tasks directly in the browser. Dexie makes working with IndexedDB easier and helps manage the local task data.

This was important because the application needs to continue working even without an internet connection.

### Spring Boot

Spring Boot is used to build the backend REST API. It handles task synchronization and communicates with the database.

### H2 Database

H2 was chosen as the database for this prototype because it is lightweight and simple to set up.

### Service Worker and PWA

A service worker is used to cache important application resources so that the application can continue to be accessed when the network is unavailable.

### Version-Based Conflict Detection

Each task has a version number.

When a device sends an update, the backend checks whether the version received matches the current server version.

If the versions are different, the application reports a conflict instead of silently replacing the existing data.

## How the Application Works

The basic workflow is simple.

A user creates or changes a task.

The change is first stored locally.

If the user is online, the change is sent to the backend and synchronized.

If the user is offline, the change stays locally and is marked as pending.

When the internet connection comes back, SyncFlow automatically tries to synchronize the pending changes.

After successful synchronization, the task is marked as synced.

## Offline Workflow

One of the main goals of SyncFlow is to allow users to continue working without internet access.

For example, a user can turn off their internet connection and still create a new task.

The task is saved locally using IndexedDB and the application shows that there is a pending change.

When the connection is restored, the application automatically synchronizes the task with the backend.

This prevents users from losing work simply because of a temporary network problem.

## Conflict Handling

SyncFlow also handles situations where different versions of the same task exist.

For example, one version of a task may be changed locally while another version is already stored on the server.

Instead of silently overwriting one of the changes, SyncFlow detects the version mismatch.

The application shows the local version and the server version and gives the user two choices:

* Keep My Version
* Keep Server Version

This makes the conflict visible to the user and allows them to decide which version should be preserved.

## Core Workflow Demonstration

The main workflow demonstrated in the project is:

1. Create a task while online.
2. Edit and complete the task.
3. Delete a task.
4. Turn off the internet connection.
5. Create or modify a task while offline.
6. Check the pending changes count.
7. Restore the internet connection.
8. Observe the automatic synchronization.
9. Trigger and detect a conflicting version.
10. Resolve the conflict by selecting the required version.

## Testing

The application was tested using different online and offline scenarios.

### Online Testing

* Creating tasks was tested successfully.
* Editing tasks was tested successfully.
* Completing and uncompleting tasks was tested successfully.
* Deleting tasks was tested successfully.

### Offline Testing

* Creating tasks without internet was tested successfully.
* Editing tasks without internet was tested successfully.
* Completing tasks without internet was tested successfully.
* Deleting tasks without internet was tested successfully.
* Pending changes were correctly displayed.

### Synchronization Testing

* Changes made while offline were successfully synchronized after reconnecting.
* The pending changes count returned to zero after synchronization.
* Tasks were correctly marked as synced.

### Conflict Testing

* Version mismatches were successfully detected.
* Both local and server versions were displayed.
* The user was able to keep the local version or the server version.

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* IndexedDB
* Dexie
* Service Worker
* PWA

### Backend

* Java
* Spring Boot
* Spring Data JPA
* REST API
* H2 Database

### Development and Deployment

* Git
* GitHub
* VS Code
* Maven
* Railway

## Project Structure

```text
algo_hack/
|
├── frontend/
|   ├── public/
|   |   ├── manifest.webmanifest
|   |   └── sw.js
|   |
|   └── src/
|       ├── db/
|       |   └── database.js
|       ├── App.jsx
|       ├── main.jsx
|       └── index.css
|
├── backend/
|   ├── src/
|   |   └── main/
|       |       └── java/
|       |           └── com/example/backend/
|       |               ├── controller/
|       |               |   └── TaskController.java
|       |               ├── model/
|       |               |   └── Task.java
|       |               └── repository/
|       |                   └── TaskRepository.java
|   |
|   ├── pom.xml
|   └── mvnw.cmd
|
├── screenshots/
|   ├── sample1.png
|   ├── sample2.png
|   ├── conflict.png
|   └── architecture.png
|
└── README.md
```

## Running the Project Locally

### Backend

Open a terminal inside the backend folder.

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### Frontend

Open another terminal inside the frontend folder.

```powershell
cd frontend
npm install
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

## Deployment

The project is deployed using Railway.

The frontend and backend are deployed separately. The frontend communicates with the deployed Spring Boot REST API.

The live application can be accessed here:

https://syncflow-production-6e18.up.railway.app

## Known Limitations

SyncFlow is currently a hackathon prototype, so there are some limitations.

* There is no user authentication yet.
* The application currently uses H2 instead of a production database such as PostgreSQL.
* Conflict resolution is based on choosing a version rather than automatically merging two different changes.
* The application is currently focused on task management rather than supporting multiple types of offline data.
* Background synchronization could be improved for a production application.

## Future Improvements

Some improvements we would like to add in the future are:

* User authentication
* Multi-device synchronization
* PostgreSQL or another production database
* Smarter conflict merging
* Real-time synchronization
* Background synchronization
* Push notifications
* Task priorities and categories
* Due dates and reminders
* Activity history

## Why We Built SyncFlow

Many applications assume that the user will always have a stable internet connection. In real-world situations, this is not always true.

A temporary network problem should not prevent a user from completing their work.

SyncFlow addresses this by allowing users to continue working offline and synchronizing their changes later.

The project focuses on making offline work simple for the user while still handling synchronization and conflicting changes safely.

## Screenshots

### 1. Normal Synchronized State

This screenshot shows the application in its normal online state. The tasks are available in the workspace and the sync status shows that the changes have been successfully synchronized with the server.

![Normal Synchronized State](sample1.png)

### 2. Offline Changes and Pending Sync

This screenshot shows SyncFlow working without an internet connection. New or modified tasks are stored locally, and the Pending Changes count indicates that these changes are waiting to be synchronized.

Once the connection is restored, SyncFlow automatically sends the pending changes to the server.

![Offline Mode and Pending Changes](sample2.png)

### 3. Conflict Detection and Resolution

SyncFlow also handles situations where the same task has been changed in different places.

Instead of silently overwriting one version, the application detects the version mismatch and displays both the Your Version and Server Version.

The user can then choose whether to keep their version or the server version.

![Conflict Detection and Resolution](conflict.png)

### 4. Architecture

![SyncFlow Architecture](image.png)

## Conclusion

SyncFlow demonstrates how an offline-first approach can make a task management application more reliable.

Users can work normally without worrying about their internet connection, and their changes can be synchronized when the connection becomes available again.

The main idea behind the project is simple:

**Work first. Sync later.**
