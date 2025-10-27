console.log("Gallery shuffle loaded");

const button = document.querySelector("#themeButton");
const gallery = document.querySelector(".gallery");

button.addEventListener("click", shuffleImages);

function shuffleImages() {
  const items = Array.from(gallery.children);

  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  gallery.innerHTML = "";
  items.forEach(item => gallery.appendChild(item));

  console.log("Images shuffled!");
}
