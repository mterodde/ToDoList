const TASK_GLOBALS = require('../client/js/modell/TaskGlobals');
// const TASK_STAUS_VALUES = TASK_GLOBALS.TASK_STAUS_VALUES;
const PERSISTENCE_STATUS_VALUES = TASK_GLOBALS.PERSISTENCE_STATUS_VALUES;

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

const listOfTaskDescriptions = [
    {
        ownerId: '12345',
        description: 'do something',
        creationDate: '',
        startDate: '',
        endDate: ''
    },    
    {
        ownerId: '12346',
        description: 'do something else',
        creationDate: '',
        startDate: '',
        endDate: ''
    },    
    {
        ownerId: '12347',
        description: 'do nothing',
        creationDate: '',
        startDate: '',
        endDate: ''
    },    
    {
        ownerId: '12348',
        description: 'do it all',
        creationDate: '',
        startDate: '',
        endDate: ''
    },    
    {
        ownerId: '12349',
        description: 'do right',
        creationDate: '',
        startDate: '',
        endDate: ''
    }  
]


describe('TaskBucket', () => {
    describe('#create a task', () => {
        it('check wether all user attibutes are correctly set and returned by the getters', () => {
            let taskBucket = new TaskBucket(null, null, false);
            let task = taskBucket.createTask(initialTaskDescription);
            assert.strictEqual(task.persistStatus,PERSISTENCE_STATUS_VALUES.notPersisted);
            assert.strictEqual(task.owner, initialTaskDescription.ownerId);
            assert.strictEqual(task.description, initialTaskDescription.description);
        });
    });
    describe('#update a task', () => {
        it('check wether all user attibutes are correctly set and returned by the getters', () => {
            let taskBucket = new TaskBucket(null, null, false);
            let task = taskBucket.createTask(initialTaskDescription);
            task = taskBucket.updateTask(task.id, updateTaskDescription)
            assert.strictEqual(task.persistStatus, PERSISTENCE_STATUS_VALUES.notPersisted);
            assert.strictEqual(task.owner, initialTaskDescription.ownerId);
            assert.strictEqual(task.description, updateTaskDescription.description);
        });
    });
    describe('#delete a task', () => {
        it('check wether number of tasks is reduced as soon as the task was deleted', () => {
            let taskBucket = new TaskBucket(null, null, false);
            let task = null;
            let tasksCreated = []
            for (let index = 0; index < 5; index++) {
                task = taskBucket.createTask(initialTaskDescription);
                tasksCreated.push(task);
            }
            let taskToRemove = tasksCreated[3];
            assert.strictEqual(taskBucket.numOfTasks, 5);
            taskBucket.removeTask(taskToRemove.id);
            assert.strictEqual(taskBucket.numOfTasks, 4);
            taskBucket.removeTask(taskToRemove.id);
            assert.strictEqual(taskBucket.numOfTasks, 4);
        });
    });
    describe('#reseting list of tasks with external data', () => {
        it('check wether the task list has been generated and is complete', () => {
            let taskBucket = new TaskBucket(null, null, false);
            taskBucket.public_resetTaskList(listOfTaskDescriptions);
            let listOfTasks = taskBucket.taskList.map(task => task.serialized);
            let resultList = listOfTaskDescriptions.map(resultItem => JSON.stringify(resultItem));
            assert.deepStrictEqual(resultList, listOfTasks);
        })
    })
});