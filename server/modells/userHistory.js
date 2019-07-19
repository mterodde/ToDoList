'use strict'
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OpSchemeDescription = new Schema({
    opTitle: { type: String },
    opSymbols: { type: Array },
    service: { type: String },
    needsLogin: {type: Boolean},
    operands: { type: Array },
    title: {type: String}

});

const OpSchema = new Schema({
    numInputs: Number,
    operandValues: Schema.Types.Mixed,
    opSchemaDescription: OpSchemeDescription
});

const InputsSchema = new Schema({
    inputMatrices: Array,
    numRows: Number,
    numCols: Number,
    opSchema: OpSchema
})

const HistorySchema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        opCode: {
            type: String,
            required: true
        },
        explanation: {
            type: String,
            required: true
        },
        inputs: {
            type: InputsSchema,
            required: true
        },
        result: {
            type: Array,
            required: true
        }
    }
);

const historyDb = mongoose.connection.useDb("MatrixUserHistory");

const History = historyDb.model('userHistory', HistorySchema);

module.exports = History;