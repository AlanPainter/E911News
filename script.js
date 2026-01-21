(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const year = document.getElementById('year');
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  if (year) year.textContent = new Date().getFullYear();

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav after selecting a link (mobile)
    nav.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.tagName === 'A' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Contact form: no backend; open mail client with a prefilled message
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      statusEl.textContent = '';

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const topic = String(data.get('topic') || '').trim();
      const message = String(data.get('message') || '').trim();

      if (!name || !email || !topic || !message) {
        statusEl.textContent = 'Please complete all fields.';
        return;
      }

      // Change this to your preferred intake address
      const to = 'I-Team@E911News.com';

      const subject = `[E911 News] ${topic.toUpperCase()} — from ${name}`;
      const body =
        `Name: ${name}
Email: ${email}
Topic: ${topic}

Message:
${message}

---
Sent from the E911 News website contact form.`;

      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      statusEl.textContent = 'Opening your email app with a prepared message…';
      window.location.href = mailto;
    });
  }
})();