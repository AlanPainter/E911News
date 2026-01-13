(function () {
    const results = document.getElementById("results");
    if (!results) return;

    const q = document.getElementById("q");
    const topic = document.getElementById("topic");
    const status = document.getElementById("status");
    const reset = document.getElementById("reset");

    let items = [];

    fetch("./data/investigations.json", { cache: "no-store" })
        .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to load investigations")))
        .then(data => {
            items = Array.isArray(data) ? data : [];
            hydrateTopics(items);
            render(applyFilters(items));
        })
        .catch(() => {
            results.innerHTML = `<div class="result"><h3>Error</h3><p class="muted">Unable to load investigations.</p></div>`;
        });

    [q, topic, status].forEach(el => el && el.addEventListener("input", () => render(applyFilters(items))));
    reset && reset.addEventListener("click", () => {
        if (q) q.value = "";
        if (topic) topic.value = "";
        if (status) status.value = "";
        render(applyFilters(items));
    });

    function hydrateTopics(data) {
        if (!topic) return;
        const topics = new Set();
        data.forEach(x => (x.topics || []).forEach(t => topics.add(t)));
        [...topics].sort().forEach(t => {
            const opt = document.createElement("option");
            opt.value = t;
            opt.textContent = t;
            topic.appendChild(opt);
        });
    }

    function applyFilters(data) {
        const query = (q?.value || "").trim().toLowerCase();
        const t = (topic?.value || "").trim();
        const s = (status?.value || "").trim();

        return data
            .slice()
            .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
            .filter(x => {
                const text = [
                    x.title, x.summary, x.county, x.agency, (x.topics || []).join(" ")
                ].filter(Boolean).join(" ").toLowerCase();

                const matchesQ = !query || text.includes(query);
                const matchesTopic = !t || (x.topics || []).includes(t);
                const matchesStatus = !s || (x.status || "") === s;

                return matchesQ && matchesTopic && matchesStatus;
            });
    }

    function render(list) {
        if (!list.length) {
            results.innerHTML = `<div class="result"><h3>No results</h3><p class="muted">Try adjusting your filters.</p></div>`;
            return;
        }

        results.innerHTML = list.map(x => `
      <article class="result">
        <h3>${escapeHtml(x.title || "Untitled")}</h3>
        <div class="meta">
          <span>${escapeHtml(x.date || "—")}</span>
          <span>•</span>
          <span>${escapeHtml(x.status || "Update")}</span>
          ${x.county ? `<span>•</span><span>${escapeHtml(x.county)}</span>` : ""}
          ${x.agency ? `<span>•</span><span>${escapeHtml(x.agency)}</span>` : ""}
        </div>
        <p class="muted">${escapeHtml(x.summary || "")}</p>
        ${x.links?.length ? `
          <p style="margin:10px 0 0;">
            ${x.links.map(l => `<a class="text-link" href="${escapeAttr(l.href)}" target="_blank" rel="noopener">${escapeHtml(l.label || "Link")}</a>`).join(" • ")}
          </p>` : ""}
      </article>
    `).join("");
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[c]));
    }
    function escapeAttr(s) {
        return String(s).replace(/"/g, "&quot;");
    }
})();
