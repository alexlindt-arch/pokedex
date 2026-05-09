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
    <div class="stat-bar"><div class="stat-fill" style="width:${pct}%;background:${color}"></div></div>
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

function createInfoSection(pokemon) {
  const h = (pokemon.height / 10).toFixed(1);
  const w = (pokemon.weight / 10).toFixed(1);
  const exp = pokemon.base_experience || '—';
  return `<div class="info-row">
    <div class="info-item"><span>Height</span><strong>${h} m</strong></div>
    <div class="info-item"><span>Weight</span><strong>${w} kg</strong></div>
    <div class="info-item"><span>Base Exp</span><strong>${exp}</strong></div>
  </div>`;
}

function createOverlayHeader(pokemon) {
  const color = getTypeColor(pokemon.types);
  const name = formatName(pokemon.name);
  const id = String(pokemon.id).padStart(3, '0');
  const img = getSprite(pokemon);
  return `<div class="ov-header" style="--card-color:${color}">
    <span class="poke-id">#${id}</span>
    <img src="${img}" alt="${name}" class="ov-img">
    <h2>${name}</h2>
    <div class="type-badges">${createTypeBadges(pokemon.types)}</div>
  </div>`;
}

function createOverlayBody(pokemon) {
  const abilities = createAbilitiesHTML(pokemon.abilities);
  const stats = createStatsHTML(pokemon.stats);
  return `<div class="ov-body">
    ${createInfoSection(pokemon)}
    <div class="ov-section"><h4>Abilities</h4><div class="abilities">${abilities}</div></div>
    <div class="ov-section"><h4>Base Stats</h4>${stats}</div>
    <div id="evoChain" class="ov-section">
      <h4>Evolution Chain</h4><div class="evo-loading">Loading…</div>
    </div>
  </div>`;
}

function createOverlayHTML(pokemon) {
  return createOverlayHeader(pokemon) + createOverlayBody(pokemon);
}

function buildEvoNames(chain, names = []) {
  names.push(capitalize(chain.species.name));
  if (chain.evolves_to.length > 0) buildEvoNames(chain.evolves_to[0], names);
  return names;
}

function renderEvoChain(chainData) {
  const names = buildEvoNames(chainData.chain);
  const inner = names
    .map(n => `<span class="evo-name">${n}</span>`)
    .join('<span class="evo-arrow"> → </span>');
  const el = document.getElementById('evoChain');
  if (el) el.innerHTML = `<h4>Evolution Chain</h4><div class="evo-list">${inner}</div>`;
}
