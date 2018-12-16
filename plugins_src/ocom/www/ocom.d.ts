interface CordovaOcom {
  add1DScanListener(listener: (event: Event) => void): void;
  remove1DScanListener(listener: (event: Event) => void): void;
  start(): void;
}

interface Window {
  ocom: CordovaOcom;
}

declare var ocom: CordovaOcom;
