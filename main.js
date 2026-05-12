const escapeHtml = (value) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const highlightSql = (sql) => escapeHtml(sql)
    .replace(/(--.*)$/gm, '<span class="sql-comment">$1</span>')
    .replace(/'([^']*)'/g, '<span class="sql-string">\'$1\'</span>')
    .replace(/\b(SELECT|FROM|WHERE|LEFT|JOIN|ON|CASE|WHEN|THEN|ELSE|END|AS|ORDER|BY|AND|OR|IS|NULL|IN|DEFINE|PROMPT)\b/g, '<span class="sql-keyword">$1</span>')
    .replace(/\b(MED_SIATEP_RECA|MED_SIATEP_RELA|ADH_MEDICOS)\b/g, '<span class="sql-table">$1</span>')
    .replace(/(:[A-Z_][A-Z0-9_]*)\b/g, '<span class="sql-bind">$1</span>')
    .replace(/\b(SQL&gt;|\d+)\b/g, '<span class="sql-prompt">$1</span>');

document.querySelectorAll(".sql-terminal").forEach((terminal) => {
    const bar = terminal.querySelector(".sql-terminal__bar");
    const code = terminal.querySelector("pre code");

    if (!bar || !code) {
        return;
    }

    code.innerHTML = highlightSql(code.textContent);

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "copy-sql";
    copyButton.textContent = "Copiar";
    copyButton.setAttribute("aria-label", "Copiar query SQL");

    copyButton.addEventListener("click", async () => {
        const originalText = copyButton.textContent;
        const query = code.innerText.replace(/^SQL>\s?/gm, "").replace(/^\s*\d+\s+/gm, "");

        try {
            await navigator.clipboard.writeText(query.trim());
            copyButton.textContent = "Copiado";
            copyButton.classList.add("is-copied");

            window.setTimeout(() => {
                copyButton.textContent = originalText;
                copyButton.classList.remove("is-copied");
            }, 1600);
        } catch (error) {
            copyButton.textContent = "Error";
            window.setTimeout(() => {
                copyButton.textContent = originalText;
            }, 1600);
        }
    });

    bar.appendChild(copyButton);
});

const backToTopButton = document.querySelector(".back-to-top");

if (backToTopButton) {
    const toggleBackToTopButton = () => {
        backToTopButton.classList.toggle("is-visible", window.scrollY > 300);
    };

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", toggleBackToTopButton);
    toggleBackToTopButton();
}
