# 📝 To-Do Application (JSON Server)

A modern **To-Do List web application** built with **HTML, CSS, and JavaScript**, using **JSON Server** as a RESTful backend. The app supports full CRUD operations and includes advanced features like **search** and **category filtering**.

---

## 🚀 Features

### Core Functionalities

* ➕ Add a task (title, description, category, due date)
* 📋 Display all tasks in a styled layout
* ✅ Mark tasks as completed / not completed
* ✏️ Edit existing tasks
* 🗑️ Delete tasks (with confirmation)

### Advanced Features

* 🗂️ **Category Filtering**
  Tasks can be filtered based on their assigned category (list). Each task contains a `cat` property, and selecting a list from the dropdown filters tasks accordingly.

  **How it works:**

  * Categories are stored in the `customLists` array
  * Each task is saved with a `cat` field in JSON Server
  * When a category is selected, tasks are filtered on the client side

  ```js
  filtered = tasks.filter(t => t.cat === filter && !t.finished);
  ```

* 🔍 **Live Search**
  The application includes a live search feature that allows users to search tasks by title in real time.

  **How it works:**

  * User input is captured from the search field
  * Tasks are filtered dynamically as the user types
  * Results are immediately rendered without reloading the page

  ```js
  function runLiveSearch() {
    const q = document.getElementById('headerSearchInput').value.toLowerCase();
    const filtered = tasks.filter(t =>
      t.desc.toLowerCase().includes(q)
    );
    renderTaskList(filtered);
  }
  ```

  This improves usability by allowing fast task lookup.

---

## 🛠️ Technologies Used

* **HTML5** – Structure
* **CSS3** – Styling & layout
* **JavaScript (Vanilla)** – Logic & API interaction
* **JSON Server** – Mock REST API backend
* **Font Awesome** – Icons

---

## 📁 Project Structure

```
project-folder/
│
├── index.html        # Main HTML file
├── styles.css        # Application styling
├── script.js         # JavaScript logic (CRUD + UI)
├── db.json           # JSON Server database
└── README.md         # Project documentation
```

---

## ⚙️ API Endpoints (JSON Server)

| Action         | Method | Endpoint   |
| -------------- | ------ | ---------- |
| Load all tasks | GET    | /todos     |
| Create task    | POST   | /todos     |
| Update task    | PATCH  | /todos/:id |
| Delete task    | DELETE | /todos/:id |

---

## 🗄️ Database Structure (`db.json`)

```json
{
  "todos": [
    {
      "id": 1,
      "desc": "Buy groceries",
      "longDesc": "Milk and bread",
      "cat": "Shopping",
      "date": "2025-01-01",
      "finished": false
    }
  ]
}
```

---

## ▶️ How to Run the Project

### Step 1: Install JSON Server

```bash
npm install -g json-server
```

### Step 2: Start the Backend Server

```bash
json-server --watch db.json
```

The server will run at:

```
http://localhost:3000
```

### Step 3: Open the Frontend

* Open `index.html` in your browser
* Make sure JSON Server is running

---

## 🔄 How CRUD Works in the App

* **Create**: POST request when adding a task
* **Read**: GET request when loading tasks
* **Update**: PATCH request for edit & completion toggle
* **Delete**: DELETE request to remove a task

After every change, tasks are reloaded to keep UI and backend in sync.

---

## 🎨 UI Highlights

* Floating action button (FAB)
* Modal confirmations
* Calendar date picker
* Category-based task lists
* Completed tasks shown with line-through style

---

## 👩‍🎓 Academic Purpose

This project demonstrates:

* RESTful API usage
* Frontend–backend communication
* CRUD operations
* State management
* Clean UI/UX practices

---

## 📌 Author

**Nanat Abeshu** and
**Tsion Tibebe**


---

## ✅ Future Improvements

* Dark mode toggle
* Drag-and-drop task ordering
* Server-side search using `?q=`
* Authentication

---
