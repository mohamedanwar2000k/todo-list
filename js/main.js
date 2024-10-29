/*
  ============================
  == THE ELEMENTS VARIABLES ==
  ============================
*/

let body = document.body;
let switchBtn = document.querySelector(".switch-mode");
let h1 = document.querySelector("h1");
let input = document.querySelector(`form input[type="text"]`);
let submit = document.querySelector(`form input[type="submit"]`);
let tasks = document.querySelector(".tasks");
let delAllBtn = document.querySelector(".del-all");



/*
  =========================================================
  == SWITCH BETWEEN LIGHT MODE TO DARK MODE AND OPPOSITE ==
  =========================================================
*/

let darkData = new Object();

if (window.localStorage.getItem("dark mode data")) {
  // GET DATA FROM LOCAL STORAGE
  darkData = JSON.parse(window.localStorage.getItem("dark mode data"));

  if (darkData["dark statu"]) {
    // TOGGLE DARK MODE CLASS
    toggleDarkModeClasses();

    // TOGGLE DARK MODE ICON
    switchBtn.innerHTML = JSON.parse(window.localStorage.getItem("dark mode data"))["dark icon"];
  }
}

switchBtn.addEventListener("click", () => {
  // TOGGLE DARK MODE CLASS
  toggleDarkModeClasses();

  // ADD DATA TO OBJECT
  if (body.classList.contains("dark-mode")) {
    darkData["dark statu"] = true;
    darkData["dark icon"] = `<i class="fa-solid fa-sun"></i>`;
  } else {
    darkData["dark statu"] = false;
    darkData["dark icon"] = `<i class="fa-solid fa-moon"></i>`;
  }

  // ADD THE OBJECT TO LOCAL STORAGE
  window.localStorage.setItem("dark mode data", JSON.stringify(darkData));

  // TOGGLE DARK MODE ICON
  switchBtn.innerHTML = JSON.parse(window.localStorage.getItem("dark mode data"))["dark icon"];
});

function toggleDarkModeClasses() {
  body.classList.toggle("dark-mode");
  switchBtn.classList.toggle("dark-mode");
  h1.classList.toggle("dark-mode");
  input.classList.toggle("dark-mode");
  submit.classList.toggle("dark-mode");
  tasks.classList.toggle("dark-mode");

  let task = document.querySelectorAll(".task");
  let taskLabel = document.querySelectorAll(".task .task-title label");
  let delBtn = document.querySelectorAll(".task .del");

  for (let i = 0; i < task.length; i++) {
    task[i].classList.toggle("dark-mode");
  }
  for (let i = 0; i < taskLabel.length; i++) {
    taskLabel[i].classList.toggle("dark-mode");
  }
  for (let i = 0; i < delBtn.length; i++) {
    delBtn[i].classList.toggle("dark-mode");
  }

  delAllBtn.classList.toggle("dark-mode");
};



/*
  ================================================
  == ADDING AND REMOVING TASKS AND OTHER THINGS ==
  ================================================
*/

// DISABLE FORM SUBMIT
document.forms[0].onsubmit = (e) => {
  e.preventDefault();
};

let tasksArr = [];

if (window.localStorage.getItem("tasks")) {
  // GET DATA FROM LOCAL STORAGE
  tasksArr = JSON.parse(window.localStorage.getItem("tasks"));
  addElementsToPage(tasksArr);
}

if (tasks.childNodes.length === 0) {
  tasks.classList.add("empty");
  tasks.append("No tasks to show");
}

// CLICK TO ADD TASK
submit.onclick = () => {
  if (input.value !== "") {
    // ADD TASK TO ARRAY
    addTaskToArr(tasksArr);

    // CLEAR INPUT VALUE
    input.value = "";

    // REMOVE EMPTY CLASS
    tasks.classList.remove("empty");
  }
};

// CLICK ON TASK ELEMENT
tasks.addEventListener("click", (e) => {
  // DONE TASK
  if (e.target.getAttribute("for")) {
    toggleStatusTask(e.target.previousElementSibling.getAttribute("id"));
    e.target.parentElement.parentElement.classList.toggle("done");
  }

  // DELETE TASK
  if (e.target.classList.contains("del") || e.target.id == "del-icon") {
    if (e.target.classList.contains("del")) {
      daleteTask(e.target.parentElement.previousElementSibling.firstElementChild.id);
      e.target.parentElement.parentElement.remove();
    } else if (e.target.id == "del-icon") {
      daleteTask(e.target.parentElement.parentElement.previousElementSibling.firstElementChild.id);
      e.target.parentElement.parentElement.parentElement.remove();
    }

    if (tasks.childNodes.length === 0) {
      // ADD EMPTY CLASS AND SHOW EMPTY MASSAGGE
      tasks.classList.add("empty");
      tasks.append("No tasks to show");
    }
  }
});

// CLICK TO CLEAR TASKS
delAllBtn.onclick = () => {
  // CLEAR DATA FROM LOCAL STORAGE 
  tasksArr = [];
  window.localStorage.removeItem("tasks");

  // CLEAR TASKS DIV
  tasks.innerHTML = "";

  // ADD EMPTY CLASS AND SHOW EMPTY MASSAGGE
  tasks.classList.add("empty");
  tasks.append("No tasks to show");
};

function addTaskToArr() {
  // TASK DATA
  const task = {
    id: Date.now(),
    title: input.value,
    done: false
  };

  // ADD TASKS TO ARRAY
  tasksArr.push(task);

  // ADD ELEMENTS TO PAGE
  addElementsToPage(tasksArr);

  // ADD ARR TO LOCAL STORAGE
  addArrToLcStrg(tasksArr);
}

function addElementsToPage(tasksArr) {
  // EMPTY TASKS DIV
  tasks.innerHTML = "";

  // LOOPING ON ADD OF TASKS
  tasksArr.forEach((task) => {
    let div = document.createElement("div");
    div.className = "task";

    let titleDiv = document.createElement("div");
    titleDiv.className = "task-title";

    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = task.id;

    let label = document.createElement("label");
    label.setAttribute("for", task.id);
    label.append(task.title);

    let buttons = document.createElement("div");
    buttons.className = "buttons";

    let del = document.createElement("span");
    del.className = "del";
    del.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
    del.firstElementChild.id = "del-icon";

    if (body.classList.contains("dark-mode")) {
      div.className = "task dark-mode";
      label.className = "dark-mode";
      del.className = "del dark-mode";
    } else {
      div.classList.remove("dark-mode");
      label.classList.remove("dark-mode");
      del.classList.remove("dark-mode");
    }

    if (task.done && body.classList.contains("dark-mode")) {
      div.className = "task dark-mode done";
      checkBox.click();
    } else if (task.done && body.classList.contains("dark-mode") === false) {
      div.className = "task done";
      checkBox.click();
    }

    titleDiv.append(checkBox);
    titleDiv.append(label);
    buttons.append(del);
    div.append(titleDiv);
    div.append(buttons);

    tasks.append(div);
  });
}

function addArrToLcStrg(tasksArr) {
  window.localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function toggleStatusTask(taskId) {
  for (let i = 0; i < tasksArr.length; i++) {
    if (tasksArr[i].id == taskId) {
      tasksArr[i].done == false ? tasksArr[i].done = true : tasksArr[i].done = false;
    }
  }

  addArrToLcStrg(tasksArr);
}

function daleteTask(taskId) {
  tasksArr = tasksArr.filter((task) => task.id != taskId);
  addArrToLcStrg(tasksArr);
}