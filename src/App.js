import React, { useEffect, useState} from "react";
import "./App.css"

function App() {
  const [pokemons, setPokemons] = useState([])
  const [search, setSearch] = useState("")
  const [paginate, SetPaginate] = useState(1)
  const itemsPerPage = 8;
  
  const indexOfLastItem = paginate * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginateItems = pokemons.slice(indexOfFirstItem, indexOfLastItem)

  const totalPage = Math.ceil(pokemons.length / itemsPerPage);

  const nextPage = () => {
    if ( paginate < totalPage) SetPaginate(paginate + 1);
  }

  const prevPage = () => {
    if (paginate > 1) SetPaginate(paginate - 1);
  }

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
        {paginateItems
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
      <div className="pagination">
        <button onClick={prevPage} disabled={paginate === 1}>
          Anterior
        </button>
        <span>Página {paginate} de {totalPage} </span>
        <button onClick={nextPage} disabled={paginate === totalPage}>
          Siguente
        </button>
      </div>
    </div>
  );
}

export default App;
