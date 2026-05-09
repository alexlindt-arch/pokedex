const BASE_URL = 'https://pokeapi.co/api/v2';
const cache = {};

async function fetchWithCache(url) {
  if (cache[url]) return cache[url];
  const res = await fetch(url);
  if (!res.ok) throw new Error('Fetch failed: ' + url);
  const data = await res.json();
  cache[url] = data;
  return data;
}

async function fetchPokemonList(offset, limit) {
  return fetchWithCache(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
}

async function fetchPokemonDetail(nameOrId) {
  return fetchWithCache(`${BASE_URL}/pokemon/${nameOrId}`);
}

async function fetchSpecies(pokemonId) {
  return fetchWithCache(`${BASE_URL}/pokemon-species/${pokemonId}`);
}

async function fetchEvolutionChain(chainUrl) {
  return fetchWithCache(chainUrl);
}

async function searchPokemon(query) {
  return fetchWithCache(`${BASE_URL}/pokemon/${query.toLowerCase()}`).catch(() => null);
}
