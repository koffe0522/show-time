import { useCallback, useEffect, useState } from 'react';
import firebase from 'firebase/app';

type ChannelData = {
  channelName: string;
  type: string;
  file?: File;
};

export const useChannel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUniqueStr = (myStrong?: number): string => {
    let strong = 1000;
    if (myStrong) strong = myStrong;
    return new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16);
  };

  const uploadFile = async (file: File, channelName: string) => {
    return await firebase
      .storage()
      .ref()
      .child(`channel/${channelName}/${getUniqueStr()}`)
      .put(file);
  };

  const createChannel = useCallback(
    async ({ channelName, type, file, uid }: ChannelData & { uid: number }) => {
      try {
        setLoading(true);

        let url = '';
        if (file) {
          const snapshot = await uploadFile(file, channelName);
          url = await snapshot.ref.getDownloadURL();
        }
        const functions = firebase.functions();
        // ローカルではエミュレーターを使用する
        if (process.env.NODE_ENV !== 'production') {
          functions.useEmulator('localhost', 5001);
        }
        const httpEvent = functions.httpsCallable('v1-call-token-generateToken');
        const { data } = await httpEvent({ channelName, uid });

        if (data.status !== 201) {
          console.error(data.message);
          setError('error');
          setLoading(false);
          return;
        }

        await firebase.firestore().collection('channel').add({
          channelName,
          type,
          uid,
          token: data.data.token,
          preview: url,
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    },
    [],
  );

  return {
    create: createChannel,
    loading,
    error,
  };
};
