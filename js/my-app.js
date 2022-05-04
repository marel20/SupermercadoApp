  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [

   
      {path: '/index/', url: 'index.html',},
      {path: '/busqueda/', url: 'pages/busqueda.html',},
      {path: '/categorias/', url: 'pages/categorias.html',},
      {path: '/cuenta/', url: 'pages/cuenta.html',},
      {path: '/resumen/', url: 'pages/resumen.html',},
      {path: '/iniciar/', url: 'pages/iniciar.html',},
      {path: '/sucursales/', url: 'pages/sucursales.html',},
      {path: '/contacto/', url: 'pages/contacto.html',},
      {path: '/registro/', url: 'pages/registro.html',} ,
      {path: '/mispedidos/', url: 'pages/mispedidos.html',} ,
      {path: '/categoria/:id/', url: 'pages/categoria.html',},
     
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

var db = firebase.firestore();
var colCategorias = db.collection("categorias");
var colProductos = db.collection("productos");
var colUsuarios = db.collection("usuarios");
//var colCañada = db.collection('Suc Cañada');
//var colCorrea = db.collection('Suc Correa');

var email = "";
var password = "";
var n="";
var p="";

var descr = '#descripcion';
var cant = '#cantidad';
var precUnit = '#precUnit';
var totalArt = '#totalArt';
var totalPesos = '#totalPesos';

var envio = '#envio';
var pago = '#pago';


var Rdescr = '#Rdescripcion';
var Rcant = '#Rcantidad';
var RprecUnit = '#RprecUnit';
var RtotalArt = '#RtotalArt';
var RtotalPesos = '#RtotalPesos';

var envioR = '#envioR';
var pagoR = '#pagoR';

var getData = function () {
  var name = $$('#nomAp').val();
  var email = $$('#mailCons').val();
  var celu = $$('#tel').val();
  var mensaje = $$('#consulta').val();

  if (name == "") {
      $$('#nomAp').focus();
  } else {
        if (email == "") {
          $$('#mailCons').focus();
      } else {
        if (celu == "") {
          $$('#tel').focus();
      } else {
        if (mensaje == "") {
          $$('#consulta').focus();
        } else{
        console.log(name);
        console.log(email);
        console.log(celu);
        console.log(mensaje);
      }
        name = "";
        email = "";
        celu = "";
        mensaje = "";
      }
      }
  }
  mainView.router.navigate('/index/');


}


// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    //console.log(e);
   $$('#agregar1').on('click', fnAgregaProducto);
   $$('#agregar2').on('click', fnAgregaProducto);



})

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  crearCategorias();
  $$('#confirmar').on('click', fnConfirmarPedido);
  $$('#registro').on('click', fnNuevoUsuario);
  $$('#confirmar').on('click', fnultimoPedido());


})


// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="busqueda"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);

  
  $$('#search').on('click', fnbusqueda);
  crearBusqueda();

})


$$(document).on('page:init', '.page[data-name="categoria"]', function (e, page) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);
  //console.log('Pag. Categoria con id: ' + page.route.params.id );
  idCategoria = "" + page.route.params.id;
  

  listaProductos = '';

  colProductos.where("codCategoria", "==", idCategoria)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());

            n=doc.data().nombre;
            p=doc.data().precio;

            listaProductos += `<div class="col-50"><h4>`+doc.data().nombre+`</h4> <br>`;
            listaProductos += `<img src=`+doc.data().imagen+`>`;
            listaProductos += `<h3> $`+doc.data().precio+`</h3> <br>`;
            listaProductos += `
            <div class="block-strong visible">
            <button class="boton col button button-fill" id="agregar1">Agregar a carrito</button>
            </div></div>
          </div>`;
        });
        //$$('#nombreCategoria').html(cat);
        $$('#listaProductos').append(listaProductos); 
        $$('#agregar1').on('click', fnAgregaProducto);

    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
   
  

})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="categorias"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);

grupoActual = "";
inicio = 0;

txtMostrar = '';
  
  colCategorias.orderBy("grupo")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            if (grupoActual != doc.data().grupo ) {
              txtMostrar += `
                  <li class="accordion-item"><a class="item-content item-link" href="#">
                  <div class="item-inner">
                    <div class="item-title">`+doc.data().grupo+`</div>
                  </div>
                </a>
                <div class="accordion-item-content">
                  <div class="block categorias">
                      <a href="/categoria/`+doc.id+`/">`+doc.data().categoria+`</a>  <br>
              `;
              grupoActual = doc.data().grupo;

            } else {
              txtMostrar += `<a href="/categoria/`+doc.id+`/">`+doc.data().categoria+`</a>  <br>`
            }

             



            console.log(doc.id, " => ", doc.data().grupo , " / " , doc.data().categoria);

        });

        txtMostrar += `</div>
        </div>
        </li>`;

        $$('#listaCategorias').append(txtMostrar);

    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });





})
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="cuenta"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);
  fnSacaBoton();
  $$('#cerrar').on('click', fnCerrarSesion);

})
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="resumen"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
 // console.log(e);
  $$('#volver').on('click', fnVolverInicio);
  //console.log('estoy por llenar el resumen')
  $$('#volver').on('click', fnultimoPedido());
  fnLlenarResumen();

})
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);
  $$('#registro').on('click', fnNuevoUsuario)
})
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="sucursales"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);

})
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="mispedidos"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  //console.log(e);
  //console.log('ultimo pedido');
  $$('#confirmar').on('click', fnultimoPedido());
})
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="iniciar"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  $$('#inSes').on('click', fnIngresoUsuario);

})





/*Mis Funciones*/

function crearCategorias() {
  
  console.log("creando categorias");
  dameUnID = "1";   datos = { categoria: "Comestibles", grupo: "Almacen" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "2";   datos = { categoria: "Infusiones", grupo: "Almacen" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "3";   datos = { categoria: "Conservas", grupo: "Almacen" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "4";   datos = { categoria: "Enlatados", grupo: "Almacen" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "5";   datos = { categoria: "Envasados", grupo: "Almacen" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "6";   datos = { categoria: "Aderezos", grupo: "Almacen" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "7";   datos = { categoria: "Galletas", grupo: "Almacen" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "8";   datos = { categoria: "Golosinas", grupo: "Almacen" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "9";   datos = { categoria: "Aperitivos", grupo: "Bebidas" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "10";   datos = { categoria: "Gaseosas", grupo: "Bebidas" };
  colCategorias.doc(dameUnID).set(datos);
  
  dameUnID = "11";   datos = { categoria: "Jugos", grupo: "Bebidas" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "12";   datos = { categoria: "Licores", grupo: "Bebidas" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "13";   datos = { categoria: "Champagnes", grupo: "Bebidas" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "14";   datos = { categoria: "Vinos de Mesa", grupo: "Bebidas" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "15";   datos = { categoria: "Whisky", grupo: "Bebidas" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "16";   datos = { categoria: "Sidras", grupo: "Bebidas" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "17";   datos = { categoria: "Energizantes", grupo: "Bebidas" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "18";   datos = { categoria: "Cervezas", grupo: "Bebidas" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "19";   datos = { categoria: "Aguas Saborizadas", grupo: "Bebidas" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "20";   datos = { categoria: "Aguas Minerales", grupo: "Bebidas" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "21";   datos = { categoria: "Carnicería", grupo: "Alimentos Frescos" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "22";   datos = { categoria: "Verdulería", grupo: "Alimentos Frescos" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "23";   datos = { categoria: "Fiambrería", grupo: "Alimentos Frescos" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "24";   datos = { categoria: "Panadería", grupo: "Alimentos Frescos" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "25";   datos = { categoria: "Lacteos", grupo: "Alimentos Frescos" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "26";   datos = { categoria: "Pastas", grupo: "Alimentos Frescos" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "27";   datos = { categoria: "Congelados", grupo: "Alimentos Frescos" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "28";   datos = { categoria: "Perfumeria", grupo: "Perfumería y Limpieza" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "29";   datos = { categoria: "Limpieza", grupo: "Perfumería y Limpieza" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "30";   datos = { categoria: "Alimentos", grupo: "Mascotas" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "31";   datos = { categoria: "Hogar", grupo: "Bazar" };
  colCategorias.doc(dameUnID).set(datos);

  dameUnID = "32";   datos = { categoria: "Fiestas", grupo: "Otras Categorías" };
  colCategorias.doc(dameUnID).set(datos);


console.log("creando productos");

dameUnID = "1001";   datos = { nombre: "Fideos Coditos knorr", precio: 57.80, imagen: 'img/ofertas/oferta1.jpg',
 enOferta: 0, destado: 1, codCategoria: "1" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1041";   datos = { nombre: "Fideos Mostachol knorr", precio: 57.80, imagen: 'img/ofertas/oferta1.jpg',
 enOferta: 0, destado: 0, codCategoria: "1" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1002";   datos = { nombre: "Te La Virginia x25 unid.", precio: 25, imagen: 'img/ofertas/oferta1.jpg',
 enOferta: 0, destado: 1, codCategoria: "2" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1003";   datos = { nombre: "Atun Lomito Al Natural Bahía", precio: 90, imagen: 'img/ofertas/oferta1.jpg',
 enOferta: 0, destado: 1, codCategoria: "3" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1004";   datos = { nombre: "Tomate Perita Noel", precio: 63, imagen: 'img/ofertas/oferta1.jpg',
 enOferta: 0, destado: 1, codCategoria: "4" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1005";   datos = { nombre: "Aceitunas Vanoli dp x300", precio: 38, imagen: 'img/ofertas/oferta1.jpg',
 enOferta: 0, destado: 1, codCategoria: "5" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1006";   datos = { nombre: "Savora Original x250", precio: 65, imagen: 'img/ofertas/oferta1.jpg',
 enOferta: 0, destado: 1, codCategoria: "6" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1007";   datos = { nombre: "Vainillas Lara x300", precio: 70, imagen: 'img/ofertas/oferta1.jpg',
 enOferta: 0, destado: 1, codCategoria: "7" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1008";   datos = { nombre: "Gomas Fantasia Misky x 1Kg", precio: 130, imagen: 'img/ofertas/oferta1.jpg',
 enOferta: 0, destado: 1, codCategoria: "8" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1009";   datos = { nombre: "Fernet Branca x 1 Lt.", precio: 949, imagen: 'img/ofertas/oferta1.jpg',
 enOferta: 0, destado: 1, codCategoria: "9" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1010";   datos = { nombre: "Manaos de Uva - 2.25", precio: 99, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 1, destado: 0, codCategoria: "10" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1011";   datos = { nombre: "Jugo en Polvo Tang Naranja", precio: 33, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 1, destado: 1, codCategoria: "11" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1012";   datos = { nombre: "Licor Tia Maria Cream", precio: 850, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "12" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1013";   datos = { nombre: "Champagne Baron B", precio: 2500, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 1, destado: 1, codCategoria: "13" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1014";   datos = { nombre: "Vino Rutini Cabernet-Malbec", precio: 1050, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "14" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1015";   datos = { nombre: "Whisky Jack Daniel´s", precio: 4500, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "15" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1016";   datos = { nombre: "Sidra Real", precio: 250, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "16" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1017";   datos = { nombre: "Red Bull x250", precio: 110, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "17" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1018";   datos = { nombre: "Patagonia Amber Lager x473cc", precio: 180, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "18" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1019";   datos = { nombre: "Baggio Fresh Pera", precio: 84, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "19" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1020";   datos = { nombre: "Agua Villavicencio 2 lts", precio: 80, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "20" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1021";   datos = { nombre: "Asado Costilla x500 grs", precio: 425, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "21" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1022";   datos = { nombre: "Cebolla x 1kg", precio: 100, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "22" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1023";   datos = { nombre: "Queso Barra x 150 grs", precio: 100, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "23" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1024";   datos = { nombre: "Pan x 150grs", precio: 25, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "24" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1025";   datos = { nombre: "Leche La Serenisima Entera x 1 Lt", precio: 115, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "25" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1026";   datos = { nombre: "Ravioles HDT x500 grs", precio: 350, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "26" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1027";   datos = { nombre: "Hamburguesa Super Paty", precio: 100, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "27" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1028";   datos = { nombre: "Papel Higienico Felpita x30 mts", precio: 60, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "28" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1029";   datos = { nombre: "Limpiador Poett x900 cc Lavanda", precio: 89, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "29" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1030";   datos = { nombre: "Dog Chow x21 kg", precio: 1500, imagen: '/img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "30" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1031";   datos = { nombre: "Termo Lumilagro", precio: 900, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "31" };
colProductos.doc(dameUnID).set(datos);

dameUnID = "1032";   datos = { nombre: "Pan Dulce Fantoche con chips", precio: 150, imagen: 'img/ofertas/oferta1.jpg',
  enOferta: 0, destado: 1, codCategoria: "32" };
colProductos.doc(dameUnID).set(datos);



  /*
  colCategorias.doc(dameUnID).set(datos)
  .then(function() {     // .then((docRef) => {
    console.log("OK!");
  })
  .catch(function(error) {     // .catch((error) => {
    console.log("Error: " + error);
  });
  */
}

var micarrito = [];
var miUltimoCarrito = [];
function fnAgregaProducto() {

   // console.log('Entramos en la funcion');
 
  producto = n;
  precio = p;
  cantidad = 1;
  micarrito.push({nombre:producto, precio:precio, cantidad:1})
  console.log(producto);
  console.log(precio);

  
  $$(descr).append(producto + "<br><br>");
  $$(cant).append(cantidad + "<br><br>");
  $$(precUnit).append('$' + precio + "<br><br>");


  canTotal = parseInt($$(totalArt).text());
  canTotal+= (cantidad);
  $$(totalArt).html(canTotal);
  //console.log(canTotal);

  pesosTotal = parseInt($$(totalPesos).text());
  pesosTotal+= parseInt((cantidad * precio));
  $$(totalPesos).html(pesosTotal);
  //console.log(pesosTotal);
}

function fnNuevoUsuario() {

     email = $$('#mail').val();
     password = $$('#passw').val();
     nombre = $$('#nombre').val();
     apellido = $$('#apellido').val();
     cel = $$('#telefono').val();
     fecha = $$('#fecnac').val();
     direccion = $$('#direccion').val();
  
  
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Usuario creado. Agregar datos a la base de datos
          
          var datosUsuario = {
              nombre: nombre,
              apellido: apellido,
              telefono: cel,
              nacimiento: fecha,
              direccion: direccion,
              tipoUsuario: "Usuario"
          }
  
          colUsuarios.doc(email).set(datosUsuario)
              .then(function() {     // .then((docRef) => {
                //console.log("Usuario Registrado!");
              mainView.router.navigate('/iniciar/');

              })
              .catch(function(error) {     // .catch((error) => {
                console.log("Error: " + error);
              });
  
        })
        .catch((error) => {   // error en AUTH
          var errorCode = error.code;
          var errorMessage = error.message;
  
          console.error(errorCode);
          console.error(errorMessage);
  
          if (errorCode == "auth/email-already-in-use") {
              //console.error("el mail ya esta usado");
              alert("El mail ya esta en uso");
          }
  
          // ..
        });
  
  
  
}
  
var logueado = 0;
function fnIngresoUsuario() {

  email=$$("#mailLog").val();
  password=$$("#passwLog").val();
  //console.log(email);
  //console.log(password);
  
  firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // traer los datos de la base de datos de ESTE usuario en particular
            logueado = 1;
            docRef = colUsuarios.doc(email);

            docRef
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        console.log("Document data:", doc.data());
                        nombre = doc.data().nombre;
                        apellido = doc.data().apellido;
                        direccion = doc.data().direccion;
                        tipoUsuario = doc.data().tipoUsuario;

                      

                        console.log("Bienvenid@!! " + email);
                        mainView.router.navigate("/cuenta/");

                                      
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("Debes registrarte para iniciar sesión");
                    }
                })
                .catch((error) => {
                    console.log("Error getting document:", error);
                });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.error(errorCode);
            console.error(errorMessage);
            $$("#msgErrorLogin").html("Usuario o contraseña incorrecta. <br> Si no estas registrado, debes registrarte para iniciar sesión");
            //mainView.router.navigate('/registro/');

        });
}

function fnSacaBoton() {
  //console.log('Saque boton');
  if (logueado == 1) { 
    $$('#visualizar').removeClass('oculto').addClass('visible');
    $$('#ocultar').removeClass('visible').addClass('oculto');
} else {
  $$('#visualizar').removeClass('visible').addClass('oculto');
  $$('#ocultar').removeClass('oculto').addClass('visible');
  }
}

function fnCerrarSesion() {
  console.log('Cerramos sesion');
  firebase.auth().signOut().then(()  => {
    logueado = 0;
    //console.log('Cerramos definitivamente');
    //fnborrarPedido();
    mainView.router.navigate('/index/');
  })
  .catch((error) => {
    console.log('error' + error);
  });

}
/*
var pedidoTotal ="";
function fnborrarPedido(){
  $$('.borrar').html("");
  $$('#miPedido').html("");
  $$('#totalPedido').html(0);
  $$('#pesosPedido').html(0);
  console.log("borrar");
  pedidoTotal = `<div class="carrito">
  <div><h4 id="Rdescripcion"></h4></div>
  <div><h4 id="Rcantidad"></h4></div>
  <div><h4 id="RprecUnit"></h4></div></div>`
}
*/
function fnLlenarResumen() {
  console.log(micarrito);
  var totalDeMiCarrito = 0;
  var totalDeArticulos = 0;
  var retiroMercaderia = "";
  var formaDePago = "";
  micarrito.map(function(producto){
    totalDeMiCarrito += parseInt(producto.precio);
    totalDeArticulos += producto.cantidad;
    retiroMercaderia = $$('#envio').val();
    formaDePago = $$('#pago').val();
    var productoParaAgregar=`<div class="carrito">
    <div><h4 id="Rdescripcion">${producto.nombre}</h4></div>
    <div><h4 id="Rcantidad">${producto.cantidad}</h4></div>
    <div><h4 id="RprecUnit">$ ${producto.precio}</h4></div></div>`

    //algo como: id. append
    $$('#resumenPedido').append(productoParaAgregar);
    $$('#RtotalArt').html(parseInt(totalDeArticulos));
    $$('#RtotalPesos').html(parseInt(totalDeMiCarrito));
    $$('#envioR').html(retiroMercaderia);
    $$('#pagoR').html(formaDePago);
  })
  emailSucursal();
}

function fnultimoPedido() {
  console.log(miUltimoCarrito);
  var totalPedido = 0;
  var pesosPedido = 0;
  var envioPedido = "";
  var pagoPedido = "";
  
  miUltimoCarrito.map(function(producto){
    totalPedido += producto.cantidad;
    pesosPedido += parseInt(producto.precio);
    envioPedido = $$('#envio').val();
    pagoPedido = $$('#pago').val();
    var pedidoTotal = `<div class="carrito">
    <div><h4 id="Rdescripcion">${producto.nombre}</h4></div>
    <div><h4 id="Rcantidad">${producto.cantidad}</h4></div>
    <div><h4 id="RprecUnit">$ ${producto.precio}</h4></div></div>`

    $$('#miPedido').append(pedidoTotal);
  })
  $$('#totalPedido').html(totalPedido);
  $$('#pesosPedido').html(parseInt(pesosPedido));
  $$('miEnvio').html(envioPedido);
  $$('miPago').html(pagoPedido);
}

function fnConfirmarPedido() {
  //console.log('Entramos a la funcion')
 // mainView.router.navigate('/resumen/');

  if (logueado == 0) {
    mainView.router.navigate('/iniciar/');
  } else {
    mainView.router.navigate('/resumen/');
  }


/*
  $$(Rdescr).append($$(descr).val());
  $$(Rcant).append($$(cant).val());
  $$(RprecUnit).append($$(precUnit).val());
  $$(RprecTotal).append($$(precTotal).val());
  $$(RtotalArt).html($$(totalArt).val());
  $$(RtotalPesos).html($$(RtotalPesos).val());
  $$(envioR).html($$(envio).html());
  $$(pagoR).html($$(pago).html());
  console.log(envio);
  console.log(pago);
*/
  

}

function fnVolverInicio() {
  $$('#foto').text("");
  $$('#Rfoto').text("");
  $$('#descripcion').text("");
  $$('#Rdescripcion').text("");
  $$('#cantidad').text("");
  $$('#Rcantidad').text("");
  $$('#precUnit').text("");
  $$('#RprecUnit').text("");
  $$('#precTotal').text("");
  $$('#RprecTotal').text("");
  $$('#totalArt').text(0);
  $$('#RtotalArt').text(0);
  $$('#totalPesos').text(0);
  $$('#RtotalPesos').text(0);
  $$('#envioR').text("");
  $$('#pagoR').text("");
  miUltimoCarrito = micarrito;
  micarrito = [];
  
  mainView.router.navigate('/index/');

}

function fnbusqueda(){
  //console.log("busqueda");
    colProductos
        .orderBy("nombre")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

              let n=doc.data().nombre;
              let p=doc.data().precio;
              
                var producto = `<li class="item-content">
                    <div class="item-inner">
                        <div class="item-title">${doc.data().nombre}<br><h4>$${doc.data().precio}</h4></div>
                        <div class="item-after">
                        <div class="block-strong visible">
                        <button class="botonn col button button-fill" id="${doc.data().nombre}" onclick="fnAgregarDesdeBusqueda('${n}','${p}')">
                        <img src="img/icons/carritocompras.png"></button>
                        </div></div>
                        </div>
                    </div>
                </li>`;
                $$("#select-productos").append(producto);
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function fnAgregarDesdeBusqueda(nombre, precio) {
  
  producto = nombre;
  precio = precio;
  cantidad = 1;
  micarrito.push({nombre:producto, precio:precio, cantidad:1})
  console.log(producto);
  console.log(precio);

  
  $$(descr).append(producto + "<br><br>");
  $$(cant).append(cantidad +  "<br><br>");
  $$(precUnit).append('$' + precio + "<br><br>");


  canTotal = parseInt($$(totalArt).text());
  canTotal+= (cantidad);
  $$(totalArt).html(canTotal);
  //console.log(canTotal);

  pesosTotal = parseInt($$(totalPesos).text());
  pesosTotal+= parseInt((cantidad * precio));
  $$(totalPesos).html(pesosTotal);
  //console.log(pesosTotal);
}

function crearBusqueda() {
  console.log('Cree mi barra');
  searchbar = app.searchbar.create({
    el: ".searchbar",
    searchContainer: ".list",
    searchIn: ".item-title",
    on: {
  search(sb, query, previousQuery) {
      console.log(query, previousQuery);
  },
},
});
}

function emailSucursal() {
  console.log('Seleccione email');
  var sucursal = $$('#suc').val();
  var sucCorrea = $$('#corr').val();

  if (sucursal == sucCorrea) {
    //console.log('Mail sucursal Correa');
    
    
  } else {
    console.log('Mail sucursal Cañada');    
  }
}


/*
function fnEnviarConsulta() {
  mensaje = $$('#consulta').val();

  colMensajes.doc(mensaje).set({
})
.then(() => {
    console.log("Se envió la consulta");
})
.catch((error) => {
    console.error("Error writing document: ", error);
});
}*/
