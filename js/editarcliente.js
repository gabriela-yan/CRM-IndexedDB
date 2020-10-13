(function() {

    let DB;

    const nameInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const phoneInput = document.querySelector('#telefono');
    const companyInput = document.querySelector('#empresa');

    document.addEventListener('DOMContentLoaded', () => {

        connectDB()

        // Check ID of the URL
        const parametersURL = new URLSearchParams(window.location.search);
        const idClient = parametersURL.get('id');
        // console.log(idClient); Test
        if(idClient) {
            // Delete error of transaction
            setTimeout(()=>{
                getClient(idClient);
            },100);
            
        }
    });

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