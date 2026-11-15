# Home Assistant Chat

A separate browser chat for Home Assistant diagnostics. It runs as an isolated Home Assistant OS app and calls the OpenAI Responses API through the existing Secure MCP Tunnel.

## What it does

- Runs on the Home Assistant host; the Windows PC does not need to stay on.
- Opens inside Home Assistant through **Ingress**, behind the normal Home Assistant login.
- Calls the OpenAI Responses API using a server-side API key.
- Connects to the existing private MCP tunnel by `tunnel_id`; it does not publish the Home Assistant MCP URL.
- Requires approval for MCP tool calls that are not marked read-only by the MCP server.
- Keeps chat session state in app memory only. Restarting the app clears in-memory conversations.
- Exposes no host port and grants no Supervisor, Docker, host-network, or Home Assistant API privileges.

## Requirements

- Home Assistant OS on amd64.
- The separate **OpenAI Tunnel for HA-MCP** integration already running and polling.
- The same OpenAI tunnel ID used by that integration.
- An OpenAI project API key with permission to make Responses API model requests. The API key for this chat app is separate from the tunnel runtime key.
- API billing enabled for the selected project.

## Configure

In the app's Configuration page, enter:

- **OpenAI API key**: a new project API key for the Responses API (not the tunnel runtime key).
- **Tunnel ID**: the existing `tunnel_...` identifier.
- **Model**: defaults to `gpt-6-astra`.

The API key is kept on the Home Assistant host and is never sent to the browser. Do not put it in GitHub, a URL, a screenshot, or a chat message.

For the API key, use a restricted project key and enable only the Model capabilities request permission needed for `/v1/responses`, where the Platform permission selector allows it. Configure an appropriate project spending limit. API usage is billed separately from ChatGPT Go.

## Read-only safety

The app asks the Responses API to require approval for MCP tools unless the MCP server marks them read-only. The HA-MCP server must also remain in **read-only mode**, with only intended read tools exposed and secret redaction enabled. Never disable those HA-MCP protections for this app.

The app itself does not implement Home Assistant write APIs and does not have a Home Assistant access token. Tool calls are routed through the existing tunnel integration.

## Privacy

Chat messages and the Home Assistant data returned by MCP are sent to OpenAI for processing. The app does not write chat history to disk or log prompts, responses, credentials, or tool arguments. Conversation state is held in memory while the app runs.

## Access

The interface is served only through Home Assistant Ingress. Home Assistant handles login; the app listens on the internal ingress port and accepts requests only from the Supervisor ingress proxy. No host port is exposed.

## Troubleshooting

- **API key rejected**: verify the new project key, project, model-request permission, and API billing.
- **Tunnel unavailable**: verify that the separate OpenAI Tunnel for HA-MCP integration is running and polling.
- **No MCP tools returned**: verify the tunnel ID is identical in both configurations and that the HA-MCP server is exposing the intended tool-search API.
