# OpenAI MCP Tunnel app

## Purpose

This app runs the official OpenAI Secure MCP Tunnel client inside a separate Home Assistant OS app container. The Windows PC is not needed once this app is running.

The current app only provides the tunnel transport. A separate API-backed chat frontend is a later, independent component.

## Requirements

- Home Assistant OS on an amd64 host.
- An OpenAI tunnel ID.
- An OpenAI Runtime API key with only the required Tunnels Read and Tunnels Use permissions.
- A dedicated Home Assistant long-lived access token.
- The native Home Assistant MCP API enabled.
- The Home Assistant MCP server configured in read-only mode and with only intended read tools enabled.

## Configuration

Enter these values in the app's Configuration page:

- **Tunnel ID**: the tunnel ID from OpenAI Platform.
- **Runtime API key**: the restricted runtime key. This is a password field.
- **Home Assistant token**: a dedicated long-lived access token. This is a password field.
- **MCP server URL**: defaults to `http://homeassistant:8123/api/mcp`. If the hostname cannot be resolved from the app container, use the Home Assistant LAN URL reachable from that container.

The app reads secrets at startup and passes them to the client through process environment variables. They are not stored in this Git repository and are never printed by the service script.

## Network and security

- The tunnel client initiates outbound HTTPS connections to OpenAI.
- The app exposes no inbound ports and does not publish the tunnel client's local admin UI.
- The Home Assistant bearer token is scoped to the configured MCP server origin by the tunnel client's static MCP header configuration.
- Discovery/probe requests use the same Authorization header.
- OpenAI tunnel traffic carries MCP request and response data through OpenAI services; a static HA token is injected by the local tunnel client for the HA-facing request.
- The Home Assistant MCP server should remain in read-only mode. A long-lived HA token itself can have broad API permissions, so the app must only target the MCP endpoint and that endpoint must expose only the intended tools.

## Version and build

The Dockerfile downloads OpenAI tunnel-client v0.0.20 for Linux amd64 and verifies the release ZIP using its published SHA-256 digest before installing the binaries.

The app intentionally omits a prebuilt `image` field so Home Assistant Supervisor builds it locally from this repository. This is an experimental first release; validate the build and the MCP connection before relying on it.

## Troubleshooting

- **DNS error for `homeassistant`**: set MCP server URL to the Home Assistant LAN URL that the add-on container can reach.
- **HTTP 401 from Home Assistant**: verify the long-lived access token and confirm the bearer header is configured.
- **HTTP 401 from OpenAI control plane**: verify the runtime key, its expiry, and Tunnels Read + Use permissions.
- **No MCP tools appear**: make sure the tunnel client is running, check the Home Assistant MCP endpoint, and check the native MCP integration settings.

Never add tokens, API keys, passwords, private IP addresses, or screenshots containing secrets to GitHub issues or commits.
