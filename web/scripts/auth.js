// add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const adminEmail = document.querySelector('#admin-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result);
  });
});

auth.onAuthStateChanged(user => {
  if (user) {
    console.log('user logged in: ', user);
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      
      setupUI(user);
    });
    db.collection('cerradura').onSnapshot(snapshot => {
      //selectCerr(snapshot.docs);
    });
    db.collection('usuarios').doc(user.uid).onSnapshot(snapshot => {
      selectCerr(snapshot);
      setupCerr(snapshot);
    });
  } else {
    console.log('user logged out');
    setupUI();
    setupCerr();
    //selectCerr([]);
    selectCerr();
  }
})


//añadir cerradura
const cerrForm = document.querySelector('#cerr-form');
cerrForm.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('cerradura').add({
    nombre: cerrForm.nombre.value,
    cerrid: cerrForm.cerrid.value,
    admin: auth.currentUser.email
  })
  db.collection('usuarios').where('email', '==', auth.currentUser.email)
  .get()
  .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.update({
            cerraduras: firebase.firestore.FieldValue.arrayUnion(cerrForm.nombre.value),
            [cerrForm.nombre.value]: {
              datein: "0000-00-00",
              dateout: "0000-00-00",
              admin: true
            }
          }).then(() => {
          // close the create modal & reset form
          const modal = document.querySelector('#modal-cerr');
          M.Modal.getInstance(modal).close();
          cerrForm.reset();
        });
        console.log(doc.id, " => ", doc.data());
      });
    }).catch(err => {
    console.log(err.message);
  });
});


//añadir cerradura a usuario
const usuForm = document.querySelector('#usu-form');
usuForm.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('cerradura').where('nombre','==',usuForm.cerr.value)
  .get()
  .then(function(querySanpshot){
    querySanpshot.forEach(function(doc){
      doc.ref.update({
        usuarios: firebase.firestore.FieldValue.arrayUnion(usuForm.usuemail.value)
      });
    })
  })
  db.collection('usuarios').where('email', '==', usuForm.usuemail.value)
  .get()
  .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.update({
          cerraduras: firebase.firestore.FieldValue.arrayUnion(usuForm.cerr.value),
          [usuForm.cerr.value]: {
            admin: false,
            datein: usuForm.usudatein.value,
            dateout: usuForm.usudateout.value,
          }
          }).then(() => {
          // close the create modal & reset form
          const modal = document.querySelector('#modal-user');
          M.Modal.getInstance(modal).close();
          usuForm.reset();
          });
          console.log(doc.id, " => ", doc.data());
      });
    }).catch(err => {
      console.log(err.mesage);
  });
});



// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    //console.log('user signed out');
  })
  const modal = document.querySelector('#modal-user');
  M.Modal.getInstance(modal).close();
});



// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  }).catch(err => {
    alert(err.message);
  });;
});



// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('usuarios').doc(cred.user.uid).set({
      email: signupForm['signup-email'].value,
      cerraduras: [],
    });
  }).then(() => {

    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  }).catch(err => {
    alert(err.message);
  });
});


//mostrar usuarios
// const adminform = document.querySelector('#adminuser');
// const adminusers = document.querySelector('#tooltip');
// adminusers.addEventListener('mousehover', (e) => {
//   e.preventDefault();
  
// });