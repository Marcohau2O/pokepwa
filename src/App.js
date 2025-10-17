import React, { useEffect, useState} from "react";
import "./App.css"

function App() {
  const [pokemons, setPokemons] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
    .then((res) => res.json())
    .then((data) => {
      setPokemons(data.results);
    });
  }, []);


  return (
    <div className="app">
      <h1>Pokedex PWA</h1>
      <input type="text" placeholder="Buscar Pokémon" value={search} onChange={(e) => setSearch(e.target.value)}/>
      <div className="pokemon-grid">
        {pokemons
        .filter((p) => p.name.includes(search.toLowerCase()))
        .map((p, index) => {
          return(
            <div key={index} className="card">
              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                alt={p.name}
              />
              <p>{p.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
