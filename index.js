let isModalOpen = false;
let isContrastOn = false;

function toggleContrast() {
    isContrastOn = !isContrastOn;
    if (isContrastOn) {
        document.body.classList += " dark-theme"
    }
    else {
        document.body.classList.remove("dark-theme")
    }
}
function contact(event) {
  event.preventDefault();
  const loading = document.querySelector(".modal__overlay--loading");
  const success = document.querySelector(".modal__overlay--success");
  loading.classList += " modal__overlay--visible";
  emailjs
    .sendForm(
      "service_mgbw47z",
      "template_cu21ivk",
      event.target,
      "i4Ysn7FwxaL2UqEMV"
    )
    .then(() => {
        loading.classList.remove("modal__overlay--visible");
        success.classList += " modal__overlay--visible";
    }).catch(() => {
        loading.classList.remove("modal__overlay--visible");
        alert (
            "The email service is temporary unavailable. Please contact me directly on hope91824@gmail.com"
        );
    })
}

function toggleModal() {
    if (isModalOpen) {
        isModalOpen = false;
        return document.body.classList.remove("modal--open");
    }
    isModalOpen = !isModalOpen;
    document.body.classList += " modal--open";

}
