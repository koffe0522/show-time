import firebase from 'firebase/app';
import { useEffect, useMemo, useState } from 'react';

// useAuthState
const useAuthState = (auth: firebase.auth.Auth) => {
  const [user, setUser] = useState<firebase.User>();
  const [error, setError] = useState<firebase.auth.Error>();

  const onError = (err: firebase.auth.Error) => {
    setError(err);
    setUser(null);
  };

  const onCompleted = () => {
    console.log('completed!!');
  };

  useEffect(() => {
    const listener = auth.onAuthStateChanged(
      (user) => {
        if (user) {
          setUser(user);
          setError(null);
        }
      },
      onError,
      onCompleted,
    );

    return () => {
      listener();
    };
  }, [auth]);

  return useMemo(() => ({ user, error }), [user, error]);
};

export default useAuthState;
