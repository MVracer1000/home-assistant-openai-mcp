# Home Assistant OpenAI MCP

Home Assistant OS app repository for running the official OpenAI Secure MCP Tunnel client inside the Home Assistant network.

> **Status: experimental, initial tunnel app only.** The separate browser chat frontend is a later step and is not included yet.

## App

- [OpenAI MCP Tunnel](./openai_mcp_tunnel) — runs the official OpenAI tunnel client and forwards MCP traffic to the local Home Assistant MCP endpoint.

## Security

- The repository contains no credentials, access tokens, tunnel IDs, or personal network addresses.
- Runtime API key and Home Assistant token are entered in the Home Assistant app configuration and are represented as password fields.
- The app exposes no inbound network ports.
- The app uses the Home Assistant MCP HTTP endpoint and a bearer token.
- Keep the Home Assistant MCP integration in read-only mode and expose only the tools you intend the model to use.
- Do not enable write-capable tools unless you have separately reviewed and explicitly approved that change.
- The tunnel client makes outbound connections to OpenAI; MCP requests and responses traverse OpenAI's service.

## Installation

1. Add this repository URL in Home Assistant under **Settings → Apps → Install app → ⋮ → Repositories**:
   `https://github.com/MVracer1000/home-assistant-openai-mcp`
2. Install **OpenAI MCP Tunnel** after the container image has been published.
3. Enter the tunnel ID, the restricted OpenAI Runtime API key, and a dedicated Home Assistant long-lived access token in the app configuration.
4. Start the app and inspect its logs for a healthy connection.

Never paste credentials into GitHub, issue reports, screenshots, or chat messages.

## Development notes

- Current tunnel client release pinned by the Dockerfile: `v0.0.20`.
- Current app version: `0.1.0`.
- Initial supported Home Assistant architecture: `amd64` (Generic x86-64).
- The image is published to GitHub Container Registry by GitHub Actions.
- The API chat UI will be designed and reviewed separately after the tunnel app is tested.

## References

- [OpenAI Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels)
- [OpenAI MCP servers / Responses API](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)
- [Home Assistant app development](https://developers.home-assistant.io/docs/apps/)
