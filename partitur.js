document.documentElement.classList.add('has-js');

const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];

function activateTab(tab, focus = false, updateHash = false) {
  tabs.forEach((item) => {
    const isActive = item === tab;
    item.setAttribute('aria-selected', String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isActive = panel.id === tab.getAttribute('aria-controls');
    panel.classList.toggle('is-active', isActive);
    panel.hidden = !isActive;
  });

  if (focus) tab.focus();
  if (updateHash) history.replaceState(null, '', `#${tab.dataset.view}`);
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab, false, true));
  tab.addEventListener('keydown', (event) => {
    const nextIndex = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowDown: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      ArrowUp: (index - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];

    if (nextIndex === undefined) return;
    event.preventDefault();
    activateTab(tabs[nextIndex], true, true);
  });
});

const requestedTab = tabs.find((tab) => tab.dataset.view === location.hash.slice(1));
activateTab(requestedTab || tabs[0]);

window.addEventListener('hashchange', () => {
  const tab = tabs.find((item) => item.dataset.view === location.hash.slice(1));
  if (tab) activateTab(tab);
});
