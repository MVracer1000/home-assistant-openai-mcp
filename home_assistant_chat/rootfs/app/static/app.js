(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const conversation = $("conversation");
  const messages = $("messages");
  const pendingHost = $("pending");
  const welcome = $("welcome");
  const composer = $("composer");
  const textarea = $("message");
  const sendButton = $("send");
  const newChatButton = $("new-chat");
  const basePath = window.location.pathname.endsWith("/")
    ? window.location.pathname
    : window.location.pathname + "/";
  const endpoint = (name) => basePath + "api/" + name;

  function newSessionId() {
    if (window.crypto && crypto.getRandomValues) {
      const data = new Uint8Array(18);
      crypto.getRandomValues(data);
      return Array.from(data, (v) => v.toString(16).padStart(2, "0")).join("");
    }
    return "s" + Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  let sessionId = sessionStorage.getItem("ha_chat_session");
  if (!sessionId) {
    sessionId = newSessionId();
    sessionStorage.setItem("ha_chat_session", sessionId);
  }
  let busy = false;

  function scrollDown() {
    conversation.scrollTop = conversation.scrollHeight;
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function addMessage(role, text) {
    const row = document.createElement("div");
    row.className = "message " + role;
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = role === "user" ? "DU" : role === "notice" ? "!" : "HA";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text || "";
    row.append(avatar, bubble);
    messages.appendChild(row);
  }

  function render(state) {
    messages.replaceChildren();
    pendingHost.replaceChildren();
    const items = Array.isArray(state.messages) ? state.messages : [];
    welcome.hidden = items.length > 0;
    for (const item of items) {
      if (!item || typeof item.text !== "string") continue;
      addMessage(item.role === "user" ? "user" : item.role === "notice" ? "notice" : "assistant", item.text);
    }
    if (state.pending) renderApproval(state.pending);
    scrollDown();
  }

  function renderApproval(pending) {
    const card = document.createElement("section");
    card.className = "approval";
    const title = document.createElement("h3");
    title.textContent = "Freigabe für eine Home-Assistant-Abfrage";
    const intro = document.createElement("p");
    intro.textContent = "Prüfe die Werkzeugbezeichnung und Parameter. Nur freigeben, wenn die Abfrage lesend und für deine Frage erforderlich ist.";
    const tool = document.createElement("div");
    tool.className = "tool-name";
    tool.textContent = "Werkzeug: " + String(pending.tool_name || "Unbekannt");
    const args = document.createElement("pre");
    args.textContent = JSON.stringify(pending.arguments ?? {}, null, 2);
    const note = document.createElement("p");
    note.textContent = "Die HA-MCP-Nur-Lese-Sperre muss eingeschaltet bleiben. Eine Freigabe hier ersetzt diese Sperre nicht.";
    const actions = document.createElement("div");
    actions.className = "approval-actions";
    const approve = document.createElement("button");
    approve.type = "button";
    approve.className = "approve";
    approve.textContent = "Abfrage freigeben";
    approve.addEventListener("click", () => decideApproval(true, approve, deny));
    const deny = document.createElement("button");
    deny.type = "button";
    deny.className = "deny";
    deny.textContent = "Ablehnen";
    deny.addEventListener("click", () => decideApproval(false, approve, deny));
    actions.append(approve, deny);
    card.append(title, intro, tool, args, note, actions);
    pendingHost.appendChild(card);
  }

  async function api(path, payload) {
    let response;
    try {
      response = await fetch(endpoint(path), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ session: sessionId, ...payload })
      });
    } catch (error) {
      const reason = error && error.message ? error.message : "Netzwerkfehler";
      throw new Error("Verbindung zum Home-Assistant-Chatserver fehlgeschlagen: " + reason);
    }

    const raw = await response.text();
    let data = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (_) {
      data = {};
    }

    if (!response.ok) {
      const detail = data.error || data.message || data.detail ||
        ("HTTP " + response.status + (response.statusText ? " " + response.statusText : ""));
      throw new Error(String(detail).slice(0, 700));
    }
    if (!data || typeof data !== "object" || !Array.isArray(data.messages)) {
      throw new Error("Der Chatserver hat eine unerwartete Antwort geliefert (HTTP " + response.status + ").");
    }
    return data;
  }

  async function decideApproval(approve, approveButton, denyButton) {
    if (busy) return;
    busy = true;
    approveButton.disabled = true;
    denyButton.disabled = true;
    try {
      const state = await api("approval", { approve });
      render(state);
    } catch (error) {
      addMessage("notice", "Freigabe konnte nicht verarbeitet werden: " + error.message);
    } finally {
      busy = false;
      approveButton.disabled = false;
      denyButton.disabled = false;
    }
  }

  async function sendMessage(text) {
    if (busy || !text.trim()) return;
    busy = true;
    sendButton.disabled = true;
    textarea.disabled = true;
    addMessage("user", text.trim());
    welcome.hidden = true;
    try {
      const state = await api("chat", { text: text.trim() });
      render(state);
    } catch (error) {
      addMessage("notice", "Fehler: " + error.message);
    } finally {
      busy = false;
      sendButton.disabled = false;
      textarea.disabled = false;
      textarea.focus();
      scrollDown();
    }
  }

  composer.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = textarea.value;
    if (!text.trim()) return;
    textarea.value = "";
    textarea.style.height = "auto";
    sendMessage(text);
  });

  textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      composer.requestSubmit();
    }
  });

  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 190) + "px";
  });

  document.querySelectorAll(".suggestion").forEach((button) => {
    button.addEventListener("click", () => sendMessage(button.dataset.prompt || ""));
  });

  newChatButton.addEventListener("click", async () => {
    if (busy) return;
    sessionId = newSessionId();
    sessionStorage.setItem("ha_chat_session", sessionId);
    messages.replaceChildren();
    pendingHost.replaceChildren();
    welcome.hidden = false;
    try {
      const response = await fetch(endpoint("history") + "?session=" + encodeURIComponent(sessionId), { cache: "no-store" });
      const state = await response.json();
      render(state);
    } catch (_) { /* An empty session is safe if the first history read fails. */ }
    textarea.focus();
  });

  (async () => {
    try {
      const response = await fetch(endpoint("history") + "?session=" + encodeURIComponent(sessionId), { cache: "no-store" });
      const state = await response.json();
      if (response.ok) render(state);
    } catch (error) {
      addMessage("notice", "Die Chatoberfläche konnte den Sitzungsstatus nicht laden: " + error.message);
    }
  })();
})();
