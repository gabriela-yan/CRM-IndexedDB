(function() {

    let DB;

    const customersList = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        createDB();

        if(window.indexedDB.open('crm',1)){
            getClients();
        }

        customersList.addEventListener('click', deleteClient);
    });

    function deleteClient(e) {
        
        if(e.target.classList.contains('eliminar')){
            const idDelete = Number(e.target.dataset.cliente);
            
            // const confirma = confirm('¿Deseas eliminar este cliente?');
            // console.log(confirma);
            Swal.fire({
                title: '¿Deseas eliminar este registro?',
                text: "No podrás revertir esta acción!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                
                if (result.isConfirmed) {
                    Swal.fire(
                    'Eliminado!',
                    'El registro ha sido eliminado.',
                    'success'
                    )
                    
                    const transaction = DB.transaction(['crm'], 'readwrite');
                    const objectStore = transaction.objectStore('crm');

                    objectStore.delete(idDelete);

                    transaction.oncomplete = function() {
                        console.log('Eliminado...');
                        e.target.parentElement.parentElement.remove();
                    };

                    transaction.onerror = function() {
                        console.log('Ocurrió un error');
                    }
                }
            });
        }
    }

    //Create the DB of IndexDB
    function createDB() {
        const createDB = window.indexedDB.open('crm', 1);
        
        createDB.onerror = function() {
            console.log('Database Error');
        };

        createDB.onsuccess = function() {
            DB = createDB.result;
        };

        createDB.onupgradeneeded = function(e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('name', 'name', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('phone', 'phone', {unique: false});
            objectStore.createIndex('company', 'company', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            console.log('DB ready!');

        };

    }

    function getClients() {
        const openConnection = window.indexedDB.open('crm',1);

        openConnection.onerror = function() {
            console.log('Ocurrió un error');    
        };

        openConnection.onsuccess = function() {
            DB = openConnection.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){
                    // console.log(cursor.value); Test
                    const {name, email, phone, company, id} = cursor.value;

                    

                    customersList.innerHTML += ` <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${phone}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${company}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                        </tr>
                    `;

                    cursor.continue();
                } else {
                    console.log('No ha más registros');
                }
            }
        }
    }
})();