
export interface Program {
  id: string;
  name: string;
  host: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  image: string;
  description: string;
}

export interface RadioState {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
}

export interface TVState {
  isPlaying: boolean;
  isFullscreen: boolean;
  currentProgram: string;
}
