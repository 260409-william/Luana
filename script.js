// ======= Céu estrelado com piscar (canvas) =======
(function(){
  const c = document.getElementById('stars');
  const ctx = c.getContext('2d');
  let W, H, starsSmall = [], starsBig = [];

  const SMALL_COUNT = 150; // estrelas pequenas
  const BIG_COUNT = 20;    // estrelas maiores

  function rand(min, max){ return Math.random()*(max-min)+min; }

  function resize(){
    const dpr = Math.max(1, devicePixelRatio || 1);
    W = c.width = window.innerWidth * dpr;
    H = c.height = window.innerHeight * dpr;
    c.style.width = window.innerWidth + 'px';
    c.style.height = window.innerHeight + 'px';
    makeStars(dpr);
  }

  function makeStars(dpr){
    starsSmall = Array.from({length: SMALL_COUNT}, ()=>({
      x: rand(0, W), y: rand(0, H),
      r: rand(0.4, 1.5) * dpr,
      baseA: rand(0.2, 0.7),
      amp: rand(0.05, 0.25),
      spd: rand(0.001, 0.004),
      t: rand(0, Math.PI*2)
    }));

    starsBig = Array.from({length: BIG_COUNT}, ()=>({
      x: rand(0, W), y: rand(0, H),
      r: rand(1.2, 3.2) * dpr,
      baseA: rand(0.4, 0.9),
      amp: rand(0.2, 0.6),
      spd: rand(0.001, 0.003),
      t: rand(0, Math.PI*2)
    }));
  }

  function draw(){
    ctx.fillStyle = "#000"; // fundo preto
    ctx.fillRect(0,0,W,H);

    // estrelas pequenas piscando
    for(const s of starsSmall){
      s.t += s.spd;
      const a = s.baseA + Math.sin(s.t) * s.amp;
      ctx.globalAlpha = Math.max(0, Math.min(1, a));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }

    // estrelas maiores com halo
    for(const s of starsBig){
      s.t += s.spd;
      const a = s.baseA + Math.sin(s.t*1.3) * s.amp;
      ctx.globalAlpha = Math.max(0, Math.min(1, a));

      const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*6);
      grad.addColorStop(0, `rgba(255,255,255,${0.8*a})`);
      grad.addColorStop(0.4, `rgba(255,255,255,${0.25*a})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r*6, 0, Math.PI*2);
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, {passive:true});
  resize();
  draw();
})();

// ======= Texto "Luana + corações" ao clique =======
(function(){
  const stage = document.getElementById('stage');
  const hint = document.querySelector('.hint');
  const hearts = ['💖','💘','💗','💞','💕','❤️'];

  function spawnBurst(x, y){
    const el = document.createElement('div');
    el.className = 'burst';
    const h1 = hearts[Math.floor(Math.random()*hearts.length)];
    const h2 = hearts[Math.floor(Math.random()*hearts.length)];
    el.textContent = `luana ${h1}${h2}`;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    el.addEventListener('animationend', ()=> el.remove());
  }

  function onTap(e){
    if(hint) hint.style.display = 'none';
    const touch = e.touches && e.touches[0];
    const x = (touch ? touch.clientX : e.clientX);
    const y = (touch ? touch.clientY : e.clientY);
    spawnBurst(x, y);
  }

  stage.addEventListener('click', onTap);
  stage.addEventListener('touchstart', onTap, {passive:true});
})();
