import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import AgoraRTC, { IAgoraRTCClient, ILocalTrack } from 'agora-rtc-sdk-ng';
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
  const options = {
    appId: process.env.NEXT_PUBLIC_APP_ID,
    channel: process.env.NEXT_PUBLIC_CHANNEL_NAME,
    token: process.env.NEXT_PUBLIC_TEMP_TOKEN, // generated on server
  };
  const classes = useStyles();

  /**
   * @returns {IAgoraRTCClient} client agora client instance
   */
  const createClient = (): IAgoraRTCClient => {
    // return AgoraRTC.createClient({ mode: "live", codec: "h264", role: "audience" })
    return AgoraRTC.createClient({ mode: 'rtc', codec: 'h264' });
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
          options.appId ?? '', // APP_ID
          options.channel ?? '', // CHANNEL
          options.token ?? null, // TOKEN
          null, // uid: The user ID, which should be unique in a channel. If you set uid as null, Agora automatically assigns a user ID and returns it in the result of join.
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
   * @description Initializes the local track
   * @param {IAgoraRTCClient} client agora client instance
   * @returns {Promise<ILocalTrack[]>} local video tracks
   */
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
  /**
   * @description show local track
   * @param {IAgoraRTCClient} client agora client instance
   */
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
      await prepareJoin(client);
      await subscribe(client);
      await client.publish(localTracks);
      showLocalTrack(client);
    })();

    // clean up
    return () => {
      console.log('clean up');
    };
  }, []);

  return (
    <div className={classes.root}>
      <Paper elevation={0} />
      <Paper id="me" />
      <Paper elevation={3} id="remote-container" />
    </div>
  );
}
