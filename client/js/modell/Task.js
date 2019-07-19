'use strict'

// import { INITIAL_TASK, PERSISTANCE_STAUS_vALUES } from "./TaskGlobals";
const TASK_GLOBALS = require('./TaskGlobals');

const INITIAL_TASK = TASK_GLOBALS.INITIAL_TASK;
const PERSISTANCE_STATUS_VALUES = TASK_GLOBALS.PERSISTANCE_STATUS_VALUES;

/* Class to be used, to fully describe a task item 
    consisting of:
        - taskId
        - ownerId of task owner
        - task creation date
        - task start date
        - task end date
        - task description
        
*/


class Task {
    constructor(taskDecription = INITIAL_TASK){
        /* a shallow copy of the task description object is sufficent
            since it has no nested objects at all */
        this.taskData = {...taskDecription};
        this._persistStatus = PERSISTANCE_STATUS_VALUES.notPersisted;
    }

    set persistStatus(stateInfo){
        this._persistStatus = stateInfo;
    }

    set start(date = Date.now()){
        this.taskData.startDate = date;
    }

    set end(date = Date.now()) {
        this.taskData.endDate = date;
    }

    get id() {
        return this.taskData.id;
    }

    get description(){
        return this.taskData.description
    }

    get owner() {
        return this.taskData.ownerId;
    }

    get creationDate(){
        return this.taskData.creationDate;
    }

    get startDate(){
        return this.taskData.startDate;
    }

    get endDate() {
        return this.taskData.endDate;
    }

    get persistStatus(){
        return this._persistStatus;
    }

    get serializedData(){
        return JSON.stringify(this.taskData);
    }

    update(dataforUpdate){
        this.taskData = {...this.taskData, ...dataforUpdate};
    }
}

module.exports = Task;