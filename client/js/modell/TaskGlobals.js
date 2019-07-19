const TASK_STATUS_VALUES = {
    initialized: 0,
    running: 1,
    endded: 2
};

const INITIAL_TASK = {
    id: '',
    description: '',
    staus: TASK_STATUS_VALUES.initialized,
    ownerId: '',
    creationDate: '',
    startDate: '',
    endDate: ''
}

const PERSISTANCE_STATUS_VALUES = {
    notPersisted: 0,
    inProgress: 1,
    persisted: 2,
    persistanceFailed: 99
}

module.exports = {
    TASK_STATUS_VALUES:TASK_STATUS_VALUES,
    NITIAL_TASK: INITIAL_TASK,
    PERSISTANCE_STATUS_VALUES:PERSISTANCE_STATUS_VALUES
}