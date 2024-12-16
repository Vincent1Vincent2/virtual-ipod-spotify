export class PlaybackController {
  private auth: any;
  private baseUrl: string;

  constructor(auth: any) {
    this.auth = auth;
    this.baseUrl = "https://api.spotify.com/v1/me/player";
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

  async getCurrentState() {
    const token = await this.auth.getValidToken();
    const response = await fetch(`${this.baseUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }

  async play(deviceId: string | null = null, context: any = null) {
    const token = await this.auth.getValidToken();
    await fetch(
      `${this.baseUrl}/play${deviceId ? `?device_id=${deviceId}` : ""}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: context ? JSON.stringify(context) : undefined,
      }
    );
  }

  async pause(deviceId: string | null = null) {
    const token = await this.auth.getValidToken();
    await fetch(
      `${this.baseUrl}/pause${deviceId ? `?device_id=${deviceId}` : ""}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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

  async seek(positionMs: number, deviceId: string | null = null) {
    const token = await this.auth.getValidToken();
    await fetch(
      `${this.baseUrl}/seek?position_ms=${positionMs}${
        deviceId ? `&device_id=${deviceId}` : ""
      }`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async setVolume(volumePercent: number, deviceId: string | null = null) {
    const token = await this.auth.getValidToken();
    await fetch(
      `${this.baseUrl}/volume?volume_percent=${volumePercent}${
        deviceId ? `&device_id=${deviceId}` : ""
      }`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async queueTrack(uri: string, deviceId: string | null = null) {
    const token = await this.auth.getValidToken();
    await fetch(
      `${this.baseUrl}/queue?uri=${uri}${
        deviceId ? `&device_id=${deviceId}` : ""
      }`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
