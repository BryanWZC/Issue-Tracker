const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = new Schema({
    issue_title: {
        type: String,
        required: true,
    },
    issue_text: {
        type: String,
        required: true,
    },
    created_by: {
        type: String,
        required: true,
    },
    open: {
        type: Boolean,
        default: true,
    },
    assigned_to: String,
    status_text: String,
    project: {
        type: String,
        required: true,
    }
}, { 
    versionKey: false,
    timestamps: { createdAt: 'created_on',  updatedAt: 'updated_on'},
});