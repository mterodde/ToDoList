/* import { TASK_STAUS_VALUES, PERSISTANCE_STAUS_vALUES } from "./TaskGlobals";
import { Task } from "./Task";
 */
const TASK_GLOBALS = require('./TaskGlobals');
const TASK_STATUS_VALUES = TASK_GLOBALS.TASK_STATUS_VALUES;
const PERSISTANCE_STATUS_VALUES = TASK_GLOBALS.PERSISTANCE_STATUS_VALUES;

const Task = require('./Task');

/* Manages all the tasks of the currrent user.
 */

class TaskBucket {
    constructor() {
        this.tasks = [];
        this.currentTaskId = 0;

    }

    get taskList(){
        return this.tasks;
    }

    get numOfTasks(){
        return this.tasks.length;
    }

    findTask(taskId) {
        let task = this.tasks.find(task => task.id === taskId);
        if (task) {
            return task;
        } else {
            console.error(`TaskBucket.find failed. Task with id ${taskId} does not exist in list of tasks`);           
            return null;
        }
    }

    createTask(taskDescripton) {
        taskDescripton.id = this.currentTaskId++;
        taskDescripton.status = TASK_STATUS_VALUES.initialized;
        let newTask = new Task(taskDescripton);
        this.tasks.push(newTask);
        return newTask
    }

    updateTask(taskId, taskDescription) {
        let task = this.findTask(taskId);
        if (task) {
            task.update(taskDescription);
            return task;
        } else {
            console.error(`TaskBucket.updateTask for task ${taskDescription} failed. Task not found`);           
            return null;
        }
    }

    removeTask(taskForRemove) {
        let index = this.tasks.findIndex(task => task.id === taskForRemove.id);
        if (index !== -1) {
            this.tasks.splice(index,1);
        } else {
            console.error(`TaskBucket.remove failed. Task ${taskForRemove.serializedData} not found`);          
        }
    }

    persistChanges(restServiceHandle){
        let tasksToBePersisted = this.tasks.filter(task => [
            PERSISTANCE_STATUS_VALUES.notPersisted,
            PERSISTANCE_STATUS_VALUES.persistanceFailed
        ].includes(task.persistStatus) );

        let operationPaylod = tasksToBePersisted.map(task => task.serializedData);
        restServiceHandle.processUpdates(operationPaylod);

    }

}

module.exports = TaskBucket;