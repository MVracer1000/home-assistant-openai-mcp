# Home Assistant Chat app

A private browser chat for technical Home Assistant support. It runs as an isolated Home Assistant OS app and calls the OpenAI Responses API through the existing OpenAI Secure MCP Tunnel.

## What it does

- Runs on the Home Assistant host; the Windows PC does not need to stay on.
- Opens inside Home Assistant through **Ingress**, protected by the normal Home Assistant login and restricted to Home Assistant's Ingress proxy.
- Uses the OpenAI Responses API with **GPT-6.1 Sol** by default.
- Connects to the existing private MCP tunnel by tunnel ID; it does not publish the Home Assistant MCP URL.
- Requires explicit approval for every MCP tool invocation. The tool name and arguments are shown before approval.
- Keeps chat session state in app memory only. Restarting the app clears in-memory conversations.
- Exposes no host port and grants no Supervisor, Docker, host-network, or Home Assistant API privileges.

## Requirements

- Home Assistant OS on amd64.
- The separate **OpenAI Tunnel for HA-MCP** integration must be running and polling.
- The same OpenAI tunnel ID must be used by both the tunnel integration and this app.
- A separate OpenAI project API key with permission to make Responses API model requests.
- API billing enabled for the selected project.

## Configure

In the app's Configuration page, enter:

- **OpenAI API key**: a new project API key for the Responses API (not the tunnel runtime key).
- **Tunnel ID**: the existing tunnel_... identifier.
- **Model**: defaults to gpt-6.1-sol. gpt-6-astra is also available for more demanding analysis; it costs more.

For a restricted project API key, grant only the model request / Responses API write permission needed for POST /v1/responses. Do not grant tunnel management, admin, files, vector-store, or unrelated endpoint permissions to this chat key. The key should have an expiration date and the project should have a suitable spending limit.

The API key is stored in the app's local /data/options.json on the Home Assistant host and is never sent to the browser or written to this Git repository. It is still a sensitive secret: access to Home Assistant backups or the host can expose it. Do not share backups containing it.

API usage is billed separately from ChatGPT Go.

## Read-only safety

- The Responses API asks for explicit approval before every MCP call.
- The app's system instructions limit its intended use to diagnostics and read-only inspection.
- The HA-MCP server's own **Nur-Lese-Modus** is a separate enforcement layer and must remain **ON**. Keep secret redaction enabled.
- Do not enable write-capable tools in HA-MCP. The separate read-only server policy is essential; an AI prompt or approval dialog alone is not a security boundary.
- The app does not implement Home Assistant write APIs and does not have a Home Assistant access token.

A tool approval shows the MCP tool name and its arguments. Deny requests that appear to create, update, delete, execute, or otherwise change anything.

## Privacy

- Chat messages and Home Assistant data returned by MCP are sent to OpenAI for model processing.
- The app uses store=false for Responses API requests, so it does not create saved Responses API objects for this chat. This setting is not the same as Zero Data Retention; applicable API abuse-monitoring retention and contractual data controls still apply.
- The app does not write chat history to disk. Conversation state is kept in app memory and removed when the app restarts or the session expires.
- The app does not log prompts, responses, credentials, or tool arguments.

## Access and network

- The interface is served only through Home Assistant Ingress.
- The server accepts inbound requests only from Home Assistant's Ingress proxy at 172.30.32.2, as required by the Home Assistant app ingress guidance.
- No host port is exposed. Do not add a port mapping or enable host networking.
- The tunnel integration makes the outbound MCP tunnel connection. The chat app makes outbound HTTPS requests to api.openai.com.

## Troubleshooting

- **API key rejected**: verify the API key, project, expiration, model-request / Responses permission, and API billing.
- **Tunnel unavailable**: verify that the separate OpenAI Tunnel for HA-MCP integration is running and polling, and that the configured tunnel ID is identical in both apps.
- **No MCP tools returned**: verify the ID at the end of the configured API's individual URL, that the HA-MCP Server (tool search) API is enabled, and that the MCP server is exposing the intended tools.
- **Tool call rejected by Home Assistant**: check the HA-MCP logs and verify that the MCP server read-only protection remains enabled.

Never add tokens, API keys, passwords, private URLs, or screenshots containing secrets to GitHub issues or commits.
