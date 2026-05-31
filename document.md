# API Documentation

Base URL:

```text
https://local-agent-be.onrender.com
```

All POST APIs accept JSON request bodies. Use this header for requests with a body:

```http
Content-Type: application/json
```

## Auth APIs

### POST `/auth/register`

Full URL:

```text
https://local-agent-be.onrender.com/auth/register
```

Creates a new user account and returns a JWT token.

Payload:

```json
{
  "name": "Arul",
  "email": "arul@example.com",
  "password": "password123"
}
```

Required fields:

- `name`: string, required, 2 to 120 characters
- `email`: valid email string, required
- `password`: string, required, 8 to 100 characters

Example response:

```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "name": "Arul",
    "email": "arul@example.com"
  },
  "token": "jwt-token"
}
```

### POST `/auth/login`

Full URL:

```text
https://local-agent-be.onrender.com/auth/login
```

Logs in an existing user and returns a JWT token.

Payload:

```json
{
  "email": "arul@example.com",
  "password": "password123"
}
```

Required fields:

- `email`: valid email string, required
- `password`: string, required, 8 to 100 characters

Example response:

```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "name": "Arul",
    "email": "arul@example.com"
  },
  "message": "Arul you have logged in successfully",
  "token": "jwt-token"
}
```

## Health / Test APIs

### GET `/health`

Full URL:

```text
https://local-agent-be.onrender.com/health
```

Payload: none

Example response:

```json
{
  "status": "ok",
  "message": "Backend is connected"
}
```

### GET `/db-test`

Full URL:

```text
https://local-agent-be.onrender.com/db-test
```

Payload: none

Example response:

```json
{
  "status": "ok",
  "message": "Database connection successful. User count: 1",
  "userCount": 1
}
```

### GET `/intent-test`

Full URL:

```text
https://local-agent-be.onrender.com/intent-test
```

Payload: none

Returns a test parsed agent intent for the sample prompt `install Sublime text editor`.

### GET `/winget-test`

Full URL:

```text
https://local-agent-be.onrender.com/winget-test
```

Payload: none

Example response:

```json
{
  "success": true,
  "packageID": "Notepad++.Notepad++",
  "rawOuput": "..."
}
```

### GET `/ws-test`

Full URL:

```text
https://local-agent-be.onrender.com/ws-test
```

Payload: none

Sends a test WebSocket broadcast message from the backend.

Example response:

```json
{
  "success": true,
  "message": "Message sent"
}
```

## Chat APIs

### POST `/chat`

Full URL:

```text
https://local-agent-be.onrender.com/chat
```

Creates a new chat conversation or continues an existing conversation.

Payload:

```json
{
  "prompt": "Hello, explain what this agent can do",
  "conversationId": "optional-existing-conversation-uuid",
  "projectId": "optional-project-uuid"
}
```

Required fields:

- `prompt`: string, required, 1 to 500 characters

Optional fields:

- `conversationId`: UUID string. If omitted, a new conversation is created.
- `projectId`: UUID string. If provided while creating a new conversation, the conversation is linked to that project.

Example response:

```json
{
  "success": true,
  "conversationId": "conversation-uuid",
  "message": "AI response text"
}
```

### GET `/chat/conversations`

Full URL:

```text
https://local-agent-be.onrender.com/chat/conversations
```

Returns conversation titles ordered by latest update.

Payload: none

Example response:

```json
{
  "success": true,
  "conversations": [
    {
      "id": "conversation-uuid",
      "title": "Hello, explain what this agent can do",
      "updated_at": "2026-05-21T17:00:00.000Z"
    }
  ]
}
```

### GET `/chat/:conversationId`

Full URL:

```text
https://local-agent-be.onrender.com/chat/{conversationId}
```

Returns one conversation with its messages.

Payload: none

Path parameter:

- `conversationId`: conversation UUID

Example response:

```json
{
  "success": true,
  "conversation": {
    "id": "conversation-uuid",
    "title": "Hello, explain what this agent can do",
    "updated_at": "2026-05-21T17:00:00.000Z",
    "messages": [
      {
        "id": "message-uuid",
        "role": "user",
        "content": "Hello, explain what this agent can do",
        "created_at": "2026-05-21T17:00:00.000Z"
      },
      {
        "id": "message-uuid",
        "role": "assistant",
        "content": "AI response text",
        "created_at": "2026-05-21T17:00:01.000Z"
      }
    ]
  }
}
```

## Project APIs

### POST `/projects`

Full URL:

```text
https://local-agent-be.onrender.com/projects
```

Creates a project for the local user.

Payload:

```json
{
  "name": "My Project"
}
```

Required fields:

- `name`: string, required

Example response:

```json
{
  "success": true,
  "project": {
    "id": "project-uuid",
    "user_id": "user-uuid",
    "name": "My Project",
    "created_at": "2026-05-21T17:00:00.000Z",
    "updated_at": "2026-05-21T17:00:00.000Z"
  }
}
```

### GET `/projects`

Full URL:

```text
https://local-agent-be.onrender.com/projects
```

Returns projects for the local user ordered by latest update.

Payload: none

Example response:

```json
{
  "success": true,
  "projects": [
    {
      "id": "project-uuid",
      "name": "My Project",
      "updated_at": "2026-05-21T17:00:00.000Z"
    }
  ]
}
```

## Sidebar APIs

### GET `/sidebar`

Full URL:

```text
https://local-agent-be.onrender.com/sidebar
```

Returns sidebar data containing projects with conversations and recent conversations not linked to a project.

Payload: none

Example response:

```json
{
  "success": true,
  "projects": [
    {
      "id": "project-uuid",
      "name": "My Project",
      "conversations": [
        {
          "id": "conversation-uuid",
          "title": "Conversation title",
          "updated_at": "2026-05-21T17:00:00.000Z"
        }
      ]
    }
  ],
  "recents": [
    {
      "id": "conversation-uuid",
      "title": "Recent conversation title",
      "updated_at": "2026-05-21T17:00:00.000Z"
    }
  ]
}
```

## Agent APIs

### POST `/agent/run`

Full URL:

```text
https://local-agent-be.onrender.com/agent/run
```

Parses the prompt into an install or uninstall action and returns a safe winget command.

Payload:

```json
{
  "prompt": "Install Notepad++",
  "conversationId": "optional-existing-conversation-uuid",
  "projectId": "optional-project-uuid"
}
```

Required fields:

- `prompt`: string, required, 1 to 500 characters

Optional fields:

- `conversationId`: UUID string. If omitted, a new conversation is created.
- `projectId`: UUID string. Accepted by validation, but this endpoint currently only uses it when validating the request body.

Example response:

```json
{
  "success": true,
  "conversationId": "conversation-uuid",
  "action": "install_app",
  "app": "Notepad++",
  "command": "winget install Notepad++.Notepad++",
  "message": "Preparing installation for Notepad++..."
}
```

Possible `action` values:

```text
install_app
uninstall_app
```

## Error Response Format

Most APIs return this shape when an error occurs:

```json
{
  "success": false,
  "error": "Error message"
}
```
