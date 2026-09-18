// ===============================
// DARK / LIGHT MODE
// ===============================

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "☀️ Light Mode";
    }

    themeToggle.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {

            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "☀️ Light Mode";

        } else {

            localStorage.setItem("theme", "light");
            themeToggle.textContent = "🌙 Dark Mode";

        }

    });
}


// ===============================
// TO-DO LIST
// ===============================

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");


// Only run To-Do code if we are on todo.html
if (taskInput && addTaskButton && taskList && taskCount) {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let currentFilter = "all";


    // Save tasks
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }


    // Display tasks
    function displayTasks() {

        taskList.innerHTML = "";

        let filteredTasks = tasks;

        if (currentFilter === "active") {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        if (currentFilter === "completed") {
            filteredTasks = tasks.filter(task => task.completed);
        }


        if (filteredTasks.length === 0) {

            taskList.innerHTML = "<p>No tasks added yet.</p>";

        } else {

            filteredTasks.forEach(task => {

                const li = document.createElement("li");

                li.className = "task-item";

                if (task.completed) {
                    li.classList.add("completed");
                }


                li.innerHTML = `
                    <input
                        type="checkbox"
                        class="task-checkbox"
                        data-id="${task.id}"
                        ${task.completed ? "checked" : ""}
                    >

                    <span class="task-text">
                        ${task.text}
                    </span>

                    <button
                        class="edit-btn"
                        data-id="${task.id}">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        data-id="${task.id}">
                        Delete
                    </button>
                `;

                taskList.appendChild(li);

            });

        }


        taskCount.textContent = `${tasks.length} tasks`;
    }


    // Add task
    addTaskButton.addEventListener("click", function () {

        const text = taskInput.value.trim();

        if (text === "") {

            alert("Please enter a task.");

            return;
        }


        const newTask = {

            id: Date.now(),

            text: text,

            completed: false

        };


        tasks.push(newTask);

        saveTasks();

        taskInput.value = "";

        displayTasks();

    });


    // Press Enter to add task
    taskInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            addTaskButton.click();

        }

    });


    // Edit and Delete
    taskList.addEventListener("click", function (event) {

        const id = Number(event.target.dataset.id);


        // Delete
        if (event.target.classList.contains("delete-btn")) {

            tasks = tasks.filter(task => task.id !== id);

            saveTasks();

            displayTasks();

        }


        // Edit
        if (event.target.classList.contains("edit-btn")) {

            const task = tasks.find(task => task.id === id);

            const newText = prompt(
                "Edit your task:",
                task.text
            );


            if (newText !== null && newText.trim() !== "") {

                task.text = newText.trim();

                saveTasks();

                displayTasks();

            }

        }

    });


    // Complete / uncomplete
    taskList.addEventListener("change", function (event) {

        if (event.target.classList.contains("task-checkbox")) {

            const id = Number(event.target.dataset.id);

            const task = tasks.find(task => task.id === id);

            task.completed = event.target.checked;

            saveTasks();

            displayTasks();

        }

    });


    // Filters
    const filterButtons =
        document.querySelectorAll(".filter-btn");


    filterButtons.forEach(button => {

        button.addEventListener("click", function () {

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            this.classList.add("active");

            currentFilter = this.dataset.filter;

            displayTasks();

        });

    });


    // Display saved tasks
    displayTasks();

}