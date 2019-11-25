console.log('Pop-up is loading!');

var activeTab;
var parentId;
var beacons;

var titleInput = document.getElementById('title');
var urlInput = document.getElementById('url');
var iconInput = document.getElementById('icon');
var parentInput = document.getElementById('parent-id');

var allFolders = document.getElementById('all-folders');
var selectedFolder;
var recentFolders = document.getElementById('recent-folders');
var iconElement = document.getElementById('icon');
var parentElement = document.getElementById('parent-id');

function main() {
  setBookmarkInfos();
  setRecentLocations();
}

// Retrieve the current tab infos from the browser
function setBookmarkInfos() {
  browser.tabs
    .query({active: true, currentWindow: true})
    .then(function(tabs) {
      activeTab = tabs[0];
      fillBookmarkInfos();
    });
}

// Fill form fields with tab infos
function fillBookmarkInfos() {
  titleInput.value = activeTab.title;
  titleInput.select();

  urlInput.value = activeTab.url;
  iconInput.value = activeTab.favIconUrl;
}

function setRecentLocations() {
  const url = 'http://localhost:5001/lastbookmarkslocations';
  fetch(url)
    .then(function(response) {
      response.json().then(function(boxes) {
        console.log("boxes:", boxes);
        fillRecentLocations(boxes);
      });
    });
}

function fillRecentLocations(locations) {
  recentFolders.innerHTML = '';

  const otherLocation = document.createElement('option');
  otherLocation.value = 'other';
  otherLocation.innerHTML = 'Autres...';
  recentFolders.append(otherLocation);

  for (let location of locations) {
    const option = document.createElement('option');
    option.value = location.id;
    option.innerHTML = location.name;
    recentFolders.append(option);
  }

  if (recentFolders.options[recentFolders.selectedIndex].value != null) {
    recentFolders.selectedIndex = 1;
    parentId = recentFolders.options[recentFolders.selectedIndex].value;
    parentInput.value = parentId;
  }

  recentFolders.onchange = function() {
    if (this.options[this.selectedIndex].value !== 'other') {
      parentId = this.options[this.selectedIndex].value;
      parentInput.value = parentId;
      console.log("recentFolders: new parentId:", parentId);
      allFolders.style.display = 'none';
    } else {
      if (beacons == null) {
        setBeacons();
      }
      allFolders.style.display = 'block';
      // const selected = allFolders.getElementByClass('selected');
      // if (selected.length > 0) {
      //   selectedLocation = {
      //     element: selected[0],
      //     data = selected[0]
      //   };
      // }
    }
  };
}

// Retrieve available bookmarks locations from the server, then display them
// in the 'allFolders' node.
function setBeacons() {
  const url = 'http://localhost:5001/beacons?until=box';
  fetch(url)
    .then(function(response) {
      response.json().then(function(res) {
        beacons = res;
        console.log("beacons:", beacons);
        for(let slide of beacons) {
          addOption(allFolders, slide);
        };
      });
    });
}

// Rafraîchir la liste des bookmarks à chaque fois que l'on ouvre
// le pop-up. Le pop-up doit fermer lorsqu'on change d'onglet.
// Mise à jour : conserver la date de dernière mise à jour
// envoyée par le serveur, et qui correspond à la date de la
// dernière modification effectuée sur la base de données.

function addBookmark() {
  console.group("Adding bookmark");

  const url = new URL('http://localhost:5001/bookmarks');
  const params = {
    name: titleInput.value,
    url: urlInput.value,
    icon: activeTab.favIconUrl,
    parent_id: parentId
  };
  console.log("params:", params);
  // url.search = new URLSearchParams(params).toString();
  console.log("url:", url);
  console.groupEnd();

  fetch(url, { method: 'POST', body: JSON.stringify(params) })
    .then(function(response) {
      window.close();
      console.log("Done!");
      console.log("response:", response);
    })
    .catch(error => console.error(error));
}

function addOption(parent, data) {
  let container = document.createElement('div');

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
      parentId = data.id;
      parentInput.value = parentId;
      console.log("allFolders: new parentId:", parentId);
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

// window.addEventListener('unload', function() {
//   console.log("unload!");
//   if (parentId != null) {
//     addBookmark();
//   }
// });

document.getElementById('form').addEventListener('submit', function(form) {
  var formData = new FormData(this);
  event.preventDefault();
  console.log("Submitting!");
  console.log("this:", this);
  console.log("formData:", formData);

  console.log('titleInput.value:', titleInput.value);
  console.log('urlInput.value:', urlInput.value);
  console.log('iconInput.value:', iconInput.value);
  console.log('parentInput.value:', parentInput.value);
  this.submit(function(event) {
    // event.preventDefault();
  });
  setTimeout(function() {
    browser.browserAction.setIcon({
      path: { 32: "../icons/icon-added.png" },
      tabId: activeTab.id
    });
    console.log("Submitted!");
    window.close();
  }, 10);
  // addBookmark();
});

// document.getElementById('add-bookmark-btn').addEventListener('click', function() {
//   console.log("send()");

//   const url = 'http://localhost:5001/bookmarks';
//   const params = {
//     name: titleInput.value,
//     url: urlInput.value,
//     icon: iconInput.value,
//     parent_id: parentInput.value
//   };
//   // console.log("params:", params);
//   // url.search = new URLSearchParams(params).toString();
//   // console.log("url:", url);
//   // console.groupEnd();

//   fetch(url, {
//       method: 'POST',
//       body: JSON.stringify(params),
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//     })
//     .then(function(response) {
//       console.log("Done!");
//       console.log("response:", response);
//       window.close();
//     })
//     .catch(error => console.error(error));
// });

main();
