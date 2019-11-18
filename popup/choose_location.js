const beacons = [
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
    let slideOpt = document.createElement('div');
    slideOpt.classList.add('selector', 'slide-selector');
    slideOpt.addEventListener('click', function() {
      slideOpt.classList.toggle('opened');
    });

    let slideOptToggler = document.createElement('div');
    slideOptToggler.innerHTML = '❯';
    slideOptToggler.classList.add('folder-icon');

    let slideTitle = document.createElement('div');
    slideTitle.innerHTML = slide.title;
    slideTitle.classList.add('selector-title');

    slideOpt.appendChild(slideOptToggler);
    slideOpt.appendChild(slideTitle);

    el.appendChild(slideOpt);
  });
}

addSlides(beacons);
