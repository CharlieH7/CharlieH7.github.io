let isModalOpen = false;
let isContrastOn = false;
const scaleFactor = 1 / 28;

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

function moveBackground(event) {
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
