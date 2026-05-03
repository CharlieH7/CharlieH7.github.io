let isModalOpen = false;
let isContrastOn = false;
const scaleFactor = 1 / 28;

const yearElement = document.getElementById("year");
const modalElement = document.getElementById("contact-modal");
const modalPanel = modalElement?.querySelector(".modal__panel");
const formStatus = document.getElementById("form-status");
const submitButton = document.getElementById("contact__submit");
let previousFocusedElement = null;

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

function setFormStatus(type, message) {
  if (!formStatus) return;
  formStatus.className = `form__status form__status--${type}`;
  formStatus.textContent = message;
}

function setSubmitLoading(isLoading) {
  if (!submitButton) return;
  submitButton.classList.toggle("is-loading", isLoading);
  submitButton.disabled = isLoading;
}

function contact(event) {
  event.preventDefault();
  setSubmitLoading(true);
  setFormStatus("idle", "");

  emailjs
    .sendForm("service_mgbw47z", "template_cu21ivk", event.target, "i4Ysn7FwxaL2UqEMV")
    .then(() => {
      setSubmitLoading(false);
      setFormStatus("success", "Thanks for the message! I will get back to you soon.");
      event.target.reset();
    })
    .catch(() => {
      setSubmitLoading(false);
      setFormStatus("error", "The email service is temporarily unavailable. Please contact me directly on LinkedIn.");
    });
}

function trapFocus(event) {
  if (!isModalOpen || event.key !== "Tab" || !modalElement) return;

  const focusableElements = modalElement.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  );

  if (!focusableElements.length) return;

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function onModalKeyDown(event) {
  if (event.key === "Escape" && isModalOpen) {
    closeModal();
    return;
  }

  trapFocus(event);
}

function openModal() {
  if (!modalElement) return;
  previousFocusedElement = document.activeElement;
  isModalOpen = true;
  document.body.classList.add("modal--open", "body--no-scroll");
  modalElement.setAttribute("aria-hidden", "false");
  document.addEventListener("keydown", onModalKeyDown);
  setTimeout(() => modalPanel?.focus(), 20);
}

function closeModal() {
  if (!modalElement) return;
  isModalOpen = false;
  document.body.classList.remove("modal--open", "body--no-scroll");
  modalElement.setAttribute("aria-hidden", "true");
  document.removeEventListener("keydown", onModalKeyDown);
  previousFocusedElement?.focus?.();
}

function toggleModal() {
  if (isModalOpen) {
    closeModal();
  } else {
    openModal();
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
