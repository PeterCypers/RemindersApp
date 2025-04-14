class Todo {
    #id;
    #status; //boolean input.type[checkbox].checked
    #body;

    constructor(id, status, body){
        this.#id = id;
        this.#status = status;
        this.#body = body;
    }
    get status() { return this.#status; }
    set status(value){ this.#status = value; }

    get body() { return this.#body; }
    set body(value) { this.#body = value; }

    get id(){ return this.#id; }

    toJSON() {
        return {
            id: this.#id,
            status: this.#status,
            body: this.#body
        }
    }
}

class TodoComponent {
    #storage;
    #todoList = [];
    #maxwordlength = 11
    
    constructor(storage){
        this.#storage = storage;
        this.getTodosFromStorage();
        this.toHTML();
    }

    get storage () {
        return this.#storage;
    }
    get todoList () {
        return this.#todoList;
    }

    addTodo(body) {
        // ID-generation: max-(existant)ID + 1
        let id = 1;
        if(this.#todoList.length === 0){
            id = 1;
        }else{
            // spread operator shallow copy ... map's callback MUTATES ! the original
            let max = Math.max(...this.#todoList.map((todo)=> todo.id));
            id = max + 1;
        }
        this.#todoList.push(new Todo(id, false, body));
        this.setTodosInStorage();
        this.toHTML();
    }

    getTodosFromStorage() {
        this.#todoList = [];
        if(this.#storage.getItem('todos')){
            this.#todoList = JSON.parse(this.#storage.getItem('todos')).map(
                (t) => new Todo(t.id, t.status, t.body)
            );
        }
    }

    setTodosInStorage() {
        this.#storage.setItem('todos', JSON.stringify(this.#todoList));
    }

    // Function to get the length of the longest word in a string (by GPT)
    getLongestWordLength(text) {
        const words = text.split(/\s+/);  // Split the text into words by spaces
        const longestWord = words.reduce((a, b) => (b.length > a.length ? b : a), "");  // Find the longest word
        return longestWord.length;  // Return the length of the longest word
    }

    toHTML() {
            const dropZone = document.getElementById("todoZone");
            dropZone.innerHTML = '';
            this.#todoList.forEach((todo) => {
                const li = document.createElement('li');

                const p = document.createElement('p');
                p.innerText = todo.body;
                p.classList.add('todoBody');
                // li.innerText = todo.body;

                li.classList.add('list-group-item');
                // Added container to wrap all the buttons for mobile-view's added row
                const btnBox = document.createElement('div');
                btnBox.classList.add('buttonContainer')
                // ❌🗑️ Delete Bucket with SVG
                const deleteBucket = document.createElement('button');
                deleteBucket.classList.add('btn', 'btn-outline-danger', 'trashcan');
                deleteBucket.id = `delBucket${todo.id}`;
                deleteBucket.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
                `;
                deleteBucket.onclick = () => {
                    if(confirm("Remove Reminder?")){
                        this.deleteTodo(todo.id);
                        this.toHTML();
                    } 
                };
                // [ end delete bucket ]

                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = todo.status;
                cb.style.padding = '10px';
                cb.onchange = () => {
                    todo.status = cb.checked;
                    this.setTodosInStorage();
                }
                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = "Remove";
                deleteBtn.classList.add('btn','btn-outline-danger','removeBtn')
                deleteBtn.id = `rb${todo.id}`;
                deleteBtn.onclick = () => {
                    if(confirm("Remove Reminder?")){
                        this.deleteTodo(todo.id);
                        //note(1): didn't update immediately, seems solved
                        this.toHTML();
                    } 
                };
                // ✏️ Edit Button with SVG (EDIT functionality courtesy of chatGPT)
                const editBtn = document.createElement('button');
                editBtn.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'editBtn');
                editBtn.id = `editBtn${todo.id}`;
                editBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                </svg>
                `;

                editBtn.onclick = () => {
                    // console.log(`Edit button clicked for todo id ${todo.id}`);
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = todo.body;
                    input.classList.add('form-control');
                
                    // Replace the current li's text node (firstChild) with the input field
                    li.replaceChild(input, li.firstChild);
                    input.focus();

                    let hasSaved = false;
  
                    const saveSecureEdit = () => {
                        if (hasSaved) return;
                        hasSaved = true;
                
                        const newText = input.value.trim() || '[ Empty ]';
                        if (newText !== todo.body) {
                            // Check if 'secureEdit' checkbox is true before confirming
                            if (document.getElementById('secureEdit').checked) {
                                if (confirm(`Update this reminder?\n\nOld: "${todo.body}"\nNew: "${newText}"`)) {
                                    todo.body = newText;
                                    this.setTodosInStorage();
                                }
                            } else {
                                todo.body = newText;
                                this.setTodosInStorage();
                            }
                        }
                        this.toHTML();
                    };            

                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') saveSecureEdit();
                    });
                
                    input.addEventListener('blur', saveSecureEdit);
                };
                
                // Made 100 % redundant including all variable mediaqueries for smaller screens
                {
                    // const todoWordLength = this.getLongestWordLength(li.innerText);
                    
                    // if (todoWordLength > this.#maxwordlength) {
                    //     li.classList.add("long-word-todo");
                    // } else if (li.classList.contains("long-word-todo")) {
                    //     li.classList.remove("long-word-todo");
                    // }
                }

                btnBox.appendChild(editBtn);
                btnBox.appendChild(cb);
                btnBox.appendChild(deleteBucket);
                btnBox.appendChild(deleteBtn);
                li.appendChild(p);
                li.appendChild(btnBox);
                dropZone.appendChild(li);

            });
    }
    

    deleteTodo(key) {
        const index = this.#todoList.findIndex(t => t.id === key);
        this.#todoList.splice(index, 1);
        this.setTodosInStorage();
        //note(1): didn't update immediately, seems solved
        //this.toHTML();
    }
}

import { initializeDropdown, loadBackgroundImage } from './saveImgBase64.js';

function init(){
    // Base64.js setup
    initializeDropdown();
    loadBackgroundImage();

    // Secure Edit by GPT
    const secureEditCheckbox = document.getElementById('secureEdit');
    const storedSecureEdit = localStorage.getItem('secureEdit');
    const isSecureEdit = storedSecureEdit === null ? true : JSON.parse(storedSecureEdit); //default: checked
    secureEditCheckbox.checked = isSecureEdit;

    secureEditCheckbox.addEventListener('change', () => {
        localStorage.setItem('secureEdit', JSON.stringify(secureEditCheckbox.checked));
    });

    const todoComponent = new TodoComponent(localStorage);
    const addButton = document.getElementById("add");
    const addButton2 = document.getElementById("add2");
    const addInput = document.getElementById("addInput");
    const todos = document.getElementById("todoZone");
    const inputBox = document.getElementById("todoInput")


    addButton.onclick = () => {
        addInput.classList.replace("hidden", "shown");
        addButton.classList.replace("shown", "hidden");
        inputBox.value = '';
        inputBox.focus();
    }

    inputBox.onkeydown = (event) => {
    if (event.key === "Enter" || event.key === "NumpadEnter"){
        event.preventDefault();
        addButton2.click();
    }
    }

    // uncomment to add behavior: no empty field allowed and/or confirm to add
    addButton2.onclick = () => {
        // if(inputBox.value !== ''){
        // if(confirm("ToDo opslaan?")){
            addInput.classList.replace("shown", "hidden");
            addButton.classList.replace("hidden", "shown");
            // FIXED, in original ToDoList it was: "body = inputBox.value || '[ Empty ]';" -> it now causes an error if
            // the main.js is marked as a module
            let body = inputBox.value || '[ Empty ]';
            todoComponent.addTodo(body);
        // }
        // }else{
        //     alert('Fill in a TODO');
        // }
    }
}

window.onload = init;
