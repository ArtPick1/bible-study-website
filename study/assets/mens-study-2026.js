document.querySelector('.menu-button')?.addEventListener('click', event => {
  const nav = document.querySelector('#main-nav');
  const open = nav.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-dropdown > button').forEach(button => {
  button.addEventListener('click', event => {
    event.stopPropagation();
    const dropdown = button.closest('.nav-dropdown');
    const opening = !dropdown.classList.contains('open');
    document.querySelectorAll('.nav-dropdown.open').forEach(item => {
      item.classList.remove('open');
      item.querySelector('button')?.setAttribute('aria-expanded', 'false');
    });
    dropdown.classList.toggle('open', opening);
    button.setAttribute('aria-expanded', String(opening));
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.nav-dropdown.open').forEach(item => {
    item.classList.remove('open');
    item.querySelector('button')?.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') document.dispatchEvent(new MouseEvent('click'));
});

const studyRoot = document.querySelector('[data-study-options]');
if (studyRoot) {
  const parsedStudyData = JSON.parse(document.querySelector('#study-data').textContent);
  const verseStudies = Array.isArray(parsedStudyData) ? parsedStudyData : [parsedStudyData];
  const tabs = studyRoot.querySelector('.option-tabs');
  const panel = studyRoot.querySelector('.option-content');
  const verseLabel = studyRoot.querySelector('[data-selected-verse]');
  const passage = document.querySelector('main h1')?.textContent.trim().match(/^(.+?) (\d+):\d+/);
  const interlinearBooks = {Habakkuk: 'habakkuk'};
  const showOption = (option, button, verse) => {
    tabs.querySelectorAll('button').forEach(item => item.setAttribute('aria-selected', String(item === button)));
    let content = option.content;
    const book = passage && Object.hasOwn(interlinearBooks, passage[1]) && interlinearBooks[passage[1]];
    if (/^9:?\s+WORDS$/i.test(option.title) && book && /^\d+(?:[–-]\d+)?$/.test(verse)) {
      const [first, last = first] = verse.split(/[–-]/).map(Number);
      const links = [];
      for (let number = first; number <= last; number++) {
        const label = 'View Original Language — Bible Hub Interlinear';
        const reference = first === last ? '' : ` (${passage[1]} ${passage[2]}:${number})`;
        links.push(`<p><a href="https://biblehub.com/interlinear/${book}/${passage[2]}-${number}.htm" target="_blank" rel="noopener noreferrer">${label}${reference}</a></p>`);
      }
      const reference = /<(h[345]|p)\b[^>]*>(?:Passage: )?Habakkuk \d+:\d+(?:[^<]|<br>)*<\/\1>/i;
      content = reference.test(content)
        ? content.replace(reference, heading => heading + links.join(''))
        : `<p class="study-reference">${passage[1]} ${passage[2]}:${verse}</p>${links.join('')}${content}`;
    }
    panel.innerHTML = `<h3>${option.title}</h3>${content}`;
    panel.focus();
  };
  const showVerse = verse => {
    const study = verseStudies.find(item => item.verse === verse);
    document.querySelectorAll('.verse').forEach(button => button.setAttribute('aria-selected', String(button.dataset.verse === verse)));
    verseLabel.textContent = verse;
    tabs.replaceChildren();
    const options = (study?.options || []).filter(option => option.content && option.content.trim()).slice(0, 14);
    options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = option.title;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', String(index === 0));
      button.addEventListener('click', () => showOption(option, button, verse));
      tabs.append(button);
      if (index === 0) showOption(option, button, verse);
    });
  };
  document.querySelectorAll('.verse').forEach(button => button.addEventListener('click', () => showVerse(button.dataset.verse)));
  showVerse(document.querySelector('.verse[aria-selected="true"]')?.dataset.verse || verseStudies[0].verse);
}
