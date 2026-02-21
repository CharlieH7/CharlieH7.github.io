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
