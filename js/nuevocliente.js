( function() {
    let DB;
    const form = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded',() => {
        connectDB();
        form.addEventListener('submit', validateClient );
    })

    function connectDB() {
        const openConnection = window.indexedDB.open('crm', 1);

        openConnection.onerror = function() {
            console.log('Database Error');
        };

        openConnection.onsuccess = function() {
            DB = openConnection.result;
        };
    }

    function validateClient(e) {
        e.preventDefault();
        // console.log('Validando...'); Test

        // Read all inputs
        const name = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#telefono').value;
        const company = document.querySelector('#empresa').value;

        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if(name === '' || email === '' || phone === '' || company === ''){
            printAlert('Todos los campos son obligatorios', 'error');
            return;
        }

        if(!regex.test(email)){
            printAlert('Email no válido', 'error');
            return;
        }

        if(isNaN(phone) || phone.length < 10){
            printAlert('Teléfono no válido', 'error');
            return;
        }

        // console.log('Paso la validación'); Test
        // Create object with the information of the inputs
        const client = {name, email, phone, company, id: Date.now()}
        createNewClient(client);

    }

    function createNewClient(client) {
        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.add(client);

        transaction.onerror = function(){
            printAlert('Ocurrió un error','error');
        }

        transaction.oncomplete = function() {
            printAlert('Cliente agregado correctamente');
            setTimeout(()=>{
                window.location.href = 'index.html';
            },3000);
        }
    }

})();