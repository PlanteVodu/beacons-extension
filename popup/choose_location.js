console.log('Pop-up is loading!');

var activeTab;
var selectedLocation;
var el = document.getElementById('location_all_folder');

// Get the current tab infos
browser.tabs
  .query({active: true, currentWindow: true})
  .then(function(tabs) {
    activeTab = tabs[0];
    fillBookmarkInfos();
  });


function fillBookmarkInfos() {
  let titleInput = document.getElementById('title');
  let urlInput = document.getElementById('url');

  titleInput.value = activeTab.title;
  titleInput.select();

  urlInput.value = activeTab.url;
}


function getBeacons() {
  const url = 'http://localhost:5000/beacons2';
  fetch(url)
    .then(function(response) {
      response.json().then(function(beacons) {
        console.log("beacons:", beacons);
        addSlides(beacons);
      });
    });
}
getBeacons();

function addSlides(beacons) {
  for(let slide of beacons) {
    addOption(el, slide);
  };
}

// Rafraîchir la liste des bookmarks à chaque fois que l'on ouvre
// le pop-up. Le pop-up doit fermer lorsqu'on change d'onglet.
// Mise à jour : conserver la date de dernière mise à jour
// envoyée par le serveur, et qui correspond à la date de la
// dernière modification effectuée sur la base de données.

function addBookmark(selectedLocation) {
  console.log("Adding bookmark");
  console.log("selectedLocation:", selectedLocation);
  console.log("activeTab:", activeTab);
  console.log("activeTab.url:", activeTab.url);
  console.log("activeTab.title:", activeTab.title);

  let titleInput = document.getElementById('title');
  let urlInput = document.getElementById('url');

  let url = new URL('http://localhost:5000/addbm?');
  let params = {
    title: titleInput.value,
    url: urlInput.value,
    boxId: selectedLocation.data.id
  }

  url.search = new URLSearchParams(params).toString();

  console.log("===== URL:", url);

  fetch(url)
    .then(function(response) {
      console.log("Done!");
      console.log("response:", response);
    });
}

function addOption(parent, data) {
  let container = document.createElement('div');

  data.content = data.rows || data.columns || data.boxes;
  data.name = data.name || data.title;

  let opt = document.createElement('div');
  opt.classList.add('option');

  if (data.content) {
    opt.addEventListener('click', function(event) {
      event.stopPropagation();
      container.classList.toggle('opened');
      opt.classList.toggle('opened');
    });

    let optToggler = document.createElement('div');
    optToggler.innerHTML = '❯';
    optToggler.classList.add('folder-icon');
    opt.appendChild(optToggler);
  } else {
    opt.classList.add('last-option');
    opt.setAttribute('box-id', data.id);
    opt.addEventListener('click', function(event) {
      event.stopPropagation();
      if (selectedLocation) {
        selectedLocation.element.classList.remove('selected');
        selectedLocation = null;
      }
      opt.classList.add('selected');
      selectedLocation = {
        element: opt,
        data: data
      };
    });
  }

  let title = document.createElement('div');
  title.innerHTML = data.name;
  title.classList.add('option-title');

  opt.appendChild(title);
  container.appendChild(opt);

  if (data.content) {
    let folderContainer = document.createElement('div');
    folderContainer.classList.add('folder');
    for(let folder of data.content) {
      addOption(folderContainer, folder);
    };
    container.appendChild(folderContainer);
  }

  parent.appendChild(container);
}

window.addEventListener('unload', function() {
  console.log("unload!");
  if (selectedLocation) {
    addBookmark(selectedLocation);
  }
});
