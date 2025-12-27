(function () {
  const openBtn = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("close-toggle");
  const menu = document.getElementById("navbar2");

  if (!openBtn || !closeBtn || !menu) return;

  const body = document.body;

  function getTransitionMs(el) {
    const styles = window.getComputedStyle(el);
    const durs = styles.transitionDuration.split(",").map((v) => v.trim());
    const delays = styles.transitionDelay.split(",").map((v) => v.trim());

    const toMs = (s) => (s.endsWith("ms") ? parseFloat(s) : parseFloat(s) * 1000);

    const msList = durs.map((d, i) => toMs(d) + toMs(delays[i] || "0s"));
    return Math.max(0, ...msList);
  }

  function openMenu() {
    menu.hidden = false;

    requestAnimationFrame(() => menu.classList.add("active"));

    openBtn.style.display = "none";
    closeBtn.style.display = "inline-flex";

    body.classList.add("menu-open");

    closeBtn.focus();
  }

  function closeMenu() {
    menu.classList.remove("active");

    closeBtn.style.display = "none";
    openBtn.style.display = "inline-flex";

    body.classList.remove("menu-open");

    openBtn.focus();

    const ms = getTransitionMs(menu);
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      menu.hidden = true;
      menu.removeEventListener("transitionend", onEnd);
    };

    const onEnd = (e) => {
      if (e.target !== menu) return;
      finish();
    };

    menu.addEventListener("transitionend", onEnd);
    window.setTimeout(finish, ms + 50);
  }

  openBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) closeMenu();
  });

  document.addEventListener("click", (e) => {
    if (menu.hidden) return;

    const target = e.target;
    if (!(target instanceof Node)) return;

    const clickedInsideMenu = menu.contains(target);
    const clickedToggle = openBtn.contains(target) || closeBtn.contains(target);

    if (!clickedInsideMenu && !clickedToggle) closeMenu();
  });
})();
