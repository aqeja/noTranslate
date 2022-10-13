declare class WebRecorder {
  start(arg: { deviceId: string }): void;
  stop(): void;
  OnReceivedData(data: unknown): void;
  OnError(reason: unknown): void;
}

export type WebRecorderStartArg = MediaTrackConstraints;
