(function () {
  "use strict";

  const STORAGE_KEYS = {
    freelancers: "doidera_freelancers",
    vagas: "doidera_vagas",
  };

  const SEED_FREELANCERS = [
    {
      id: "f1",
      nome: "Ana Souza",
      titulo: "Desenvolvedora Front-end",
      skills: ["React", "CSS", "JavaScript"],
      valorHora: 90,
      bio: "5 anos criando interfaces rápidas e acessíveis para startups.",
      contato: "ana.souza@exemplo.com",
    },
    {
      id: "f2",
      nome: "Bruno Lima",
      titulo: "Designer UI/UX",
      skills: ["Figma", "Design", "Prototipação"],
      valorHora: 75,
      bio: "Ajudo empresas a transformar ideias em produtos bonitos e usáveis.",
      contato: "bruno.lima@exemplo.com",
    },
    {
      id: "f3",
      nome: "Carla Mendes",
      titulo: "Redatora / Copywriter",
      skills: ["Copywriting", "SEO", "Marketing"],
      valorHora: 60,
      bio: "Textos que vendem, para blogs, landing pages e redes sociais.",
      contato: "carla.mendes@exemplo.com",
    },
  ];

  const SEED_VAGAS = [
    {
      id: "v1",
      titulo: "Freelancer para landing page",
      empresa: "Nuvem Tech",
      skills: ["HTML", "CSS", "Figma"],
      orcamento: "R$ 1.500",
      descricao: "Precisamos de uma landing page responsiva a partir de um layout no Figma.",
      contato: "contato@nuvemtech.com",
    },
    {
      id: "v2",
      titulo: "Redator para blog semanal",
      empresa: "Verde Consultoria",
      skills: ["Copywriting", "SEO"],
      orcamento: "A combinar",
      descricao: "Buscamos redator(a) para 4 artigos por mês sobre sustentabilidade.",
      contato: "rh@verdeconsultoria.com",
    },
  ];

  function loadData(key, seed) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      /* ignore corrupted data, fall back to seed */
    }
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }

  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  let freelancers = loadData(STORAGE_KEYS.freelancers, SEED_FREELANCERS);
  let vagas = loadData(STORAGE_KEYS.vagas, SEED_VAGAS);

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = String(str == null ? "" : str);
    return div.innerHTML;
  }

  function parseSkills(input) {
    return input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // ---------- Navigation ----------
  const views = ["home", "freelancers", "vagas", "cadastro"];

  function navigate(target) {
    views.forEach((v) => {
      document.getElementById("view-" + v).classList.toggle("hidden", v !== target);
    });
    document.querySelectorAll(".nav-link").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.nav === target);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => navigate(el.dataset.nav));
  });

  // ---------- Tabs (cadastro) ----------
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.add("hidden"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.remove("hidden");
    });
  });

  // ---------- Rendering ----------
  function renderFreelancers(filterText) {
    const list = document.getElementById("freelancers-list");
    const emptyMsg = document.getElementById("freelancers-empty");
    const filter = (filterText || "").toLowerCase().trim();

    const filtered = freelancers.filter((f) => {
      if (!filter) return true;
      const haystack = (f.titulo + " " + f.skills.join(" ")).toLowerCase();
      return haystack.includes(filter);
    });

    list.innerHTML = filtered
      .map(
        (f) => `
      <div class="card">
        <h3>${escapeHtml(f.nome)}</h3>
        <div class="card-sub">${escapeHtml(f.titulo)}</div>
        <div class="tag-list">
          ${f.skills.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("")}
        </div>
        <p class="card-body">${escapeHtml(f.bio)}</p>
        <div class="card-footer">
          <span class="price">${f.valorHora ? "R$ " + escapeHtml(f.valorHora) + "/h" : "Valor a combinar"}</span>
          <span>${escapeHtml(f.contato)}</span>
        </div>
      </div>
    `
      )
      .join("");

    emptyMsg.classList.toggle("hidden", filtered.length !== 0);
  }

  function renderVagas(filterText) {
    const list = document.getElementById("vagas-list");
    const emptyMsg = document.getElementById("vagas-empty");
    const filter = (filterText || "").toLowerCase().trim();

    const filtered = vagas.filter((v) => {
      if (!filter) return true;
      const haystack = (v.titulo + " " + v.skills.join(" ") + " " + v.descricao).toLowerCase();
      return haystack.includes(filter);
    });

    list.innerHTML = filtered
      .map(
        (v) => `
      <div class="card">
        <h3>${escapeHtml(v.titulo)}</h3>
        <div class="card-sub">${escapeHtml(v.empresa)}</div>
        <div class="tag-list">
          ${v.skills.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("")}
        </div>
        <p class="card-body">${escapeHtml(v.descricao)}</p>
        <div class="card-footer">
          <span class="price">${escapeHtml(v.orcamento || "A combinar")}</span>
          <span>${escapeHtml(v.contato)}</span>
        </div>
      </div>
    `
      )
      .join("");

    emptyMsg.classList.toggle("hidden", filtered.length !== 0);
  }

  function renderStats() {
    document.getElementById("stat-freelancers").textContent = freelancers.length;
    document.getElementById("stat-vagas").textContent = vagas.length;
    const allSkills = new Set();
    freelancers.forEach((f) => f.skills.forEach((s) => allSkills.add(s.toLowerCase())));
    vagas.forEach((v) => v.skills.forEach((s) => allSkills.add(s.toLowerCase())));
    document.getElementById("stat-skills").textContent = allSkills.size;
  }

  function renderAll() {
    renderFreelancers(document.getElementById("filter-freelancers").value);
    renderVagas(document.getElementById("filter-vagas").value);
    renderStats();
  }

  // ---------- Filters ----------
  document.getElementById("filter-freelancers").addEventListener("input", (e) => {
    renderFreelancers(e.target.value);
  });
  document.getElementById("filter-vagas").addEventListener("input", (e) => {
    renderVagas(e.target.value);
  });

  // ---------- Forms ----------
  function showMsg(el, text, isError) {
    el.textContent = text;
    el.classList.toggle("error", !!isError);
  }

  document.getElementById("tab-freelancer").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const msgEl = document.getElementById("msg-freelancer");
    const nome = form.nome.value.trim();
    const titulo = form.titulo.value.trim();
    const skills = parseSkills(form.skills.value);
    const contato = form.contato.value.trim();

    if (!nome || !titulo || skills.length === 0 || !contato) {
      showMsg(msgEl, "Preencha nome, título, habilidades e contato.", true);
      return;
    }

    freelancers.push({
      id: "f" + Date.now(),
      nome,
      titulo,
      skills,
      valorHora: form.valorHora.value ? Number(form.valorHora.value) : null,
      bio: form.bio.value.trim(),
      contato,
    });
    saveData(STORAGE_KEYS.freelancers, freelancers);
    form.reset();
    showMsg(msgEl, "Perfil publicado com sucesso!", false);
    renderAll();
  });

  document.getElementById("tab-vaga").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const msgEl = document.getElementById("msg-vaga");
    const titulo = form.titulo.value.trim();
    const empresa = form.empresa.value.trim();
    const skills = parseSkills(form.skills.value);
    const descricao = form.descricao.value.trim();
    const contato = form.contato.value.trim();

    if (!titulo || !empresa || skills.length === 0 || !descricao || !contato) {
      showMsg(msgEl, "Preencha todos os campos obrigatórios.", true);
      return;
    }

    vagas.push({
      id: "v" + Date.now(),
      titulo,
      empresa,
      skills,
      orcamento: form.orcamento.value.trim(),
      descricao,
      contato,
    });
    saveData(STORAGE_KEYS.vagas, vagas);
    form.reset();
    showMsg(msgEl, "Vaga publicada com sucesso!", false);
    renderAll();
  });

  // ---------- Init ----------
  renderAll();
})();
