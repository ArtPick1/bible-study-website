(() => {
  document.querySelectorAll('[data-nav]').forEach(host => {
    const root = host.dataset.root || '';
    const embedded = host.dataset.embedded === 'true';
    host.innerHTML = `<nav class="site-nav${embedded ? ' embedded' : ''}" aria-label="Main navigation">
      <a href="${root}index.html">Home</a><a href="${root}bible-study/index.html">Bible Study</a><a href="${root}previous-studies/index.html">Previous Studies</a>
      <div class="drop"><button type="button">Events <span>⌄</span></button><div class="menu"><p>No events scheduled at this time.</p></div></div>
      <div class="drop"><button type="button">Contact <span>⌄</span></button><div class="menu contact"><a href="mailto:luke_sills@yahoo.com?subject=Men%27s%20Fellowship"><strong>Pastor Luke</strong><small>luke_sills@yahoo.com</small></a><a href="mailto:artprepper@gmail.com?subject=Men%27s%20Fellowship"><strong>Art Pickens</strong><small>artprepper@gmail.com</small></a></div></div>
    </nav>`;
  });
  document.querySelectorAll('.drop button').forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    const parent = button.parentElement;
    document.querySelectorAll('.drop.open').forEach(drop => { if (drop !== parent) drop.classList.remove('open'); });
    parent.classList.toggle('open');
    button.setAttribute('aria-expanded', parent.classList.contains('open'));
  }));
  document.addEventListener('click', () => document.querySelectorAll('.drop.open').forEach(drop => drop.classList.remove('open')));
})();
