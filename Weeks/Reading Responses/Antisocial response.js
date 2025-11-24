document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".glitch-overlay");
  const links = document.querySelectorAll(".glitch-link");

  if (!overlay || links.length === 0) return;

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const targetHref = link.getAttribute("href");
      if (!targetHref) return;

      // Add active class to start the animation
      overlay.classList.add("active");

      // When animation finishes, go to the next page
      const handleAnimationEnd = () => {
        overlay.removeEventListener("animationend", handleAnimationEnd);
        window.location.href = targetHref;
      };

      overlay.addEventListener("animationend", handleAnimationEnd);
    });
  });
});
