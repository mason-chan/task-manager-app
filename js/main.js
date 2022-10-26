// Declare components needed from HTML doc
const progressContainer = document.querySelector('#currentTasks');
const newTask = document.querySelector('#newTaskForm');
const cardContainer = document.querySelector('#taskList');
const emptyContainer = document.querySelector('#noCard');
const deleteTaskButton = document.querySelector('#deleteTask');
const markTaskButton = document.querySelector('#markButton');
const pendingCount = document.querySelector('#pending');
const finishedCount = document.querySelector('#finished');
const progressBar = document.querySelector('#progressTrack');
// Set key for localStorage
const listKey = 'tasks.lists'
// Initiate global values
let currentId = 0;
let lists = JSON.parse(localStorage.getItem(listKey)) || [];
// Reset form when closing modal with some fields filled in 
function closeForm() {
    newTask.reset();
}
// Add new task to lists[]; Render on DOM; save to local storage
function submitForm() {
    newTask.addEventListener("submit", e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData.entries());
        if (formObj.name == null || formObj.name == '') return;
        currentId++;
        const tasksList = createList(formObj.name, formObj.description, formObj.assignedTo, formObj.due);
        newTask.reset();
        lists.push(tasksList);
        saveAndRender();
    })
}
// Removes task based on position in lists[] array
function deleteTask(index) {
    lists.splice(index, 1);
    saveAndRender();
}
// Toggle complete 
function toggleComplete(index) {
    for (const task of lists) {
        if (task.id === index) {
            task.complete = true;
            saveAndRender();
            break;
        }
    }
}
// Toggle undo
function undoComplete(index) {
    for (const task of lists) {
        if (task.id === index) {
            task.complete = false;
            saveAndRender();
            break;
        }
    }
}
// Function to create object parameters for lists[]
function createList(name, description, assignedTo, due) {
    return { id: currentId, name: name, description: description, assignedTo: assignedTo, due: due, status: 'Incomplete', color: 'danger', complete: false }
}
// Function to combine render and save 
function saveAndRender() {
    save();
    renderList();
    renderCards();
    renderCount();
}
// Save to local storage
function save() {
    localStorage.setItem(listKey, JSON.stringify(lists));
}
// Function to render tasks on progress window
function renderList() {
    clearList(progressContainer);
    if (lists.length === 0) {
        const noItem = document.createElement('li');
        noItem.classList.add("list-group-item");
        noItem.classList.add("fw-bold");
        noItem.innerText = 'No current tasks ヾ(•ω•`)o';
        progressContainer.appendChild(noItem)
    } else {
        lists.forEach(list => {
            const listItem = document.createElement('li');
            listItem.dataset.listId = list.id
            listItem.classList.add("list-group-item");
            listItem.classList.add("fw-bold");
            listItem.innerHTML = `${list.name} <span class="float-end text-${list.complete ? list.color = 'success' : list.color = 'danger'}">${list.complete ? list.status = 'Complete' : 'Incomplete'}</span>`
            progressContainer.appendChild(listItem)
        })
    }
}
// Function to render individual tasks as cards
function renderCards() {
    clearList(cardContainer)
    if (lists.length === 0) {
        const noCard = document.createElement('div');
        const html = `<h6 class="text-center text-secondary py-5">Nothing to see here...</h6>
        <img src="/undraw_online_organizer_re_156n.svg" class="w-50 py-1">`
        noCard.classList.add('d-flex', 'flex-column', 'align-items-center', 'justify-content-center')
        noCard.innerHTML = html;
        cardContainer.appendChild(noCard)
    } else {
        lists.forEach(list => {
        const cardItem = document.createElement('div');
        const targetIndex = lists.indexOf(list);
        console.log(targetIndex)
        const html = `<div class="card shadow mb-5">
        <div class="card-header py-2 d-flex flex-row align-items-center justify-content-between bg-dark text-white">
            <h6 class="m-0 fw-semibold text-uppercase">Task ${targetIndex + 1}</h6>
            <button type="button" class="bg-dark border-0" id="deleteTask" onclick="deleteTask(${targetIndex})">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-x-square" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>    
        </div>
        <div class="card-body">
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><span class="fw-semibold">Name:</span> ${list.name}</li>
                <li class="list-group-item"><span class="fw-semibold">Description:</span> ${list.description}</li>
                <li class="list-group-item"><span class="fw-semibold">Assigned To:</span> ${list.assignedTo}</li>
                <li class="list-group-item"><span class="fw-semibold">Due Date:</span> ${list.due}</li>
                <li class="list-group-item text-${list.complete ? list.color = 'success' : list.color = 'danger'}"><span class="fw-semibold">Status:</span> ${list.complete ? list.status = 'Complete' : 'Incomplete'}</li>
            </ul>
        </div>
        <div class="card-footer justify-content-end d-flex gap-2">
            <button type="button" class="btn btn-secondary" onclick="undoComplete(${list.id})">Undo</button>
            <button type="button" class="btn btn-success" id="markButton" onclick="toggleComplete(${list.id})">Done</button>
        </div>
    </div>`;
        cardItem.dataset.listId = list.id;
        cardItem.classList.add("col-xl-3");
        cardItem.classList.add("col-md-6");
        cardItem.innerHTML = html;
        cardContainer.appendChild(cardItem)
    })
    }
}
// Function to calculate number of tasks
function renderCount() {
    const incompleteTasks = lists.filter(list => !list.complete).length
    const completeTasks = lists.filter(list => list.complete).length
    const totalTask = lists.length
    let percent = 0;
    if (totalTask === 0) {
        percent
    } else {
        percent = Math.round(completeTasks/totalTask*100)
    }
    
    pendingCount.innerText = `${incompleteTasks}`
    finishedCount.innerText = `${completeTasks}`
    progressBar.innerHTML = `<h6 class="small">Total Progress: <span class="float-end">${percent === 100 ? "Complete!" : percent + "%"}</span></h6>
    <div class="progress">
        <div class="progress-bar bg-success" role="progressbar" aria-valuenow="${completeTasks/totalTask*100}" aria-valuemin="0" aria-valuemax="100" style="width: ${completeTasks/totalTask*100}%"></div>
    </div>`
}
// Function to clear Lists[] everytime on render
function clearList(item) {
    while (item.firstChild) {
        item.removeChild(item.firstChild)
    }
}
// Initial run
renderList();
renderCards();
renderCount();