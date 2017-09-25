export class TodoList {
    constructor() {
        this.todos = new Array();
    }

    addTodo(text) {
        let todo = new Todo(text);
        this.todos.push(todo);
    }

    addSubTodo(text, idParent) {
        let todo = new Todo(text);
        this.todos[idParent].addSubTodo(todo);
    }

    toggleCompleted(id) {
        let status = this.todos[id].toggleCompleted();
        this.todos[id].subTodos.forEach((todo) => {
            todo.completed = status;
        });
    }

    toggleCompletedSubTodo(id, idParent) {
        this.todos[idParent].subTodos[id].toggleCompleted();
    }

    toggleGroup(id) {
        this.todos[id].toggleSubTodos();
    }

    deleteTodo(id) {
        this.todos.splice(id, 1);
    }

    deleteSubTodo(id, idParent) {
        this.todos[idParent].subTodos.splice(id, 1);
    }
}

class Todo {
    constructor(text) {
        this.subTodos = new Array();
        this.text = text;
        this.completed = false;
        this.created = new Date();
        this.expanded = false;
    }

    addSubTodo(todo) {
        this.subTodos.push(todo);
    }

    toggleCompleted() {
        let status = !this.completed;
        this.completed = status;
        return status;
    }

    toggleSubTodos() {
        this.expanded = !this.expanded;
    }
}