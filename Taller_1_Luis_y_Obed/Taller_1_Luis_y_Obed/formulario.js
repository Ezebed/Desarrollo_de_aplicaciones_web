let objectjson;

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("#form");

    // leer archivo json
    document.getElementById('archivoJson').addEventListener('change', leerJson);

    document.getElementById('personaBtn').addEventListener('click', cargarPersonaFormulario);
    
    form.addEventListener("submit", ActualizarJsonObject);

    document.getElementById('generarArchivoJson').addEventListener('click', generarFicheroJson);

    document.getElementById('cedula').addEventListener('keyup', comprobarCedula);
}, false)

function comprobarCedula() {
    // obtenemos el elmento que contiene la cedula
    let cedulaInput = document.getElementById('cedula');

    let i = 0;
    let cedulaRepetida = false;
    // recorremos cada elemento del objeto json y comparamos con la cedula ingresada
    while( !cedulaRepetida && i < objectjson.length ) {
        
        if( cedulaInput.value == objectjson[i]['cedula'] ) {
            // si se consigue una cedula repetida se coloca la bandera a verdadero
            cedulaRepetida = true;
        }

        i++;
    }

    // si la cedula esta repetida colocamos las clase error al input 
    // y desbilitamos el boton de submit
    if(cedulaRepetida) {
        cedulaInput.classList.remove('good');
        cedulaInput.classList.add('error');

        document.getElementById('formSubmit').setAttribute('disabled', '');
    }else {
        // si la cedula no esta repetida removemos la clase error y colocamos la clase good
        // y se habilita el boton submit
        cedulaInput.classList.remove('error');
        cedulaInput.classList.add('good');

        document.getElementById('formSubmit').removeAttribute('disabled');

        // despues de 2.5 se removemos la clase good
        setTimeout(() => {
            cedulaInput.classList.remove('good');
        }, 2500 );
    }
}

function generarFicheroJson() {

    // creamos un objeto blob para generar el fichero
    let blob = new Blob([JSON.stringify(objectjson)], {type: "text/plain;charset=utf-8"});

    // genereamos la descarga del fichero
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob)
    a.download = "jsonSalida.json";
    a.click();

    URL.revokeObjectURL(blob);
}

function cargarPersonaFormulario (event) {
    let personaIndex = document.getElementById('personas').value;

    // comprobamos que la persona este en la lista de personas
    if(personaIndex == "") {
        return
    }

    let persona = objectjson[parseInt(personaIndex)];

    // cargamos los datos de la persona en el formulario
    document.getElementById('name').value = persona['nombre'];
    document.getElementById('lastName').value = persona['apellido'];
    document.getElementById('cedula').value = persona['cedula'];
    document.getElementById('age').value = persona['edad'];
    document.getElementById('genre').value = persona['genero'];
    document.getElementById('departament').value = persona['departamento'];
    document.getElementById('civilState').value = persona['estadoCivil'];
    document.getElementById('adress').value = persona['direccion'];
    document.getElementById('workPosition').value = persona['cargo'];
    document.getElementById('email').value = persona['email'][0];
    document.getElementById('email_2').value = persona['email'][1];
    document.getElementById('phoneNumber').value = persona['numeroTelefono'][0];
    document.getElementById('phoneNumber_2').value = persona['numeroTelefono'][1];

    document.getElementById('indexPersona').innerText = personaIndex;

}

function leerJson(event) {
    // se obtiene el archivo json del DOM
    let archivo = event.target.files[0];

    // comprobando que el archivo existe
    if(archivo) {
        // se llama al objeto file reader para procesar el archivo
        let lector = new FileReader();

        lector.onload = function(e) {
            // se cargar en una variable el contenido del archivo
            var contenido = e.target.result;

            // se convierte el contenido del archivo a un objeto json
            objectjson = JSON.parse(contenido);

            cargarListaPersonas();
        };
        // se lee el archivo
        lector.readAsText(archivo);
    }else{
       alert('error al cargar archivo .json')
    }
}

function cargarListaPersonas() {
    
    // recorremos el objeto json y lo colocamos en la lista de personas
    objectjson.forEach((persona, index) => {
        cargarPersona(persona, index);
    });
}

function cargarPersona(persona, index) {
    // obtenemos el conteedor de la lista de personas
    let selectTag = document.getElementById('personas');
    
    // creamos un elemeto de opcion para la lista
    let optionTag = document.createElement('option');

    // colocamos como value y id el indice de la persona en el objeto json
    optionTag.value = index;

    optionTag.id = "persona_"+index;

    // colocamos la informacion de la persona que se va a visualizar
    optionTag.innerText = persona['cedula'] + ' - ' + persona['nombre'];

    // insertamos la persona en el html
    selectTag.appendChild(optionTag);
}

function ActualizarJsonObject(event) {

    event.preventDefault();

    // obtenemos los datos del formulario
    const form = new FormData(this);

    // obtenemos el indice de la persona en el objeto json
    let indexPersona = parseInt(document.getElementById('indexPersona').innerText);

    // recolectamos los datos del formulario en un objeto
    let PersonaActualizada = {
        cedula: form.get('cedula'),
        nombre: form.get('name'),
        apellido: form.get('lastName'),
        edad: form.get('age'),
        genero: form.get('genre'),
        numeroTelefono: form.getAll('phoneNumber'),
        email: form.getAll('email'),
        estadoCivil: form.get('civilState'),
        direccion: form.get('adress'),
        departamento: form.get('departament'),
        cargo: form.get('workPosition'),
    };

    // remplazmos en el indice de la persona con la nueva informacion
    objectjson[indexPersona] = PersonaActualizada;

    // actualizamos la informacion de la persona en la lista de personas
    document.getElementById('persona_'+indexPersona).innerText = PersonaActualizada['cedula']+" - "+PersonaActualizada['nombre'];
}