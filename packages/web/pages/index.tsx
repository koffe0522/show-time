import firebase from '@/src/firebase';

import useAuthState from '@/hooks/firebase/useAuthState';

import Main from '@/layouts';
import LiveCardList from '@/components/organisms/LiveCardList';

export default function Home(): JSX.Element {
  const { user, error } = useAuthState(firebase.auth());

  return (
    <Main>
      {error ? <div>{error.message}</div> : null}
      {user ? <div>{user.email}</div> : null}
      <LiveCardList />
    </Main>
  );
}
