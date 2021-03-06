import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { useEffect } from 'react';

const RESOLUTION_ARR = {
  '120p,120p_1': [160, 120, 15, 65],
  '360p_4': [640, 360, 30, 600],
  '480p_4': [640, 480, 30, 750],
  '720p_3': [1280, 720, 30, 1710],
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
        width: theme.spacing(16),
        height: theme.spacing(16),
      },
    },
  }),
);

export default function LiveRoom(): JSX.Element {
  const classes = useStyles();

  /**
   * @returns {IAgoraRTCClient} client agora client instance
   */
  const createClient = (): IAgoraRTCClient => {
    const client = AgoraRTC.createClient({ mode: 'live', codec: 'h264', role: 'audience' });
    client.setClientRole('audience');
    return client;
  };

  /**
   * @description this method sets the room
   * - room join
   * - setup the receive video quality
   * @param client
   */
  const prepareJoin = async (client: IAgoraRTCClient) => {
    try {
      const uid = await client
        .join(
          process.env.NEXT_PUBLIC_APP_ID,
          process.env.NEXT_PUBLIC_CHANNEL_NAME,
          process.env.NEXT_PUBLIC_TEMP_TOKEN,
          null,
        )
        .catch((e) => console.error(e));

      if (uid) {
        client.setLowStreamParameter({
          width: RESOLUTION_ARR['480p_4'][0],
          height: RESOLUTION_ARR['480p_4'][1],
          framerate: RESOLUTION_ARR['480p_4'][2],
          bitrate: RESOLUTION_ARR['480p_4'][3],
        });
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  /**
   * @description subscribe the remote track
   * @param {IAgoraRTCClient} client agora client instance
   */
  const subscribe = async (client: IAgoraRTCClient) => {
    // Subscribe to a remote user
    client.on('user-published', async (user, mediaType) => {
      // Subscribe to a remote user.
      await client.subscribe(user, mediaType);
      // If the subscribed track is video.
      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack;
        // Dynamically create a container in the form of a DIV element for playing the remote video track.
        // Specify the ID of the DIV container. You can use the `uid` of the remote user.
        const playerContainer = document.createElement('div');
        playerContainer.id = user.uid.toString();
        playerContainer.style.width = '100%';
        playerContainer.style.height = '100%';

        document.querySelector('#remote-container')?.append(playerContainer);
        if (!remoteVideoTrack) {
          console.error('remoteVideoTrack is not defind');
          return;
        }
        remoteVideoTrack.play(playerContainer);
      }

      // If the subscribed track is audio.
      if (mediaType === 'audio') {
        // Get `RemoteAudioTrack` in the `user` object.
        const remoteAudioTrack = user.audioTrack;
        if (!remoteAudioTrack) {
          return;
        }
        // Play the audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
      }
    });

    // NOTE: When the remote user unpublishes a media track or leaves the channel, the SDK triggers the client.on("user-unpublished") event. You need to destroy the dynamically created DIV container.
    client.on('user-unpublished', (user) => {
      // Get the dynamically created DIV container.
      const playerContainer = document.getElementById(user.uid.toString());
      if (!playerContainer) {
        return;
      }
      // Destroy the container.
      playerContainer.remove();
    });
  };

  useEffect(() => {
    // NOTE: disble SDK Log
    AgoraRTC.setLogLevel(4);
    // video transmission and reception processiong
    (async () => {
      const client = createClient();
      await prepareJoin(client);
      await subscribe(client);
    })();

    // clean up
    return () => {
      console.log('clean up');
    };
  }, []);

  return (
    <div className={classes.root}>
      <Paper elevation={3} id="remote-container" />
    </div>
  );
}
