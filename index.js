//Parent element to store cards
const taskContainer = document.querySelector(".task__container")
console.log(taskContainer);


//Global store
let globalStore = [];

const newCard = ({
    id,
    imageUrl,
    taskTitle,
    taskType,
    taskDescription
    }) => `<div class="col-md-6 col-lg-4" id=${id}>
    <div class="card ">
    <div class="card-header d-flex justify-content-end gap-2">
        <button type="button" id=${id} class="btn btn-outline-success" onclick="editCard.apply(this, arguments)">
            <i class="fas fa-pencil-alt" id=${id} onclick="editCard.apply(this, arguments)" ></i>
        </button>
        <button type="button" id=${id} class="btn btn-outline-danger" onclick="deleteCard.apply(this, arguments)" >
            <i class="fas fa-trash" id=${id} onclick="deleteCard.apply(this, arguments)" ></i>
        </button>
    </div>
    <div class="card-image" >
    <img src= ${imageUrl} class="card-img-top" alt="Image ">
    </div>
    <div class="card-body">
    <h5 class="card-title"> ${taskTitle} </h5>
    <p class="card-text">${taskDescription}</p>
    <span class="badge bg-primary"> ${taskType} </span>
    </div>
    <div class="card-footer text-muted "> 
        <button type="button" id=${id} class="btn btn-outline-primary float-end"> Open Task </button>
    </div>
    </div>
</div>` ;

const loadInitialTaskCards = () => {
    //access local storage
    const getInitialData = localStorage.getItem("tasky");
    if( !getInitialData ) return;

    //convert stringified-object to object 
    const { cards } = JSON.parse(getInitialData);

    //map arpund the array to generate HTML card and inject it to DOM
    cards.map((cardObject) => {
        const createNewCard= newCard(cardObject);
        taskContainer.insertAdjacentHTML("beforeend", createNewCard);
        globalStore.push(cardObject);
    });
}

const updateLocalStorage = () =>     localStorage.setItem("tasky", JSON.stringify({ cards: globalStore })); //key -> data 


const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}`, //unique number for card id
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value ,
        taskType: document.getElementById("tasktype").value ,
        taskDescription: document.getElementById("taskdescription").value,
    };

    //HTML code
    const createNewCard = newCard(taskData);

    taskContainer.insertAdjacentHTML("beforeend", createNewCard);
    globalStore.push(taskData);

    //Application programming interface to add to local storage
    updateLocalStorage();    

};

const deleteCard = (event) => {
    //id

    event= window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    //search the global store array, remove obj which has the id
    globalStore = globalStore.filter((cardObject) => cardObject.id !== targetID);
    
    updateLocalStorage();    

    //access DOM to remove them
    if(tagname=== "BUTTON") {
        //task__container
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode); 
        //col-lg-4
    }
    //if clicked on icon
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
    
};

const editCard = (event) => {
    event= window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    let parentElement;

    if(tagname === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    }
    else {
        parentElement = event.target.parentNode.parentNode.parentNode ; 
    }

    //content editable 
    //setAttributeNode()

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];

    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick", "saveEditchanges.apply(this, arguments)");
    submitButton.innerHTML = "Save Changes";
    
};

const saveEditchanges = (event) => {
    event= window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    let parentElement;

    if(tagname === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    }
    else {
        parentElement = event.target.parentNode.parentNode.parentNode ; 
    }

    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];

    const updatedData = {
        taskTitle: taskTitle.innerHTML,
        taskType: taskType.innerHTML,
        taskDescription: taskDescription.innerHTML,
      };

    globalStore = globalStore.map((task) => {
        if(task.id === targetID) {
            return {
                id: task.id,
                imageUrl: task.imageUrl,
                taskTitle: updatedData.taskTitle,
                taskType: updatedData.taskType,
                taskDescription: updatedData.taskDescription,
            };
        }
        return task; //To return original card if no changes made //impppp 
    });

    updateLocalStorage();

    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    submitButton.removeAttribute ("onclick");
    submitButton.innerHTML = "Open Task";
};


//parent object browser -> window
//parent object html -> DOM -> document 
