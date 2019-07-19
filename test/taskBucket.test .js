const TASK_GLOBALS = require('../client/js/modell/TaskGlobals');
// const TASK_STAUS_VALUES = TASK_GLOBALS.TASK_STAUS_VALUES;
const PERSISTANCE_STATUS_VALUES = TASK_GLOBALS.PERSISTANCE_STATUS_VALUES;

const TaskBucket = require("../client/js/modell/TaskBucket");

var assert = require("assert");

const initialTaskDescription = {
    ownerId: '1234',
    description: 'do something',
    creationDate: '',
    startDate: '',
    endDate: ''
}

const updateTaskDescription = {
    description: 'do something else'
 }


describe('TaskBucket', () => {
    describe('#create a task', () => {
        it('check wether all user attibutes are correctly set and returned by the getters', () => {
            let taskBucket = new TaskBucket();
            let task = taskBucket.createTask(initialTaskDescription);
            assert.strictEqual(task.persistStatus, PERSISTANCE_STATUS_VALUES.notPersisted);
            assert.strictEqual(task.owner, initialTaskDescription.ownerId);
            assert.strictEqual(task.description, initialTaskDescription.description);
        });
    });
    describe('#update a task', () => {
        it('check wether all user attibutes are correctly set and returned by the getters', () => {
            let taskBucket = new TaskBucket();
            let task = taskBucket.createTask(initialTaskDescription);
            task = taskBucket.updateTask(task.id, updateTaskDescription)
            assert.strictEqual(task.persistStatus, PERSISTANCE_STATUS_VALUES.notPersisted);
            assert.strictEqual(task.owner, initialTaskDescription.ownerId);
            assert.strictEqual(task.description, updateTaskDescription.description);
        });
    });
    describe('#delete a task', () => {
        it('check wether number of tasks is reduced as soon as the task was deleted', () => {
            let taskBucket = new TaskBucket();
            let task = null;
            let tasksCreated = []
            for (let index = 0; index < 5; index++) {
                task = taskBucket.createTask(initialTaskDescription);
                tasksCreated.push(task);
            }
            let taskToRemove = tasksCreated[3];
            assert.strictEqual(taskBucket.numOfTasks, 5);
            taskBucket.removeTask(taskToRemove);
            assert.strictEqual(taskBucket.numOfTasks, 4);
            taskBucket.removeTask(taskToRemove);
            assert.strictEqual(taskBucket.numOfTasks, 4);
        });
    });

});