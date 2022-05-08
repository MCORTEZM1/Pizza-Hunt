// create variable to hold the db connection 
let db; 

// establish connection to IndexedDB database called 'pizza-hunt' and set it to version 1
    // # acts as event listener for the database  with .open('name of db', version of db) method
    // # version is used to determine whether the database structure has changed between connections [i.e. changing SQL columns]
    // # indexedDB is a window global variable
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes (nonexistent to version 1, v1 to v2, etc.)
    // # this event will trigger on the first connection to the DB and on updates to the database
request.onupgradeneeded = function(event) {
    // save a reference to the database
    const db = event.target.result;
    // create an object store (table) called 'new-pizza', set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_pizza', { autoIncrement: true });
    // when the even triggers, we store a locally scoped connection too the database and use createObjectStore
    // to hold the data  
};

// upon a successful
request.onsuccess = function(event) {
    // when db is successfully create with its object store (from onupgradeneeded event above),
    //  or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
        uploadPizza();
    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};


// This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method
    pizzaObjectStore.add(record);
};

// This function will handle collecting all of the data from the new_pizza object store in indexedDB and POST it to the server
function uploadPizza() {

    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from the  store and set to a variable
        // # .getAll() method is an asynchronous function that we have to attach an event handler to in order to retrieve the data
    const getAll = pizzaObjectStore.getAll();


    // upon a successful getAll() execution, run this function
    getAll.onsuccess = function () {
        // if there was data in indexedDB's store, lets send it ot the api server
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // open transaction one more time
                    const transaction = db.transaction(['new_pizza'], 'readwrite');
                    // access the new_pizza object store
                    const pizzaObjectStore = transaction.objectStore('new_pizza');
                    // clear all items in your store
                    pizzaObjectStore.clear();

                    alert('All saved pizzas have been submitted!');
                })
                .catch (err => {
                    console.error(err);
                })
        }
    };

};


// listen for app coming back online
window.addEventListener('online', uploadPizza);