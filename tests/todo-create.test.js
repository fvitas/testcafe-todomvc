import { Selector } from 'testcafe'

class TodoPage {
    constructor() {
        this.input = Selector('.new-todo')
        this.editInput = Selector('.edit')
        this.todoItems = Selector('.todo-list li')
        this.firstTodoItem = Selector('.todo-list li:nth-child(1)')
        this.completedTodos = Selector('.completed')
        this.toggleAll = Selector('.toggle-all')
        this.clearCompleted = Selector('.clear-completed')
        this.showActiveLink = Selector('[href="#/active"]')
        this.showCompletedLink = Selector('[href="#/completed"]')
    }
}

const todoPage = new TodoPage()

fixture('Test TodoMVC App')
    .page('http://todomvc.com/examples/vanillajs/')


test('Create todo', async t => {
    await t
        .typeText(todoPage.input, 'write blog post about JS')
        .pressKey('enter')

    await t
        .expect(todoPage.todoItems.count)
        .eql(1)

    await t
        .expect(todoPage.firstTodoItem.textContent)
        .contains('write blog post about JS')
})


test('Edit todo', async t => {
    await t
        .typeText(todoPage.input, 'write blog post about JS')
        .pressKey('enter')

    await t
        .doubleClick(todoPage.firstTodoItem)
        .selectText(todoPage.editInput, 6)
        .pressKey('backspace')
        .typeText(todoPage.editInput, 'something different')
        .pressKey('enter')

    await t
        .expect(todoPage.firstTodoItem.textContent)
        .contains('write something different')
})


test('Delete todo', async t => {
    await t
        .typeText(todoPage.input, 'write blog post about JS')
        .pressKey('enter')

        .typeText(todoPage.input, 'buy some beer')
        .pressKey('enter')

    await t
        .expect(todoPage.todoItems.count)
        .eql(2)

    await t
        .hover(todoPage.firstTodoItem)
        .click(Selector('.todo-list li:nth-child(1) .destroy'))

    await t
        .expect(todoPage.todoItems.count)
        .eql(1)

    await t
        .expect(todoPage.firstTodoItem.textContent)
        .contains('buy some beer')
})


test('Complete one todo', async t => {
    await t
        .typeText(todoPage.input, 'write blog post about JS')
        .pressKey('enter')

        .typeText(todoPage.input, 'buy some beer')
        .pressKey('enter')

    await t
        .expect(todoPage.todoItems.count)
        .eql(2)

    await t
        .click(Selector('.todo-list li:nth-child(1) .toggle'))

    await t
        .expect(todoPage.todoItems.count)
        .eql(2)

    await t
        .expect(todoPage.firstTodoItem.hasClass('completed'))
        .ok()
})


test('Show active/completed todos', async t => {
    await t
        .typeText(todoPage.input, 'write blog post about JS')
        .pressKey('enter')

        .typeText(todoPage.input, 'buy some beer')
        .pressKey('enter')

    await t
        .click(Selector('.todo-list li:nth-child(1) .toggle'))

    await t
        .expect(todoPage.todoItems.count)
        .eql(2)

    // when click on show active
    await t
        .click(todoPage.showActiveLink)

    await t
        .expect(Selector('.todo-list li:nth-child(1)').textContent)
        .contains('buy some beer')

    // when click on show completed
    await t
        .click(Selector(todoPage.showCompletedLink))

    await t
        .expect(todoPage.firstTodoItem.textContent)
        .contains('write blog post about JS')
})


test('Complete all todos', async t => {
    await t
        .typeText(todoPage.input, 'write blog post about JS')
        .pressKey('enter')

        .typeText(todoPage.input, 'buy some beer')
        .pressKey('enter')

        .typeText(todoPage.input, 'watch a movie')
        .pressKey('enter')

        .typeText(todoPage.input, 'go to a meeting')
        .pressKey('enter')

    await t
        .expect(todoPage.todoItems.count)
        .eql(4)
        .expect(todoPage.completedTodos.count)
        .eql(0)

    await t
        .click(todoPage.toggleAll)

    await t
        .expect(todoPage.completedTodos.count)
        .eql(4)
})


test('Clear all completed todos', async t => {
    // await t
    //     .typeText(todoPage.input, 'write blog post about JS')
    //     .pressKey('enter')
    //
    //     .typeText(todoPage.input, 'buy some beer')
    //     .pressKey('enter')
    //
    //     .typeText(todoPage.input, 'watch a movie')
    //     .pressKey('enter')
    //
    //     .typeText(todoPage.input, 'go to a meeting')
    //     .pressKey('enter')

    let todos = ['write blog post about JS', 'buy some beer', 'watch a movie', 'go to a meeting']

    for (let todo of todos)
        await t
            .typeText(todoPage.input, todo)
            .pressKey('enter')

    await t
        .expect(todoPage.todoItems.count)
        .eql(4)

    await t
        .click(todoPage.toggleAll)
        .click(todoPage.clearCompleted)

    await t
        .expect(todoPage.todoItems.count)
        .eql(0)
})