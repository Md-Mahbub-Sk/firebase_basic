import React from 'react';
import  { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [users,setUser] = useState({
    signedIn:false,
    name:'',
    email:'',
    photo:'',
    error:''
  })
  const handleSignIn = () => {
    
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      var {email,displayName, photoURL} = res.user;
      const signedInUser = {
        signedIn:true,
        name:displayName,
        email:email,
        photo: photoURL
      }
      setUser(signedInUser)
      console.log(email,displayName,photoURL);
      console.log(signedInUser.signedIn);
      
      
    })
    .catch(error=>{
      
      console.log(error.message)
    })
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        signedIn:false,
        name:'',
        photo:'',
        password:'',
        isValid:false,
        existingUser:false
      }
      setUser(signedOutUser)
    })
    .catch(error=>{
      console.log("error 404!!");
    })
  }

  const isValidEmail = email =>/(.+)@(.+){4,}\.(.+){3,}/.test(email);
 
  
  const handleChange = event =>{
    const  newUserInfo ={
      ...users
    }

    // perform validation...
    let isValid = true;
    if (event.target.name === 'email'){
      isValid= isValidEmail(event.target.value);
    }
    if (event.target.name ==='password'){
      isValid= event.target.value.length > 8;
    }


    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
    
  }


/**create account method is here.. which is linked by firebase..*/
  const createAccount = (e) =>{
    if(users.isValid){
      firebase.auth().createUserWithEmailAndPassword(users.email,users.password)
      
      .then(res => {
        const createdUser = {...users};
        createdUser.signedIn = true;
        createdUser.error = '';
        setUser(createdUser);
        console.log("yes",res);
      })
      
      .catch(error=>{
        console.log(error.message,"not bro!!")
        const createdUser = {...users};
        createdUser.signedIn = false;
        createdUser.error = error.message;
        setUser(createdUser);
      })
    }
    e.preventDefault();
    e.target.reset();
  }


  /** login or sign in */ 
const signIn= (event)=>{
  
        const createdUser = {...users};
        
        if(users.isValid){
          firebase.auth().signInWithEmailAndPassword(users.email,users.password)
          
          .then(res => {
            const createdUser = {...users};
            createdUser.signedIn = true;
            createdUser.error = '';
            setUser(createdUser);
            console.log("yes",res);
          })
          
          .catch(error=>{
            console.log(error.message,"not bro!!")
            const createdUser = {...users};
            createdUser.signedIn = false;
            createdUser.error = error.message;
            setUser(createdUser);
          })
          
}
         
          createdUser.existingUser= event.target.checked;
          setUser(createdUser);
}

  return (
    <div className="App">
      {
        users.signedIn === true ? <button onClick={handleSignOut}>Sign Out</button> :
        <button onClick={handleSignIn}>Sign in</button>
      }
      {
        users.signedIn === true && <div>
          <p>welcome {users.name}</p>
          <p>your Email: {users.email}</p>
          <img src={users.photo} alt=""/>

        </div>
      }
    {/**form log in  */}

      <h1>our own authentication</h1>
      <label htmlFor="switchForm">Returning User
          <input type="checkbox" name="switchForm" onChange={signIn} id="switchForm"/>
        </label>
      <form style={{display:users.existingUser === true ? "block" : "none"}} onSubmit={signIn}>
        
        <h1>login</h1>
        <input onBlur={handleChange} type="text" name="email" placeholder="type your own email" required/>
        <br/>
        <input onBlur={handleChange} type="password" name="password" placeholder="your password" required/>
        <br/>
        <input type="submit" value="sign in"/>
      </form>




      {/**form create account */}
      <br/>
      
      <form style={{display:users.existingUser === true ? "none" : "block"}} onSubmit={createAccount}>
      <h1>register</h1>
        <input onBlur={handleChange} type="text" name="name" placeholder="type your own password" required/>
        <br/>
        <input onBlur={handleChange} type="text" name="email" placeholder="type your own email" required/>
        <br/>
        <input onBlur={handleChange} type="password" name="password" placeholder="your password" required/>
        <br/>
        <input type="submit" value="create account"/>
      </form>
      {
        users.error && <p style={{color:"red",fontSize:"24px"}}>{users.error}</p>
      }
    </div>
  );
}

export default App;
