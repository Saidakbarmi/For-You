/* app.js — For You romantic site logic */

document.addEventListener('DOMContentLoaded', () => {

  /* ── State ───────────────────────────────────────────── */
  let currentQ   = 0;
  let questions  = JSON.parse(JSON.stringify(QUESTIONS));
  let negPos     = { x: 0, y: 0 };
  let evadeTimer = null;

  /* ════════════════════════════════════════════════════════
     1. BACKGROUND HEART PARTICLES
  ═══════════════════════════════════════════════════════ */
  const bgC   = document.getElementById('bgCanvas');
  const bgCtx = bgC.getContext('2d');
  const resize = () => { bgC.width = innerWidth; bgC.height = innerHeight; };
  resize(); addEventListener('resize', resize);

  const CHARS = ['♥','♡','❤','💕','✦','✧','⋆','🌸'];
  class Particle {
    constructor(){ this.reset(true) }
    reset(init){
      this.x     = Math.random() * bgC.width;
      this.y     = init ? Math.random() * bgC.height : bgC.height + 20;
      this.size  = Math.random() * 15 + 7;
      this.speed = Math.random() * .55 + .18;
      this.alpha = Math.random() * .4 + .08;
      this.drift = (Math.random() - .5) * .4;
      this.wob   = Math.random() * Math.PI * 2;
      this.wobS  = Math.random() * .025 + .008;
      this.char  = CHARS[Math.floor(Math.random() * CHARS.length)];
      this.hue   = Math.random() < .5 ? `hsl(${330+Math.random()*30},80%,65%)` : `hsl(${270+Math.random()*20},70%,70%)`;
    }
    update(){ this.y -= this.speed; this.wob += this.wobS; this.x += this.drift + Math.sin(this.wob)*.45; if(this.y < -30) this.reset() }
    draw(){ bgCtx.save(); bgCtx.globalAlpha = this.alpha; bgCtx.fillStyle = this.hue; bgCtx.font = `${this.size}px serif`; bgCtx.fillText(this.char, this.x, this.y); bgCtx.restore() }
  }
  const parts = Array.from({length:40}, () => new Particle());
  (function loop(){ bgCtx.clearRect(0,0,bgC.width,bgC.height); parts.forEach(p=>{p.update();p.draw()}); requestAnimationFrame(loop) })();

  /* ════════════════════════════════════════════════════════
     2. CONFIG → DOM
  ═══════════════════════════════════════════════════════ */
  document.title = SITE_CONFIG.pageTitle;
  document.getElementById('heroHeadline').textContent  = SITE_CONFIG.heroHeadline;
  document.getElementById('heroSubtitle').textContent  = SITE_CONFIG.heroSubtitle;
  document.getElementById('heroBtn').textContent       = SITE_CONFIG.heroButtonText;
  document.getElementById('finalHeadline').textContent = SITE_CONFIG.finalHeadline;
  document.getElementById('finalMessage').textContent  = SITE_CONFIG.finalMessage;
  document.getElementById('finalCtaBtn').textContent   = SITE_CONFIG.finalCtaText;

  /* ════════════════════════════════════════════════════════
     3. SCREEN MANAGER
  ═══════════════════════════════════════════════════════ */
  const screens = {
    hero:     document.getElementById('heroScreen'),
    question: document.getElementById('questionScreen'),
    final:    document.getElementById('finalScreen'),
  };
  const showScreen = name => {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  };

  /* ════════════════════════════════════════════════════════
     4. PROGRESS
  ═══════════════════════════════════════════════════════ */
  const progLabel = document.getElementById('progressLabel');
  const progFill  = document.getElementById('progressFill');
  const setProgress = (i, total) => {
    progFill.style.width = (i / total * 100) + '%';
    progLabel.textContent = SITE_CONFIG.progressFormat(i, total);
    progFill.parentElement.setAttribute('aria-valuenow', Math.round(i/total*100));
  };

  /* ════════════════════════════════════════════════════════
     5. ROSE BLOOM ANIMATION
  ═══════════════════════════════════════════════════════ */
  const roseOverlay = document.getElementById('roseOverlay');

  function showRoseBloom(onDone) {
    // Build burst HTML
    roseOverlay.innerHTML = `
      <div class="rose-burst">
        <div class="rose-ring"></div>
        <div class="rose-ring"></div>
        <div class="rose-ring"></div>
        <span class="rose-center">🌹</span>
      </div>`;
    roseOverlay.classList.add('visible');

    // Spawn flying petals
    spawnPetals();

    setTimeout(() => {
      roseOverlay.classList.remove('visible');
      setTimeout(() => { roseOverlay.innerHTML = ''; if(onDone) onDone(); }, 300);
    }, 1100);
  }

  const PETALS = ['🌸','🌺','🌷','✿','❀','🪷'];
  function spawnPetals() {
    const cx = innerWidth  / 2;
    const cy = innerHeight / 2;
    for (let i = 0; i < 18; i++) {
      setTimeout(() => {
        const el   = document.createElement('span');
        el.className = 'petal';
        const angle  = (Math.random() * 360) * Math.PI / 180;
        const dist   = 80 + Math.random() * 160;
        const tx     = Math.cos(angle) * dist;
        const ty     = Math.sin(angle) * dist;
        const rot    = (Math.random() * 720 - 360) + 'deg';
        el.style.cssText = `left:${cx}px;top:${cy}px;--tx:translateX(${tx}px);--ty:translateY(${ty}px);--rot:${rot};font-size:${1.2+Math.random()*1.2}rem`;
        el.textContent   = PETALS[Math.floor(Math.random() * PETALS.length)];
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1400);
      }, i * 35);
    }
  }

  /* ════════════════════════════════════════════════════════
     6. RENDER QUESTION
  ═══════════════════════════════════════════════════════ */
  const qEmoji   = document.getElementById('questionEmoji');
  const qText    = document.getElementById('questionText');
  const optGrid  = document.getElementById('optionsGrid');

  function renderQ(idx) {
    const q = questions[idx];
    setProgress(idx + 1, questions.length);
    const card = document.querySelector('.question-card');
    card.classList.add('card-exit');
    setTimeout(() => {
      card.classList.remove('card-exit');
      qEmoji.textContent = q.emoji;
      qText.textContent  = q.question;
      optGrid.innerHTML  = '';
      negPos = { x:0, y:0 };
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className   = `btn ${opt.type === 'positive' ? 'btn-positive' : 'btn-negative'}`;
        btn.textContent = opt.label;
        btn.dataset.type = opt.type;
        if (opt.type === 'positive') btn.addEventListener('click', () => onPositive(q));
        else setupEvasive(btn);
        optGrid.appendChild(btn);
      });
    }, 320);
  }

  /* ════════════════════════════════════════════════════════
     7. POSITIVE ANSWER → rose → next
  ═══════════════════════════════════════════════════════ */
  function onPositive(q) {
    showToast(q.positiveResponse);
    showRoseBloom(() => {
      currentQ++;
      if (currentQ >= questions.length) {
        showScreen('final');
        launchConfetti();
      } else {
        renderQ(currentQ);
      }
    });
  }

  /* ════════════════════════════════════════════════════════
     8. EVASIVE BUTTON
  ═══════════════════════════════════════════════════════ */
  function setupEvasive(btn) {
    btn.addEventListener('mousemove',  e => evade(btn, e.clientX, e.clientY));
    btn.addEventListener('mouseenter', e => evade(btn, e.clientX, e.clientY));
    btn.addEventListener('touchstart', e => { e.preventDefault(); const t=e.touches[0]; evade(btn,t.clientX,t.clientY); }, {passive:false});
    btn.addEventListener('touchmove',  e => { e.preventDefault(); const t=e.touches[0]; evade(btn,t.clientX,t.clientY); }, {passive:false});
    btn.addEventListener('click', e => { e.preventDefault(); evade(btn,e.clientX,e.clientY); });
  }

  function evade(btn, px, py) {
    clearTimeout(evadeTimer);
    btn.classList.add('evading');
    const r  = btn.getBoundingClientRect();
    let dx   = (r.left + r.width/2) - px;
    let dy   = (r.top  + r.height/2) - py;
    const d  = Math.sqrt(dx*dx+dy*dy) || 1;
    dx = (dx/d)*95 + (Math.random()-.5)*70;
    dy = (dy/d)*95 + (Math.random()-.5)*70;
    negPos.x += clamp(btn, dx, 'x');
    negPos.y += clamp(btn, dy, 'y');
    btn.style.transform = `translate(${negPos.x}px,${negPos.y}px)`;
    evadeTimer = setTimeout(() => {
      negPos.x *= .25; negPos.y *= .25;
      btn.style.transform = `translate(${negPos.x}px,${negPos.y}px)`;
      btn.classList.remove('evading');
    }, 1800);
  }

  function clamp(btn, delta, axis) {
    const r = btn.getBoundingClientRect(), m = 12;
    if (axis === 'x') {
      if (r.left+delta < m) return m-r.left;
      if (r.right+delta > innerWidth-m) return innerWidth-m-r.right;
    } else {
      if (r.top+delta < m) return m-r.top;
      if (r.bottom+delta > innerHeight-m) return innerHeight-m-r.bottom;
    }
    return delta;
  }

  /* ════════════════════════════════════════════════════════
     9. TOAST
  ═══════════════════════════════════════════════════════ */
  const toast = document.getElementById('responseToast');
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2400);
  }

  /* ════════════════════════════════════════════════════════
     10. CONFETTI
  ═══════════════════════════════════════════════════════ */
  const cC   = document.getElementById('confettiCanvas');
  const cCtx = cC.getContext('2d');
  const resizeC = () => { cC.width = innerWidth; cC.height = innerHeight; };
  resizeC(); addEventListener('resize', resizeC);

  const CCOLORS = ['#e8609a','#f9a8d4','#c084fc','#f4c542','#fb923c','#f472b6','#a78bfa','#fde68a'];
  const CSHAPES = ['🌸','🌹','❤','⭐','✦','♥','🌷'];
  class Confetti {
    constructor(){
      this.x = Math.random()*cC.width; this.y = -20;
      this.size = Math.random()*16+8;
      this.vy = Math.random()*3+2; this.vx = (Math.random()-.5)*3;
      this.rot = Math.random()*360; this.rotS = (Math.random()-.5)*6;
      this.alpha = 1; this.decay = Math.random()*.003+.001;
      this.color = CCOLORS[Math.floor(Math.random()*CCOLORS.length)];
      this.shape = CSHAPES[Math.floor(Math.random()*CSHAPES.length)];
    }
    update(){ this.x+=this.vx; this.y+=this.vy; this.vy+=.05; this.rot+=this.rotS; this.alpha-=this.decay }
    draw(){ cCtx.save(); cCtx.globalAlpha=Math.max(0,this.alpha); cCtx.fillStyle=this.color; cCtx.font=`${this.size}px serif`; cCtx.translate(this.x,this.y); cCtx.rotate(this.rot*Math.PI/180); cCtx.fillText(this.shape,0,0); cCtx.restore() }
    dead(){ return this.alpha<=0||this.y>cC.height+30 }
  }

  let pieces=[], confAnim=null, spawnN=0;
  function launchConfetti(){
    pieces=[]; spawnN=0;
    if(confAnim) cancelAnimationFrame(confAnim);
    runConf();
  }
  function runConf(){
    cCtx.clearRect(0,0,cC.width,cC.height);
    if(spawnN<130){ spawnN++; if(spawnN%2===0) for(let i=0;i<5;i++) pieces.push(new Confetti()) }
    pieces=pieces.filter(p=>!p.dead());
    pieces.forEach(p=>{p.update();p.draw()});
    if(pieces.length||spawnN<130) confAnim=requestAnimationFrame(runConf);
    else cCtx.clearRect(0,0,cC.width,cC.height);
  }

  /* ════════════════════════════════════════════════════════
     11. SPARKLE ON MOUSE
  ═══════════════════════════════════════════════════════ */
  const sparkSt = document.createElement('style');
  sparkSt.textContent = `@keyframes sparkOut{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-220%) scale(.2)}}`;
  document.head.appendChild(sparkSt);
  addEventListener('mousemove', e => {
    if(Math.random()>.96){ const s=document.createElement('span'); s.style.cssText=`position:fixed;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;z-index:500;font-size:${10+Math.random()*10}px;animation:sparkOut .65s ease forwards;color:hsl(${320+Math.random()*60},80%,65%)`; s.textContent=['✦','✧','⋆','·','✿'][Math.floor(Math.random()*5)]; document.body.appendChild(s); setTimeout(()=>s.remove(),700) }
  });

  /* ════════════════════════════════════════════════════════
     12. AVATAR UPLOAD
  ═══════════════════════════════════════════════════════ */
  const avatarImg = document.getElementById('heroAvatar');
  const avatarIn  = document.getElementById('avatarInput');
  document.getElementById('avatarUploadHint').addEventListener('click', ()=>avatarIn.click());
  avatarImg.addEventListener('click', ()=>avatarIn.click());
  avatarIn.addEventListener('change', e => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => { avatarImg.src = ev.target.result; avatarImg.style.background='none'; };
    r.readAsDataURL(f);
  });

  /* ════════════════════════════════════════════════════════
     13. CUSTOMIZE PANEL
  ═══════════════════════════════════════════════════════ */
  const fab    = document.getElementById('fabCustomize');
  const ovl    = document.getElementById('panelOverlay');
  const panel  = document.getElementById('customizePanel');
  const pClose = document.getElementById('panelClose');
  const pSave  = document.getElementById('panelSaveBtn');
  const pBody  = document.getElementById('panelBody');

  const openPanel  = () => { buildPanel(); ovl.classList.add('open'); panel.classList.add('open'); document.body.style.overflow='hidden' };
  const closePanel = () => { ovl.classList.remove('open'); panel.classList.remove('open'); document.body.style.overflow='' };
  fab.addEventListener('click', openPanel);
  ovl.addEventListener('click', closePanel);
  pClose.addEventListener('click', closePanel);

  function buildPanel(){
    while(pBody.children.length>1) pBody.removeChild(pBody.lastChild);
    questions.forEach((q,qi)=>{
      const b=document.createElement('div'); b.className='q-edit-block';
      b.innerHTML=`<div class="panel-section-title">Savol ${qi+1}</div>
        <label>Emoji</label><input id="qe${qi}" value="${q.emoji}" maxlength="4"/>
        <label>Savol matni</label><textarea id="qt${qi}" rows="2">${q.question}</textarea>
        ${q.options.map((o,oi)=>`<label>${o.type==='positive'?'✅':'❌'} Javob ${oi+1}</label><input id="qo${qi}_${oi}" value="${o.label}"/>`).join('')}
        <label>Ijobiy javob reaktsiyasi</label><input id="qr${qi}" value="${q.positiveResponse}"/>`;
      pBody.appendChild(b);
    });
  }

  pSave.addEventListener('click', ()=>{
    questions.forEach((q,qi)=>{
      const e=document.getElementById(`qe${qi}`), t=document.getElementById(`qt${qi}`), r=document.getElementById(`qr${qi}`);
      if(e) q.emoji=e.value||q.emoji;
      if(t) q.question=t.value||q.question;
      if(r) q.positiveResponse=r.value||q.positiveResponse;
      q.options.forEach((_,oi)=>{ const o=document.getElementById(`qo${qi}_${oi}`); if(o) q.options[oi].label=o.value||q.options[oi].label; });
    });
    if(screens.question.classList.contains('active')){ negPos={x:0,y:0}; renderQ(currentQ); }
    closePanel(); showToast('💾 Saqlandi!');
  });

  /* ════════════════════════════════════════════════════════
     14. NAVIGATION
  ═══════════════════════════════════════════════════════ */
  document.getElementById('heroBtn').addEventListener('click', ()=>{
    currentQ=0; negPos={x:0,y:0}; showScreen('question'); renderQ(0);
  });

  document.getElementById('finalCtaBtn').addEventListener('click', ()=>{
    launchConfetti();
    setTimeout(()=> window.open(SITE_CONFIG.finalCtaUrl,'_blank','noopener,noreferrer'), 400);
  });

  document.getElementById('restartBtn').addEventListener('click', ()=>{
    currentQ=0; negPos={x:0,y:0}; showScreen('hero');
    if(confAnim){ cancelAnimationFrame(confAnim); cCtx.clearRect(0,0,cC.width,cC.height); }
  });

  /* ── Boot ── */
  showScreen('hero');
});
