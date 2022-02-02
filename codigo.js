// Decreto mis variables globales que voy a necesitar para el funcionamiento de mi página
let carritoDeCompras = []
let stockProductos =[]


const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');

const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');
const finalizarCompra = document.getElementById('finalizarCompra')

//jQuery para acceder a mi base de datos Local

$.getJSON('juegos.json', function(datos){
    datos.forEach(elemento => stockProductos.push(elemento))

    mostrarProductos(stockProductos)
})

//Creo mi funcion del LocalStorage que me permite ir guardando los datos o información de mi página para que no se pierda

function productoEnStorage(){
    let productoEnStorage = JSON.parse(localStorage.getItem('carrito'))
    console.log(productoEnStorage)

    if(productoEnStorage){
        productoEnStorage.forEach(elemento =>{
            mostraCarrito(elemento)
            carritoDeCompras.push(elemento)
            actualizarCarrito()
        })
    }
}

//Exhibo mis productos en el html, de forma dinámica y a cada producto con su boton para poder sumarlo a mi carrito


function mostrarProductos(array){
    contenedorProductos.innerHTML = ''

    array.forEach(productos => {
        let div = document.createElement('div')
        div.classList.add('producto')
        div.innerHTML += `
            <div class="card">
                <div class="card-image">
                    <img src=${productos.img}>
                    <span class="card-title">${productos.nombre}</span>
                    <a id="boton${productos.id}" style="position: absolute;right: 24px;bottom: -40px;" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add_shopping_cart</i></a>
                </div>
                <div class="card-content">
                    <p>${productos.formato}</p>                 
                    <p>$${productos.precio}</p>
                </div>
            </div>
        `
        contenedorProductos.appendChild(div)

        let botonAgregar = document.getElementById(`boton${productos.id}`)

        botonAgregar.addEventListener('click', ()=>{
            agregarAlCarrito(productos.id)
            

            Toastify({
                text: "Producto Agregado",
                className: "info",
                style: {
                  background: "green",
                }
              }).showToast();
        })

    });
}

//Genero la función para poder agregar mis productos al carrito, para poder ir recopilando


function agregarAlCarrito(id) {
    let verificar = carritoDeCompras.find(elemento => elemento.id == id)
    
    if(verificar){
        verificar.cantidad = verificar.cantidad + 1
        document.getElementById(`cantidad${verificar.id}`).innerHTML = `<p id="cantidad${verificar.id}">Cantidad:${verificar.cantidad}</p>`
        actualizarCarrito()
    }else{
        let productoAgregar = stockProductos.find(producto => producto.id == id)

        carritoDeCompras.push(productoAgregar)
        
        mostraCarrito(productoAgregar)
        actualizarCarrito() 


    }
    localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
}

// Genero mi función para poder mostrar mis elementos en mi carrito, y su dinamismo

function mostraCarrito(productoAgregar){
    let div = document.createElement('div')
    div.classList.add('productoEnCarrito')
    div.innerHTML = `
                    <p>${productoAgregar.nombre}</p>
                    <p>Precio:$${productoAgregar.precio}</p>
                    <p id="cantidad${productoAgregar.id}">Cantidad:${productoAgregar.cantidad}</p>
                    <button class="boton-eliminar" id='eliminar${productoAgregar.id}'><i class="fas fa-trash-alt"></i></button>
    `
    contenedorCarrito.appendChild(div)

    let btnEliminar = document.getElementById(`eliminar${productoAgregar.id}`)

    btnEliminar.addEventListener('click', ()=>{
        if(productoAgregar.cantidad == 1){
            btnEliminar.parentElement.remove()
            carritoDeCompras = carritoDeCompras.filter(elemento => elemento.id != productoAgregar.id)
            actualizarCarrito()
            Toastify({
                text: "Producto Eliminado",
                className: "info",
                style: {
                background: "blue",
                }
            }).showToast();
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
        }else{
            productoAgregar.cantidad= productoAgregar.cantidad - 1
            document.getElementById(`cantidad${productoAgregar.id}`).innerHTML = `<p id="cantidad${productoAgregar.id}">Cantidad:${productoAgregar.cantidad}</p>`
            actualizarCarrito()
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
        }
        
    })
}


productoEnStorage()

// Defino la funcion que me va permitir actualizar el carrito en base a la cantidad de productos que me solicitan

function  actualizarCarrito (){
   contadorCarrito.innerText = carritoDeCompras.reduce((acumulador, elemento)=> acumulador + elemento.cantidad, 0)
   precioTotal.innerText = carritoDeCompras.reduce((acumulador, elemento)=> acumulador + (elemento.precio * elemento.cantidad), 0 )
}


// Finalizo la compra de mi cliente con el respectivo boton. Hecho con Jquery dado que me resultava mas sencillo y habia que emplear los metodos

$('#finalizarCompra').on('click',()=>{
    $.post("https://jsonplaceholder.typicode.com/posts",JSON.stringify(carritoDeCompras), function (data, estado) {
        console.log(data,estado);
        if(estado){
            $('#carrito-contenedor').empty()
            swal("Gracias por su compra!", "Los productos seran enviados en la brevedad", "success")

            carritoDeCompras= []
            localStorage.clear()
            actualizarCarrito()
        }

      } )
})