//inicializar correctamente el filtro por transaccion
import {crearTabla, obtenerIdSeleccionado} from "./tabla.js";
import Anuncio_Auto from "./anuncio.js";

let listaAnuncios = [];

//Dirección a pegar en el servidor
const URL_DATA="http://localhost:3000/anuncios/";

const txtTitulo = document.getElementById('txtTitulo');
const lstTransaccion = document.getElementById('lstTransaccion');
const txtDescripcion = document.getElementById('txtDescripcion');
const numPrecio = document.getElementById('numPrecio');
const numPuertas = document.getElementById('numPuertas');
const numKMs = document.getElementById('numKMs');
const numPotencia = document.getElementById('numPotencia');

const btnGuardar = document.getElementById('btnGuardar');
const btnModificar = document.getElementById('btnModificar');
const btnBorrar = document.getElementById('btnBorrar');
const btnRestablecer = document.getElementById('btnRestablecer');

const lstFiltroTr=document.getElementById('lstFiltroTr');
const txtPromedio=document.getElementById('txtPromedio');
const txtPrecioMax=document.getElementById('txtPrecioMax');
const txtPrecioMin=document.getElementById('txtPrecioMin');
const txtPromPot=document.getElementById('txtPromPot');

const divTablaDatos = document.getElementById('dTablaDatos');

const chkColTitulo = document.getElementById('chkColTitulo');
const chkColTransaccion = document.getElementById('chkColTransaccion');
const chkColDescripcion = document.getElementById('chkColDescripcion');
const chkColPrecio = document.getElementById('chkColPrecio');
const chkColPuertas = document.getElementById('chkColPuertas');
const chkColKMs = document.getElementById('chkColKMs');
const chkColPotencia = document.getElementById('chkColPotencia');

const LAPSO_ESPERA=1000;

window.addEventListener("DOMContentLoaded", inicializarManejadores);

function inicializarManejadores(){
    console.info("Inicializando sitio...");
    lstFiltroTr.value="Todos";
    getFetch();
}

btnGuardar.addEventListener('click', (e)=>{
    e.preventDefault();
    let auxAnuncioAuto=new Anuncio_Auto(
        0,
        txtTitulo.value,
        lstTransaccion.value,
        txtDescripcion.value,
        numPrecio.value,
        numPuertas.value,
        numKMs.value,
        numPotencia.value
    );
        
    postFetch(auxAnuncioAuto);
});

btnModificar.addEventListener('click', (e)=>{
    e.preventDefault();
    let IdSel = obtenerIdSeleccionado();

    let auxAnuncioAuto=new Anuncio_Auto(
        IdSel,
        txtTitulo.value,
        lstTransaccion.value,
        txtDescripcion.value,
        numPrecio.value,
        numPuertas.value,
        numKMs.value,
        numPotencia.value
    );
    putXhr(auxAnuncioAuto);
});

btnBorrar.addEventListener('click', (e)=>{
    e.preventDefault();
    let IdSel = obtenerIdSeleccionado();

    let auxAnuncioAuto=new Anuncio_Auto(
        IdSel,
        txtTitulo.value,
        lstTransaccion.value,
        txtDescripcion.value,
        numPrecio.value,
        numPuertas.value,
        numKMs.value,
        numPotencia.value
    );
    deleteFetch(auxAnuncioAuto);
});

lstFiltroTr.addEventListener('change', (e)=>{
    filtrarPorTransaccion(listaAnuncios,lstFiltroTr.value);
});

chkColTitulo.addEventListener('change',(e)=>{
    filtrarColumnas(chkColTitulo.checked,chkColTransaccion.checked,chkColDescripcion.checked,chkColPrecio.checked,chkColPuertas.checked,chkColKMs.checked,chkColPotencia.checked);
});

chkColTransaccion.addEventListener('change',(e)=>{
    filtrarColumnas(chkColTitulo.checked,chkColTransaccion.checked,chkColDescripcion.checked,chkColPrecio.checked,chkColPuertas.checked,chkColKMs.checked,chkColPotencia.checked);
});

chkColDescripcion.addEventListener('change',(e)=>{
    filtrarColumnas(chkColTitulo.checked,chkColTransaccion.checked,chkColDescripcion.checked,chkColPrecio.checked,chkColPuertas.checked,chkColKMs.checked,chkColPotencia.checked);
});

chkColPrecio.addEventListener('change',(e)=>{
    filtrarColumnas(chkColTitulo.checked,chkColTransaccion.checked,chkColDescripcion.checked,chkColPrecio.checked,chkColPuertas.checked,chkColKMs.checked,chkColPotencia.checked);
});

chkColPuertas.addEventListener('change',(e)=>{
    filtrarColumnas(chkColTitulo.checked,chkColTransaccion.checked,chkColDescripcion.checked,chkColPrecio.checked,chkColPuertas.checked,chkColKMs.checked,chkColPotencia.checked);
});

chkColKMs.addEventListener('change',(e)=>{
    filtrarColumnas(chkColTitulo.checked,chkColTransaccion.checked,chkColDescripcion.checked,chkColPrecio.checked,chkColPuertas.checked,chkColKMs.checked,chkColPotencia.checked);
});

chkColPotencia.addEventListener('change',(e)=>{
    filtrarColumnas(chkColTitulo.checked,chkColTransaccion.checked,chkColDescripcion.checked,chkColPrecio.checked,chkColPuertas.checked,chkColKMs.checked,chkColPotencia.checked);
});

//Elimina todos los datos mostrados y carga nuevamente los disponibles(refresca)
function mostrarDatos(arrayDatos){
    borrarDatos();

    divTablaDatos.appendChild(crearSpinner());

    setTimeout(()=>{
        divTablaDatos.removeChild(divTablaDatos.firstChild);
        if(arrayDatos.length>0){
            divTablaDatos.appendChild(crearTabla(arrayDatos));
            let columnas = JSON.parse(localStorage.getItem('configColsTabla')) || [true,true,true,true,true,true,true];
            filtrarColumnas(...columnas);
        }            
        else
            divTablaDatos.innerHTML = "<p>Sin datos para mostrar.</p>";

    }, LAPSO_ESPERA);
}

function borrarDatos(){
    while(divTablaDatos.hasChildNodes()){
        divTablaDatos.removeChild(divTablaDatos.firstChild);
    }
}

//Busca indice en array por su id
function buscarIndiceAnuncio(id){
    //Validar datos
    for(let i=0; i<listaAnuncios.length; i++){
        if(listaAnuncios[i].id == id)
            return i;
    }
    
    return -1;
}

function crearSpinner(){
    const spinner = document.createElement('img');
    spinner.setAttribute('src', './img/llanta-spinner.gif');
    return spinner;
}

//Filtros
function filtrarPorTransaccion(array,transaccion){
    let arrayFiltrado=null;
    
    switch(transaccion){
        case "Venta":
            arrayFiltrado=array.filter(compararTrVenta);
            break;
        case "Alquiler":
            arrayFiltrado=array.filter(compararTrAlquiler);
            break;
        case "Permuta":
            arrayFiltrado=array.filter(compararTrPermuta);
            break;
        case "Todos":
            arrayFiltrado=array;
            break;
        default:
            console.error("Error en filtrado por transacciones.");
            break;
    }

    mostrarDatos(arrayFiltrado);


    if(lstFiltroTr.value!="Todos")        
        txtPromedio.value=promedioPrecios(arrayFiltrado);
    else        
        txtPromedio.value="N/A";

    txtPrecioMax.value=buscarPrecioMaximo(arrayFiltrado);
    txtPrecioMin.value=buscarPrecioMinimo(arrayFiltrado);
    txtPromPot.value=calcularPotenciaPromedio(arrayFiltrado);
}

function compararTrVenta(anuncio){
    return anuncio.transaccion=="Venta";
}

function compararTrAlquiler(anuncio){
    return anuncio.transaccion=="Alquiler";
}

function compararTrPermuta(anuncio){
    return anuncio.transaccion=="Permuta";
}

function promedioPrecios(array){
    let arrayPrecios=array.map(e=>parseInt(e.precio));
    let promPrecios=arrayPrecios.reduce((previo,actual)=>{
        return previo+actual;
    },0);

    promPrecios/=arrayPrecios.length;

    return promPrecios;
}

function filtrarColumnas(titulo,transaccion,descripcion,precio,puertas,kilometraje,potencia){
    //Enviar LS
    let columnas=[titulo,transaccion,descripcion,precio,puertas,kilometraje,potencia];
    chkColTitulo.checked=titulo;
    chkColTransaccion.checked=transaccion;
    chkColDescripcion.checked=descripcion;
    chkColPrecio.checked=precio;
    chkColPuertas.checked=puertas;
    chkColKMs.checked=kilometraje;
    chkColPotencia.checked=potencia;

    localStorage.clear();
    localStorage.setItem('configColsTabla', JSON.stringify(columnas));

    let celdas=divTablaDatos.querySelectorAll('th,td');
    celdas.forEach(c => {
        if(c.dataset.campo=="titulo"){
            c.hidden=!titulo;
        }
        else if(c.dataset.campo=="transaccion"){
            c.hidden=!transaccion;
        }
        else if(c.dataset.campo=="descripcion"){
            c.hidden=!descripcion;
        }
        else if(c.dataset.campo=="precio"){
            c.hidden=!precio;
        }
        else if(c.dataset.campo=="puertas"){
            c.hidden=!puertas;
        }
        else if(c.dataset.campo=="kilometraje"){
            c.hidden=!kilometraje;
        }
        else if(c.dataset.campo=="potencia"){
            c.hidden=!potencia;
        }
    });
}

function getFetch(){
    fetch(URL_DATA)
        .then((res)=>{
            return res.ok? res.json():Promise.reject(res);
        })//Retorno de promesa Fetch
        .then((data)=>{
            console.info(data);
            listaAnuncios=data;
            filtrarPorTransaccion(listaAnuncios,lstFiltroTr.value);
        })//Retorno de promesa de res.json() y conversión de datos
        .catch((error)=>console.error(`Error: ${error.status}-${error.statusText}`))//Manejo de excepción
        .finally(()=>{
            console.log("Proceso terminado.");
        });//Avisamos final del proceso
}

function postFetch(anuncioAuto){
    const options={
        method: "POST",
        headers: {
            "Content-Type":"application/json;charset=utf-8"
        },
        body: JSON.stringify(anuncioAuto)
    };

    fetch(URL_DATA,options)
        .then((res)=>{
            return res.ok? res.json():Promise.reject(res);
        })//Retorno de promesa Fetch
        .then((data)=>{
            console.info(data);
            listaAnuncios.push=data;
            mostrarDatos(listaAnuncios);
        })//Retorno de promesa de res.json() y conversión de datos
        .catch((error)=>console.error(`Error: ${error.status}-${error.statusText}`))//Manejo de excepción
        .finally(()=>{
            console.log("Proceso terminado.");
        });//Avisamos final del proceso
}

function putXhr(anuncioAuto){
    //Instancia de objeto XHR
    const xhr=new XMLHttpRequest();

    //Manejador para peticiones
    xhr.onreadystatechange = ()=>{
        //Petición lista
        if(xhr.readyState==4){
            //Petición resuelta satisfactoriamente
            if(xhr.status>=200 && xhr.status<=299){
                data=JSON.parse(xhr.responseText);
                console.info(data);
                listaAnuncios[buscarIndiceAnuncio(anuncioAuto.id)]=data;
                mostrarDatos(listaAnuncios);
            }
            //Petición resuelta con error
            else{
                console.error(`Error:${xhr.status}-${xhr.statusText}`);
            }
        }
        //Petición en proceso
        else{
        }
    }

    //Abrir petición(método,URL,asíncrona-true por defecto y es opcional)
    xhr.open("PUT",`${URL_DATA}${anuncioAuto.id}`,true);
    
    //Setear encabezado
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    //Enviar petición con objeto(se envía por body)
    xhr.send(JSON.stringify(anuncioAuto));
}

function deleteFetch(anuncioAuto){
    const options={
        method: "DELETE"
    };

    fetch(`${URL_DATA}${anuncioAuto.id}`,options)
        .then((res)=>{
            return res.ok? res.json():Promise.reject(res);
        })//Retorno de promesa Fetch
        .then((data)=>{
            console.info(data);
            listaAnuncios=data;
            mostrarDatos(listaAnuncios);
        })//Retorno de promesa de res.json() y conversión de datos
        .catch((error)=>{
            console.error(`Error: ${error.status}-${error.statusText}`);
        })//Manejo de excepción
        .finally(()=>{
            console.log("Proceso terminado.");
        });//Avisamos final del proceso
}

function buscarPrecioMaximo(anuncios){
    let pMax=anuncios[0].precio;

    anuncios.map((e)=>{
        if(e.Precio>pMax)
            pMax=e.Precio;
    });

    console.info("Precio máximo: $" + pMax);
    return pMax;
}

function buscarPrecioMinimo(anuncios){
    let anunciosSelec=anuncios.filter((e)=>{
        return e.precio>0;
    });

    let pMin=0,primerValor=true;

    anunciosSelec.forEach((e)=>{
        if(primerValor){
            pMin=e.precio;
            primerValor=false;
        }
        else if(e.precio<pMin)
            pMin=e.precio;
        }
    );

    console.info("Precio mínimo: $" + pMin);
    return pMin;
}

function calcularPotenciaPromedio(anuncios){
    let listaPotencia=anuncios.map((e)=>e.potencia);

    let promPotencia=listaPotencia.reduce((prev,act)=>parseInt(prev)+parseInt(act),0);
    promPotencia/=listaPotencia.length;

    console.info("Promedio de potencia: " + promPotencia);

    return promPotencia;
}