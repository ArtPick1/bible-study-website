document.querySelector('.menu-button')?.addEventListener('click', event => {
  const nav = document.querySelector('#main-nav');
  const open = nav.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});

const studyRoot = document.querySelector('[data-study-options]');
if (studyRoot) {
  const parsedStudyData = JSON.parse(document.querySelector('#study-data').textContent);
  const verseStudies = Array.isArray(parsedStudyData) ? parsedStudyData : [parsedStudyData];
  const tabs = studyRoot.querySelector('.option-tabs');
  const panel = studyRoot.querySelector('.option-content');
  const verseLabel = studyRoot.querySelector('[data-selected-verse]');
  const showOption = (option, button) => {
    tabs.querySelectorAll('button').forEach(item => item.setAttribute('aria-selected', String(item === button)));
    panel.innerHTML = `<h3>${option.title}</h3>${option.content}`;
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
      button.addEventListener('click', () => showOption(option, button));
      tabs.append(button);
      if (index === 0) showOption(option, button);
    });
  };
  document.querySelectorAll('.verse').forEach(button => button.addEventListener('click', () => showVerse(button.dataset.verse)));
  showVerse(document.querySelector('.verse[aria-selected="true"]')?.dataset.verse || verseStudies[0].verse);
}
