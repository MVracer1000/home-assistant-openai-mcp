# Home Assistant OpenAI MCP

Home Assistant OS app repository for a private OpenAI Secure MCP Tunnel and a separate browser chat for Home Assistant support.

> **Status: experimental.** Both apps are intended for a single Home Assistant OS amd64 host and need testing in the target installation before everyday use.

## Apps

- [OpenAI MCP Tunnel](./openai_mcp_tunnel) — runs the official OpenAI tunnel client and forwards MCP traffic to a private Home Assistant MCP endpoint.
- [Home Assistant Chat](./home_assistant_chat) — browser chat using the OpenAI Responses API and the existing tunnel. Served through Home Assistant Ingress.

## Security principles

- Never commit credentials, access tokens, tunnel IDs, or private network addresses.
- Keep the HA-MCP integration's **Nur-Lese-Modus** enabled and secret redaction on.
- The chat app requires approval for each MCP tool call.
- The chat app has no Home Assistant token, Docker API, Supervisor API, host networking, or exposed host port.
- Home Assistant Ingress protects the browser UI; the chat backend accepts only the Ingress proxy.
- MCP requests and Home Assistant data sent to the model traverse OpenAI for processing.

## Installation

1. Add this repository in Home Assistant under **Settings → Apps → App Store → ⋮ → Repositories**:
   https://github.com/MVracer1000/home-assistant-openai-mcp
2. Install **OpenAI MCP Tunnel** and configure it with your tunnel ID, restricted Runtime API key, HA-MCP URL, and HA access token.
3. Verify the tunnel integration is healthy and the control plane is polling.
4. Install **Home Assistant Chat**. Configure a separate OpenAI project API key with permission to create Responses API requests, and use the same tunnel ID.
5. Open the chat app through its Home Assistant Ingress panel.

The experimental app images are built locally by Home Assistant Supervisor from the included Dockerfiles. No secrets are stored in this repository.

## Important distinctions

- The tunnel Runtime API key is used only by the tunnel client.
- The Chat app needs a separate Responses API project key.
- API usage is billed separately from any ChatGPT subscription.
- The chat app uses store=false, but that does not equal Zero Data Retention.
- The app's in-memory chat history is cleared when it restarts.

## References

- [OpenAI Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels)
- [OpenAI MCP servers / Responses API](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)
- [OpenAI API keys and service accounts](https://developers.openai.com/api/docs/guides/api-keys)
- [Home Assistant app development](https://developers.home-assistant.io/docs/apps/)
- [Home Assistant Ingress](https://developers.home-assistant.io/docs/apps/presentation/#ingress)
