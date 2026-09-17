(() => {
  const services = [
    "İlk Muayene",
    "Fizyoterapi Seansları",
    "Osteopatik Değerlendirme",
    "Core / Stabilizasyon Egzersizleri",
    "Sporcu Sağlığı ve Fonksiyonel Egzersiz",
    "Ortopedik Rehabilitasyon",
    "Manuel Terapi",
    "Klinik Pilates",
    "Nörolojik Rehabilitasyon",
    "Diğer",
  ];

  const consultants = [
    "Müsait danışman",
    "Sılasu Turhan",
    "Tilbe Meriç",
  ];

  function toDateKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function formatFullDate(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d, 12, 0, 0);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    }).format(date);
  }

  function getWeekDates(offset) {
    const base = new Date();
    base.setHours(12, 0, 0, 0);
    base.setDate(base.getDate() + offset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }

  let overlayEl = null;
  let weekIndex = 0;
  let selectedDateKey = toDateKey(new Date());

  function createModal() {
    if (overlayEl) return overlayEl;

    overlayEl = document.createElement("div");
    overlayEl.className = "booking-overlay";
    overlayEl.setAttribute("role", "presentation");
    overlayEl.style.display = "none";

    overlayEl.innerHTML = `
      <section class="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <button class="booking-close" type="button" aria-label="Randevu penceresini kapat">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
        <div id="booking-form-container">
          <form id="booking-modal-form">
            <div class="booking-heading">
              <h2 id="booking-title">Size uygun seansı<br><em>birlikte</em> planlayalım.</h2>
              <p>Bilgilerinizi seçin; onayla dediğinizde WhatsApp'ta hazır mesajınız açılır.</p>
            </div>
            <div class="booking-fields">
              <label>
                <span>Hizmet seçin</span>
                <select id="modal-service-select">
                  ${services.map((s) => `<option value="${s}">${s}</option>`).join("")}
                </select>
              </label>
              <label>
                <span>Danışman seçin</span>
                <select id="modal-consultant-select">
                  ${consultants.map((c) => `<option value="${c}">${c}</option>`).join("")}
                </select>
              </label>
            </div>
            <label class="booking-note" id="modal-note-field" style="display: none;">
              <span>Notunuz</span>
              <textarea id="modal-note-input" placeholder="İhtiyacınızı veya notunuzu yazın"></textarea>
            </label>
            <div class="booking-date-heading">
              <span>Tarih seçin</span>
              <div>
                <button type="button" class="modal-prev-week" aria-label="Önceki haftayı göster" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m15 18-6-6 6-6"></path></svg>
                </button>
                <button type="button" class="modal-next-week" aria-label="Sonraki haftayı göster">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 18 6-6-6-6"></path></svg>
                </button>
              </div>
            </div>
            <div class="booking-days" id="modal-days-grid" role="group" aria-label="Randevu günü"></div>
            <label class="booking-name">
              <span>Adınız soyadınız</span>
              <input id="modal-name-input" required placeholder="Adınızı ve soyadınızı yazın">
            </label>
            <label class="booking-name booking-phone">
              <span>Telefon numaranız</span>
              <input id="modal-phone-input" required type="tel" inputmode="tel" placeholder="05XX XXX XX XX">
            </label>
            <div class="booking-summary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-days" aria-hidden="true"><path d="M8 2v3"></path><path d="M16 2v3"></path><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18"></path><path d="M8 13h.01"></path><path d="M12 13h.01"></path><path d="M16 13h.01"></path><path d="M8 17h.01"></path><path d="M12 17h.01"></path><path d="M16 17h.01"></path></svg>
              <span>
                <strong id="modal-summary-date"></strong>
                <small id="modal-summary-details"></small>
              </span>
            </div>
            <label class="booking-kvkk">
              <input type="checkbox" required id="modal-kvkk-checkbox">
              <span><a href="/kvkk" target="_blank" rel="noopener noreferrer">KVKK Aydınlatma Metni</a>'ni okudum, kabul ediyorum.</span>
            </label>
            <button class="booking-confirm" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path></svg>
              Randevuyu onayla
            </button>
          </form>
        </div>
        <div id="booking-success-container" style="display: none;">
          <div class="booking-success">
            <span class="booking-success-mark">
              <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
            </span>
            <p class="eyebrow"><span></span> Talebiniz hazır</p>
            <h2>Randevu talebiniz<br><em>oluşturuldu.</em></h2>
            <p>WhatsApp'ta hazır açılan mesajınızı göndererek randevu talebinizi tamamlayabilirsiniz. Ekibimiz uygunluk için sizinle iletişime geçecek.</p>
            <button class="booking-confirm" type="button" id="modal-success-close">Tamam, anladım</button>
          </div>
        </div>
      </section>
    `;

    document.body.appendChild(overlayEl);

    // Event handlers inside modal
    const closeBtn = overlayEl.querySelector(".booking-close");
    const successCloseBtn = overlayEl.querySelector("#modal-success-close");
    const serviceSelect = overlayEl.querySelector("#modal-service-select");
    const consultantSelect = overlayEl.querySelector("#modal-consultant-select");
    const noteField = overlayEl.querySelector("#modal-note-field");
    const noteInput = overlayEl.querySelector("#modal-note-input");
    const prevWeekBtn = overlayEl.querySelector(".modal-prev-week");
    const nextWeekBtn = overlayEl.querySelector(".modal-next-week");
    const form = overlayEl.querySelector("#booking-modal-form");
    const modalSection = overlayEl.querySelector(".booking-modal");

    closeBtn.addEventListener("click", closeModal);
    successCloseBtn.addEventListener("click", closeModal);

    overlayEl.addEventListener("click", (e) => {
      if (e.target === overlayEl) closeModal();
    });

    serviceSelect.addEventListener("change", () => {
      const isOther = serviceSelect.value === "Diğer";
      noteField.style.display = isOther ? "block" : "none";
      noteInput.required = isOther;
      updateSummary();
    });

    consultantSelect.addEventListener("change", updateSummary);

    prevWeekBtn.addEventListener("click", () => {
      if (weekIndex > 0) {
        weekIndex--;
        renderDays();
      }
    });

    nextWeekBtn.addEventListener("click", () => {
      weekIndex++;
      renderDays();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const kvkkCheck = overlayEl.querySelector("#modal-kvkk-checkbox");
      if (!kvkkCheck.checked) {
        kvkkCheck.focus();
        return;
      }

      const name = overlayEl.querySelector("#modal-name-input").value.trim();
      const phone = overlayEl.querySelector("#modal-phone-input").value.trim();
      const service = serviceSelect.value;
      const consultant = consultantSelect.value;
      const note = noteInput.value.trim();

      // Routing logic:
      let targetPhone = "905516467462";
      let consultantTitle = "Fizyoterapist Sılasu Turhan";

      if (consultant === "Tilbe Meriç") {
        targetPhone = "905518418880";
        consultantTitle = "Fizyoterapist Tilbe Meriç";
      } else if (consultant === "Sılasu Turhan") {
        targetPhone = "905516467462";
        consultantTitle = "Fizyoterapist Sılasu Turhan";
      } else {
        // Müsait danışman: random 50/50 between Tilbe and Sılasu
        const isTilbe = Math.random() < 0.5;
        targetPhone = isTilbe ? "905518418880" : "905516467462";
        consultantTitle = isTilbe ? "Fizyoterapist Tilbe Meriç" : "Fizyoterapist Sılasu Turhan";
      }

      const formattedDate = formatFullDate(selectedDateKey);
      const lines = [
        `Merhaba 👋 ${consultantTitle} için randevu talebi oluşturmak istiyorum. ✨`,
        "",
        `👤 Ad Soyad: ${name}`,
        `📞 Telefon: ${phone}`,
        `🩺 Hizmet: ${service}`,
      ];

      if (service === "Diğer" && note) {
        lines.push(`📝 Not: ${note}`);
      }

      lines.push(
        `👩‍⚕️ Danışman: ${consultant}`,
        `📅 Tarih: ${formattedDate}`,
        "",
        `🔒 KVKK Aydınlatma Metni okundu ve kabul edildi.`,
        "",
        `Uygunluk bilgisi için dönüşünüzü bekliyorum. Teşekkür ederim 🙏`
      );

      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");

      // Show success container
      overlayEl.querySelector("#booking-form-container").style.display = "none";
      overlayEl.querySelector("#booking-success-container").style.display = "block";
    });

    renderDays();
    updateSummary();

    return overlayEl;
  }

  function renderDays() {
    if (!overlayEl) return;
    const grid = overlayEl.querySelector("#modal-days-grid");
    const prevBtn = overlayEl.querySelector(".modal-prev-week");
    prevBtn.disabled = weekIndex <= 0;

    const dates = getWeekDates(weekIndex);
    grid.innerHTML = "";

    dates.forEach((date) => {
      const key = toDateKey(date);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = key === selectedDateKey ? "selected" : "";

      const weekday = new Intl.DateTimeFormat("tr-TR", { weekday: "short" }).format(date);
      const month = new Intl.DateTimeFormat("tr-TR", { month: "short" }).format(date);
      const dayNum = date.getDate();

      btn.innerHTML = `<small>${weekday}</small><strong>${dayNum}</strong><i>${month}</i>`;

      btn.addEventListener("click", () => {
        selectedDateKey = key;
        grid.querySelectorAll("button").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        updateSummary();
      });

      grid.appendChild(btn);
    });
  }

  function updateSummary() {
    if (!overlayEl) return;
    const dateStrong = overlayEl.querySelector("#modal-summary-date");
    const detailsSmall = overlayEl.querySelector("#modal-summary-details");
    const service = overlayEl.querySelector("#modal-service-select").value;
    const consultant = overlayEl.querySelector("#modal-consultant-select").value;

    dateStrong.textContent = formatFullDate(selectedDateKey);
    detailsSmall.textContent = `${service} · ${consultant}`;
  }

  function openModal() {
    const modal = createModal();
    // Reset view
    modal.querySelector("#booking-form-container").style.display = "block";
    modal.querySelector("#booking-success-container").style.display = "none";
    modal.querySelector("#modal-kvkk-checkbox").checked = false;

    modal.style.display = "flex";
    document.body.classList.add("booking-open");

    // Close on escape
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
        window.removeEventListener("keydown", onKeyDown);
      }
    };
    window.addEventListener("keydown", onKeyDown);
  }

  function closeModal() {
    if (!overlayEl) return;
    overlayEl.style.display = "none";
    document.body.classList.remove("booking-open");
  }

  window.openBookingModal = openModal;
  window.closeBookingModal = closeModal;

  // Bind click triggers across the page
  function attachTriggers() {
    const triggers = document.querySelectorAll(`
      .header-cta,
      .hero-actions .button.primary,
      .mobile-menu-cta,
      .contact-main .button.light-button,
      [data-blog-appointment],
      .blog-appointment,
      .kinezyo-link,
      a[href="/?randevu=1"],
      a[href="?randevu=1"],
      a[href="/#randevu"]
    `);

    triggers.forEach((el) => {
      if (el.dataset.modalAttached === "true") return;
      el.dataset.modalAttached = "true";
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    });
  }

  // Check URL param ?randevu=1
  function checkUrlParam() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("randevu") === "1" || params.has("randevu")) {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("randevu");
      window.history.replaceState({}, "", cleanUrl.pathname + cleanUrl.hash);
      openModal();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      attachTriggers();
      checkUrlParam();
    });
  } else {
    attachTriggers();
    checkUrlParam();
  }

  // Also observe DOM additions for dynamically rendered CTA buttons
  if (window.MutationObserver && document.body) {
    new MutationObserver(() => attachTriggers()).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
