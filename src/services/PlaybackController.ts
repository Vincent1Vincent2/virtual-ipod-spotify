export class PlaybackController {
  private auth: any;
  private baseUrl: string;
  private initialized: boolean;
  private currentDeviceId: string | null;
  private currentContext: any;

  constructor(auth: any) {
    this.auth = auth;
    this.baseUrl = "https://api.spotify.com/v1/me/player";
    this.initialized = false;
    this.currentDeviceId = null;
    this.currentContext = null;
  }

  private async checkInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  async initialize() {
    try {
      const devices = await this.getAvailableDevices();
      this.initialized = true;
      if (devices.devices?.length > 0) {
        this.currentDeviceId = devices.devices[0].id;
      }
      await this.restorePlaybackState();
    } catch (error) {
      console.error("Failed to initialize PlaybackController:", error);
      this.initialized = true;
    }
  }

  async getAvailableDevices() {
    const token = await this.auth.getValidToken();
    const response = await fetch(`${this.baseUrl}/devices`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { devices: [] };
    }

    const text = await response.text();
    try {
      return text ? JSON.parse(text) : { devices: [] };
    } catch {
      return { devices: [] };
    }
  }

  async getCurrentState() {
    const token = await this.auth.getValidToken();
    const response = await fetch(`${this.baseUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        is_playing: false,
        item: null,
        device: null,
        progress_ms: 0,
      };
    }

    const text = await response.text();
    try {
      const state = text ? JSON.parse(text) : null;
      await this.savePlaybackState(state);
      return state;
    } catch {
      return null;
    }
  }

  async transferPlayback(deviceId: string, startPlaying = true) {
    await this.checkInitialized();
    const token = await this.auth.getValidToken();
    const response = await fetch(`${this.baseUrl}`, {
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

    if (response.ok) {
      this.currentDeviceId = deviceId;
    }
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

    try {
      const state = JSON.parse(savedState);
      if (state.isPlaying && state.trackUri) {
        const timePassed = Date.now() - state.timestamp;
        const newProgress = state.progress + timePassed;
        await this.play(this.currentDeviceId, {
          uris: [state.trackUri],
          position_ms: newProgress,
        });
      }
    } catch (error) {
      console.error("Failed to restore playback state:", error);
    }
  }

  async play(deviceId: string | null = null, context: any = null) {
    await this.checkInitialized();
    const token = await this.auth.getValidToken();
    const targetDevice = deviceId || this.currentDeviceId;
    this.currentContext = context;

    const response = await fetch(
      `${this.baseUrl}/play${targetDevice ? `?device_id=${targetDevice}` : ""}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: context ? JSON.stringify(context) : undefined,
      }
    );

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to play: ${response.status}`);
    }
  }

  async togglePlayback(deviceId: string | null = null) {
    const currentState = await this.getCurrentState();

    if (currentState?.is_playing) {
      await this.pause(deviceId);
    } else if (this.currentContext) {
      await this.play(deviceId, this.currentContext);
    } else if (currentState?.item) {
      await this.play(deviceId, {
        uris: [currentState.item.uri],
        position_ms: currentState.progress_ms,
      });
    }
  }

  async pause(deviceId: string | null = null) {
    await this.checkInitialized();
    const token = await this.auth.getValidToken();
    const targetDevice = deviceId || this.currentDeviceId;

    const response = await fetch(
      `${this.baseUrl}/pause${
        targetDevice ? `?device_id=${targetDevice}` : ""
      }`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to pause: ${response.status}`);
    }
  }

  async nextTrack(deviceId: string | null = null) {
    await this.checkInitialized();
    const token = await this.auth.getValidToken();
    const targetDevice = deviceId || this.currentDeviceId;

    const response = await fetch(
      `${this.baseUrl}/next${targetDevice ? `?device_id=${targetDevice}` : ""}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to skip track: ${response.status}`);
    }
  }

  async previousTrack(deviceId: string | null = null) {
    await this.checkInitialized();
    const token = await this.auth.getValidToken();
    const targetDevice = deviceId || this.currentDeviceId;

    const response = await fetch(
      `${this.baseUrl}/previous${
        targetDevice ? `?device_id=${targetDevice}` : ""
      }`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to go to previous track: ${response.status}`);
    }
  }
}
