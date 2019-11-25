var currentTab;
var bookmarkExists;

/*
 * Updates the browserAction icon to reflect whether the current page
 * is already bookmarked.
 */
function updateIcon() {
  browser.browserAction.setIcon({
    path: bookmarkExists ? {
      32: "icons/icon-added.png",
    } : {
      32: "icons/icon-absent.png",
    },
    tabId: currentTab.id
  });
  browser.browserAction.setTitle({
    // Screen readers can see the title
    title: bookmarkExists ?
      'Remove this page from Beacons.' :
      'Add this page to Beacons.',
    tabId: currentTab.id
  });
}

/*
 * Add or remove the bookmark on the current page.
 */
function toggleBookmark() {
  console.warn("TODO: toggleBookmark()");
}

browser.browserAction.onClicked.addListener(toggleBookmark);

/*
 * Switches currentTab and bookmarkExists to reflect the currently active tab
 */
function updateActiveTab(tabs) {

  function isSupportedProtocol(urlString) {
    var supportedProtocols = ["https:", "http:", "ftp:", "file:"];
    var url = document.createElement('a');
    url.href = urlString;
    return supportedProtocols.indexOf(url.protocol) != -1;
  }

  function searchBookmark() {
    const url = `http://localhost:5000/bmexists?url=${currentTab.url}`;
    fetch(url).then(function(response) {
      response.json().then(function(exists) {
        bookmarkExists = JSON.parse(exists);
        updateIcon();
      });
    });
  }

  function updateTab(tabs) {
    if (tabs[0]) {
      currentTab = tabs[0];
      if (isSupportedProtocol(currentTab.url)) {
        searchBookmark();
      } else {
        console.log(`Bookmark it! does not support the '${currentTab.url}' URL.`)
      }
    }
  }

  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then(updateTab);
}

// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);

// listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab);

// update when the extension loads initially
updateActiveTab();
