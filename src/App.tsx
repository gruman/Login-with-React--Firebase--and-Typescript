import React, { useState, useEffect } from "react";
import "./App.css";
import "./constants/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";

function App(): JSX.Element {
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleLogout(): void {
    signOut(auth);
  }

  function handleCreate(): void {
    if (email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential: UserCredential) => {
          // Signed in
          setUser(userCredential.user);
        })
        .catch((error: any) => {
          setErrorMessage(error.message);
        });
    } else {
      setErrorMessage("Please fill out both fields.");
    }
  }

  function handleLogin(): void {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        // Signed in
        setUser(userCredential.user);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (userCredential) => {
      // check if user is already logged in
      if (userCredential) {
        setUser(userCredential);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <div className="container">
      <h1>Login Website</h1>
      {user ? (
        <p onClick={() => handleLogout()}>Logout</p>
      ) : (
        <>
          <p>Create an account to login.</p>
          {errorMessage && <p className="error">{errorMessage}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit" onClick={() => handleLogin()}>
            Login
          </button>
          <button type="submit" onClick={() => handleCreate()}>
            Create Account
          </button>
        </>
      )}
    </div>
  );
}

export default App;
