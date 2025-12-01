document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".glitch-overlay");
  const links = document.querySelectorAll(".glitch-link");

  if (!overlay) return;

  let userClicked = false;

  // --------- GLITCH NAVIGATION (Page 1 <-> Page 2) ---------
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      userClicked = true; // user chose navigation

      const targetHref = link.getAttribute("href");
      if (!targetHref) return;

      overlay.classList.add("active");

      const handleTransition = () => {
        overlay.removeEventListener("animationend", handleTransition);
        window.location.href = targetHref;
      };

      overlay.addEventListener("animationend", handleTransition, { once: true });
    });
  });

  // --------- AUTO REDIRECT (happens independently on every page) ---------
  setTimeout(() => {
    if (userClicked) return; // user clicked link: skip auto redirect

    overlay.classList.add("active");

    // Wait for glitch animation (0.7s)
    setTimeout(() => {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
      overlay.classList.remove("active");
    }, 700);

  }, 5000); // auto redirect timing
});


// --------- INTRO SCREEN FADE OUT ---------
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.querySelector(".intro-screen");
  if (!intro) return;

  intro.addEventListener("animationend", () => {
    intro.style.display = "none";
  });
});
