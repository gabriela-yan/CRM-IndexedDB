(function() {

    let DB;
    let idClient;

    const nameInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const phoneInput = document.querySelector('#telefono');
    const companyInput = document.querySelector('#empresa');
    
    const form = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {

        connectDB()

        // Update registry
        form.addEventListener('submit', updateClient);

        // Check ID of the URL
        const parametersURL = new URLSearchParams(window.location.search);
        idClient = parametersURL.get('id');
        // console.log(idClient); Test
        if(idClient) {
            // Delete error of transaction
            setTimeout(()=>{
                getClient(idClient);
            },100);
            
        }
    });

    function updateClient(e) {
        e.preventDefault();

        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(nameInput.value === '' || emailInput.value === '' || phoneInput.value === '' || companyInput.value === ''){
            printAlert('Todos los campos son obligatorios','error');
            return;
        }

        if(!regex.test(emailInput.value)){
            printAlert('Email no válido', 'error');
            return;
        }

        if(isNaN(phoneInput.value) || phoneInput.value.length < 10){
            printAlert('Teléfono no válido', 'error');
            return;
        }

        // Update client
        const updatedClient = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            company: companyInput.value,
            id: Number(idClient)
        }

        // console.log(updatedClient);
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(updatedClient);

        transaction.oncomplete = function() {
            printAlert('Editado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            },3000);
        }

        transaction.onerror = function() {
            printAlert('Ocurrió un error', 'error');
        }

    }

    function getClient(id) {
        const transaction = DB.transaction(['crm'],'readonly');
        const objectStore = transaction.objectStore('crm');

        // console.log(objectStore); Test
        const client = objectStore.openCursor();

        client.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {
                // console.log(cursor.value); Test
                if(cursor.value.id === Number(id)){
                    // console.log(cursor.value);
                    fillForm(cursor.value);
                }

                cursor.continue();
            }
        }
    };

    function fillForm(clientData) {
        const {name, email, phone, company} = clientData;

        nameInput.value = name;
        emailInput.value = email;
        phoneInput.value = phone;
        companyInput.value = company;
    }


    function connectDB() {
        const openConnection = window.indexedDB.open('crm', 1);

        openConnection.onerror = function() {
            console.log('Database Error');
        };

        openConnection.onsuccess = function() {
            DB = openConnection.result;
        };
    };
})();