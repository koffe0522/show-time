import React from 'react';

// import { useAuthentication } from '@/hooks/firebase';
import Main from '@/layouts';

export default function SignIn() {
  // const [values, setValues] = useState({ email: '', password: '' });
  // const { isLoading, user, error, signupEmailAndPassword } = useAuthentication();

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.name === 'email') {
  //     setValues((prev) => ({ ...prev, email: event.target.value }));
  //     return;
  //   }

  //   setValues((prev) => ({ ...prev, password: event.target.value }));
  // };

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   if (!values.email || !values.password) {
  //     return;
  //   }

  //   signupEmailAndPassword(values.email, values.password);
  // };

  return <Main></Main>;
}
