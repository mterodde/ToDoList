const TASK_STATUS_VALUES = {
    created: 1,
    running: 2,
    endded: 3
};

const INITIAL_TASK = {
    /* unique id to identify the task on the client and on the server side */
    taskId: '',
    description: '',
    /* describes the tasks lifecycle (created -> running -> ended) */
    staus: TASK_STATUS_VALUES.initialized,
    ownerId: '',
    creationDate: '',
    startDate: '',
    endDate: ''
}

const PERSISTENCE_STATUS_VALUES = {
    notPersisted: 0,
    inProgress: 1,
    persisted: 2,
    persistanceFailed: 99
}

const TASK_RETRIEVALSTATUS = {
    retrievalRunning: 1,
    retrievalFinished: 2,
    retrievalFailed: 0
}

const TASK_DEMO_LIST = [
    {
        id: 1,
        description: "do something"
    },
    {
        id: 2,
        description: "do something else"
    },
    {
        id: 3,
        description: "do nothing"
    },
    {
        id: 4,
        description: "do nothing more"
    },
    {
        id: 5,
        description: "do the right thing"
    },
    {
        id: 6,
        description: "do it now"
    },
]

module.exports = {
    TASK_STATUS_VALUES,
    INITIAL_TASK,
    PERSISTENCE_STATUS_VALUES,
    TASK_RETRIEVALSTATUS,
    TASK_DEMO_LIST
}