const menu = document.querySelector("#menu"),
  nav = document.querySelector("#nav"),
  toast = document.querySelector("#toast"),
  contactButton = document.querySelector("#contactButton");
if (menu && nav) {
  menu.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open")),
  );
}
const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
const currentKey =
  page === "" || page === "index.html"
    ? "index.html"
    : ["start.html", "save.html", "yuma.html"].includes(page)
      ? "articles.html"
      : page;
document.querySelectorAll(".header nav a").forEach((a) => {
  const href = (a.getAttribute("href") || "").split("/").pop();
  if (href === currentKey) a.classList.add("is-current");
});
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
if (contactButton && toast) {
  contactButton.addEventListener("click", () => {
    toast.textContent =
      "お問い合わせありがとうございます。近日中にフォームを公開します！";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3200);
  });
}
