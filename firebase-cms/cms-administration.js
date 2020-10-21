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

const tabs = document.getElementById("tabs");
const tabsCollection = document.getElementsByClassName("tab");
const sectionsCollection = document.getElementsByClassName("admin-section");
const pageBody = document.body;

function checkIfAuthenticated() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      pageBody.classList.add("logged-in");
      endLoading();
    } else {
      endLoading();
    }
  });
}

function endLoading() {
  document.getElementById("lds").classList.add("page-loaded");
}

function removeClasses(classCollection, myClass) {
  for (let item of classCollection) {
    item.classList.remove(myClass);
  }
}

function getFormFieldsValues(UUID) {
  const targetForm = document.querySelector('form[data-uuid="' + UUID + '"]');
  const formElements = targetForm.children;
  let objectsArr = [];
  for (let i = 0; i < formElements.length; i++) {
    const currentElement = formElements[i];
    const currentPlaceholder = currentElement.placeholder ? currentElement.placeholder : "";
    const itemProperty = {
      name: currentElement.className,
      inputType: currentElement.tagName.toLowerCase(),
      value: currentElement.value,
      order: currentElement.dataset.order,
      placeholder: currentPlaceholder
    };
    objectsArr.push(itemProperty);
  }
  return objectsArr;
}

function createRecord(collection, UUID, update) {
  let currentCollection = collection;
  let properties = getFormFieldsValues(UUID);
  let obj = {};
  for (let i = 0; i < properties.length; i++) {
    let currentProperty = properties[i];
    obj[currentProperty.name] = { value: currentProperty.value, input: currentProperty.inputType, order: currentProperty.order, placeholder: currentProperty.placeholder }
  };
  if (!update) {
    let timeStamp = new Date();
    obj.created = timeStamp;
  }

  db.collection(currentCollection).doc(UUID).set(obj).then(function () {
    generateContent(currentCollection);
    clearFormFields(UUID);
    assignUUIDs();
  }).catch(function (error) {
    console.error("Error creating document: ", error);
  });
}

function deleteRecord(collection, UUID) {
  let currentCollection = collection;
  db.collection(currentCollection).doc(UUID).delete().then(function () {
    generateContent(currentCollection);
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });
}

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

const optionsLists = {
  categoryOptions: '<option value="opt1">Option1</option><option value="opt2">Option2</option>'
}

function createElement(doc, collection) {
  const formWrapper = document.createElement('div');
  const formElement = document.createElement('form');
  formElement.setAttribute("data-uuid", doc.id);
  formElement.classList.add("item-form");
  const submitBtnElement = document.createElement('button');
  submitBtnElement.innerHTML = 'Update';
  submitBtnElement.setAttribute("data-collection", collection);
  submitBtnElement.setAttribute("data-uuid", doc.id);
  submitBtnElement.classList.add("submit-btn"); // update later!
  const deleteBtnElement = document.createElement('button');
  deleteBtnElement.innerHTML = 'Delete';
  deleteBtnElement.setAttribute("data-collection", collection);
  deleteBtnElement.setAttribute("data-uuid", doc.id);
  deleteBtnElement.classList.add("delete-btn");
  const docData = doc.data();
  delete docData.created;
  Object.keys(docData).forEach(function (key, index) {
    const inputElement = document.createElement(docData[key].input);
    if (docData[key].input == 'textarea') {
      inputElement.innerHTML = docData[key].value;
    } else if (docData[key].input == 'select') {
      inputElement.innerHTML = optionsLists.categoryOptions;
      inputElement.setAttribute("value", docData[key].value);
      inputElement.value = docData[key].value;
    } else {
      inputElement.setAttribute("value", docData[key].value);
    }
    inputElement.classList.add(key);
    inputElement.placeholder = docData[key].placeholder;
    inputElement.dataset.order = docData[key].order;
    formElement.appendChild(inputElement);
  });
  formWrapper.appendChild(formElement);
  formWrapper.appendChild(submitBtnElement);
  formWrapper.appendChild(deleteBtnElement);
  document.getElementById("dynamic-" + collection).appendChild(formWrapper);
}

function generateContent(collection) {
  document.getElementById("dynamic-" + collection).innerHTML = "";
  const targetCollection = collection;
  getDocs(collection, function (docs) {
    docs.forEach(function (doc) {
      createElement(doc, targetCollection);
    });
  });

}

function clearFormFields(UUID) {
  const targetForm = document.querySelector('form[data-uuid="' + UUID + '"]');
  if (targetForm) {
    const formElements = targetForm.children;
    for (let i = 0; i < formElements.length; i++) {
      let currentElement = formElements[i];
      currentElement.value = "";
    };
  }
}

function generateUUID() {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

function login(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {
      pageBody.classList.add("logged-in");
    })
    .catch(function (error) {
      document.getElementById("login-box").classList.add("show-error");
      document.getElementById("error").innerHTML = error.message;
    });
}

function logout() {
  firebase.auth().signOut().then(function () {
    pageBody.classList.remove("logged-in");
  }, function (error) {
    console.error("Can't log out: ", error);
  });
}

function handleSubmitEvent(event) {
  event.preventDefault();
  const eventTargetUUID = event.target.dataset.uuid;
  const eventTargetCollection = event.target.dataset.collection;
  createRecord(eventTargetCollection, eventTargetUUID, false);
}

function handleUpdateEvent(event) {
  event.preventDefault();
  const eventTargetUUID = event.target.dataset.uuid;
  const eventTargetCollection = event.target.dataset.collection;
  createRecord(eventTargetCollection, eventTargetUUID, true);
}

function handleDeleteEvent(event) {
  event.preventDefault();
  const eventTargetUUID = event.target.dataset.uuid;
  const eventTargetCollection = event.target.dataset.collection;
  deleteRecord(eventTargetCollection, eventTargetUUID);
}

function handleLoginEvent(event) {
  event.preventDefault();
  const loginEmail = document.getElementById("email").value;
  const loginPassword = document.getElementById("password").value;
  login(loginEmail, loginPassword);
}

function handleLogoutEvent(event) {
  event.preventDefault();
  logout();
}

tabs.addEventListener("click", function (event) {
  if (event.target.classList.contains("tab")) {
    removeClasses(tabsCollection, "active");
    removeClasses(sectionsCollection, "active");
    event.target.classList.add("active");
    document.getElementById(event.target.dataset.section).classList.add("active");
    generateContent(event.target.dataset.collection);
  }
});

function assignUUIDs() {
  const newItemForms = document.getElementsByClassName("new-item-form");
  const newItemBtn = document.getElementsByClassName("new-item-btn");
  for (let i = 0; i < newItemForms.length; i++) {
    const uuid = generateUUID();
    newItemForms[i].dataset.uuid = uuid;
    newItemBtn[i].dataset.uuid = uuid;
  }
}


document.addEventListener("click", function (e) {
  if (e.target.classList.contains("submit-btn")) {
    handleSubmitEvent(e)
  } else if (e.target.classList.contains("update-btn")) {
    handleUpdateEvent(e)
  } else if (e.target.classList.contains("delete-btn")) {
    handleDeleteEvent(e)
  } else if (e.target.classList.contains("login-btn")) {
    handleLoginEvent(e)
  } else if (e.target.id == "logoutBtn") {
    handleLogoutEvent(e)
  } else if (e.target.id == "homepageBtn") {
    removeClasses(tabsCollection, "active");
    removeClasses(sectionsCollection, "active");
    document.getElementById("homepage").classList.add("active");
  }
});

window.addEventListener('load', function () {
  checkIfAuthenticated();
  assignUUIDs();
})
