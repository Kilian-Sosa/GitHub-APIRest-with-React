import React, { useState, ChangeEvent, MouseEventHandler } from "react";
import '../App.css';
import options from '../token.js';

function Profile() {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [username, setUsername] = useState<string>("");
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const submitHandler: MouseEventHandler<HTMLButtonElement> = async e=>{
    e.preventDefault();
    try{
      const profile = await fetch(`https://api.github.com/users/${username}`, options);
      const profileJson = await profile.json();
      setData(profileJson);
      console.log(data);
  
      const imagen = document.getElementById("imagen") as HTMLImageElement;
      if(profileJson["message"] !== "Not Found") imagen.src = profileJson.avatar_url;
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="col-12 d-flex justify-content-center align-items-center">
      <div className="container col-3 ">
        <img src="https://picsum.photos/300/300" alt="User Avatar" id="imagen" className="col-12" />
      </div>
      <div className="container col-3">
        <input type="text" value={username} onChange={onChangeHandler} className="col-4" />
        <button type="button" className="btn btn-primary col-4"  onClick={submitHandler} >Buscar</button>
      </div>
    </div>
  );
}

export default Profile;