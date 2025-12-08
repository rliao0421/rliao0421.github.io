const feed = document.getElementById("feed");

let loading = false;      // prevents double-loading
let postCount = 0;        // just for tracking / debugging

// Generate a random image URL (you can replace with your own images)
function getRandomPhotoUrl() {
  // Picsum placeholder images – you can swap with your own URLs
  return `https://picsum.photos/800/1200?random=${Math.random()}`;
}

// Create a single post element
function createPost() {
  postCount++;

  const post = document.createElement("div");
  post.className = "post";

  const frame = document.createElement("img");
  frame.className = "frame";
  frame.src = "Frame.png";

  const photo = document.createElement("img");
  photo.className = "photo";
  photo.src = getRandomPhotoUrl();

  post.appendChild(frame);
  post.appendChild(photo);

  return post;
}

// Add N posts to the feed
function loadMorePosts(count = 4) {
  for (let i = 0; i < count; i++) {
    const newPost = createPost();
    feed.appendChild(newPost);
  }
}

// Check if user is near the bottom of the page
function handleScroll() {
  if (loading) return;

  const scrollPosition = window.innerHeight + window.scrollY;
  const bottom = document.body.offsetHeight - 200; // 200px from bottom

  if (scrollPosition >= bottom) {
    loading = true;
    loadMorePosts(4); // load 4 more posts
    // small delay to avoid spamming loads
    setTimeout(() => { loading = false; }, 300);
  }
}

// Initial setup
window.addEventListener("DOMContentLoaded", () => {
  loadMorePosts(6);                // first batch of posts
  window.addEventListener("scroll", handleScroll);
});
