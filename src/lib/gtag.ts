export function gtagSendEvent(event: string, url?: string) {
  const callback = function () {
    if (typeof url === "string") {
      window.location.href = url;
    }
  };
  // @ts-ignore
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, {
      event_callback: callback,
      event_timeout: 2000,
      // <event_parameters>
    });
  } else {
    // Fallback: navigate immediately if gtag is not available
    callback();
  }
  return false;
}
