const box = document.getElementById("links");
const status = document.getElementById("status");

const CHECK_ICON = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="m8.2 12.3 2.6 2.6 5-5.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function setStatus(message) {
  status.innerHTML = CHECK_ICON + "<span>" + message + "</span>";
}

function getLinks(text) {
  return [...new Set(
    text.split(/\r?\n/)
      .map(x => x.trim())
      .filter(x => /^(https?:\/\/|file:\/\/\/)/i.test(x))
  )];
}

document.getElementById("open").onclick = () => {
  const links = getLinks(box.value);
  links.forEach(url => chrome.tabs.create({ url, active: false }));
  setStatus(`Opened ${links.length} link(s)`);
};

document.getElementById("copy").onclick = async () => {
  const tabs = await chrome.tabs.query({});
  const links = [...new Set(
    tabs.map(t => t.url)
      .filter(u => u && /^(https?:\/\/|file:\/\/\/)/i.test(u))
  )];
  const output = links.join("\n");
  await navigator.clipboard.writeText(output);
  box.value = output;
  setStatus(`Copied ${links.length} link(s)`);
};
