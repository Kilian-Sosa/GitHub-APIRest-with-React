import React, { useState, ChangeEvent, MouseEventHandler, useEffect } from "react";
import '../App.css';
import options from '../token.js';
import axios from 'axios';
import Autosuggest, { SuggestionsFetchRequestedParams } from 'react-autosuggest';

interface Repo {
  html_url: string,
  name: string,
  description: string,
  watchers: number,
  forks: number
}

interface User {
  login: string,
  avatar_url: string,
  name: string,
  bio: string,
  location: string,
  email: string,
  blog: string,
  created_at: string,
  public_repos: number,
  public_gists: number,
  followers: number,
  following: number
  html_url: string
}

function Profile() {
  const [data, setData] = useState<User[]>([]);
  const [user, setUser] = useState<User>({} as User);
  const [reposData, setRepos] = useState<Record<string, Repo>>({});
  const [userSelected, setUserSelected] = useState({});
  const [value, setValue] = useState("");
  const [flag, setFlag] = useState(false);

  const reposHandler: MouseEventHandler<HTMLButtonElement> = async e=>{
    e.preventDefault();
    try{
      const repos = await fetch(`https://api.github.com/users/${user.login}/repos`, options);
      const reposJson = await repos.json();
      setRepos(reposJson);
      console.log(reposJson);
    }catch(err){
      console.log(err);
    }
  }
  
  const onSuggestionsFetchRequested = ({ value }: SuggestionsFetchRequestedParams) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    if(inputLength < 3) return [];

    axios.get(`https://api.github.com/search/users?q=${inputValue}%20in:login`, options).then(response => {
      setData(response.data["items"]);
    })
  };

  const onSuggestionsClearRequested = () => { 
    setData([]);
    setFlag(false);
    setRepos({});
    const imagen = document.getElementById("imagen") as HTMLImageElement;
    imagen.src = "https://picsum.photos/300/300";
  };

  const getSuggestionValue = (suggestion: any) => { return suggestion.login; };

  const renderSuggestion = (suggestion: any) => {
    return (
      <div onClick={()=>getUser(suggestion)}>
        {suggestion.login}
      </div>
    );
  };

  const inputProps = {
    placeholder: "Buscar usuario",
    value,
    onChange: (event: any, { newValue }: any) => {
      setValue(newValue);
    }
  }

  const eventEnter = (e: any)=>{
    if(e.keyCode === 13){
      let currentUser = data.filter((u => u.login === e.target.value.trim()));
      console.log(currentUser);
      getUser(currentUser[0]);
    }
  }

  const getUser = (userA: any) => {
    axios.get(userA.url, options).then(response => {
      setUser(response.data);
      setUserSelected(response.data);

      if(user.avatar_url !== undefined){
        setFlag(true);
        const imagen = document.getElementById("imagen") as HTMLImageElement;
        imagen.src = user.avatar_url;
        setRepos({});
      }  
    }).catch(error => {
      console.error(error);
    });
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center gap-2 mb-5 text-white">
        <Autosuggest 
            suggestions={data}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            onSuggestionSelected={eventEnter}
          />
        <button type="button" className="btn btn-primary col-4" id="btnSearch" onClick={()=>{getUser(userSelected);}}>Buscar</button>
      </div>
      <div className="col-12 d-flex justify-content-center align-items-center gap-2">
        <div className="col-3 card align-items-center">
          <img src="https://picsum.photos/300/300" alt="User Avatar" id="imagen" className="col-12" />
          <p className="fs-4 card-title">{flag ? (<a href={user.html_url + ""} target="_blank">{user.login + ""}</a>) : null}</p>
          <p className="fs-6 card-title px-3">{user.bio}</p>
          {flag ? (<button type="button" className="btn btn-info col-8 text-white mb-2" onClick={reposHandler}>Mostrar Repositorios</button>) : null}
        </div>
        {flag ? (
          <div className="col-5 card">
            <div className="text-white col-12">
              <span className="bg-primary mx-1 col-2 rounded px-1">{user.public_repos + ""} Repositorios Públicos</span>
              <span className="bg-success mx-1 col-2 rounded px-1">{user.public_gists + ""} Gists Públicos</span>
              <span className="bg-info mx-1 col-2 rounded px-1">{user.followers + ""} Seguidores</span>
              <span className="bg-warning mx-1 col-2 rounded px-1">{user.following + ""} Seguidos</span>
            </div>
            <ul className="list-group">
              <li className="list-group-item"><strong>Nombre: </strong>{user.name}</li>
              <li className="list-group-item"><strong>Localización: </strong>{user.location}</li>
              <li className="list-group-item"><strong>Correo Electrónico: </strong>{user.email}</li>
              <li className="list-group-item"><strong>Página Web: </strong>{user.blog + ""}</li>
              <li className="list-group-item"><strong>Se unió en: </strong>{user.created_at + ""}</li>
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