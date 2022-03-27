let userList = document.querySelector("#userList");
let form = document.querySelector("#addUser");

function renderUser(doc) {
  let li = document.createElement("li"); // create li tag collect in li variable
  let name = document.createElement("span");
  let city = document.createElement("span");
  let del = document.createElement("div"); // delete button
  del.className = "del";

  li.setAttribute("data-id", doc.id); // user id -> data-id
  name.textContent = doc.data().name; // access data from doc
  city.textContent = doc.data().city;

  del.textContent = "x";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(del);

  userList.appendChild(li);

  // delete data
  del.addEventListener("click", (e) => {
    let id = e.target.parentElement.getAttribute("data-id"); // get id (li) from parent
    db.collection("users").doc(id).delete();
  });
}

// db.collection('users').where('city', '==', 'Bangkok').get().then(user => {
//     user.docs.forEach(doc => {
//         console.log(doc.data())
//         renderUser(doc) // render user function
//     })
// });

form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent refresh page
  db.collection("users").add({
    name: form.name.value,
    city: form.city.value,
  });

  form.name.value = "";
  form.city.value = "";
});

/** edit data (from console.log)
 * db.collection('users').doc('3dUicFkbxSz7x2MRtACw').update({city: 'Newyork'})
 */

// real-time database
db.collection("users")
  .orderBy("name")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges(); // detect data changes at document?
    changes.forEach((change) => {
    //   console.log("CHANGE : ", change);
      if (change.type == "added") {
        renderUser(change.doc);
      } else if (change.type == "removed") {
        let li = userList.querySelector(`[data-id=${change.doc.id}]`);
        console.log(li);
        userList.removeChild(li);
      }
    });
  });
