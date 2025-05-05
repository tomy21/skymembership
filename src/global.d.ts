export {};

declare global {
  interface Window {
    NDEFReader: NDEFReader;
  }

  interface NDEFReader {
    scan: () => Promise<void>;
    onreading: ((event: NDEFReadingEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
  }

  interface NDEFReadingEvent extends Event {
    message: NDEFMessage;
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
