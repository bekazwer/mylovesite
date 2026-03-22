import { loadData } from './dataLoader.js';
import { renderProposal } from './renderer.js';
import { loadStickers, showProposal, moveRandomEl } from './effects.js';
import { startHeartsAnimation } from "./effects.js";

async function init() {
  const data = await loadData();
  const name = getName(data.defaultName);
  loadStickers(data);
  startHeartsAnimation();
  data.proposals.forEach(proposal => renderProposal(proposal, name, showProposal));
  // Set up events for move-random
  const moveBtn = document.getElementById('move-random');
  if (moveBtn) {
    moveBtn.addEventListener('click', e => moveRandomEl(e.target));
    moveBtn.addEventListener('mouseenter', e => moveRandomEl(e.target));
  }
  // Show first proposal
  showProposal('proposal-1');
}

function getName(defaultName) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('name') || defaultName;
}

init();