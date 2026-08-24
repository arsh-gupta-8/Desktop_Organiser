const toggleButton = document.getElementById('toggle-button')
const sidebar = document.getElementById('sidebar')

function toggleSidebar(){
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')
}

const appCards = document.querySelectorAll('.app-container');

appCards.forEach(card => {
  card.addEventListener('click', function() {
    const targetUrl = this.id; 
    
    if (targetUrl !== "AddShortcut"){
      window.indexBridge.openWebsite(targetUrl);
    }

  });
});

