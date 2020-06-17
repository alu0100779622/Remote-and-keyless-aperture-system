
const cerraduras = document.querySelector('.cerraduras');
const dots = document.querySelector('.dots');
const nextprev = document.querySelector('.nextprev');
const elegircerradura = document.querySelector('.elegircerradura');
const loggedout = document.querySelectorAll('.logged-out');
const loggedin = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.user');
const adminItems = document.querySelectorAll('.admin');

var date = new Date();

const setupUI = (user) => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => item.style.display = 'block');
    }else{
      adminItems.forEach(item => item.style.display = 'none');
    }

  	// nombre de cuenta y borrado de cerraduras con fecha caducada
    db.collection('usuarios').doc(user.uid).get().then(doc => {
      const html = `
        <div ${user.admin ? 'class="violet"' : ''}>${user.email}</div>
      `;

      accountDetails.innerHTML = html;
      
      for(i=0; i<doc.data().cerraduras.length; i++){
        var cerr = doc.data().cerraduras[i];
        var datein = new Date(doc.get(cerr).datein);
        var dateout = new Date(doc.get(cerr).dateout);
        if(doc.get(cerr).admin == false){
          if(dateout<date){
            console.log(doc.data().cerraduras[i]);
            doc.ref.update({
              cerraduras: firebase.firestore.FieldValue.arrayRemove(doc.data().cerraduras[i]),
              [doc.data().cerraduras[i]]: firebase.firestore.FieldValue.delete()
            });
          }
        }
      }

    });


    // toggle user UI elements
    loggedin.forEach(item => item.style.display = 'block');
    loggedout.forEach(item => item.style.display = 'none');
  } else {
    // clear account info
    accountDetails.innerHTML = '';
    // toggle user elements
    adminItems.forEach(item => item.style.display = 'none');
    loggedin.forEach(item => item.style.display = 'none');
    loggedout.forEach(item => item.style.display = 'block');
  }
};



//mostrar cerraduras
const setupCerr = (user) => {

  let html = '';
  let html2 = '';
  let html3 = '';

  if(user){
    if(user.data().cerraduras){
      for(i=0; i<user.data().cerraduras.length; i++){
        
        var cerr = user.data().cerraduras[i];
        var datein = new Date(user.get(cerr).datein);
        var dateout = new Date(user.get(cerr).dateout);

        //console.log(user.get(cerr).datein, date);
        if(datein<date && dateout>date || user.get(cerr).admin == true){
          var li = `
            <div class="mySlides fade">
            <span href="#" class="deletebtn modal-trigger" data-target="delete-modal">&times;</span>
          `;
          if(user.get(cerr).admin == true){
            li += `
            <form id="adminuser">
            <span class="tooltip">
              <img  src="img/user1.png" class="filter" style="width: 20px; float: left; line-height: 20px;">
              <span class="tooltiptext">Tooltip text
              </span>
            </span>

            <div style=" text-align: center; font-weight: bold;font-size: 22px; color: white;">${user.data().cerraduras[i]} </div>

            <div style="text-align: center; color: grey;">propietario</div><br>

            <button style="float: left; width:48%" href="#"  class="button modal-trigger" data-target="modal-user">Añadir Usuario</button>

            <button style="float: right; width:48%" href="#"  class="button modal-trigger">Quitar Usuario</button>
            </form>
            `;
          }else{
            let datein = new Date(user.get(cerr).datein);
            let dateout = new Date(user.get(cerr).dateout);
            li += `
            <br>
            <div style=" text-align: center; font-weight: bold;font-size: 22px; color: white;">${user.data().cerraduras[i]} </div>

            <div style="text-align: center; color: grey;">usuario</div><br>
            <div style="text-align: center; color: white;">Desde el ${datein.getDate()}/${datein.getMonth()+1}/${datein.getFullYear()} <br>hasta el ${dateout.getDate()}/${dateout.getMonth()+1}/${dateout.getFullYear()}</div><br>
            `;
          }
          li += `
          <form action="http://192.168.0.99/?rele=ON" method="post" target="ifrm1">
          <button class="abrir">Abrir</button>
          </form>
          </div>
          `;
          var dot = `<span class="dot" onclick="currentSlide(${i+1})"></span>  `;
          
        }else if(datein>date && user.get(cerr).admin != true){
          var li = `
          <div class="mySlides fade">

          <span href="#" class="deletebtn modal-trigger" data-target="delete-modal">&times;</span>

          <br><div style="margin-left: 15px; text-align: center; font-weight: bold;font-size: 22px; color: white;">${user.data().cerraduras[i]}</div>
          <div style="text-align: center; color: grey;">usuario</div><br>

          <div style="text-align: center; color: white;">Desde el ${datein.getDate()}/${datein.getMonth()+1}/${datein.getFullYear()} <br>hasta el ${dateout.getDate()}/${dateout.getMonth()+1}/${dateout.getFullYear()}</div><br>

          <button class="cerrar">No tienes acceso</button>

          </div>
          `;
          var dot = `<span class="dot" onclick="currentSlide(${i+1})"></span>  `;
        }
        html += li;
        html2 += dot;
      };
      if(user.data().cerraduras.length>1){
        html3 += `
          <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
          <a class="next" onclick="plusSlides(1)">&#10095;</a>
        `;
      }else if(user.data().cerraduras.length == 0){
        html += `
          <div style="text-align: center; color: white;">No tienes cerraduras</div>
        `;
      }
    }
    cerraduras.innerHTML = html;
    dots.innerHTML = html2;
    nextprev.innerHTML = html3;
    plusSlides(0)
  }
};

//elegir cerradura
const selectCerr = (cerr) => {

  let html = '';
  if(cerr){
    if(cerr.data().cerraduras){
      for(i=0; i<cerr.data().cerraduras.length; i++){
        if(cerr.get(cerr.data().cerraduras[i]).admin){
          const li = `
            <option value="${cerr.data().cerraduras[i]}">${cerr.data().cerraduras[i]}</option>
          `;
          html += li;
        }
      }
      elegircerradura.innerHTML = html
    }
  }
};


//mostrar usuarios
const showUsu = (cerr) => {

  let html = '';
  if(cerr){
    if(cerr.data().cerraduras){
      for(i=0; i<cerr.data().cerraduras.length; i++){
        if(cerr.get(cerr.data().cerraduras[i]).admin){
          const li = `
            <option value="${cerr.data().cerraduras[i]}">${cerr.data().cerraduras[i]}</option>
          `;
          html += li;
        }
      }
      elegircerradura.innerHTML = html
    }
  }
};

//MODAL
document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  var instance = M.Modal.init(modals);
});


//SLIDES
var slideIndex = 1;
function plusSlides(n) {
  showSlides(slideIndex += n);
}
function currentSlide(n) {
  showSlides(slideIndex = n);
}
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}