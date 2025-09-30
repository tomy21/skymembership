export {};

declare module "*.css";
declare module "*.scss";
declare module "*.sass";

declare global {
  interface Window {
    NDEFReader: {
      new (): NDEFReader;
    };
  }

  interface NDEFReader {
    scan: () => Promise<void>;
    onreading: ((event: NDEFReadingEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    addEventListener: (
      type: string,
      listener: (event: NDEFReadingEvent) => void,
    ) => void;
  }

  interface NDEFReadingEvent extends Event {
    message: NDEFMessage;
    serialNumber: string;
  }

  interface NDEFMessage {
    records: NDEFRecord[];
  }

  interface NDEFRecord {
    recordType: string;
    mediaType?: string;
    id: string;
    data: DataView;
  }
}
