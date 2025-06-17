import React, { useState, useEffect, useRef } from "react";

const SearchBar = ({ busca, setBusca }) => {
  const [valorInput, setValorInput] = useState(busca);
  const debounceTimeout = useRef(null);

  useEffect(() => { 
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setBusca(valorInput);
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
  }, [valorInput, setBusca]);

  const limparBusca = () => {
    setValorInput("");
    setBusca("");
  };

  return (
    <div className="input-group w-auto">
      <span className="input-group-text" id="search-icon">
        <i className="bi bi-search" /> 
      </span>
      <input
        type="search"
        className="form-control"
        placeholder="Pesquisar por nome..."
        aria-label="Pesquisar"
        aria-describedby="search-icon"
        value={valorInput}
        onChange={(e) => setValorInput(e.target.value)}
      />
      {valorInput && (
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={limparBusca}
          aria-label="Limpar pesquisa"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default SearchBar;
