const form = document.querySelector(".form");
const input = document.querySelector("#todoInput");
const todosContainer = document.querySelector(".todos");

const API = "https://jsonplaceholder.typicode.com/todos";

async function getTodos() {
  const res = await fetch(API + "?_limit=3");
  const todos = await res.json();

  todosContainer.innerHTML = "";

  todos.forEach((todo) => {
    createTodo(todo);
  });
}

getTodos();

function createTodo(todo) {
  const div = document.createElement("div");
  div.classList.add("todo");

  div.innerHTML = `
<h3 class="${todo.completed ? "done" : ""}">${todo.title}</h3>

<div class="actions">
    <button class="doneBtn">Done</button>
    <button class="edit">Edit</button>
    <button class="delete">Delete</button>
</div>
`;

  const title = div.querySelector("h3");

  const doneBtn = div.querySelector(".doneBtn");
  const editBtn = div.querySelector(".edit");
  const deleteBtn = div.querySelector(".delete");

  if (todo.completed) {
    doneBtn.style.display = "none";
    editBtn.style.display = "none";
  }

  doneBtn.addEventListener("click", async () => {
    const editInput = title.querySelector("input");

    if (editInput) {
      title.textContent = editInput.value;
      editBtn.textContent = "Edit";
    }

    todo.completed = true;

    await fetch(API + "/" + todo.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: true,
      }),
    });

    title.classList.add("done");

    doneBtn.style.display = "none";
    editBtn.style.display = "none";
  });

  deleteBtn.addEventListener("click", async () => {
    await fetch(API + "/" + todo.id, {
      method: "DELETE",
    });

    div.remove();
  });

  editBtn.addEventListener("click", async (e) => {
    if (e.target.textContent === "Edit") {
      const currentText = title.textContent;

      title.innerHTML = `
        <input type="text" value="${currentText}">
      `;

      e.target.textContent = "Save";
    } else {
      const newValue = title.querySelector("input").value;

      await fetch(API + "/" + todo.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newValue,
          completed: todo.completed,
        }),
      });

      title.textContent = newValue;

      if (todo.completed) {
        title.classList.add("done");
      }

      e.target.textContent = "Edit";
    }
  });

  todosContainer.prepend(div);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (input.value.trim() === "") return;

  const newTodo = {
    title: input.value,
    completed: false,
  };

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  });

  const data = await res.json();

  createTodo(data);

  input.value = "";
});
