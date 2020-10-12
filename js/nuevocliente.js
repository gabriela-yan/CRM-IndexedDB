( function() {
    let DB;
    const form = document.querySelector('#formulario');


    document.addEventListener('DOMContentLoaded',() => {
        connectDB();
        form.addEventListener('submit', validateClient );
    })

    function connectDB() {
        const openConnection = window.indexedDB.open('crm', 1);

        openConnection.onerror = function(e) {
            console.log('Database Error: ', e.target.errorCode);
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

        if(name === '' || email === '' || phone === '' || company === ''){
            printAlert('Todos los campos son obligatorios', 'error');

            return;
        }

    }

    function printAlert(message, type) {
        
        const alert = document.querySelector('.alert');

        if(!alert){
            // Create Alert
            const divMessage = document.createElement('div');
            divMessage.classList.add('px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center','border','alert');

            if(type === 'error') {
                divMessage.classList.add('bg-red-100','border-red-400','text-red-700');
            } else {
                divMessage.classList.add('bg-green-100','border-green-400','text-green-700');
            }

            divMessage.textContent = message;

            form.appendChild(divMessage);

            setTimeout(() =>{
                divMessage.remove();
            },3000);

        }

        

    }


})();