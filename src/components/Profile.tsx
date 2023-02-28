import React, { useState, ChangeEvent, MouseEventHandler } from "react";
import '../App.css';
import options from '../token.js';

interface Repo {
  html_url: string,
  name: string,
  description: string,
  watchers: number,
  forks: number
}

function Profile() {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [reposData, setRepos] = useState<Record<string, Repo>>({});
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
        setUsername("");
        setRepos({});
      }
    }catch(err){
      console.log(err);
    }
  }

  const reposHandler: MouseEventHandler<HTMLButtonElement> = async e=>{
    e.preventDefault();
    const inputUserName = document.querySelector("input") as HTMLInputElement;
    if(inputUserName.value.match("^\s*"), "") return;
    setUsername(inputUserName.value);
    
    try{
      const repos = await fetch(`https://api.github.com/users/${data["login"]}/repos`, options);
      const reposJson = await repos.json();
      setRepos(reposJson);
      console.log(reposJson);
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center gap-2 mb-5">
        <input type="text" className="col-4" value={username} onChange={onChangeHandler}/>
        <button type="button" className="btn btn-primary col-4" onClick={submitHandler}>Buscar</button>
      </div>
      <div className="col-12 d-flex justify-content-center align-items-center gap-2">
        <div className="col-3 card align-items-center">
          <img src="https://picsum.photos/300/300" alt="User Avatar" id="imagen" className="col-12" />
          <p className="fs-4 card-title">{Object.keys(data).length > 0 ? (<a href={data["html_url"] + ""} target="_blank">{data["login"] + ""}</a>) : null}</p>
          <p className="fs-6 card-title px-3">{bio}</p>
          {Object.keys(data).length > 0 ? (<button type="button" className="btn btn-info col-8 text-white mb-2" onClick={reposHandler}>Mostrar Repositorios</button>) : null}
        </div>
        {Object.keys(data).length > 0 ? (
          <div className="col-5 card">
            <div className="text-white col-12">
              <span className="bg-primary mx-1 col-2 rounded px-1">{data["public_repos"] + ""} Repositorios Públicos</span>
              <span className="bg-success mx-1 col-2 rounded px-1">{data["public_gists"] + ""} Gists Públicos</span>
              <span className="bg-info mx-1 col-2 rounded px-1">{data["followers"] + ""} Seguidores</span>
              <span className="bg-warning mx-1 col-2 rounded px-1">{data["following"] + ""} Seguidos</span>
            </div>
            <ul className="list-group">
              <li className="list-group-item"><strong>Nombre: </strong>{name}</li>
              <li className="list-group-item"><strong>Localización: </strong>{location}</li>
              <li className="list-group-item"><strong>Correo Electrónico: </strong>{email}</li>
              <li className="list-group-item"><strong>Página Web: </strong>{data["blog"] + ""}</li>
              <li className="list-group-item"><strong>Se unió en: </strong>{data["created_at"] + ""}</li>
            </ul>
        </div>
        ) : null}
      </div>
      {Object.keys(reposData).length > 0 ? (
        <div className="col-12 d-flex justify-content-center align-items-center gap-2 mt-5">
          <div className="col-7 card">
            <p className="fs-4 card-header mb-4">Repositorios</p>
            {Object.values(reposData).map((repo: Repo) => {
              return (
                <div className="p-2">
                  <div className="row">
                    <div className="col-7">
                      <h5><a href={repo.html_url} target="_blank">{repo.name}</a></h5>
                    </div>
                    <ul className="list-group col-5 d-flex text-white flex-row justify-content-end align-items-center">
                      <span className="bg-primary mx-1 col-5 px-1 rounded text-white">{repo.watchers} Views</span>
                      <span className="bg-success mx-1 col-4 px-1 rounded text-white">{repo.forks} Forks</span>
                    </ul>
                  </div>
                  <div className="row">
                    <p>{repo.description}</p>
                  </div>
                  <hr/>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Profile;