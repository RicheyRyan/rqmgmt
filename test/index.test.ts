import { AbortManager } from "../src";
import fetchMock from "jest-fetch-mock";

describe("AbortManager", () => {
  it("passes on errors thrown by the promise function", () => {
    const mgr = new AbortManager();
    try {
      mgr.register(() => {
        throw new Error("oops");
      });
    } catch (e) {
      expect(e.message).toBe("oops");
    }
  });

  it("cancels an inflight promise as expected", async () => {
    jest.useFakeTimers();
    const mgr = new AbortManager();
    let signalToTrack: AbortSignal | null = null;
    fetchMock.mockResponse(async () => {
      jest.advanceTimersByTime(60);
      return "";
    });
    mgr.register(signal => {
      signalToTrack = signal;
      return fetchMock("/test", { signal });
    });
    mgr.register(signal => {
      return fetchMock("/test", { signal });
    });
    expect(signalToTrack!.aborted).toBeTruthy();
  });
  it("returns the result of the promise properly", async () => {
    const mgr = new AbortManager();
    const result = await mgr.register(() => {
      return Promise.resolve("success");
    });
    expect(result).toBe("success");
  });
});
