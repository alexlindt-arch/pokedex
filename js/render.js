const typeColors = {
  normal: '#9A9A7A', fire: '#F08030', water: '#6890F0',
  electric: '#F8D030', grass: '#78C850', ice: '#98D8D8',
  fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
  flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8',
  dark: '#705848', steel: '#B8B8D0', fairy: '#EE99AC'
};

const statColors = {
  hp: '#4CAF50', attack: '#F44336', defense: '#2196F3',
  'special-attack': '#9C27B0', 'special-defense': '#00BCD4', speed: '#FF9800'
};

const statLabels = {
  hp: 'HP', attack: 'ATK', defense: 'DEF',
  'special-attack': 'Sp.ATK', 'special-defense': 'Sp.DEF', speed: 'SPD'
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatName(name) {
  return name.split('-').map(capitalize).join(' ');
}

function getTypeColor(types) {
  return typeColors[types[0]?.type?.name] || '#9A9A7A';
}

function getSprite(pokemon) {
  return pokemon.sprites?.other?.['official-artwork']?.front_default
    || pokemon.sprites?.front_default
    || '';
}

function createTypeBadge(typeObj) {
  const name = typeObj.type.name;
  const color = typeColors[name] || '#777';
  return `<span class="type-badge" style="background:${color}">${capitalize(name)}</span>`;
}

function createTypeBadges(types) {
  return types.map(createTypeBadge).join('');
}

function createCardHTML(pokemon) {
  const color = getTypeColor(pokemon.types);
  const name = formatName(pokemon.name);
  const id = String(pokemon.id).padStart(3, '0');
  const img = getSprite(pokemon);
  return `<div class="pokemon-card" data-id="${pokemon.id}" style="--card-color:${color}">
    <span class="poke-id">#${id}</span>
    <img src="${img}" alt="${name}" loading="lazy">
    <h3>${name}</h3>
    <div class="type-badges">${createTypeBadges(pokemon.types)}</div>
  </div>`;
}

function createStatRow(stat) {
  const name = stat.stat.name;
  const color = statColors[name] || '#888';
  const label = statLabels[name] || name;
  const pct = Math.min((stat.base_stat / 255) * 100, 100).toFixed(1);
  return `<div class="stat-row">
    <span class="stat-label">${label}</span>
    <span class="stat-val">${stat.base_stat}</span>
    <div class="stat-bar"><div class="stat-fill" data-pct="${pct}" style="width:0;background:${color}"></div></div>
  </div>`;
}

function createStatsHTML(stats) {
  return stats.map(createStatRow).join('');
}

function createAbilitiesHTML(abilities) {
  return abilities
    .map(a => `<span class="ability-tag">${formatName(a.ability.name)}</span>`)
    .join('');
}

function createMoveTag(move) {
  return `<span class="move-tag">${formatName(move.move.name)}</span>`;
}

function createTabNav() {
  return `<div class="tab-nav">
    <button class="tab-btn active" data-tab="about">About</button>
    <button class="tab-btn" data-tab="stats">Base Stats</button>
    <button class="tab-btn" data-tab="evolution">Evolution</button>
    <button class="tab-btn" data-tab="moves">Moves</button>
  </div>`;
}

function createOverlayImgHTML(img, name, color) {
  return `<div class="img-wrapper">
    <div class="img-glow" style="background:${color}"></div>
    <img src="${img}" alt="${name}" class="ov-img">
  </div>`;
}

function createOverlayHeader(pokemon) {
  const color = getTypeColor(pokemon.types);
  const name = formatName(pokemon.name);
  const id = String(pokemon.id).padStart(3, '0');
  const img = getSprite(pokemon);
  return `<div class="ov-header" style="--card-color:${color}">
    <span class="poke-id">#${id}</span>
    <h2>${name}</h2>
    <div class="type-badges">${createTypeBadges(pokemon.types)}</div>
    ${createOverlayImgHTML(img, name, color)}
  </div>`;
}

function createAboutRows(pokemon) {
  const h = (pokemon.height / 10).toFixed(1);
  const w = (pokemon.weight / 10).toFixed(1);
  const exp = pokemon.base_experience || '—';
  return `<div class="about-grid">
    <div class="about-row"><span>Height</span><strong>${h} m</strong></div>
    <div class="about-row"><span>Weight</span><strong>${w} kg</strong></div>
    <div class="about-row"><span>Base Exp</span><strong>${exp}</strong></div>
  </div>`;
}

function createBreedingHTML() {
  return `<div class="ov-section">
    <h4>Breeding</h4>
    <div id="breedingInfo" class="about-grid">
      <div class="about-row"><span>Egg Groups</span><strong>—</strong></div>
      <div class="about-row"><span>Gender</span><strong>—</strong></div>
      <div class="about-row"><span>Egg Cycles</span><strong>—</strong></div>
    </div>
  </div>`;
}

function createAboutContent(pokemon) {
  return `<div class="tab-content active" data-content="about">
    ${createAboutRows(pokemon)}
    ${createBreedingHTML()}
    <p id="speciesDesc" class="species-desc">Loading description…</p>
  </div>`;
}

function createStatsContent(pokemon) {
  return `<div class="tab-content" data-content="stats">
    ${createStatsHTML(pokemon.stats)}
  </div>`;
}

function createEvolutionContent() {
  return `<div class="tab-content" data-content="evolution">
    <div id="evoChain"><div class="evo-loading">Loading…</div></div>
  </div>`;
}

function createMovesContent(pokemon) {
  const moves = pokemon.moves.slice(0, 40).map(createMoveTag).join('');
  return `<div class="tab-content" data-content="moves">
    <div class="moves-grid">${moves}</div>
  </div>`;
}

function createOverlayBody(pokemon) {
  return `<div class="ov-body">
    ${createTabNav()}
    ${createAboutContent(pokemon)}
    ${createStatsContent(pokemon)}
    ${createEvolutionContent()}
    ${createMovesContent(pokemon)}
  </div>`;
}

function createOverlayHTML(pokemon) {
  return createOverlayHeader(pokemon) + createOverlayBody(pokemon);
}

function buildEvoNames(chain, names = []) {
  names.push(chain.species.name);
  if (chain.evolves_to.length > 0) buildEvoNames(chain.evolves_to[0], names);
  return names;
}

function renderEvoChain(chainData) {
  const names = buildEvoNames(chainData.chain);
  const inner = names
    .map(n => `<span class="evo-name" data-name="${n}">${capitalize(n)}</span>`)
    .join('<span class="evo-arrow"> → </span>');
  const el = document.getElementById('evoChain');
  if (el) el.innerHTML = `<div class="evo-list">${inner}</div>`;
}
