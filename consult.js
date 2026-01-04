(function () {
  const form = document.getElementById("consultForm");
  const backBtn = document.getElementById("backBtn");

  if (!form) return;

  if (backBtn) {
    backBtn.addEventListener("click", () => history.back());
  }

  function setError(name, message) {
    const errorEl = document.querySelector(`[data-error-for="${name}"]`);
    const inputEl = document.getElementById(name);

    if (errorEl) errorEl.textContent = message || "";

    if (inputEl && name !== "agree") {
      if (message) inputEl.classList.add("input-error");
      else inputEl.classList.remove("input-error");
    }
  }

  function clearErrors() {
    ["name", "phone", "email", "category", "message", "agree"].forEach((k) => setError(k, ""));
  }

  function isValidPhone(value) {
    const v = value.trim();
    return /^01[016789]-?\d{3,4}-?\d{4}$/.test(v);
  }

  function isValidEmail(value) {
    const v = value.trim();
    if (!v) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validate() {
    clearErrors();

    const name = form.name?.value.trim() || "";
    const phone = form.phone?.value.trim() || "";
    const email = form.email?.value.trim() || "";
    const category = form.category?.value || "";
    const message = form.message?.value.trim() || "";
    const agree = !!form.agree?.checked;

    let ok = true;

    if (!name) { setError("name", "이름을 입력해주세요."); ok = false; }

    if (!phone) { setError("phone", "연락처를 입력해주세요."); ok = false; }
    else if (!isValidPhone(phone)) { setError("phone", "연락처 형식이 올바르지 않아요."); ok = false; }

    if (!isValidEmail(email)) { setError("email", "이메일 형식이 올바르지 않아요."); ok = false; }

    if (!category) { setError("category", "상담 유형을 선택해주세요."); ok = false; }

    if (!message) { setError("message", "상담 내용을 입력해주세요."); ok = false; }

    if (!agree) { setError("agree", "동의 체크가 필요해요."); ok = false; }

    return ok;
  }

  ["name", "phone", "email", "category", "message"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", () => setError(id, ""));
    el.addEventListener("change", () => setError(id, ""));
  });

  const agreeEl = document.getElementById("agree");
  if (agreeEl) {
    agreeEl.addEventListener("change", () => setError("agree", ""));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ok = validate();
    if (!ok) return;

    const payload = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: (form.email.value || "").trim(),
      category: form.category.value,
      date: (form.date?.value || ""),
      time: (form.time?.value || ""),
      message: form.message.value.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const list = JSON.parse(localStorage.getItem("consultList")) || [];
      list.push(payload);
      localStorage.setItem("consultList", JSON.stringify(list));
    } catch (err) {
      console.warn("Failed to save consultList:", err);
    }

    location.href = "complete.html";
  });
})();
