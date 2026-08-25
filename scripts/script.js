const toggleButton = document.getElementById('toggle-button')
const sidebar = document.getElementById('sidebar')


function toggleSidebar(){
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')
}


function addOnClickFunction() {
  const appCards = document.querySelectorAll('.app-container');

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
      
      const main = document.getElementById('all-apps');
      const shortcutCard = document.createElement('div');

      shortcutCard.className = 'app-container';
      shortcutCard.id = shortcut.domain;

      shortcutCard.innerHTML = `
        <div class="app-display">
          <img src="https://www.google.com/s2/favicons?domain=${shortcut.domain}&sz=128" alt="${shortcut.name}">
          <h3>${shortcut.name}</h3>
        </div>
        <div class="app-information">
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

loadShortcuts();
addOnClickFunction();
