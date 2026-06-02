import { writeFileSync, statSync } from "node:fs";
import http from "node:http";

const [, , debugPortValue, targetUrl, screenshotPath] = process.argv;
const debugPort = Number(debugPortValue);

function requestJson(path, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port: debugPort, path, method }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(new Error(`Invalid JSON from ${method} ${path}: ${body.slice(0, 300)}`));
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForCdp() {
  for (let i = 0; i < 30; i += 1) {
    try {
      return await requestJson("/json/version");
    } catch {
      await wait(250);
    }
  }
  throw new Error("CDP version endpoint unavailable");
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const pending = new Map();
    let id = 0;

    ws.onopen = () => {
      const send = (method, params = {}) => new Promise((innerResolve, innerReject) => {
        id += 1;
        pending.set(id, { resolve: innerResolve, reject: innerReject });
        ws.send(JSON.stringify({ id, method, params }));
      });
      resolve({ ws, send });
    };

    ws.onerror = reject;
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !pending.has(message.id)) return;
      const { resolve: innerResolve, reject: innerReject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) innerReject(new Error(JSON.stringify(message.error)));
      else innerResolve(message.result);
    };
  });
}

await waitForCdp();
const tab = await requestJson(`/json/new?${encodeURIComponent(targetUrl)}`, "PUT");
const { ws, send } = await connect(tab.webSocketDebuggerUrl);

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1365,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await wait(1800);

const titleInfo = await send("Runtime.evaluate", {
  expression: "JSON.stringify({title: document.title, h1: document.querySelector('h1')?.textContent, hasPayment: document.body.innerText.includes('PAYMENT_LINK_HERE')})",
  returnByValue: true,
});
const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
writeFileSync(screenshotPath, Buffer.from(screenshot.data, "base64"));
ws.close();

const stat = statSync(screenshotPath);
console.log(JSON.stringify({
  url: targetUrl,
  titleInfo: JSON.parse(titleInfo.result.value),
  screenshot: screenshotPath,
  bytes: stat.size,
}, null, 2));
