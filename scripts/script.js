const toggleButton = document.getElementById('toggle-button')
const sidebar = document.getElementById('sidebar')


document.addEventListener('click', function() {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.classList.add('hide');
  });
});


function toggleSidebar(){
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')
}


function addOnClickFunction() {
  const appCards = document.querySelectorAll('.shortcut');
  const optionsButton = document.querySelectorAll('.options-btn');
  const dropdownMenu = document.querySelectorAll('.dropdown-menu');

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

  optionsButton.forEach(option => {
    option.addEventListener('click', function(event) {
      event.stopPropagation();
      const dropdownMenu = this.nextElementSibling;
      const isCurrentlyHidden = dropdownMenu.classList.contains('hide');

      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.add('hide');
      });

      if (isCurrentlyHidden) {
        dropdownMenu.classList.remove('hide');
      }
    });
  });

  dropdownMenu.forEach(menu => {
    menu.addEventListener('click', function(event) {
      event.stopPropagation();
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
          <button class="options-btn">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
          </button>

          <div class="dropdown-menu hide">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>

          <div class="shortcut-display">
            <img src="${shortcut.icon}" alt="${shortcut.name}">
            <h3>${shortcut.name}</h3>
          </div>
          <div class="shortcut-information">
            // <p>${shortcut.description}</p>
          </div>
        `;
      } else {
        shortcutCard.id = shortcut.domain;
        shortcutCard.innerHTML = `
          <button class="options-btn">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
          </button>

          <div class="dropdown-menu hide">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
          
          <div class="shortcut-display">
            <img src="https://www.google.com/s2/favicons?domain=${shortcut.domain}&sz=128" alt="${shortcut.name}">
            <h3>${shortcut.name}</h3>
          </div>
          <div class="shortcut-information">
            // <p>${shortcut.description}</p>
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
newWebShortcutForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const shortcutForm = new FormData(newWebShortcutForm);
  
  const shortcutInfo = {}

  shortcutInfo["name"] = shortcutForm.get('name');
  shortcutInfo["domain"] = shortcutForm.get('domain');
  shortcutInfo["description"] = shortcutForm.get('description');
  shortcutInfo["type"] = "website";

  window.indexBridge.createShortcut(shortcutInfo);

  toggleModal();
  newWebShortcutForm.reset();
  location.reload();

})

const newAppShortcutForm = document.getElementById('new-app-shortcut');
newAppShortcutForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const shortcutForm = new FormData(newAppShortcutForm);

  const shortcutInfo = {}

  shortcutInfo["name"] = shortcutForm.get('name');
  shortcutInfo["description"] = shortcutForm.get('description');
  shortcutInfo["type"] = "app";

  const newShortcut = await window.indexBridge.createAppShortcut(shortcutInfo);
  if (newShortcut){
    toggleModal();
    newAppShortcutForm.reset();
    location.reload();
  }
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