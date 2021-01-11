import firebase from 'firebase/app';
import { useCallback, useState } from 'react';

// useAuth
const useAuth = () => {
  const [user, setUser] = useState<firebase.User>();
  const [error, setError] = useState<firebase.auth.Error>();
  const [isLoading, setLoading] = useState<boolean>(false);

  const signupEmailAndPassword = useCallback((email: string, password: string) => {
    setLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(onCompleted)
      .catch(onError)
      .finally(() => setLoading(false));
  }, []);

  const onError = (err: firebase.auth.Error) => {
    setError(err);
    setUser(null);
  };

  const onCompleted = (value: firebase.auth.UserCredential) => {
    setError(null);
    setUser(value.user);
  };

  return {
    user,
    error,
    isLoading,
    signupEmailAndPassword,
  };
};

export default useAuth;
