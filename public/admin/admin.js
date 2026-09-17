// ==========================================================================
// TURHAN & MERİÇ YÖNETİM PANELİ (ADMIN CMS CLIENT)
// ==========================================================================

const state = {
  gallery: [],
  articles: [],
  experts: {},
  instagram: { silasu: [], tilbe: [] },
  activeExpert: "silasu",
  token: null,
};

// ================= TOAST NOTIFICATION =================
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type === "error" ? "toast-error" : ""}`;
  toast.innerHTML = `
    <span>${type === "error" ? "⚠️" : "✓"}</span>
    <span>${escapeHtml(message)}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(30px)";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(text) {
  const trMap = {
    ç: "c", Ç: "c",
    ğ: "g", Ğ: "g",
    ı: "i", I: "i", İ: "i",
    ö: "o", Ö: "o",
    ş: "s", Ş: "s",
    ü: "u", Ü: "u",
  };
  return String(text)
    .replace(/[çÇğĞıIİöÖşŞüÜ]/g, (c) => trMap[c] || c)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ================= API REQUEST HELPER =================
async function apiRequest(endpoint, options = {}) {
  const headers = options.headers || {};
  if (state.token) {
    headers["Authorization"] = `Bearer ${state.token}`;
  }
  if (options.body && typeof options.body === "object") {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(endpoint, { credentials: "include", ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `İşlem başarısız (${response.status})`);
  }
  return data;
}

// ================= AUTHENTICATION =================
async function checkAuth() {
  try {
    const res = await apiRequest("/api/admin/check");
    if (res.ok) {
      document.getElementById("login-overlay").style.display = "none";
      document.getElementById("app").style.display = "block";
      await loadAllData();
    }
  } catch (err) {
    document.getElementById("login-overlay").style.display = "flex";
    document.getElementById("app").style.display = "none";
  }
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const errorEl = document.getElementById("login-error");
  const submitBtn = document.getElementById("login-submit");

  errorEl.style.display = "none";
  submitBtn.disabled = true;
  submitBtn.textContent = "Giriş yapılıyor...";

  try {
    const res = await apiRequest("/api/admin/login", {
      method: "POST",
      body: { username, password },
    });
    if (res.ok) {
      state.token = res.token;
      document.getElementById("login-overlay").style.display = "none";
      document.getElementById("app").style.display = "block";
      await loadAllData();
      showToast("Başarıyla giriş yapıldı.");
    }
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.style.display = "block";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Giriş Yap";
  }
});

document.getElementById("btn-logout").addEventListener("click", async () => {
  if (!confirm("Oturumu kapatmak istediğinize emin misiniz?")) return;
  try {
    await apiRequest("/api/admin/logout", { method: "POST" });
  } catch (e) {}
  state.token = null;
  document.getElementById("app").style.display = "none";
  document.getElementById("login-overlay").style.display = "flex";
});

// ================= DATA LOADING =================
async function loadAllData() {
  try {
    const res = await apiRequest("/api/admin/data");
    state.gallery = res.data.gallery || [];
    state.articles = res.data.articles || [];
    state.experts = res.data.experts || {};
    state.instagram = res.data.instagram || { silasu: [], tilbe: [] };

    renderGallery();
    renderArticles();
    renderExperts();
    renderInstagram();
  } catch (err) {
    showToast("Veriler yüklenirken hata: " + err.message, "error");
  }
}

// ================= TABS SWITCHING =================
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));

    btn.classList.add("active");
    const tabId = `tab-${btn.dataset.tab}`;
    document.getElementById(tabId)?.classList.add("active");
  });
});

// ================= FILE UPLOAD HELPER =================
async function uploadFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result;
        const res = await apiRequest("/api/admin/upload", {
          method: "POST",
          body: { filename: file.name, dataUrl },
        });
        resolve(res.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Setup generic file upload inputs
document.addEventListener("change", async (e) => {
  if (e.target.classList.contains("file-upload-input")) {
    const file = e.target.files?.[0];
    if (!file) return;
    const targetId = e.target.dataset.target;
    const targetInput = document.getElementById(targetId);

    const oldLabel = e.target.parentElement.textContent.trim();
    e.target.parentElement.firstChild.textContent = "Yükleniyor...";

    try {
      const url = await uploadFile(file);
      if (targetInput) {
        targetInput.value = url;
        targetInput.dispatchEvent(new Event("input"));
      }
      showToast("Fotoğraf yüklendi: " + url);

      // Handle preview if exists
      if (targetId === "new-gallery-image") {
        document.getElementById("gallery-preview-wrap").style.display = "block";
        document.getElementById("gallery-preview-img").src = url;
      }
    } catch (err) {
      showToast("Yükleme hatası: " + err.message, "error");
    } finally {
      e.target.parentElement.firstChild.textContent = oldLabel || "Yükle";
      e.target.value = "";
    }
  }
});

// ================= TAB 1: GALERİ =================
function renderGallery() {
  const container = document.getElementById("gallery-list");
  if (!container) return;
  container.innerHTML = "";

  state.gallery.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.innerHTML = `
      <div class="gallery-thumb-wrap">
        <span class="gallery-order-badge">${String(index + 1).padStart(2, "0")}</span>
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.caption)}" loading="lazy" />
      </div>
      <div class="gallery-body">
        <input type="text" class="gallery-caption-input" value="${escapeHtml(item.caption)}" data-index="${index}" placeholder="Fotoğraf açıklaması" />
        <div class="gallery-controls">
          <div class="order-btns">
            <button type="button" class="btn btn-secondary btn-sm" data-action="move-up" data-index="${index}" ${index === 0 ? "disabled" : ""}>▲</button>
            <button type="button" class="btn btn-secondary btn-sm" data-action="move-down" data-index="${index}" ${index === state.gallery.length - 1 ? "disabled" : ""}>▼</button>
          </div>
          <button type="button" class="btn btn-danger btn-sm" data-action="delete-photo" data-index="${index}">Sil</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

document.getElementById("gallery-list")?.addEventListener("input", (e) => {
  if (e.target.classList.contains("gallery-caption-input")) {
    const index = Number(e.target.dataset.index);
    if (state.gallery[index]) {
      state.gallery[index].caption = e.target.value;
    }
  }
});

document.getElementById("gallery-list")?.addEventListener("click", (e) => {
  const target = e.target.closest("button");
  if (!target) return;
  const action = target.dataset.action;
  const index = Number(target.dataset.index);

  if (action === "move-up" && index > 0) {
    const temp = state.gallery[index];
    state.gallery[index] = state.gallery[index - 1];
    state.gallery[index - 1] = temp;
    renderGallery();
  } else if (action === "move-down" && index < state.gallery.length - 1) {
    const temp = state.gallery[index];
    state.gallery[index] = state.gallery[index + 1];
    state.gallery[index + 1] = temp;
    renderGallery();
  } else if (action === "delete-photo") {
    if (confirm("Bu fotoğrafı galeriden silmek istediğinize emin misiniz?")) {
      state.gallery.splice(index, 1);
      renderGallery();
      showToast("Fotoğraf silindi.");
    }
  }
});

// Add Photo Modal
const galleryModal = document.getElementById("gallery-modal");
document.getElementById("btn-add-gallery-photo")?.addEventListener("click", () => {
  document.getElementById("gallery-add-form").reset();
  document.getElementById("gallery-preview-wrap").style.display = "none";
  galleryModal.showModal();
});
document.getElementById("btn-close-gallery-modal")?.addEventListener("click", () => galleryModal.close());
document.getElementById("btn-cancel-gallery")?.addEventListener("click", () => galleryModal.close());

document.getElementById("new-gallery-image")?.addEventListener("input", (e) => {
  const url = e.target.value.trim();
  if (url) {
    document.getElementById("gallery-preview-wrap").style.display = "block";
    document.getElementById("gallery-preview-img").src = url;
  } else {
    document.getElementById("gallery-preview-wrap").style.display = "none";
  }
});

document.getElementById("gallery-add-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const image = document.getElementById("new-gallery-image").value.trim();
  const caption = document.getElementById("new-gallery-caption").value.trim();
  if (!image || !caption) return;

  state.gallery.push({
    id: String(Date.now()),
    image,
    caption,
  });

  renderGallery();
  galleryModal.close();
  showToast("Fotoğraf eklendi. Değişiklikleri kaydetmeyi unutmayın.");
});

// Save Gallery
document.getElementById("btn-save-gallery")?.addEventListener("click", async () => {
  const btn = document.getElementById("btn-save-gallery");
  btn.disabled = true;
  btn.textContent = "Kaydediliyor...";
  try {
    const res = await apiRequest("/api/admin/gallery", {
      method: "POST",
      body: { gallery: state.gallery },
    });
    state.gallery = res.gallery;
    showToast("İşletmemizden Kareler galerisi başarıyla kaydedildi!");
  } catch (err) {
    showToast("Kaydetme hatası: " + err.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Galeriyi Kaydet";
  }
});

// ================= TAB 2: MAKALELER =================
function renderArticles() {
  const container = document.getElementById("articles-list");
  if (!container) return;
  container.innerHTML = "";

  state.articles.forEach((article, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${escapeHtml(article.cover)}" alt="" class="table-thumb" /></td>
      <td><strong>${escapeHtml(article.title)}</strong></td>
      <td><span class="badge">${escapeHtml(article.topic)}</span></td>
      <td>${escapeHtml(article.readingTime)}</td>
      <td><code>${escapeHtml(article.slug)}</code></td>
      <td>
        <div class="table-actions">
          <a href="/blog/${escapeHtml(article.slug)}/" target="_blank" class="btn btn-secondary btn-sm" title="Görüntüle">↗</a>
          <button type="button" class="btn btn-secondary btn-sm" data-action="edit-article" data-slug="${escapeHtml(article.slug)}">Düzenle</button>
          <button type="button" class="btn btn-danger btn-sm" data-action="delete-article" data-slug="${escapeHtml(article.slug)}">Sil</button>
        </div>
      </td>
    `;
    container.appendChild(tr);
  });
}

// Article Modal Elements
const articleModal = document.getElementById("article-modal");
const articleForm = document.getElementById("article-form");
const sectionsContainer = document.getElementById("article-sections-container");

function createSectionRow(heading = "", text = "") {
  const div = document.createElement("div");
  div.className = "section-card";
  div.innerHTML = `
    <div class="section-card-header">
      <strong>Bölüm</strong>
      <button type="button" class="btn btn-danger btn-sm remove-section-btn">Bölümü Sil</button>
    </div>
    <div class="form-group">
      <label>Bölüm Başlığı *</label>
      <input type="text" class="section-heading-input" value="${escapeHtml(heading)}" required placeholder="Örn: Değerlendirme neden kişiye özeldir?" />
    </div>
    <div class="form-group" style="margin-bottom: 0;">
      <label>Bölüm Paragrafı *</label>
      <textarea rows="3" class="section-text-input" required placeholder="Paragraf içeriğini buraya yazın...">${escapeHtml(text)}</textarea>
    </div>
  `;
  div.querySelector(".remove-section-btn").addEventListener("click", () => div.remove());
  return div;
}

document.getElementById("btn-add-section")?.addEventListener("click", () => {
  sectionsContainer.appendChild(createSectionRow());
});

document.getElementById("btn-new-article")?.addEventListener("click", () => {
  document.getElementById("article-modal-title").textContent = "Yeni Makale Ekle";
  articleForm.reset();
  document.getElementById("article-original-slug").value = "";
  sectionsContainer.innerHTML = "";
  sectionsContainer.appendChild(createSectionRow());
  articleModal.showModal();
});

document.getElementById("btn-close-article-modal")?.addEventListener("click", () => articleModal.close());
document.getElementById("btn-cancel-article")?.addEventListener("click", () => articleModal.close());

document.getElementById("article-title")?.addEventListener("input", (e) => {
  const origSlug = document.getElementById("article-original-slug").value;
  if (!origSlug) {
    document.getElementById("article-slug").value = slugify(e.target.value);
  }
});

// Edit / Delete Article click
document.getElementById("articles-list")?.addEventListener("click", (e) => {
  const target = e.target.closest("button");
  if (!target) return;
  const action = target.dataset.action;
  const slug = target.dataset.slug;
  const article = state.articles.find((a) => a.slug === slug);
  if (!article) return;

  if (action === "edit-article") {
    document.getElementById("article-modal-title").textContent = "Makaleyi Düzenle: " + article.title;
    document.getElementById("article-original-slug").value = article.slug;
    document.getElementById("article-title").value = article.title;
    document.getElementById("article-slug").value = article.slug;
    document.getElementById("article-topic").value = article.topic;
    document.getElementById("article-readingTime").value = article.readingTime;
    document.getElementById("article-cover").value = article.cover;
    document.getElementById("article-coverAlt").value = article.coverAlt;
    document.getElementById("article-excerpt").value = article.excerpt;
    document.getElementById("article-answer").value = article.answer;

    sectionsContainer.innerHTML = "";
    (article.sections || []).forEach(([heading, text]) => {
      sectionsContainer.appendChild(createSectionRow(heading, text));
    });

    articleModal.showModal();
  } else if (action === "delete-article") {
    if (confirm(`"${article.title}" başlıklı makaleyi silmek istediğinize emin misiniz?`)) {
      state.articles = state.articles.filter((a) => a.slug !== slug);
      renderArticles();
      showToast("Makale silindi. Değişiklikleri kaydetmeyi unutmayın.");
    }
  }
});

// Submit Article Form
articleForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const origSlug = document.getElementById("article-original-slug").value;
  const slug = document.getElementById("article-slug").value.trim();
  const title = document.getElementById("article-title").value.trim();
  const topic = document.getElementById("article-topic").value.trim().toUpperCase();
  const readingTime = document.getElementById("article-readingTime").value.trim() || "4 dk okuma";
  const cover = document.getElementById("article-cover").value.trim();
  const coverAlt = document.getElementById("article-coverAlt").value.trim();
  const excerpt = document.getElementById("article-excerpt").value.trim();
  const answer = document.getElementById("article-answer").value.trim();

  const sections = [];
  sectionsContainer.querySelectorAll(".section-card").forEach((card) => {
    const heading = card.querySelector(".section-heading-input").value.trim();
    const text = card.querySelector(".section-text-input").value.trim();
    if (heading && text) {
      sections.push([heading, text]);
    }
  });

  const updatedArticle = {
    slug,
    title,
    excerpt,
    answer,
    topic,
    readingTime,
    cover,
    coverAlt,
    sections,
  };

  if (origSlug) {
    const idx = state.articles.findIndex((a) => a.slug === origSlug);
    if (idx !== -1) {
      state.articles[idx] = updatedArticle;
    }
  } else {
    // Check if slug already exists
    if (state.articles.some((a) => a.slug === slug)) {
      return alert("Bu URL (slug) zaten başka bir makalede kullanılıyor. Lütfen benzersiz bir slug girin.");
    }
    state.articles.unshift(updatedArticle);
  }

  renderArticles();
  articleModal.close();
  showToast("Makale listeye kaydedildi. Kalıcı olması için 'Makaleleri Kaydet' butonuna tıklayın.");
});

// Save Articles API
document.getElementById("btn-save-articles")?.addEventListener("click", async () => {
  const btn = document.getElementById("btn-save-articles");
  btn.disabled = true;
  btn.textContent = "Kaydediliyor...";
  try {
    const res = await apiRequest("/api/admin/articles", {
      method: "POST",
      body: { articles: state.articles },
    });
    state.articles = res.articles;
    showToast("Makaleler başarıyla kaydedildi!");
  } catch (err) {
    showToast("Hata: " + err.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Makaleleri Kaydet";
  }
});

// ================= TAB 3: DANIŞMANLAR =================
function renderExperts() {
  renderExpertForm("silasu");
  renderExpertForm("tilbe");
}

function renderExpertForm(id) {
  const container = document.getElementById(`expert-form-${id}`);
  const data = state.experts[id] || {};
  if (!container) return;

  container.innerHTML = `
    <div class="expert-profile-banner">
      <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.name)}" class="expert-portrait-preview" id="preview-${id}-image" />
      <div>
        <h3 style="color: #fff; font-size: 1.25rem;">${escapeHtml(data.prefix || "")} ${escapeHtml(data.name || "")}</h3>
        <p class="text-muted">${escapeHtml(data.role || "")} · ${escapeHtml(data.title || "")}</p>
        <div style="margin-top: 0.75rem;">
          <label class="btn btn-secondary btn-sm file-upload-label">
            Yeni Fotoğraf Yükle
            <input type="file" accept="image/*" class="file-upload-input" data-target="input-${id}-image" />
          </label>
        </div>
      </div>
    </div>

    <form id="form-expert-${id}">
      <input type="hidden" id="input-${id}-image" value="${escapeHtml(data.image || "")}" />

      <div class="form-row">
        <div class="form-group flex-1">
          <label>Ünvan Ön Ek</label>
          <input type="text" id="input-${id}-prefix" value="${escapeHtml(data.prefix || "")}" placeholder="Örn: Uzm. Fzt. veya Fzt." />
        </div>
        <div class="form-group flex-2">
          <label>Ad Soyad *</label>
          <input type="text" id="input-${id}-name" value="${escapeHtml(data.name || "")}" required />
        </div>
        <div class="form-group flex-2">
          <label>Akademik Derece / Alan</label>
          <input type="text" id="input-${id}-title" value="${escapeHtml(data.title || "")}" placeholder="Örn: Fizyoloji YL · FTR PhD" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group flex-1">
          <label>Rol</label>
          <input type="text" id="input-${id}-role" value="${escapeHtml(data.role || "")}" placeholder="Örn: Kurucu · Fizyoterapist" />
        </div>
        <div class="form-group flex-1">
          <label>Kategori</label>
          <input type="text" id="input-${id}-category" value="${escapeHtml(data.category || "")}" placeholder="Örn: FİZYOTERAPİ VE REHABİLİTASYON" />
        </div>
      </div>

      <div class="form-group">
        <label>Kısa Tanıtım (Hero Bölümü) *</label>
        <textarea rows="2" id="input-${id}-shortBio">${escapeHtml(data.shortBio || "")}</textarea>
      </div>

      <div class="form-group">
        <label>Detaylı Biyografi / Yaklaşım Metni *</label>
        <textarea rows="4" id="input-${id}-fullBio">${escapeHtml(data.fullBio || "")}</textarea>
      </div>

      <div class="form-group">
        <label>Uzmanlık Alanları (Etiketler)</label>
        <div class="tags-input-box" id="tags-box-${id}">
          ${(data.expertiseAreas || [])
            .map(
              (tag, idx) => `
            <span class="tag-item">
              ${escapeHtml(tag)}
              <button type="button" class="tag-remove" data-expert="${id}" data-tag-idx="${idx}">×</button>
            </span>
          `,
            )
            .join("")}
        </div>
        <div class="tag-add-bar">
          <input type="text" id="new-tag-input-${id}" placeholder="Yeni uzmanlık alanı yazın (Örn: Omurga Sağlığı)" />
          <button type="button" class="btn btn-secondary btn-sm" id="btn-add-tag-${id}">Ekle</button>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group flex-1">
          <label>Randevu Telefonu</label>
          <input type="tel" id="input-${id}-phone" value="${escapeHtml(data.phone || "")}" />
        </div>
        <div class="form-group flex-1">
          <label>E-posta Adresi</label>
          <input type="email" id="input-${id}-email" value="${escapeHtml(data.email || "")}" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group flex-1">
          <label>Instagram Kullanıcı Adı</label>
          <input type="text" id="input-${id}-instagram" value="${escapeHtml(data.instagram || "")}" placeholder="@kullaniciadi" />
        </div>
        <div class="form-group flex-2">
          <label>Instagram Profil Linki</label>
          <input type="url" id="input-${id}-instagramUrl" value="${escapeHtml(data.instagramUrl || "")}" />
        </div>
      </div>
    </form>
  `;

  // Listen to portrait input changes to update preview
  document.getElementById(`input-${id}-image`)?.addEventListener("input", (e) => {
    document.getElementById(`preview-${id}-image`).src = e.target.value;
  });

  // Add tag
  document.getElementById(`btn-add-tag-${id}`)?.addEventListener("click", () => {
    const input = document.getElementById(`new-tag-input-${id}`);
    const val = input.value.trim();
    if (val) {
      if (!state.experts[id].expertiseAreas) state.experts[id].expertiseAreas = [];
      state.experts[id].expertiseAreas.push(val);
      renderExpertForm(id);
    }
  });

  document.getElementById(`new-tag-input-${id}`)?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById(`btn-add-tag-${id}`).click();
    }
  });

  // Remove tag
  document.getElementById(`tags-box-${id}`)?.addEventListener("click", (e) => {
    if (e.target.classList.contains("tag-remove")) {
      const idx = Number(e.target.dataset.tagIdx);
      state.experts[id].expertiseAreas.splice(idx, 1);
      renderExpertForm(id);
    }
  });
}

// Switch Expert Subtabs
document.querySelectorAll(".subtab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".subtab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const expert = btn.dataset.expert;
    state.activeExpert = expert;

    document.getElementById("expert-form-silasu").style.display = expert === "silasu" ? "block" : "none";
    document.getElementById("expert-form-tilbe").style.display = expert === "tilbe" ? "block" : "none";
  });
});

// Save Experts
document.getElementById("btn-save-experts")?.addEventListener("click", async () => {
  const btn = document.getElementById("btn-save-experts");
  btn.disabled = true;
  btn.textContent = "Kaydediliyor...";

  try {
    // Harvest both forms
    ["silasu", "tilbe"].forEach((id) => {
      const exp = state.experts[id] || {};
      exp.prefix = document.getElementById(`input-${id}-prefix`).value.trim();
      exp.name = document.getElementById(`input-${id}-name`).value.trim();
      exp.title = document.getElementById(`input-${id}-title`).value.trim();
      exp.role = document.getElementById(`input-${id}-role`).value.trim();
      exp.category = document.getElementById(`input-${id}-category`).value.trim();
      exp.shortBio = document.getElementById(`input-${id}-shortBio`).value.trim();
      exp.fullBio = document.getElementById(`input-${id}-fullBio`).value.trim();
      exp.image = document.getElementById(`input-${id}-image`).value.trim();
      exp.phone = document.getElementById(`input-${id}-phone`).value.trim();
      exp.email = document.getElementById(`input-${id}-email`).value.trim();
      exp.instagram = document.getElementById(`input-${id}-instagram`).value.trim();
      exp.instagramUrl = document.getElementById(`input-${id}-instagramUrl`).value.trim();
      state.experts[id] = exp;
    });

    const res = await apiRequest("/api/admin/experts", {
      method: "POST",
      body: { experts: state.experts },
    });
    state.experts = res.experts;
    renderExperts();
    showToast("Danışman bilgileri başarıyla kaydedildi!");
  } catch (err) {
    showToast("Hata: " + err.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Tüm Danışman Bilgilerini Kaydet";
  }
});

// ================= TAB 4: INSTAGRAM REELS =================
function renderInstagram() {
  renderReelsList("silasu");
  renderReelsList("tilbe");
}

function renderReelsList(id) {
  const listEl = document.getElementById(`${id}-reels-list`);
  if (!listEl) return;
  listEl.innerHTML = "";

  const items = state.instagram[id] || [];
  items.forEach((url, index) => {
    const li = document.createElement("li");
    li.className = "reel-item";
    li.innerHTML = `
      <a href="${escapeHtml(url)}" target="_blank" class="reel-link" title="${escapeHtml(url)}">
        ${escapeHtml(url)}
      </a>
      <div class="reel-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-action="move-up" data-expert="${id}" data-index="${index}" ${index === 0 ? "disabled" : ""}>▲</button>
        <button type="button" class="btn btn-secondary btn-sm" data-action="move-down" data-expert="${id}" data-index="${index}" ${index === items.length - 1 ? "disabled" : ""}>▼</button>
        <button type="button" class="btn btn-danger btn-sm" data-action="delete-reel" data-expert="${id}" data-index="${index}">Sil</button>
      </div>
    `;
    listEl.appendChild(li);
  });
}

function handleReelAction(e) {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const expert = btn.dataset.expert;
  const index = Number(btn.dataset.index);
  const list = state.instagram[expert];

  if (action === "move-up" && index > 0) {
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    renderReelsList(expert);
  } else if (action === "move-down" && index < list.length - 1) {
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    renderReelsList(expert);
  } else if (action === "delete-reel") {
    if (confirm("Bu videoyu kaldırmak istediğinize emin misiniz?")) {
      list.splice(index, 1);
      renderReelsList(expert);
      showToast("Video kaldırıldı.");
    }
  }
}

document.getElementById("silasu-reels-list")?.addEventListener("click", handleReelAction);
document.getElementById("tilbe-reels-list")?.addEventListener("click", handleReelAction);

// Add Reel
["silasu", "tilbe"].forEach((id) => {
  const addBtn = document.getElementById(`btn-add-${id}-reel`);
  const input = document.getElementById(`${id}-reel-input`);

  const addAction = () => {
    let url = input.value.trim();
    if (!url) return;
    if (!url.includes("instagram.com/")) {
      return alert("Lütfen geçerli bir Instagram bağlantısı girin (Örn: https://www.instagram.com/reel/...)");
    }
    if (!state.instagram[id]) state.instagram[id] = [];
    state.instagram[id].push(url);
    input.value = "";
    renderReelsList(id);
    showToast("Reel eklendi. Kaydetmeyi unutmayın.");
  };

  addBtn?.addEventListener("click", addAction);
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAction();
    }
  });
});

// Save Instagram
document.getElementById("btn-save-instagram")?.addEventListener("click", async () => {
  const btn = document.getElementById("btn-save-instagram");
  btn.disabled = true;
  btn.textContent = "Kaydediliyor...";
  try {
    const res = await apiRequest("/api/admin/instagram", {
      method: "POST",
      body: { instagram: state.instagram },
    });
    state.instagram = res.instagram;
    showToast("Instagram videoları başarıyla kaydedildi!");
  } catch (err) {
    showToast("Hata: " + err.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Instagram Videolarını Kaydet";
  }
});

// ================= PUBLISH / CANLIYA AL =================
document.getElementById("btn-publish")?.addEventListener("click", async () => {
  const btn = document.getElementById("btn-publish");
  const textEl = document.getElementById("publish-text");
  btn.disabled = true;
  textEl.textContent = "Derleniyor ve Canlıya Alınıyor...";

  try {
    const res = await apiRequest("/api/admin/publish", { method: "POST" });
    showToast(res.message || "Değişiklikler canlıya alındı!");
  } catch (err) {
    showToast("Yayınlama başarısız: " + err.message, "error");
  } finally {
    btn.disabled = false;
    textEl.textContent = "Değişiklikleri Canlıya Al";
  }
});

// Initialize on page load
checkAuth();
