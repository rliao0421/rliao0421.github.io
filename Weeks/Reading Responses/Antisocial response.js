document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".glitch-overlay");
  const links = document.querySelectorAll(".glitch-link");

  if (!overlay) return;


  if (links.length > 0) {
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        const targetHref = link.getAttribute("href");
        if (!targetHref) return;

        overlay.classList.add("active");

        const handleAnimationEnd = () => {
          overlay.removeEventListener("animationend", handleAnimationEnd);
          window.location.href = targetHref;
        };

        overlay.addEventListener("animationend", handleAnimationEnd);
      });
    });
  }

  setTimeout(() => {

    overlay.classList.add("active");

    const handleAutoEnd = () => {
      overlay.removeEventListener("animationend", handleAutoEnd);
      window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    };

    overlay.addEventListener("animationend", handleAutoEnd);
  }, 5000); 
});
