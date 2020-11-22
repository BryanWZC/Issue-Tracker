const { model } = require('mongoose');
const issueSchema = require('./schema');

module.exports = model('Issue', issueSchema);