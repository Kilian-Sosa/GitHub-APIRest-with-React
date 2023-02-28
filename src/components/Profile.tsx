import React, { useState, ChangeEvent, MouseEventHandler } from "react";
import '../App.css';
import options from '../token.js';

function Profile() {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const submitHandler: MouseEventHandler<HTMLButtonElement> = async e=>{
    e.preventDefault();
    const inputUserName = document.querySelector("input") as HTMLInputElement;
    if(inputUserName.value.match("^\s*"), "") return;
    setUsername(inputUserName.value);
    
    try{
      const profile = await fetch(`https://api.github.com/users/${username}`, options);
      const profileJson = await profile.json();
      setData(profileJson);
      console.log(profileJson);
  
      const imagen = document.getElementById("imagen") as HTMLImageElement;
      if(profileJson["message"] !== "Not Found") {
        imagen.src = profileJson.avatar_url;
        setName(profileJson.name);
        setBio(profileJson.bio);
        setLocation(profileJson.location);
        setEmail(profileJson.email);
      }
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center gap-2 mb-5">
        <input type="text" className="col-4" value={username} onChange={onChangeHandler}/>
        <button type="button" className="btn btn-primary col-4"  onClick={submitHandler} >Buscar</button>
      </div>
      <div className="col-12 d-flex justify-content-center align-items-center gap-2">
        <div className="col-3 card">
          <img src="https://picsum.photos/300/300" alt="User Avatar" id="imagen" className="col-12" />
          <p className="fs-4 card-title">{username}</p>
          <p className="fs-6 card-title">{bio}</p>
        </div>
        {Object.keys(data).length > 0 ? (
          <div className="col-4 card">
            <div className="gap-2 text-white">
              <span className="label bg-primary">{data["public_repos"] + ""} Public Repos</span>
              <span className="label bg-success">{data["public_gists"] + ""} Public Gists</span>
              <span className="label bg-info">{data["followers"] + ""} Followers</span>
              <span className="label bg-warning">{data["following"] + ""} Following</span>
            </div>
            <ul className="list-group">
              <li className="list-group-item"><strong>Name: </strong>{name}</li>
              <li className="list-group-item"><strong>Location: </strong>{location}</li>
              <li className="list-group-item"><strong>Email: </strong>{email}</li>
              <li className="list-group-item"><strong>WebPage: </strong>{data["blog"] + ""}</li>
              <li className="list-group-item"><strong>Member Since: </strong>{data["created_at"] + ""}</li>
            </ul>
        </div>
        ) : null}
      </div>
    </div>
  );
}

export default Profile;