(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // буквы заголовка поднимаются по очереди
  document.querySelectorAll('.split').forEach(function(el){
    var txt = el.textContent;
    el.textContent = '';
    txt.split('').forEach(function(c, i){
      var s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      s.style.animationDelay = (0.15 + i * 0.09) + 's,' + (-i * 0.4) + 's';
      el.appendChild(s);
    });
  });

  // меню
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function(e){
    if (e.target.tagName === 'A'){ nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
  });

  // появление при прокрутке
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold: .12, rootMargin: '0px 0px -6% 0px'});
    els.forEach(function(el){ io.observe(el); });
  } else {
    els.forEach(function(el){ el.classList.add('in'); });
  }

  // лёгкий параллакс фото
  var par = Array.prototype.slice.call(document.querySelectorAll('[data-speed]'));
  var mx = 0, my = 0, ticking = false;
  function frame(){
    ticking = false;
    var wide = window.innerWidth > 980, y = window.scrollY;
    par.forEach(function(el){
      var sp = parseFloat(el.dataset.speed);
      var inHero = el.closest('.hero');
      if (inHero && !wide){ el.style.transform = ''; return; }
      var r = el.getBoundingClientRect();
      var off = (r.top + r.height / 2 - innerHeight / 2) * sp * -1;
      var tx = inHero && fine ? mx * sp * 260 : 0, ty = inHero && fine ? my * sp * 260 : 0;
      el.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,' + (off + ty).toFixed(1) + 'px,0)';
    });
  }
  function req(){ if (!ticking){ ticking = true; requestAnimationFrame(frame); } }
  if (!reduce){
    addEventListener('scroll', req, {passive: true});
    addEventListener('resize', req);
    if (fine) addEventListener('mousemove', function(e){ mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; req(); });
    req();
  }

  // всплывающее фото в списке услуг
  var peek = document.getElementById('peek'), pimg = peek.querySelector('img');
  if (fine){
    document.querySelectorAll('.menu li').forEach(function(li){
      li.addEventListener('mouseenter', function(){ pimg.src = li.dataset.img; peek.classList.add('on'); });
      li.addEventListener('mouseleave', function(){ peek.classList.remove('on'); });
      li.addEventListener('mousemove', function(e){
        peek.style.transform = 'translate(' + (e.clientX + 30) + 'px,' + (e.clientY - 150) + 'px) rotate(-3deg)';
      });
    });
  }

  // стрижки: смена фото
  var cuts = document.querySelectorAll('#cuts li'), cimg = document.getElementById('cutimg');
  function pick(li){
    cuts.forEach(function(c){ c.classList.remove('on'); });
    li.classList.add('on');
    cimg.style.opacity = 0;
    setTimeout(function(){ cimg.src = li.dataset.img; cimg.style.opacity = 1; }, 220);
  }
  cuts.forEach(function(li){
    li.addEventListener('mouseenter', function(){ if (fine) pick(li); });
    li.addEventListener('click', function(){ pick(li); });
  });
})();
