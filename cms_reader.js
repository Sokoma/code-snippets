const firebaseConfig = {
  apiKey: "api-key",
  authDomain: "domain",
  databaseURL: "url",
  projectId: "id",
  storageBucket: "storage",
  messagingSenderId: "senderId",
  appId: "appId",
  measurementId: "mId"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const templateStrings = {
  udalostiTS: '<div class="events-item {category}"><div class="event-name">{name}</div><div class="event-place">{date} - {place}</div></div>',
  clenoveTS: '<p>{seznamClenu}</p>',
  predsedaTS: '<p><b>předseda:</b> {predseda}<p>',
  mistopredsedaTS: '<p><b>místopředseda:</b> {mistopredseda}<p>',
};



function getDocs(collection, callback) {
  let docs = [];
  db.collection(collection).orderBy("created", "desc").get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      docs.push(doc);
    });
    callback(docs);
  })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
}

function createContent(collection, templateString, targetContainer) {
  getDocs(collection, function (docs) {
    docs.forEach(function (doc) {
      const currentDoc = doc.data();
      var result = templateString.replace(/\{([^}]*)\}/g, function ($0, $1) {
        return currentDoc[$1].value || $0; // If replacement found in object use that, else keep the string as it is
      });
      targetContainer.innerHTML += result;
    });
  });
}

window.addEventListener('load', function () {
  const dynamicContentElements = document.getElementsByClassName("dynamic-wrapper");
  for (let element of dynamicContentElements) {
    createContent(element.dataset.collection, templateStrings[element.dataset.template], element);
  }
});