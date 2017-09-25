import { TodoList } from './todolist';

let todoList = new TodoList();


let helpers = {
    getParentID: function (el, selector = 'todo-wrapper', stopSelector = 'todo-list') {
        var retval = null;
        while (el) {
            if (el.className.indexOf(selector) > -1) {
                retval = el;
                break
            } else if (stopSelector && el.className.indexOf(stopSelector) > -1) {
                break
            }
            el = el.parentElement;
        }
        let idParent = null;
        if (retval != null && retval.dataset.parent) {
            idParent = retval.dataset.parent;
        }

        return idParent;
    },

    getID: function (el, selector = 'todo-wrapper', stopSelector = 'todo-list') {
        var retval = null;
        while (el) {
            if (el.className.indexOf(selector) > -1) {
                retval = el;
                break
            } else if (stopSelector && el.className.indexOf(stopSelector) > -1) {
                break
            }
            el = el.parentElement;
        }
        let id = null;
        if (retval != null && retval.dataset.id) {
            id = retval.dataset.id;
        }
        return id;
    },

    hideAllButtons: function () {
        let buttons = document.getElementsByClassName('btn-menu');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }
    }
}

let handlers = {
    toggleAll: function(event) {
        event.preventDefault();
        
        let total = todoList.todos.length;
        let completed = 0;
        todoList.todos.forEach((todo) => {
            if(todo.completed)
                completed++;
            
            total += todo.subTodos.length;
            todo.subTodos.forEach((subTodo) => {
                if(subTodo.completed)
                    completed++;
            });
        });

        todoList.todos.forEach((todo) => {
            //all true -> all false
            if(total === completed) {
                todo.completed = false;
            } else {
                todo.completed = true;
            }

            todo.subTodos.forEach((subTodo) => {
                if(total === completed) {
                    subTodo.completed = false;
                } else {
                    subTodo.completed = true;
                }
            });
        });
        
        view.displayTodoList();
    },

    expandAll: function(event) {
        event.preventDefault();
        let isAllExpanded = true;
        todoList.todos.forEach((todo) => {
            if(!todo.expanded) {
                isAllExpanded = false;
            }
        });

        todoList.todos.forEach((todo) => {
            if(isAllExpanded) {
                todo.expanded = false;
            } else {
                todo.expanded = true;
            }
        });

        view.displayTodoList();
    },

    deleteAll: function(event) {
        event.preventDefault();
        todoList.todos.forEach((todo) => {
            todo.subTodos.length = 0;
        });
        todoList.todos.length = 0;

        view.displayTodoList();
    },

    addTodo: function (event) {
        let inputEl = event.target.previousSibling;
        let todoText = inputEl.value;
        if (todoText !== '') {
            //Top li parent of input
            let idParent = helpers.getParentID(event.target);
            console.log(idParent);
            if (idParent !== null)
                todoList.addSubTodo(todoText, idParent)
            else
                todoList.addTodo(todoText);

            inputEl.value = '';
            view.displayTodoList();
        }
    },

    todoListClick: function (event) {
        if (event.target.classList.contains('toggle-btn') ||
            event.target.classList.contains('counter')) {
            //Toggle current todo (only top level)
            let id = helpers.getID(event.target);
            todoList.toggleGroup(id);
            view.displayTodoList();
        } else if (event.target.classList.contains('checkbox-link')) {
            //Toggle completed
            let id = helpers.getID(event.target);
            let idParent = helpers.getParentID(event.target);
            console.log('id: ' + id + ', idParent:  ' + idParent);
            if (idParent !== null)
                todoList.toggleCompletedSubTodo(id, idParent);
            else
                todoList.toggleCompleted(id);
            view.displayTodoList();
        } else if (event.target.classList.contains('del-btn')) {
            //Delete todo
            let id = helpers.getID(event.target);
            let idParent = helpers.getParentID(event.target);
            if (idParent !== null)
                todoList.deleteSubTodo(id, idParent);
            else
                todoList.deleteTodo(id);
            view.displayTodoList();
        } else if (event.target.classList.contains('more-btn')) {
            //More actions
            let parentEl = event.target.parentNode.children;
            var alctionsEls = Array.prototype.filter.call(parentEl, function (element, index, ch) {
                return element.classList.contains('btn-menu');
            });

            if(event.target.classList.contains('close')) {
                alctionsEls.forEach((el) => {
                    el.classList.add('active');
                });
                event.target.classList.remove('close');
                event.target.classList.add('open');
            } else {
                alctionsEls.forEach((el) => {
                    el.classList.remove('active');
                });
                event.target.classList.remove('open');
                event.target.classList.add('close');
            }
            
        }
    },

    onDocumentClick: function (event) {
        if (!event.target.classList.contains('more-btn') && !event.target.classList.contains('btn-menu')) {
            let openMenus = document.getElementsByClassName('open');
            for(let i = 0; i < openMenus.length; i++) {
                openMenus[i].click();
            }
        }
    }
};

let view = {
    displayTodoList: function () {
        let createNewTodoElement = function (idParent = null) {
            let containerEl = document.createElement('div');
            containerEl.classList.add('new-todo');
            containerEl.classList.add('todo-wrapper');
            let inputEl = document.createElement('input');
            let buttonEl = document.createElement('button');

            inputEl.placeholder = 'Add new todo.';
            inputEl.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.target.nextSibling.click();
                }
            });
            containerEl.appendChild(inputEl);

            buttonEl.classList.add('submit-btn');
            buttonEl.classList.add('btn');
            buttonEl.addEventListener('click', handlers.addTodo);
            containerEl.appendChild(buttonEl);

            if (idParent !== null) {
                containerEl.dataset.parent = idParent;
            }

            return containerEl;
        }

        let createToggleButton = function (i) {
            let button = document.createElement('button');
            button.classList.add('toggle-btn');
            button.classList.add('btn');

            let counterEl = document.createElement('span');
            counterEl.classList.add('counter');
            counterEl.innerHTML = i;
            button.appendChild(counterEl);

            return button;
        }

        let createMoreButton = function () {
            let button = document.createElement('button');
            button.classList.add('more-btn');
            button.classList.add('btn');
            button.classList.add('close');
            return button;
        }

        let createDeleteButton = function () {
            let button = document.createElement('button');
            button.classList.add('del-btn');
            button.classList.add('btn-menu');
            return button;
        }

        let createEditButton = function () {
            let button = document.createElement('button');
            button.classList.add('edit-btn');
            button.classList.add('btn-menu');
            return button;
        }

        let createControlsElement = function (isRoot, countSubTodos) {
            let controlsEl = document.createElement('div');
            controlsEl.classList.add('controls');

            if (isRoot === true) {
                controlsEl.appendChild(createToggleButton(countSubTodos));
            }
            controlsEl.appendChild(createMoreButton());
            controlsEl.appendChild(createDeleteButton());
            controlsEl.appendChild(createEditButton());

            return controlsEl;
        }

        let createSingleTodoEl = function (isCompleted, time, text) {
            let todoEl = document.createElement('div');
            todoEl.classList.add('todo');

            if (isCompleted === true) {
                todoEl.classList.add('completed');
            }

            let timeEl = document.createElement('div');
            timeEl.classList.add('timestamp');
            timeEl.innerHTML = time;
            todoEl.appendChild(timeEl);

            let textEl = document.createElement('div');
            textEl.classList.add('text');

            let checkboxButtonEl = document.createElement('a');
            checkboxButtonEl.classList.add('btn');
            checkboxButtonEl.classList.add('checkbox-link');
            textEl.appendChild(checkboxButtonEl);

            let textWrapperEl = document.createElement('span');
            textWrapperEl.innerHTML = text;
            textEl.appendChild(textWrapperEl);

            todoEl.appendChild(textEl);
            return todoEl;
        }

        let createTodoList = function (todos, parentEl, isRoot) {
            let todoListEl = document.createElement('div');
            todoListEl.classList.add('todo-list');

            todos.forEach((todo, index) => {
                let todoWrapperEl = document.createElement('div');
                todoWrapperEl.classList.add('todo-wrapper');
                let singleTodoEl = createSingleTodoEl(todo.completed, todo.created.toLocaleString(), todo.text);
                singleTodoEl.appendChild(createControlsElement(isRoot, todo.subTodos.length));

                todoWrapperEl.appendChild(singleTodoEl);

                todoWrapperEl.dataset.id = index;
                if (!isRoot) {
                    todoWrapperEl.dataset.parent = parentEl.dataset.id;
                }

                todoListEl.appendChild(todoWrapperEl);

                if (todo.expanded) {
                    createTodoList(todo.subTodos, todoWrapperEl, false);
                }
            });

            if (isRoot) {
                todoListEl.appendChild(createNewTodoElement());
            } else {
                todoListEl.appendChild(createNewTodoElement(parentEl.dataset.id));
            }

            parentEl.appendChild(todoListEl);
        }

        let todoAppContainer = document.getElementById('todo-app');
        todoAppContainer.addEventListener('click', handlers.todoListClick)
        todoAppContainer.innerHTML = '';
        createTodoList(todoList.todos, todoAppContainer, true);
    }
}

todoList.addTodo('První úkol.');
todoList.addSubTodo('A toto je jeden z podúkolů.', 0);
todoList.addSubTodo('Toto je další podúkol. Cupidatat sit sint eu ex sit velit dolor exercitation labore officia irure.', 0);
todoList.addTodo('Ea ad exercitation velit amet amet amet. Non labore sint dolore id eu ut est.');

view.displayTodoList();


window.addEventListener('load', function () {
    document.addEventListener('click', handlers.onDocumentClick);

    document.getElementById('toggle-all').addEventListener('click', handlers.toggleAll);
    document.getElementById('delete-all').addEventListener('click', handlers.deleteAll);
    document.getElementById('expand-all').addEventListener('click', handlers.expandAll);
});