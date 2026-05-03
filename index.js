import * as THREE from "https://unpkg.com/three@0.164.1/build/three.module.js";

let isModalOpen = false;
let isContrastOn = false;
const scaleFactor = 1 / 28;

const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

const heroState = {
  targetX: 0,
  targetY: 0,
  currentX: 0,
  currentY: 0,
  enabled: false,
};

function moveBackground(event) {
  heroState.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
  heroState.targetY = (event.clientY / window.innerHeight - 0.5) * 2;

  const shapes = document.querySelectorAll(".shape");
  const x = event.clientX * scaleFactor;
  const y = event.clientY * scaleFactor;

  shapes.forEach((shape, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    shape.style.transform = `translate(${x * direction}px, ${y * direction}px)`;
  });
}

function initProjectCards() {
  const projectCards = document.querySelectorAll("[data-project]");
  if (!projectCards.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay || 0);
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-active", entry.isIntersecting);
      });
    },
    { threshold: 0.6 }
  );

  projectCards.forEach((card, index) => {
    card.dataset.delay = String(index * 120);
    revealObserver.observe(card);
    activeObserver.observe(card);

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = (0.5 - (y / rect.height)) * 8;

      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
      card.style.boxShadow = `${-rotateY * 1.5}px ${14 + rotateX * 1.5}px 60px rgba(40, 71, 150, 0.34)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });
function initHeroVisual() {
  const canvasMount = document.getElementById("hero-canvas");
  if (!canvasMount) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  const hasWebGL = !!window.WebGLRenderingContext;

  document.getElementById("landing-page")?.addEventListener("mousemove", moveBackground, { passive: true });

  if (!hasWebGL || reduceMotion || isMobile) {
    document.body.classList.add("hero-fallback-only");
    return;
  }

  document.body.classList.add("hero-webgl-enabled");
  heroState.enabled = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvasMount.clientWidth / canvasMount.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(canvasMount.clientWidth, canvasMount.clientHeight);
  canvasMount.appendChild(renderer.domElement);

  const geo = new THREE.IcosahedronGeometry(1.4, 18);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0x9cc6ff,
    roughness: 0.08,
    transmission: 0.9,
    thickness: 1.2,
    transparent: true,
    opacity: 0.95,
    metalness: 0.1,
    ior: 1.3,
  });
  const orb = new THREE.Mesh(geo, mat);
  scene.add(orb);

  scene.add(new THREE.AmbientLight(0xcfe0ff, 0.8));
  const light = new THREE.PointLight(0x63a3ff, 2.1, 25);
  light.position.set(2, 2, 3);
  scene.add(light);

  const clock = new THREE.Clock();

  function onResize() {
    const w = canvasMount.clientWidth;
    const h = canvasMount.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  function tick() {
    if (!heroState.enabled) return;
    const t = clock.getElapsedTime();
    heroState.currentX += (heroState.targetX - heroState.currentX) * 0.06;
    heroState.currentY += (heroState.targetY - heroState.currentY) * 0.06;

    orb.rotation.y = t * 0.3;
    orb.rotation.x = t * 0.15 + heroState.currentY * 0.2;
    orb.position.x = heroState.currentX * 0.25;
    orb.position.y = -heroState.currentY * 0.2;

    camera.position.x += (heroState.currentX * 0.45 - camera.position.x) * 0.05;
    camera.position.y += (-heroState.currentY * 0.35 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  tick();
}

function toggleContrast() {
  isContrastOn = !isContrastOn;
  document.body.classList.toggle("dark-theme", isContrastOn);
}

function contact(event) {
  event.preventDefault();
  const loading = document.querySelector(".modal__overlay--loading");
  const success = document.querySelector(".modal__overlay--success");

  loading.classList.add("modal__overlay--visible");
  emailjs
    .sendForm("service_mgbw47z", "template_cu21ivk", event.target, "i4Ysn7FwxaL2UqEMV")
    .then(() => {
      loading.classList.remove("modal__overlay--visible");
      success.classList.add("modal__overlay--visible");
      event.target.reset();
    })
    .catch(() => {
      loading.classList.remove("modal__overlay--visible");
      alert("The email service is temporarily unavailable. Please contact me directly on LinkedIn.");
    });
}

function toggleModal() {
  isModalOpen = !isModalOpen;
  document.body.classList.toggle("modal--open", isModalOpen);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

initProjectCards();
window.toggleContrast = toggleContrast;
window.contact = contact;
window.toggleModal = toggleModal;
window.scrollToTop = scrollToTop;

initHeroVisual();
