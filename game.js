(() => {
  const stage = document.querySelector('#stage'), player = document.querySelector('#player'), squirrel = document.querySelector('#squirrel');
  const scoreEl = document.querySelector('#score'), heartsEl = document.querySelector('#hearts'), message = document.querySelector('#message');
  const title = document.querySelector('#messageTitle'), text = document.querySelector('#messageText'), start = document.querySelector('#startBtn');
  let score = 0, hearts = 3, playing = false, playerX = .5, lastTime = 0, spawnTimer = 0, elapsed = 0, items = [], keys = new Set();
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function updateHUD() { scoreEl.textContent = score; heartsEl.textContent = '♥ '.repeat(hearts).trim() || '—'; }
  function setPlayer() { player.style.left = `${playerX * 100}%`; }
  function reset() { items.forEach(item => item.el.remove()); items = []; score = 0; hearts = 3; elapsed = spawnTimer = lastTime = 0; playerX = .5; updateHUD(); setPlayer(); }
  function begin() { reset(); playing = true; message.hidden = true; start.textContent = '遊戲進行中'; start.disabled = true; requestAnimationFrame(loop); }
  function endGame() { playing = false; message.hidden = false; title.textContent = '遊戲結束！'; text.textContent = `你接到了 ${score} 顆蘋果，松鼠為你拍拍手！`; start.textContent = '開始遊戲'; start.disabled = false; }
  function loseHeart() { hearts--; updateHUD(); if (hearts <= 0) endGame(); }
  function spawn() { const chestnut = Math.random() < .24; const el = document.createElement('div'); el.className = `item ${chestnut ? 'chestnut' : 'apple'}`; stage.append(el); items.push({ el, type:chestnut ? 'chestnut' : 'apple', x:.25 + Math.random() * .42, y:.22, speed:.19 + elapsed * .0015 }); squirrel.style.transform = 'translateY(-5px) rotate(-3deg)'; setTimeout(() => squirrel.style.transform = '', 140); }
  function loop(time) { if (!playing) return; const dt = Math.min((time - lastTime || 16) / 1000, .05); lastTime = time; elapsed += dt; const direction = (keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0); playerX = clamp(playerX + direction * dt * .72, .08, .92); setPlayer(); spawnTimer += dt; if (spawnTimer >= Math.max(.68, 1.45 - elapsed * .012)) { spawnTimer = 0; spawn(); }
    const playerRect = player.getBoundingClientRect(), basket = { left:playerRect.left, right:playerRect.left + 58, top:playerRect.top + 55, bottom:playerRect.top + 99 };
    items = items.filter(item => { item.y += item.speed * dt; item.el.style.left = `${item.x * 100}%`; item.el.style.top = `${item.y * 100}%`; const rect = item.el.getBoundingClientRect(); const caught = rect.right > basket.left && rect.left < basket.right && rect.bottom > basket.top && rect.top < basket.bottom; if (caught) { item.el.remove(); if (item.type === 'apple') { score++; updateHUD(); } else loseHeart(); return false; } if (item.y > 1.05) { item.el.remove(); if (item.type === 'apple') loseHeart(); return false; } return playing; }); requestAnimationFrame(loop); }
  document.addEventListener('keydown', event => { if (['ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); keys.add(event.key); } }); document.addEventListener('keyup', event => keys.delete(event.key));
  function hold(button, key) { button.addEventListener('pointerdown', event => { event.preventDefault(); keys.add(key); button.setPointerCapture?.(event.pointerId); }); ['pointerup','pointercancel','pointerleave'].forEach(name => button.addEventListener(name, () => keys.delete(key))); }
  hold(document.querySelector('#leftBtn'), 'ArrowLeft'); hold(document.querySelector('#rightBtn'), 'ArrowRight'); start.addEventListener('click', begin); document.querySelector('#restartBtn').addEventListener('click', begin); updateHUD(); setPlayer();
})();
