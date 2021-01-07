import { useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient, ILocalTrack } from 'agora-rtc-sdk-ng';
import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    me: {
      width: 600,
      height: 400,
    },
  }),
);

export default function Streamer(): JSX.Element {
  const classes = useStyles();

  const createClient = (): IAgoraRTCClient => {
    const client = AgoraRTC.createClient({ mode: 'live', codec: 'h264', role: 'host' });
    client.setClientRole('host');
    return client;
  };

  const localTrackInit = async (): Promise<ILocalTrack[]> => {
    try {
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      // quality setting the video track
      localVideoTrack.setEncoderConfiguration('120p_4');
      return [localAudioTrack, localVideoTrack];
    } catch (err) {
      console.error(`Failed to publish, ${err}`);
      return [];
    }
  };

  const createRoom = async (client: IAgoraRTCClient) => {
    try {
      await client
        .join(
          process.env.NEXT_PUBLIC_APP_ID,
          process.env.NEXT_PUBLIC_CHANNEL_NAME,
          process.env.NEXT_PUBLIC_TEMP_TOKEN,
          null,
        )
        .catch((e) => console.error(e));
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const showLocalTrack = (client: IAgoraRTCClient) => {
    client.localTracks.forEach((localTrack) => {
      if (localTrack.trackMediaType === 'video') {
        const playerContainer = document.createElement('div');
        playerContainer.id = client.uid?.toString() ?? '1234';
        playerContainer.style.width = '100%';
        playerContainer.style.height = '100%';

        document.querySelector('#me')?.append(playerContainer);
        localTrack.play(playerContainer);
      }

      if (localTrack.trackMediaType === 'audio') {
        // Play the audio track. No need to pass any DOM element.
        localTrack.play();
      }
    });
  };

  useEffect(() => {
    // NOTE: disble SDK Log
    AgoraRTC.setLogLevel(4);
    // video transmission and reception processiong
    (async () => {
      const client = createClient();
      const localTracks = await localTrackInit();
      await createRoom(client);
      await client.publish(localTracks);
      showLocalTrack(client);
    })();
  });

  return (
    <div>
      <h1>Streamer</h1>
      <div id="me" className={classes.me}></div>
    </div>
  );
}
