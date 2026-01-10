(function () {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const toggle = document.querySelector("[data-nav-toggle]");
    const menu = document.querySelector("[data-nav-menu]");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            const open = menu.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
        });

        document.addEventListener("click", (e) => {
            if (!menu.classList.contains("open")) return;
            const isClickInside = menu.contains(e.target) || toggle.contains(e.target);
            if (!isClickInside) {
                menu.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Home page "Latest" widget (optional)
    const latestList = document.getElementById("latestList");
    if (latestList) {
        fetch("./data/investigations.json", { cache: "no-store" })
            .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to load investigations")))
            .then(items => {
                const sorted = [...items].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
                const top = sorted.slice(0, 4);

                if (!top.length) {
                    latestList.innerHTML = `<p class="muted">No updates posted yet.</p>`;
                    return;
                }

                latestList.innerHTML = top.map(x => `
          <article class="latest-item">
            <div class="kicker">
              <span>${escapeHtml(x.date || "—")}</span>
              <span>•</span>
              <span>${escapeHtml(x.status || "Update")}</span>
            </div>
            <div class="title">${escapeHtml(x.title || "Untitled")}</div>
          </article>
        `).join("");
            })
            .catch(() => {
                latestList.innerHTML = `<p class="muted">Unable to load updates.</p>`;
            });
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[c]));
    }
})();
