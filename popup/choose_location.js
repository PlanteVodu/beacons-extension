const beacons = [
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

function addSlides(beacons) {
  beacons.forEach(slide => {
    addOption(el, slide);
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
  }

  let title = document.createElement('div');
  title.innerHTML = data.title;
  title.classList.add('option-title');

  opt.appendChild(title);
  container.appendChild(opt);

  if (data.content) {
    let subContainer = document.createElement('div');
    subContainer.classList.add('sub-container');

    data.content.forEach(sub => {
      console.log("sub:", sub);
      addOption(subContainer, sub);
    });

    container.appendChild(subContainer);
  }

  parent.appendChild(container);
}

addSlides(beacons);
