(function () {
  let tasksList = [];
  let localStorageKey;

  function deleteTask(id) {
    for (const index in tasksList) {
      if (tasksList[index]["id"] === id) tasksList.splice(index, 1);
    }
  }

  function toggleTaskCompletion(id) {
    for (const index in tasksList) {
      if (tasksList[index]["id"] === id) {
        tasksList[index]["done"] = !tasksList[index]["done"];
      }
    }
  }

  function createButtonListeners(task) {
    task.doneButton.addEventListener("click", function () {
      // переключаем свойство done и обновляем localstorage
      toggleTaskCompletion(task.id);
      saveTodoList(localStorageKey, tasksList);
      // переключаем класс для стилизации
      task.item.classList.toggle("list-group-item-success");
    });

    task.deleteButton.addEventListener("click", function () {
      if (confirm("Вы хотите удалит задачу?")) {
        //удаляем задачу из массива и обновляем localstorage
        deleteTask(task.id);
        saveTodoList(localStorageKey, tasksList);
        // удаляем dom элемент с задачей из дерева
        task.item.remove();
      }
    });
  }

  function saveTodoList(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function getTodoList(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.classList.add("py-3");
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    //создаем элементы
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    //стилизуем элементы, добавляем необходимые подписи и атрибуты
    form.classList.add("input-group", "mb-3");

    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";

    buttonWrapper.classList.add("input-group-append");

    button.classList.add("btn", "btn-primary");
    button.setAttribute("disabled", "");
    button.textContent = "Добавить дело";

    // размещаем элементы
    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    // обработчик события для проверки пустое ли поле для ввода
    input.addEventListener("input", function () {
      input.value.trim().length !== 0
        ? button.removeAttribute("disabled")
        : button.setAttribute("disabled", "");
    });

    // возвращаем не только форму но и другие элементы,
    // чтобы потом удобно с  ними работать (например, добавить обработчики событий)
    return { form, input, button };
  }

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(taskObject) {
    const id = taskObject.id;

    // создаем dom-элементы
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    // добавляем стили и подписи
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = taskObject.name;
    // добавляем класс если задание уже выполнено
    if (taskObject.done) {
      item.classList.add("list-group-item-success");
    }

    buttonGroup.classList.add("btn-group", "btn-group-sm");

    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";

    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    // размещаем элементы
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // добавляем задачу в массив
    tasksList.push(taskObject);

    return {
      id,
      item,
      doneButton,
      deleteButton,
    };
  }

  function createTodoApp(containerId, title = "Мой список дел", key) {
    localStorageKey = key;
    containerElement = document.getElementById(containerId);
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    containerElement.append(todoAppTitle);
    containerElement.append(todoItemForm.form);
    containerElement.append(todoList);

    // проверяем есть ли задачи в localstorage и отрисовываем их при наличии
    let tasks = getTodoList(localStorageKey);
    if (tasks) {
      for (const task of tasks) {
        let taskElement = createTodoItem(task);
        todoList.append(taskElement.item);
        createButtonListeners(taskElement);
      }
    }

    // обработчик отправки формы
    todoItemForm.form.addEventListener("submit", function (event) {
      // отключаем перезагрузку страницы после подачи формы
      event.preventDefault();

      // ранний выход если поле инпут пустое
      if (!todoItemForm.input.value) {
        return;
      }

      // создаем элемент списка
      let task = createTodoItem({
        id: crypto.randomUUID(),
        name: todoItemForm.input.value.trim(),
        done: false,
      });
      // добавляем обработчики для кнопок
      createButtonListeners(task);
      //добавляем к массиву задач
      todoList.append(task.item);
      // сохраняем в localstorage
      saveTodoList(localStorageKey, tasksList);

      // очищаем input
      todoItemForm.input.value = "";

      //отключаем кнопку
      todoItemForm.button.setAttribute("disabled", "");
    });
  }

  window.createTodoApp = createTodoApp;
})();
