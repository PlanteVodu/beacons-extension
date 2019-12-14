console.log('Pop-up is loading!');

var activeTab; // browser's active tab
var beacons; // beacons retrieved from the server

var parentId; // the value of this variable will be sent to the server

var titleInput = document.getElementById('title');
var urlInput = document.getElementById('url');
var iconInput = document.getElementById('icon');
var parentInput = document.getElementById('parent-id');


var recentFolders = document.getElementById('recent-folders');
var allFolders = document.getElementById('all-folders');
var selectedLocation; // the selected element inside the allFolders element

// Method called when the popup loads
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

// Retrieve recent locations from the server and add them as option
// into the form
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

  // Add the 'others' option
  const otherLocation = document.createElement('option');
  otherLocation.value = 'other';
  otherLocation.innerHTML = 'Autres...';
  recentFolders.append(otherLocation);

  // Add recent locations options
  for (let location of locations) {
    const option = document.createElement('option');
    option.value = location.id;
    option.innerHTML = location.name;
    recentFolders.append(option);
  }

  // Select the default option
  if (recentFolders.options[recentFolders.selectedIndex].value != null) {
    recentFolders.selectedIndex = 1;
    parentId = recentFolders.options[recentFolders.selectedIndex].value;
    parentInput.value = parentId;
  }

  recentFolders.onchange = function() {
    if (this.options[this.selectedIndex].value === 'other') {
      if (beacons == null) {
        setBeacons();
      }
      allFolders.style.display = 'block';
      if (selectedLocation) {
        // Set the previous selected location in allFolders as the new location
        parentInput.value = selectedLocation.getAttribute('box-id');
      }
    } else {
      parentInput.value = this.options[this.selectedIndex].value;
      console.log("recentFolders: new parent id:", parentInput.value);
      allFolders.style.display = 'none';
    }
  };
}

// Retrieve available bookmarks locations from the server, then display them
// in the 'allFolders' node.
function setBeacons() {
  fetch(url)
    .then(function(response) {
      response.json().then(function(res) {
        beacons = res;
        console.log("beacons:", beacons);
        for(let slide of beacons) {
          addOption(allFolders, slide);
        };
      });
  const url = 'http://localhost:5001/beacons?until=box&transform=true';
    });
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
      selectedLocation = opt;
      parentInput.value = data.id;
      console.log("allFolders: new parentInput.value:", parentInput.value);
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

// Submit form and close the pop-up
document.getElementById('form').addEventListener('submit', function(event) {
  event.preventDefault();
  console.group("Submitting!");
  console.log('titleInput.value:', titleInput.value);
  console.log('urlInput.value:', urlInput.value);
  console.log('iconInput.value:', iconInput.value);
  console.log('parentInput.value:', parentInput.value);

  this.submit();

  setTimeout(function() {
    browser.browserAction.setIcon({
      path: { 32: "../icons/icon-added.png" },
      tabId: activeTab.id
    });
    console.log("Submitted!");
    window.close();
  }, 10);
  console.groupEnd();
});

main();
