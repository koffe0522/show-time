import AgoraRTC, {
  IAgoraRTCClient,
  ILocalTrack,
  VideoEncoderConfiguration,
  VideoEncoderConfigurationPreset,
} from 'agora-rtc-sdk-ng';

const useLocalTrack = async (
  client?: IAgoraRTCClient,
  config?: VideoEncoderConfiguration | VideoEncoderConfigurationPreset,
): Promise<ILocalTrack[]> => {
  if (client && client.localTracks.length > 0) {
    return client.localTracks;
  }

  try {
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    if (config) {
      // quality setting the video track
      localVideoTrack.setEncoderConfiguration(config);
    }
    return [localAudioTrack, localVideoTrack];
  } catch (err) {
    console.error(`Failed to publish, ${err}`);
    return [];
  }
};

export { useLocalTrack };
