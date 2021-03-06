import { get } from "lodash";

import inject from "./contentScript/injectToDom";
import { IEventMessage } from "./interface/message";
import { getStore } from "./store";
import { IDynamicURLMap, IMockResponse } from "./interface/mock";
const init = () => {
  let store, urlMap, dynamicUrlMap: IDynamicURLMap;
  getStore().then((a) => {
    store = a.store;
    urlMap = a.urlMap;
    dynamicUrlMap = a.dynamicUrlMap;
  });

  const getMockPath = (url: string, method: string) => {
    // this will moved to store.ts
    if (urlMap[url]) {
      if (urlMap[url][method]) {
        return urlMap[url][method];
      }
    }

    const url1 = url.replace("://", "-");
    const key = url1.split("/").length;
    // match all dynamics route
    const stack = dynamicUrlMap[key];
    if (!stack) return;

    let i = 0;
    while (i < stack.length) {
      // there is more to it will be used when
      // action are introduced
      const s = stack[i];
      if (s.method === method && !!s.match(url1)) {
        return s.getterKey;
      }
      i++;
    }
  };

  const updateStore = () => {
    getStore().then((x) => {
      store = x.store;
      urlMap = x.urlMap;
    });
  };

  const getMock = (path: string) => {
    return get(store, path, null);
  };

  // get initial store

  // From xhook to content Script
  window.addEventListener("message", function (event) {
    // We only accept messages from ourselves
    if (event.source !== window) return;

    const data: IEventMessage = event.data;

    if (data.to !== "CONTENT_SCRIPT") return;

    if (data.type === "LOG") {
      const message = data.message;
      const mockPath = getMockPath(message.request.url, message.request.method);
      const mock = getMock(mockPath) as IMockResponse;

      if (mock) {
        message.isMocked = mock.active;
        message.mockPath = mockPath;
      }

      chrome.runtime.sendMessage({
        message,
        type: "LOG",
        from: "CONTENT",
        to: "PANEL",
      });
      return;
    }

    const response: Omit<IEventMessage, "type"> = {
      id: data.id,
      from: "CONTENT_SCRIPT",
      to: "HOOK_SCRIPT",
      extenstionName: "MOKKU",
      message: {},
    };

    const request = data.message.request;
    const mockPath = getMockPath(request.url, request.method);
    const mock = getMock(mockPath) as IMockResponse;

    if (mock && mock.active) {
      response.message.mockResponse = mock;
    }

    window.postMessage(response, "*");
  });

  chrome.runtime.onMessage.addListener((message, sender, response) => {
    //!this.checkIfSameTab(sender.tab)) return;
    if (message.to !== "CONTENT") return;

    if (message.type === "UPDATE_STORE") {
      updateStore();
    }
  });
};

const host = location.host;
const isLocalhost = location.href.includes("http://localhost");

chrome.storage.local.get([`mokku.extension.active.${host}`], function (result) {
  let active = result[`mokku.extension.active.${host}`];
  if (isLocalhost && active === undefined) {
    active = true;
  }
  if (active) {
    // injects script to page's DOM
    inject();
    init();
  }
  // tell the panel about the new injection (host might have changed)
  chrome.runtime.sendMessage({
    host,
    type: "INIT",
    from: "CONTENT",
    to: "PANEL",
  });
});
