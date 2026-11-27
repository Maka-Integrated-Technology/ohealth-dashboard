import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { JSDOM } from "jsdom";

// The refresh interceptor reads window.location and may redirect; sit on
// /login so the redirect branch is a no-op in the test.
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/login",
});
for (const name of [
  "window",
  "document",
  "navigator",
  "localStorage",
  "sessionStorage",
]) {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    value: dom.window[name as keyof Window],
  });
}

const session = await import("../../app/lib/auth/session");
const axiosModule = await import("../../app/lib/config/axios");
const { default: axiosInstance, OHEALTH_CLIENT_HEADER } = axiosModule;
const axios = (await import("axios")).default;

beforeEach(() => session.clearSession());
afterEach(() => {
  session.clearSession();
  delete axiosInstance.defaults.adapter;
  delete axios.defaults.adapter;
});

test("access token is held in memory only — never in cookies or web storage", () => {
  session.setAccessToken("at_secret");
  assert.equal(session.getAccessToken(), "at_secret");
  assert.equal(session.hasSession(), true);

  // Nothing is written to any JS-readable persistence.
  assert.equal(dom.window.document.cookie, "");
  assert.equal(dom.window.localStorage.length, 0);
  assert.equal(dom.window.sessionStorage.length, 0);

  session.clearSession();
  assert.equal(session.getAccessToken(), undefined);
  assert.equal(session.hasSession(), false);
});

test("the client sends credentials and marks itself as the browser client on every request", () => {
  assert.equal(axiosInstance.defaults.withCredentials, true);
  assert.equal(
    axiosInstance.defaults.headers[OHEALTH_CLIENT_HEADER],
    "browser"
  );
});

test("concurrent 401s trigger a single browser refresh and replay the waiting requests", async () => {
  let refreshCalls = 0;

  const adapter = async (config: { url?: string; headers?: unknown }) => {
    const url = config.url ?? "";
    if (url.endsWith("/api/auth/browser/refresh")) {
      refreshCalls += 1;
      return {
        data: { data: { access_token: "fresh_at" } },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    }
    // Protected resource: 401 until a bearer token is attached.
    const auth = (config.headers as { Authorization?: string })?.Authorization;
    if (auth === "Bearer fresh_at") {
      return {
        data: { ok: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    }
    return Promise.reject({
      isAxiosError: true,
      response: { status: 401, data: {}, headers: {} },
      config,
    });
  };
  axiosInstance.defaults.adapter = adapter as never;
  axios.defaults.adapter = adapter as never;

  const results = await Promise.all([
    axiosInstance.get("/api/thing-a"),
    axiosInstance.get("/api/thing-b"),
    axiosInstance.get("/api/thing-c"),
  ]);

  assert.equal(refreshCalls, 1, "refresh must be single-flight");
  for (const r of results) assert.equal(r.status, 200);
  assert.equal(session.getAccessToken(), "fresh_at");
});

test("a rejected refresh clears the in-memory session instead of retrying forever", async () => {
  session.setAccessToken("stale_at");

  const adapter = async (config: { url?: string }) => {
    // Both the protected call and the refresh fail: refresh is rejected.
    return Promise.reject({
      isAxiosError: true,
      response: { status: 401, data: {}, headers: {} },
      config,
    });
  };
  axiosInstance.defaults.adapter = adapter as never;
  axios.defaults.adapter = adapter as never;

  await assert.rejects(axiosInstance.get("/api/thing"));
  assert.equal(
    session.getAccessToken(),
    undefined,
    "auth state must be cleared"
  );
});
