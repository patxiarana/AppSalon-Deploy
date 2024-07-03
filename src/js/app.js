let paso = 1;
let pasoInicial = 1 ; 
let pasoFinal = 3 ; 

const cita = {
    id : '', 
    nombre : '',
    fecha : '',
    hora : '',
    servicios : [] ,
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion()// Muestra y oculta las secciones 
    tabs(); // Cambia la seccciones cuando se precionen los tabs 
    botonesPaginador() ; //Agrega o quita los botones del paginador 
    paginaSiguiente() ; 
    paginaAnterior() ;

    consultarApi(); //Consulta la Api en el backend de php
    idCliente(); 
    nombreCliente(); //Almacena el nombre del cliente en el objeto de cita 
    seleccionarFecha() ; //Almacena la fecha de la cita en el objeto  
    seleccionarHora() ; //Almacena la hora de la cita en el objeto 
    
    mostrarResumen() ; //Muestra el resumen de la cita 
}
function mostrarSeccion() {
//Ocultar la seccion que tenga la clase de mostrar 
const seccionAnterior = document.querySelector('.mostrar') ; 
if(seccionAnterior) {
seccionAnterior.classList.remove('mostrar')
}

    //Seleccionar la seccion con el paso..
    const seccion = document.querySelector(`#paso-${paso}`) 
    seccion.classList.add('mostrar')
   //quita la clase del tab actual al anterior 
   const tabAnterior = document.querySelector('.actual'); 
   if(tabAnterior) {
    tabAnterior.classList.remove('actual'); 
   }


    //Resalta el tab actual 
    const tab = document.querySelector(`[data-paso="${paso}"]`)
 tab.classList.add('actual')


}
function tabs() { 
    const botones = document.querySelectorAll('.tabs button') ;
  
    botones.forEach(function(boton) { 
    boton.addEventListener('click',function(e){
     paso = parseInt(e.target.dataset.paso)

     mostrarSeccion()
     botonesPaginador() ;
    }) ; 
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior') ;
    const paginaSiguiente = document.querySelector('#siguiente') ; 
    
    if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar'); 
    } else if (paso ===3) {
        paginaAnterior.classList.remove('ocultar'); 
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen() ;
    } else {
        paginaAnterior.classList.remove('ocultar'); 
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}    

function paginaAnterior() { 
const paginaAnterior = document.querySelector('#anterior')
paginaAnterior.addEventListener('click',function() {
 
 if(paso <= pasoInicial) return ; 
    paso-- ; 
 botonesPaginador(); 
}) 
}

function paginaSiguiente() { 
    const paginaSiguiente = document.querySelector('#siguiente')
    paginaSiguiente.addEventListener('click',function() {
     
     if(paso >= pasoFinal) return ; 
        paso++ ; 
     botonesPaginador(); 
    }) 
}


async function consultarApi() {
try {
    const url = '/api/servicios' ; 
    const resultado = await fetch(url) ; 
    const servicios = await resultado.json() ; 
    mostrarServicios(servicios) ; 
} catch (error) {
    console.log(error) ; 
}
}


function mostrarServicios(servicios) {
servicios.forEach( servicio => {
    const {id, nombre, precio } = servicio 

    const nombreServicio = document.createElement('P') ;
    nombreServicio.classList.add('nombre-servicio') ;
    nombreServicio.textContent = nombre ;
  
    const precioServicio = document.createElement('P') ;
    precioServicio.classList.add('precio-servicio') ;
    precioServicio.textContent = `$${precio}`;

    const servicioDiv = document.createElement('DIV') ;
    servicioDiv.classList.add('servicio') ;
    servicioDiv.dataset.idServicio = id ; 

     servicioDiv.appendChild(nombreServicio) ;
     servicioDiv.appendChild(precioServicio) ;
     servicioDiv.onclick = function () {
        seleccionarServicio(servicio); 
     }
    document.querySelector('#servicios').appendChild(servicioDiv) ;
})
}

function seleccionarServicio(servicio) {
    const {id} = servicio ;
    const {servicios} = cita ; 
    //Identificar el elemento al que se le da click
    const  divServicio = document.querySelector(`[data-id-servicio="${id}"]`)
  //Comprobar si un servicio ya fue agregado 
  if(servicios.some(agregado => agregado.id === id)) {
    //Eliminarlo 
    cita.servicios = servicios.filter(agregado => agregado.id!== id)
    divServicio.classList.remove('seleccionado');
  } else {
 //agregarlo 
 cita.servicios = [...servicios, servicio] ;
 divServicio.classList.add('seleccionado');
  }
    

}

function idCliente() { 
    const id = document.querySelector('#id').value ; 
    cita.id = id ;
}

function  nombreCliente() {
    const nombre = document.querySelector('#nombre').value ; 

    cita.nombre = nombre ; 
}

function seleccionarFecha() {
  const inputFecha = document.querySelector('#fecha')
  inputFecha.addEventListener('input', function(e) {
    console.log('seleccionaste una fecha');
   
    const dia = new Date(e.target.value).getUTCDay(); 

   if( [6,0].includes(dia)) {
    e.target.value = '' ; 
    mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
   } else {
    cita.fecha = e.target.value ;
   }

  } )
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){
     

        const horaCita = e.target.value
        const hora = horaCita.split(":")[0];
        console.log(hora)
       if(hora < 10 || hora > 20) {
        e.target.value = '' ;
       mostrarAlerta('Las horas disponibles son de 10 a 20', 'error', '.formulario');
       } else {
       cita.hora = e.target.value ; 
       console.log(cita); 
       }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    //Prieviene que se genere mas de una alerta 
   const alertaPrevia = document.querySelector('.alerta')
   if(alertaPrevia){
    alertaPrevia.remove() ;
   }

   //Scripting para crear la alerta 
   const alerta = document.createElement('DIV') ; 
   alerta.textContent = mensaje ;
   alerta.classList.add('alerta') ; 
   alerta.classList.add(tipo) ; 

   const referencia = document.querySelector(elemento) ;
   referencia.appendChild(alerta) ;

   //Eliminar la alerta 
   if(desaparece){
    setTimeout(function() {
        alerta.remove() ; 
       }, 3000) ;
   }

}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen') ;
   
    //Limpiar el contenido de Resumen 
while(resumen.firstChild) {
    resumen.removeChild(resumen.firstChild) ;
}


    if(Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('faltan datos de Servicios,Fecha u Hora','error', '.contenido-resumen', false)
   
        return ; 
    } 
    //Formatear el div de resumen 
    const {nombre,fecha,hora,servicios} = cita ; 
    
    //Heading para servicios en resumen 
    const headingServicios = document.createElement('H3') ; 
     headingServicios.textContent = 'Resumen de servicios' ;
     resumen.appendChild(headingServicios) ;


    //Iterando y mostrando los servicios 
    servicios.forEach(servicio => {
      const {id,precio,nombre} = servicio ; 
      const contenedorSerivcio = document.createElement('DIV') ; 
      contenedorSerivcio.classList.add('contenedor-servicio') ; 

      const textoServicio = document.createElement('P') ; 
      textoServicio.textContent = nombre ; 

      const precioServicio = document.createElement('P') ; 
      precioServicio.innerHTML = `<span>Precio:</span>$${precio}`

      contenedorSerivcio.appendChild(textoServicio) ;
      
      contenedorSerivcio.appendChild(precioServicio) ;

      resumen.appendChild(contenedorSerivcio) ;
    })
    const headingCita = document.createElement('H3') ; 
    headingCita.textContent = 'Resumen de Cita' ;
    resumen.appendChild(headingCita) ;
    const nombreCliente = document.createElement('P') ; 
    nombreCliente.innerHTML = `<span>Nombre:</span>${nombre}` ; 

    //Formatear la fecha en español 
    const fechaObj = new Date(fecha) ; 
    const mes = fechaObj.getMonth() ;
    const dia = fechaObj.getDate() + 2 ;
    const year = fechaObj.getFullYear() ;
    
    const fechaUTC = new Date(Date.UTC(year,mes,dia)) ; 

    const opciones = {weekday: 'long', year:'numeric', month:'long', day:'numeric'}
    const fechaFormateada = fechaUTC.toLocaleDateString('es-AR', opciones)
    const fechaCita= document.createElement('P') ; 
    fechaCita.innerHTML = `<span>Fecha:</span>${fechaFormateada}` ; 

    const horaCita= document.createElement('P') ; 
    horaCita.innerHTML = `<span>Hora:</span>${hora} Horas` ; 

    resumen.appendChild(nombreCliente) ; 
    resumen.appendChild(fechaCita) ;  
    resumen.appendChild(horaCita) ;  
    

    
    //Boton para crear una cita 
    const botonReservar = document.createElement('BUTTON') ; 
    botonReservar.classList.add('boton') ;
    botonReservar.textContent = 'Reservar Cita' ;
    botonReservar.onclick = reservarCita ;
    resumen.appendChild(botonReservar) ;
}


async function reservarCita() { 
    const {nombre, fecha, hora, servicios, id } = cita ; 
    const idServicio = servicios.map(servicio => servicio.id) ; 

   const datos = new FormData() ;
   datos.append('fecha', fecha) ;
   datos.append('hora', hora) ;
   datos.append('usuarioId', id) ;
   datos.append('servicios', idServicio) ;
  // console.log([...datos]); 


  try {
       //Peticion hacia la api 
   const url = `/api/citas` ; 

   const respuesta = await fetch(url, {
    method: 'POST', 
    body: datos ,
   }) ;
 const resultado = await respuesta.json() ; 
 console.log(resultado.resultado) ;
 if(resultado.resultado) {
    Swal.fire({
        icon: "success",
        title: "Cita Creada",
        text: "Tu cita fue creada correctamente",
        button: 'OK', 
      }).then(()=> {
        window.location.reload() ;
      });
 }
  } catch (error) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al guardar la cita",
      });
  }
  

//console.log([...datos]); 

}