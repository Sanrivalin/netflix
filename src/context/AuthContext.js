import { createContext, useContext, useEffect, useState } from 'react';
import {auth, db} from '../firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
  } from 'firebase/auth';
  import {setDoc, doc} from 'firebase/firestore'

const AuthContext = createContext();

export function AuthContextProvider ({children}) {
    const [user, setUser] = useState({})
  

    async function signUp(email, password) {
      try {
        // Create user account
        await createUserWithEmailAndPassword(auth, email, password);
  
        // Set user document in Firestore
        await setDoc(doc(db, 'users', email), {
          //to save an specific movie at account
          savedShows: []
        });
  
        alert('User signed up successfully!');
      } catch (error) {
        // Handle specific errors
        if (error.code === 'auth/email-already-in-use') {
          alert('Email is already taken. Please try again and choose a different one.');
        } else {
          throw error; // Re-throw other errors
        }}}



    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
      }
    
      function logOut() {
        return signOut(auth);
      }

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
        return () => {
          unsubscribe();
        };
      });

    return (
        <AuthContext.Provider value={{signUp, logIn, logOut,user}}>
            {children}
            </AuthContext.Provider>
    )
}

export function UserAuth () {
    return useContext(AuthContext)
}