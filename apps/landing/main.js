/* ZehenSync landing page motion. Everything renders complete without this file;
   motion only animates from hidden states when the viewer allows motion. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var EASE = "expo.out";

  /* ---------- nav ---------- */
  var nav = document.getElementById("nav");
  function onScrollNav() { nav.classList.toggle("solid", window.scrollY > 24); }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- film ---------- */
  var video = document.getElementById("film-video");
  var cover = document.getElementById("filmCover");
  if (video && cover) {
    cover.addEventListener("click", function () {
      video.controls = true;
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      cover.classList.add("hide");
    });
    video.addEventListener("ended", function () { cover.classList.remove("hide"); video.controls = false; });
  }

  /* ---------- story scenes (works with or without GSAP) ---------- */
  var steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
  var scenes = Array.prototype.slice.call(document.querySelectorAll("#storyScreen .scene"));
  var stageLabel = document.getElementById("stageLabel");
  var stageNum = document.getElementById("stageNum");
  var LABELS = [["Patient", "guided check-in"], ["Psychologist", "flag trace"], ["Student", "cited tutor"]];
  var current = 0;
  function setScene(i) {
    if (i === current) return;
    var prev = scenes[current];
    current = i;
    steps.forEach(function (s, k) { s.classList.toggle("on", k === i); });
    stageLabel.innerHTML = "<b>" + LABELS[i][0] + "</b> · " + LABELS[i][1];
    stageNum.textContent = "0" + (i + 1) + " / 03";
    if (hasGsap && !reduce) {
      gsap.to(prev, { opacity: 0, duration: 0.5, ease: "power2.out" });
      gsap.fromTo(scenes[i], { opacity: 0, y: 14, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: EASE });
    } else {
      scenes.forEach(function (s, k) { s.style.opacity = k === i ? "1" : "0"; });
    }
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setScene(Number(e.target.getAttribute("data-step")));
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (s) { io.observe(s); });
  }

  /* ---------- EAR scope (canvas) ---------- */
  var scope = document.getElementById("scope");
  function drawScope(t) {
    if (!scope) return;
    var r = scope.getBoundingClientRect();
    if (!r.width) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
    if (scope.width !== W || scope.height !== H) { scope.width = W; scope.height = H; }
    var x = scope.getContext("2d");
    x.clearRect(0, 0, W, H);
    var padL = 34 * dpr, padB = 22 * dpr, plotW = W - padL, plotH = H - padB;
    // grid
    x.strokeStyle = "rgba(154,166,242,.10)"; x.lineWidth = 1;
    for (var g = 0; g <= 4; g++) { var gy = plotH * g / 4 + 0.5; x.beginPath(); x.moveTo(padL, gy); x.lineTo(W, gy); x.stroke(); }
    x.fillStyle = "#A7ACC4"; x.font = (10 * dpr) + "px Geist Mono, monospace";
    x.fillText("0.35", 0, plotH * 0.12 + 4 * dpr); x.fillText("0.15", 0, plotH * 0.88);
    x.fillText("EAR", 0, plotH * 0.5 + 4 * dpr);
    // threshold
    var thY = plotH * 0.62;
    x.setLineDash([4 * dpr, 5 * dpr]); x.strokeStyle = "rgba(227,163,59,.45)";
    x.beginPath(); x.moveTo(padL, thY); x.lineTo(W, thY); x.stroke(); x.setLineDash([]);
    x.fillStyle = "rgba(227,163,59,.8)"; x.fillText("blink threshold", padL + 6 * dpr, thY - 6 * dpr);
    // signal: open-eye baseline with noise, blink dips at pseudo-random times
    var speed = 70; // px per second of scroll
    var offset = (t / 1000) * speed;
    var blinks = [], prevD = null;
    x.beginPath();
    for (var px = 0; px <= plotW; px += 2) {
      var u = (px / dpr + offset) / 3; // 1 sample = 3 css px, ~23 samples per second
      var base = 0.30 + 0.012 * Math.sin(u * 0.21) + 0.008 * Math.sin(u * 0.73 + 1.3);
      var cycle = 82, ph = ((u % cycle) + cycle) % cycle, k = Math.floor(u / cycle);
      var at = 18 + ((k * 37) % 46);
      var d = ph - at;
      var dip = Math.exp(-(d * d) / (2 * 2.2 * 2.2)) * 0.17;
      var v = base - dip;
      var y = plotH * (1 - (v - 0.1) / 0.3);
      if (px === 0) x.moveTo(padL + px, y); else x.lineTo(padL + px, y);
      if (prevD !== null && prevD < 0 && d >= 0) blinks.push([padL + px, y]);
      prevD = d;
    }
    x.strokeStyle = "#9AA6F2"; x.lineWidth = 2 * dpr; x.lineJoin = "round"; x.stroke();
    // blink markers
    blinks.forEach(function (b) {
      x.save(); x.translate(b[0], b[1] + 10 * dpr); x.rotate(Math.PI / 4);
      x.fillStyle = "#E3A33B"; x.fillRect(-4 * dpr, -4 * dpr, 8 * dpr, 8 * dpr); x.restore();
    });
    // time axis
    x.fillStyle = "#62677D";
    x.fillText("−10 s", padL, H - 4 * dpr); x.fillText("now", W - 26 * dpr, H - 4 * dpr);
  }

  /* ---------- halftone arcade ---------- */
  function halftone(cv) {
    if (!cv) return;
    var r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
    if (cv.width === W && cv.height === H) return;
    cv.width = W; cv.height = H;
    var x = cv.getContext("2d");
    x.fillStyle = "#0B0E24"; x.fillRect(0, 0, W, H);
    var step = Math.max(7, Math.round(Math.min(W, H) / 44));
    var hz = H * 0.5, sunX = W * 0.7, sunY = H * 0.4, sunR = Math.min(W, H) * 0.09;
    var wallTop = H * 0.6, archW = W / 9;
    function hash(a, b) { var s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); }
    for (var py = step / 2; py < H; py += step) {
      for (var px0 = step / 2; px0 < W; px0 += step) {
        var X = px0 + (Math.floor(py / step) % 2) * step / 2;
        var d, ds = Math.hypot(X - sunX, py - sunY);
        if (py < hz) { d = 0.2 + 0.55 * Math.pow(1 - py / hz, 1.3); d -= 0.3 * Math.exp(-(ds * ds) / (2 * Math.pow(W * 0.06, 2))); }
        else d = 0.24;
        if (py > wallTop) {
          d = 0.86;
          var kk = Math.floor(X / archW), cx = (kk + 0.5) * archW, dx = Math.abs(X - cx), rr = archW * 0.3, apex = wallTop + H * 0.08;
          if (dx < rr && py > apex + 1.5 * rr * (1 - Math.sqrt(Math.max(0, 1 - dx / rr)))) d = 0.1 + 0.2 * ((py - apex) / (H - apex));
          if (py > H * 0.95) d = 0.9;
        }
        d = Math.max(0, Math.min(1, d + (hash(px0, py) - 0.5) * 0.06));
        if (ds < sunR && py < wallTop) { x.fillStyle = "#E3A33B"; x.beginPath(); x.arc(X, py, step * 0.42, 0, 6.2832); x.fill(); continue; }
        var rad = step * 0.5 * Math.sqrt(d);
        if (rad < 0.35) continue;
        x.fillStyle = "#9AA6F2"; x.globalAlpha = 0.85;
        x.beginPath(); x.arc(X, py, rad, 0, 6.2832); x.fill(); x.globalAlpha = 1;
      }
    }
  }
  var ht = document.getElementById("halftone");
  halftone(ht);
  if (window.ResizeObserver) new ResizeObserver(function () { halftone(ht); drawScope(performance.now()); }).observe(document.body);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { halftone(ht); });

  // scope animation runs only while visible and when motion is allowed
  var scopeVisible = false, raf = 0;
  function loop(t) { drawScope(t); if (scopeVisible && !reduce) raf = requestAnimationFrame(loop); }
  if (scope) {
    drawScope(0);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        scopeVisible = es[0].isIntersecting;
        cancelAnimationFrame(raf);
        if (scopeVisible && !reduce) raf = requestAnimationFrame(loop);
      }).observe(scope);
    }
  }

  if (!hasGsap || reduce) return;

  /* ---------- smooth scroll ---------- */
  gsap.registerPlugin(ScrollTrigger);
  if (typeof window.Lenis !== "undefined") {
    var lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -76 });
      });
    });
  }

  /* ---------- hero intro ---------- */
  var tl = gsap.timeline({ defaults: { ease: EASE } });
  tl.from('[data-hero="eyebrow"]', { opacity: 0, y: 12, duration: 0.8 }, 0.1)
    .from(".hero h1 .ln > span", { yPercent: 105, duration: 1.3, stagger: 0.12 }, 0.2)
    .from("#heroNq", { y: -60, opacity: 0, duration: 0.9, ease: "back.out(2.2)" }, 1.05)
    .from('[data-hero="fade"]', { opacity: 0, y: 18, duration: 1, stagger: 0.12 }, 0.8)
    .from('[data-hero="visual"] .tilt', { opacity: 0, y: 60, rotateY: -24, rotateX: 10, duration: 1.6 }, 0.35)
    .from('[data-hero="callout"]', { opacity: 0, x: -40, y: 20, duration: 1.1 }, 1.1)
    .from('[data-hero="chip"]', { opacity: 0, y: -10, duration: 0.8 }, 1.4);

  // count-ups
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var end = Number(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "";
    if (!end) return;
    var o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.6, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: function () { el.textContent = Math.round(o.v) + suf; }
    });
  });

  /* ---------- hero parallax ---------- */
  gsap.to("#heroTilt", { rotateY: -2, rotateX: 0, y: -40, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero .jaali-bg", { yPercent: 18, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* ---------- section reveals ---------- */
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.from(el, { opacity: 0, y: 40, duration: 1.2, ease: EASE,
      scrollTrigger: { trigger: el, start: "top 86%", once: true } });
  });
  gsap.utils.toArray(".h2").forEach(function (el) {
    gsap.from(el, { clipPath: "inset(0 0 100% 0)", y: 24, duration: 1.3, ease: EASE,
      scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });

  /* ---------- story rail ---------- */
  var stepsEl = document.getElementById("steps");
  if (stepsEl) {
    ScrollTrigger.create({
      trigger: stepsEl, start: "top 55%", end: "bottom 55%", scrub: 0.6,
      onUpdate: function (self) {
        var h = stepsEl.offsetHeight;
        gsap.set("#railFill", { height: self.progress * h });
        gsap.set("#railNq", { y: self.progress * (h - 13) });
      }
    });
  }

  /* ---------- safety panel rises ---------- */
  gsap.from(".crisis", { rotate: -1.5, y: 60, ease: EASE, duration: 1.4,
    scrollTrigger: { trigger: ".safety", start: "top 70%", once: true } });

  /* ---------- pilot card scale ---------- */
  gsap.from(".pilot-card", { scale: 0.94, ease: "none",
    scrollTrigger: { trigger: ".pilot", start: "top bottom", end: "top 40%", scrub: true } });
})();
