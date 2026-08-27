const toggleButton = document.getElementById('toggle-button')
const sidebar = document.getElementById('sidebar')


function toggleSidebar(){
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')
}


function addOnClickFunction() {
  const appCards = document.querySelectorAll('.shortcut');

  appCards.forEach(card => {
    card.addEventListener('click', function() {
      const targetUrl = this.id; 
      
      if (targetUrl !== "AddShortcut"){
        window.indexBridge.openWebsite(targetUrl);
      }

    });
  });
}


async function loadShortcuts() {
  
  const shortcuts = await window.indexBridge.getShortcuts();
  console.log(shortcuts);

  if (shortcuts) {
    shortcuts.forEach(shortcut => {
      
      const main = document.getElementById('all-shortcuts');
      const shortcutCard = document.createElement('div');

      shortcutCard.className = 'container shortcut';
      shortcutCard.id = shortcut.domain;

      shortcutCard.innerHTML = `
        <div class="shortcut-display">
          <img src="https://www.google.com/s2/favicons?domain=${shortcut.domain}&sz=128" alt="${shortcut.name}">
          <h3>${shortcut.name}</h3>
        </div>
        <div class="shortcut-information">
          <p>${shortcut.description}</p>
        </div>
      `;

      main.appendChild(shortcutCard);

    });
  } else {
    console.log('No data found or failed to load.');
    return null
  }
}

loadShortcuts().then(addOnClickFunction);

const modal = document.querySelector('.modal-container');
function toggleModal() {
  modal.classList.toggle("hide");
}

const modalContent = document.querySelector('.modal');
modalContent.addEventListener('click', function(event) {
  event.stopPropagation(); 
});

const newWebShortcutForm = document.getElementById('new-website-shortcut');
newWebShortcutForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const shortcutForm = new FormData(newWebShortcutForm);
  
  const shortcutInfo = {}

  shortcutInfo["name"] = shortcutForm.get('name');
  shortcutInfo["domain"] = shortcutForm.get('domain');
  shortcutInfo["description"] = shortcutForm.get('description');
  shortcutInfo["type"] = "website";

  window.indexBridge.createShortcut(shortcutInfo);

})