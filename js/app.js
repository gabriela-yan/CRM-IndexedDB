(function() {

    let DB;

    document.addEventListener('DOMContentLoaded', () => {
        createDB()
    });

    //Create the DB of IndexDB
    function createDB() {
        const createDB = window.indexedDB.open('crm', 1);
        
        createDB.onerror = function(e) {
            console.log('Database Error: ', e.target.errorCode);
        };

        createDB.onsuccess = function() {
            DB = createDB.result;
        };

        createDB.onupgradeneeded = function(e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('empresa', 'empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            console.log('DB ready!');

        };

    }
})();