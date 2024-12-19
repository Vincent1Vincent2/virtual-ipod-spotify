import { SpotifyPlaybackState } from "@/types/player/player";

export class PlaybackController {
  private auth: any;
  private baseUrl: string;
  private initialized: boolean;

  constructor(auth: any) {
    this.auth = auth;
    this.baseUrl = "https://api.spotify.com/v1/me/player";
    this.initialized = false;
  }

  async initialize() {
    try {
      await this.getAvailableDevices();
      this.initialized = true;
      await this.restorePlaybackState();
    } catch (error) {
      console.error("Failed to initialize PlaybackController:", error);
      throw error;
    }
  }

  private async checkInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  async getAvailableDevices() {
    const token = await this.auth.getValidToken();
    const response = await fetch(`${this.baseUrl}/devices`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }

  async transferPlayback(deviceId: string, startPlaying = true) {
    const token = await this.auth.getValidToken();
    await fetch(`${this.baseUrl}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: startPlaying,
      }),
    });
  }

  private async savePlaybackState(state: any) {
    if (!state) return;

    const stateToSave = {
      trackUri: state.item?.uri,
      progress: state.progress_ms,
      timestamp: Date.now(),
      isPlaying: state.is_playing,
    };

    localStorage.setItem("playbackState", JSON.stringify(stateToSave));
  }

  private async restorePlaybackState() {
    const savedState = localStorage.getItem("playbackState");
    if (!savedState) return;

    const state = JSON.parse(savedState);
    const timePassed = Date.now() - state.timestamp;
    const newProgress = state.progress + timePassed;

    if (state.isPlaying) {
      await this.play(null, {
        uris: [state.trackUri],
        position_ms: newProgress,
      });
    }
  }

  async getCurrentState(): Promise<SpotifyPlaybackState> {
    await this.checkInitialized();
    const token = await this.auth.getValidToken();
    const response = await fetch(`${this.baseUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const state = await response.json();
    await this.savePlaybackState(state);
    return state;
  }

  async play(deviceId: string | null = null, context: any = null) {
    await this.checkInitialized();
    const token = await this.auth.getValidToken();

    const queryParams = deviceId ? `?device_id=${deviceId}` : "";
    await fetch(`${this.baseUrl}/play${queryParams}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: context ? JSON.stringify(context) : undefined,
    });

    const newState = await this.getCurrentState();
    await this.savePlaybackState(newState);
  }

  async pause(deviceId: string | null = null) {
    await this.checkInitialized();
    const token = await this.auth.getValidToken();

    const queryParams = deviceId ? `?device_id=${deviceId}` : "";
    await fetch(`${this.baseUrl}/pause${queryParams}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newState = await this.getCurrentState();
    await this.savePlaybackState(newState);
  }

  async togglePlayback(deviceId: string | null = null) {
    const currentState = await this.getCurrentState();

    if (currentState.is_playing) {
      await this.pause(deviceId);
    } else if (currentState.item) {
      await this.play(deviceId, {
        uris: [currentState.item.uri],
        position_ms: currentState.progress_ms,
      });
    }
  }

  async nextTrack(deviceId: string | null = null) {
    const token = await this.auth.getValidToken();
    await fetch(
      `${this.baseUrl}/next${deviceId ? `?device_id=${deviceId}` : ""}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async previousTrack(deviceId: string | null = null) {
    const token = await this.auth.getValidToken();
    await fetch(
      `${this.baseUrl}/previous${deviceId ? `?device_id=${deviceId}` : ""}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
