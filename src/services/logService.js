import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

function init() {
  Sentry.init({
    dsn: "https://28936408c2b345b692e8a8d18bd9382e@o1224876.ingest.sentry.io/6372867",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

function log(error) {
  Sentry.captureException(error);
}

export default {
  init,
  log,
};
