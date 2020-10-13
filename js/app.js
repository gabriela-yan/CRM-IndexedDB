(function() {

    let DB;

    document.addEventListener('DOMContentLoaded', () => {
        createDB()
    });

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
})();