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
      const targetDestination = this.id;
      const classes = this.classList;

      if (targetDestination !== "AddShortcut"){
        if (classes.contains('this-is-an-app')) { 
          window.indexBridge.openApp(targetDestination);
        } else {
          window.indexBridge.openWebsite(targetDestination);
        }
      }

    });
  });
}

async function loadShortcuts() {
  
  const addShortcut = document.getElementById('AddShortcut')
  const shortcuts = await window.indexBridge.getShortcuts();
  const main = document.getElementById('all-shortcuts');

  if (shortcuts) {
    shortcuts.forEach(shortcut => {

      const shortcutCard = document.createElement('div');

      shortcutCard.className = 'container shortcut';
      

      let addID = null;
      if (shortcut.type === "app") {
        shortcutCard.id = shortcut.path;
        shortcutCard.className = shortcutCard.className + " this-is-an-app";
        shortcutCard.innerHTML = `
          <div class="shortcut-display">
          <img src="${shortcut.icon}" alt="${shortcut.name}">
            <h3>${shortcut.name}</h3>
          </div>
          <div class="shortcut-information">
            <p>${shortcut.description}</p>
          </div>
        `;
      } else {
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
      }
      

      main.insertBefore(shortcutCard, addShortcut);

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

const newAppShortcutForm = document.getElementById('new-app-shortcut');
newAppShortcutForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const shortcutForm = new FormData(newAppShortcutForm);

  const shortcutInfo = {}

  shortcutInfo["name"] = shortcutForm.get('name');
  shortcutInfo["description"] = shortcutForm.get('description');
  shortcutInfo["type"] = "app";

  window.indexBridge.createAppShortcut(shortcutInfo);

})

const appModal = document.querySelector('.app-modal');
const websiteModal = document.querySelector('.website-modal');
const modalSwitch = document.getElementsByClassName('modal-switch');

Array.from(modalSwitch).forEach(function(button) {
  button.addEventListener('click', function(event) {
    appModal.classList.toggle('hide');
    websiteModal.classList.toggle('hide');
  });
});

websiteModal.classList.remove('hide');
appModal.classList.add('hide');