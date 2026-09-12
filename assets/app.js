
document.addEventListener('DOMContentLoaded',()=>{
  const els=document.querySelectorAll('.reveal');
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
  els.forEach(e=>io.observe(e));
  document.querySelectorAll('[data-menu]').forEach(b=>b.addEventListener('click',()=>{
    const n=document.querySelector('nav'); n.style.display=n.style.display==='flex'?'none':'flex';
    n.style.flexDirection='column'; n.style.position='absolute'; n.style.top='76px'; n.style.right='24px'; n.style.background='#0b0d0c'; n.style.padding='20px'; n.style.border='1px solid var(--line)';
  }));
  document.querySelectorAll('[data-counter]').forEach(el=>{
    const target=Number(el.dataset.counter); let done=false;
    const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!done){done=true;let s=0;const step=Math.max(1,Math.ceil(target/50));const t=setInterval(()=>{s=Math.min(target,s+step);el.textContent=s.toLocaleString('pt-BR');if(s>=target)clearInterval(t)},25);obs.disconnect()}}));
    obs.observe(el);
  });
  const bmi=document.querySelector('#bmi-form');
  if(bmi)bmi.addEventListener('submit',e=>{e.preventDefault();let h=+bmi.height.value/100,w=+bmi.weight.value;let v=w/(h*h);document.querySelector('#bmi-result').textContent=`IMC: ${v.toFixed(1)} — resultado informativo, não diagnóstico.`});
  const faq=document.querySelectorAll('.faq details');
  faq.forEach(d=>d.addEventListener('toggle',()=>{}));
});


/* WhatsApp forms */
(function () {
  const WHATSAPP_NUMBER = "5511989725035";

  function value(form, selector) {
    const el = form.querySelector(selector);
    return el ? el.value.trim() : "";
  }

  function openWhatsApp(message) {
    const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  document.querySelectorAll("form[data-whatsapp-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const nome = value(form, '[name="nome"]');
      const whatsapp = value(form, '[name="whatsapp"]');
      const email = value(form, '[name="email"]');
      const cidade = value(form, '[name="cidade"]');
      const unidade = value(form, '[name="unidade"]');
      const assunto = value(form, '[name="assunto"]');
      const motivo = value(form, '[name="motivo"]');
      const mensagem = value(form, '[name="mensagem"]');

      if (!nome || !whatsapp || !mensagem) {
        alert("Preencha pelo menos nome, WhatsApp e mensagem.");
        return;
      }

      const linhas = [
        "Olá! Vim pelo site Frivaldo Uchoa / Clínica Ômega.",
        "",
        "Nome: " + nome,
        "WhatsApp: " + whatsapp,
        email ? "E-mail: " + email : "",
        cidade ? "Cidade: " + cidade : "",
        unidade ? "Unidade: " + unidade : "",
        assunto ? "Assunto: " + assunto : "",
        motivo ? "Motivo: " + motivo : "",
        "",
        "Mensagem:",
        mensagem
      ].filter(Boolean);

      openWhatsApp(linhas.join("\n"));
    });
  });
})();


/* =========================================================
   CINEMATIC MOTION ENGINE
   ========================================================= */
(function(){
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Loader
  const loader = document.querySelector(".site-loader");
  if (loader) {
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("is-done"), reduceMotion ? 0 : 650);
    });
  }

  // Scroll progress
  let progress = document.querySelector(".scroll-progress");
  if (!progress) {
    progress = document.createElement("div");
    progress.className = "scroll-progress";
    document.body.appendChild(progress);
  }

  // Cursor glow — desktop only
  let glow = document.querySelector(".motion-glow");
  if (!glow && window.matchMedia("(pointer:fine)").matches && !reduceMotion) {
    glow = document.createElement("div");
    glow.className = "motion-glow";
    document.body.appendChild(glow);
    document.body.classList.add("has-pointer");
    window.addEventListener("pointermove", e => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }, {passive:true});
  }

  const header = document.querySelector(".site-header, header");

  function onScroll(){
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${ratio})`;
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);

    if (!reduceMotion) {
      document.querySelectorAll("[data-parallax]").forEach(el => {
        const speed = parseFloat(el.dataset.parallax || "0.08");
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height/2 - window.innerHeight/2) * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    }
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  // Reveal once
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.12, rootMargin:"0px 0px -7% 0px"});

  document.querySelectorAll(
    ".reveal,.reveal-left,.reveal-right,.reveal-scale,.stagger,.image-reveal"
  ).forEach(el => revealObserver.observe(el));

  // Add image-reveal automatically to prominent media blocks
  document.querySelectorAll(".media-frame:not(.image-reveal), .ba-card:not(.image-reveal)").forEach(el => {
    el.classList.add("image-reveal");
    revealObserver.observe(el);
  });

  // Counter animation
  document.querySelectorAll(".counter[data-target]").forEach(counter => {
    const target = parseFloat(counter.dataset.target);
    if (!Number.isFinite(target)) return;

    const suffix = counter.dataset.suffix || "";
    const prefix = counter.dataset.prefix || "";
    const decimals = Number.isInteger(target) ? 0 : 1;

    const animate = () => {
      const start = performance.now();
      const duration = reduceMotion ? 1 : 1200;

      function frame(now){
        const p = Math.min(1, (now-start)/duration);
        const eased = 1 - Math.pow(1-p, 4);
        const value = target * eased;
        counter.textContent = prefix + value.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    };

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animate();
        obs.disconnect();
      }
    }, {threshold:.5});
    obs.observe(counter);
  });

  // Gentle tilt for selected cards
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5;
        const y = (e.clientY-r.top)/r.height-.5;
        card.style.transform =
          `perspective(900px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*3).toFixed(2)}deg) translateY(-5px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Magnetic buttons
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach(btn => {
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX-r.left-r.width/2;
        const y = e.clientY-r.top-r.height/2;
        btn.style.transform = `translate(${x*.08}px,${y*.08}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  // Smooth internal links with a short cinematic exit
  document.querySelectorAll('a[href$=".html"], a[href^="/"]').forEach(link => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http")) return;
    link.addEventListener("click", e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = link.target;
      if (target === "_blank") return;
      e.preventDefault();
      document.body.classList.add("page-leaving");
      setTimeout(() => { window.location.href = href; }, reduceMotion ? 0 : 260);
    });
  });

  // Hero parallax image
  if (!reduceMotion) {
    const heroMedia = document.querySelector(".hero img, .hero .media-frame img");
    if (heroMedia) {
      window.addEventListener("scroll", () => {
        const y = Math.min(window.scrollY * .12, 80);
        heroMedia.style.transform = `scale(1.02) translate3d(0,${y}px,0)`;
      }, {passive:true});
    }
  }
})();


/* V8 hero media fallback */
document.querySelectorAll('.hero-media-video').forEach(function(video){
  video.addEventListener('error',function(){ video.style.display='none'; });
});
