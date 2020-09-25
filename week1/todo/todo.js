// requires ../observable/observable.js
// requires ../transformer/transformer.js
// requires ./fortuneService.js
// requires ../dataflow/dataflow.js


const transformer = Transformers()

const capitalTransformer = (attribute) => (event) => {
    let index = attribute.value ? Number(attribute.value) : 1
    return event
        .split(' ')
        .map(word => word.charAt(index - 1).toUpperCase() + word.slice(index))
        .reduce((acc, word) => acc + word + ' ', "")
        .trim()
}
const whateverTransformer = (attribute) => (event) => 'whatever'


const addSuffix = (attribute) => (event) => event
    .split(' ')
    .map(word => {
        if (word.endsWith(attribute.value)) return word
        return word + attribute.value
    })
    .reduce((acc, word) => acc + word + ' ', "")
    .trim()

transformer.add('capital', capitalTransformer)
transformer.add('whatever', whateverTransformer)
transformer.add('addsuffix', addSuffix)

const validator = Validator()

const maxLength = (attribute) => (value) => {
    const length = attribute.value ? Number(attribute.value) : -1
    if (length < 0) return true

    return value.length <= length
}

const minLength = (attribute) => (value) => {
    const length = attribute.value ? Number(attribute.value) : -1
    if (length < 0) return true

    return value.length >= length
}

validator.add('max', maxLength)
validator.add('min', minLength)

const TodoController = () => {

    const Todo = () => {                                // facade
<<<<<<< HEAD
        const textAttr = Observable("default text");            // we current don't expose it as we don't use it elsewhere
=======
        const textAttr = Observable("text"); // we current don't expose it as we don't use it elsewhere
        textAttr.onChange(t => console.log(t))
>>>>>>> c2325132ece790526c73f16947447039efa9d01f
        const doneAttr = Observable(false);
        return {
            getDone: doneAttr.getValue,
            setDone: doneAttr.setValue,
            onDoneChanged: doneAttr.onChange,
            setText: textAttr.setValue,
            getText: textAttr.getValue,
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
<<<<<<< HEAD
        scheduler.add( ok =>
           fortuneService( text => {        // schedule the fortune service and proceed when done
                   newTodo.setText(text);
                   ok();
               }
           )
=======

        scheduler.add(ok =>
            fortuneService(text => {        // schedule the fortune service and proceed when done
                    newTodo.setText(text);
                    ok();
                }
            )
>>>>>>> c2325132ece790526c73f16947447039efa9d01f
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
        numberOfTodos: todoModel.count,
        numberOfopenTasks: () => todoModel.countIf(todo => !todo.getDone()),
        addTodo: addTodo,
        addFortuneTodo: addFortuneTodo,
        removeTodo: todoModel.del,
        onTodoAdd: todoModel.onAdd,
        onTodoRemove: todoModel.onDel,
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
<<<<<<< HEAD
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
=======
                <input type="text" size="42" max="15"  min="3" capital addsuffix="|" >
                <input type="checkbox" >            
            `;
            return template.children;
        }

        const [deleteButton, inputElement, checkboxElement] = createElements();

        checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);
        deleteButton.onclick = _ => todoController.removeTodo(todo);
        transformer.registerInputElement(inputElement)
        validator.registerInputElement(inputElement)

>>>>>>> c2325132ece790526c73f16947447039efa9d01f

        todoController.onTodoRemove((removedTodo, removeMe) => {
            if (removedTodo !== todo) return;

            div.removeChild(deleteButton);
            div.removeChild(inputElement);
            div.removeChild(checkboxElement);
            div.removeChild(remainCounter);

            rootElement.removeChild(div);
            removeMe();
        });

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


// Der view updated sich  wenn er vom Controller ueber eine Aenderung
// benachrichtigt wird.
// "Die View registriert sich auf updates."
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
