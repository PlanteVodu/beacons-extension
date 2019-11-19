console.log('Pop-up is loading!')

var bookmarkInfos = null;

let beacons = [
  {
    title: 'Général',
    content: [
      {
        title: 'Général',
        content: [
          {
            title: 'Général',
            content: [
              {
                title: 'Favoris'
              },
              {
                title: 'Actualité'
              }
            ]
          },
          {
            title: 'LMD',
            content: [
              {
                title: 'A lire'
              },
              {
                title: 'Lu'
              }
            ]
          }
        ]
      },
      {
        title: 'Divers',
        content: [
          {
            title: 'Aides'
          },
          {
            title: 'Documents'
          }
        ]
      },
      {
        title: 'Divertissement',
        content: [
          {
            title: 'Jeux'
          }
        ]
      }
    ]
  },
  {
    title: 'Développement',
    content: [
      {
        title: 'Actualité',
        content: []
      }
    ]
  },
  {
    title: 'Cuisine',
    content: [
      {
        title: 'Sites de recettes',
        content: []
      }
    ]
  },
  {
    title: 'Divers',
    content: [
      {
        title: 'Agriculture',
        content: []
      }
    ]
  },
  {
    title: 'Divertissement',
    content: [
      {
        title: 'Animés',
        content: []
      }
    ]
  }
];

const el = document.getElementById('location_all_folder');

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

// function getActiveTab() {

// }


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

let selected = null;

function addBookmarkToBox(boxId) {
  console.log("Adding bookmark");
  console.log("boxId:", boxId);
  console.log("bookmarkInfos:", bookmarkInfos);

  let url = new URL('http://localhost:5000/addbm?');
  let params = {
    url: bookmarkInfos.url,
    title: bookmarkInfos.title,
    boxId: boxId
  }

  url.search = new URLSearchParams(params).toString();

  console.log("===== URL:", url);

  fetch(url)
    .then(function(response) {
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
      let lastOptions = document.getElementsByClassName('last-option');
      for (let element of lastOptions) {
        element.classList.remove('selected');
      }
      opt.classList.add('selected');
      selected = data.id;
      addBookmarkToBox(data.id);
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
  let lastOptions = document.getElementsByClassName('selected');
  if (lastOptions.length == 0) return;

  const boxId = lastOptions[0].getAttribute('box-id');
  addBookmarkToBox(boxId);
});

browser.tabs.
  query({active: true, currentWindow: true})
  .then(function(tabs) {
    // console.log("tabs:", tabs);
    // console.log("tabs[0]:", tabs[0]);
    console.log("tabs[0].url:", tabs[0].url);
    console.log("tabs[0].url:", tabs[0].url);
    bookmarkInfos = {
      title: tabs[0].title,
      url: tabs[0].url,
    }
  });
