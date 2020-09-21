// requires ../observable/observable.js
// requires ./fortuneService.js
// requires ../dataflow/dataflow.js

const TodoController = () => {

    const Todo = () => {                                // facade
        const textAttr = Observable("default text");            // we current don't expose it as we don't use it elsewhere
        const doneAttr = Observable(false);
        return {
            getDone:       doneAttr.getValue,
            setDone:       doneAttr.setValue,
            onDoneChanged: doneAttr.onChange,
            setText:       textAttr.setValue,
            getText:       textAttr.getValue,
            onTextChanged: textAttr.onChange,
        }
    };


    const todoModel = ObservableList([]); // observable array of Todos, this state is private
    const scheduler = Scheduler();


    const addTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        return newTodo;
    };


    const addFortuneTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        newTodo.setText('...');
        scheduler.add( ok =>
           fortuneService( text => {        // schedule the fortune service and proceed when done
                   newTodo.setText(text);
                   ok();
               }
           )
        );
    };


    const validateInput = (inputElement, remainCounter) => {
        var numberOfChars = inputElement.value.length;
        if (numberOfChars < 4) {
            remainCounter.textContent = "" + (4-numberOfChars) + " to go.";
        }
        if (numberOfChars >= 4) {
            remainCounter.textContent = "Nice :)";
        }
    }


    return {
        numberOfTodos:      todoModel.count,
        numberOfopenTasks:  () => todoModel.countIf( todo => ! todo.getDone() ),
        addTodo:            addTodo,
        addFortuneTodo:     addFortuneTodo,
        removeTodo:         todoModel.del,
        onTodoAdd:          todoModel.onAdd,
        onTodoRemove:       todoModel.onDel,
        removeTodoRemoveListener: todoModel.removeDeleteListener, // only for the test case, not used below
        validateInput:       validateInput
    }
};


// View-specific parts

const TodoItemsView = (todoController, rootElement) => {

    const render = todo => {
        function createElements() {
            const template = document.createElement('DIV'); // only for parsing
            template.innerHTML = `
            <div>
                <button class="delete">&times;</button>
                <input type="text" size="25">
                <input type="checkbox">
                <span class="remain-counter">4 to go.</span>
            </div>
            `;
            return template.children;
        }
        const div = createElements()[0];
        const [deleteButton, inputElement, checkboxElement, remainCounter] = div.children; 

        deleteButton.onclick    = _ => todoController.removeTodo(todo);
        inputElement.onkeyup    = _ => todoController.validateInput(inputElement, remainCounter);
        checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);

        todoController.onTodoRemove( (removedTodo, removeMe) => {
            if (removedTodo !== todo) return;

            div.removeChild(deleteButton);
            div.removeChild(inputElement);
            div.removeChild(checkboxElement);
            div.removeChild(remainCounter);

            rootElement.removeChild(div);
            removeMe();
        } );

        div.appendChild(deleteButton);
        div.appendChild(inputElement);
        div.appendChild(checkboxElement);
        div.appendChild(remainCounter);

        rootElement.appendChild(div);
    };

    // binding
    todoController.onTodoAdd(render);

    // we do not expose anything as the view is totally passive.
};


const TodoTotalView = (todoController, numberOfTasksElement) => {

    const render = () =>
        numberOfTasksElement.innerText = "" + todoController.numberOfTodos();

    // binding
    todoController.onTodoAdd(render);
    todoController.onTodoRemove(render);
};



const TodoOpenView = (todoController, numberOfOpenTasksElement) => {

    const render = () =>
        numberOfOpenTasksElement.innerText = "" + todoController.numberOfopenTasks();

    // binding
    todoController.onTodoAdd(todo => {
        render();
        todo.onDoneChanged(render);
    });
    todoController.onTodoRemove(render);
};


