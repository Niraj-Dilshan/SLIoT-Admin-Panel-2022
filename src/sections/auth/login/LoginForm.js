import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { toast } from 'react-toastify';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "electro4-6bf4a.firebaseapp.com",
    projectId: "electro4-6bf4a",
    storageBucket: "electro4-6bf4a.appspot.com",
    messagingSenderId: "264541694722",
    appId: "1:264541694722:web:d469f224ff63c18cd5701b",
    measurementId: "G-0YTLPZX65T"
};

firebase.initializeApp(firebaseConfig);

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, navigate to dashboard
        navigate('/dashboard', { replace: true });
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleEmailChange = (event) => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value);
    setEmail(event.target.value);
    setEmailError(!isValidEmail);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(!event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!emailError && email && !passwordError && password) {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
          // User authenticated successfully, navigate to dashboard
          navigate('/dashboard', { replace: true });
          toast.success('You have successfully logged in!', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((error) => {
          // Handle any authentication errors here
          console.log(error);
          toast.error("Invalid email or password");
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <br />
      <Stack spacing={3}>
        <TextField
          fullWidth
          autoComplete="email"
          type="email"
          name="email"
          label="Email address"
          value={email}
          error={emailError}
          helperText={emailError ? 'Invalid email address' : ''}
          onChange={handleEmailChange}
        />

        <TextField
          fullWidth
          autoComplete="current-password"
          type="password"
          name="password"
          label="Password"
          value={password}
          error={passwordError}
          helperText={passwordError ? 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number' : ''}
          onChange={handlePasswordChange}
        />
      </Stack>

      <br />

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit}>
        Login
      </LoadingButton>
    </form>
  );
}
