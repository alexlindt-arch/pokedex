const state = {
  offset: 0,
  limit: 20,
  displayedIds: [],
  currentIndex: -1,
  isLoading: false
};

function showLoading(visible) {
  document.getElementById('loadingScreen').classList.toggle('hidden', !visible);
}

function setLoadMoreDisabled(disabled) {
  document.getElementById('loadMoreBtn').disabled = disabled;
}

function showNoResults(visible) {
  document.getElementById('noResults').classList.toggle('hidden', !visible);
}

function updatePokeCount() {
  const el = document.getElementById('pokeCount');
  if (el) el.textContent = `Showing ${state.displayedIds.length} Pokémon`;
}

function updateNavBtns() {
  document.getElementById('prevBtn').disabled = state.currentIndex <= 0;
  document.getElementById('nextBtn').disabled =
    state.currentIndex < 0 || state.currentIndex >= state.displayedIds.length - 1;
}

function animateStatBars() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.stat-fill[data-pct]').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
    });
  });
}

function appendPokemonsToGrid(pokemons) {
  const grid = document.getElementById('pokemonGrid');
  pokemons.forEach((p, i) => {
    state.displayedIds.push(p.id);
    grid.insertAdjacentHTML('beforeend', createCardHTML(p));
    const card = grid.lastElementChild;
    card.style.animationDelay = `${i * 40}ms`;
    card.classList.add('card-enter');
  });
  updatePokeCount();
}

async function loadPokemons(offset) {
  showLoading(true);
  try {
    const list = await fetchPokemonList(offset, state.limit);
    const pokemons = await Promise.all(list.results.map(p => fetchPokemonDetail(p.name)));
    appendPokemonsToGrid(pokemons);
    attachCardListeners();
  } catch (err) {
    console.error('Failed to load Pokémon:', err);
  }
  showLoading(false);
}

async function loadInitialPokemon() {
  await loadPokemons(0);
  state.offset = state.limit;
}

async function loadMorePokemon() {
  if (state.isLoading) return;
  state.isLoading = true;
  setLoadMoreDisabled(true);
  await loadPokemons(state.offset);
  state.offset += state.limit;
  setLoadMoreDisabled(false);
  state.isLoading = false;
}

async function openOverlay(pokemonId) {
  const pokemon = await fetchPokemonDetail(pokemonId);
  state.currentIndex = state.displayedIds.indexOf(pokemon.id);
  document.getElementById('overlayContent').innerHTML = createOverlayHTML(pokemon);
  document.getElementById('overlayCard').scrollTop = 0;
  document.getElementById('overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  animateStatBars();
  updateNavBtns();
  loadEvolutionChain(pokemon.id);
}

function closeOverlay() {
  document.getElementById('overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

async function navigateOverlay(direction) {
  if (document.getElementById('overlay').classList.contains('hidden')) return;
  if (state.currentIndex < 0) return;
  const newIndex = state.currentIndex + direction;
  if (newIndex < 0 || newIndex >= state.displayedIds.length) return;
  await openOverlay(state.displayedIds[newIndex]);
}

function attachEvoListeners() {
  document.querySelectorAll('.evo-name[data-name]').forEach(span => {
    span.style.cursor = 'pointer';
    span.addEventListener('click', async () => {
      const pokemon = await fetchPokemonDetail(span.dataset.name);
      openOverlay(pokemon.id);
    });
  });
}

async function loadEvolutionChain(pokemonId) {
  try {
    const species = await fetchSpecies(pokemonId);
    const chainData = await fetchEvolutionChain(species.evolution_chain.url);
    renderEvoChain(chainData);
    attachEvoListeners();
  } catch {
    const el = document.getElementById('evoChain');
    if (el) el.innerHTML = '';
  }
}

async function handleSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (query.length < 3) return;
  showNoResults(false);
  const pokemon = await searchPokemon(query);
  if (!pokemon) { showNoResults(true); return; }
  openOverlay(pokemon.id);
}

function attachCardListeners() {
  document.querySelectorAll('.pokemon-card:not([data-bound])').forEach(card => {
    card.dataset.bound = 'true';
    card.addEventListener('click', () => openOverlay(Number(card.dataset.id)));
  });
}

function initOverlayListeners() {
  document.getElementById('closeBtn').addEventListener('click', closeOverlay);
  document.getElementById('prevBtn').addEventListener('click', () => navigateOverlay(-1));
  document.getElementById('nextBtn').addEventListener('click', () => navigateOverlay(1));
  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target.id === 'overlay') closeOverlay();
  });
}

function initSearchListeners() {
  const input = document.getElementById('searchInput');
  const btn = document.getElementById('searchBtn');
  btn.addEventListener('click', handleSearch);
  input.addEventListener('input', () => {
    btn.disabled = input.value.trim().length < 3;
    showNoResults(false);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim().length >= 3) handleSearch();
  });
}

function initKeyboardListeners() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeOverlay();
    if (e.key === 'ArrowLeft') navigateOverlay(-1);
    if (e.key === 'ArrowRight') navigateOverlay(1);
  });
}

function initEventListeners() {
  document.getElementById('loadMoreBtn').addEventListener('click', loadMorePokemon);
  initOverlayListeners();
  initSearchListeners();
  initKeyboardListeners();
}

document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  loadInitialPokemon();
});
