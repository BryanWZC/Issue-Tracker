'use strict';

const ObjectId = require('mongoose').Types.ObjectId;
const Issue = require('../db/model');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      const project = req.params.project;
      const query = { ...req.query, project};
      const allIssues = await Issue.find(query).lean().exec();
      res.send(allIssues);
    })
    
    .post(async function (req, res){
      const project = req.params.project;
      try {
        const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
        const newIssue = await Issue.create({
          issue_title,
          issue_text,
          created_by,
          assigned_to: assigned_to || '',
          status_text: status_text || '',
          project
        });
        delete newIssue.project;
        res.json(newIssue);
      } catch (error) {
        res.json({ error: 'required field(s) missing' });
      }
    })
    
    .put(async function (req, res){
      try {
        const { _id } = req.body;
        if(!ObjectId.isValid(_id)) throw { error: 'missing _id' };
  
        const updateFields = { ... req.body };
        delete updateFields._id;
        if(!Object.keys(updateFields).length) throw { error: 'no update field(s) sent', _id }

        const updatedDoc = await Issue.findByIdAndUpdate(_id, updateFields, { new: true, useFindAndModify: false });
        if(!updatedDoc) throw { error: 'could not update', _id };
  
        res.json({ result: 'successfully updated', _id });
      } catch (error) {
        res.json(error);
      }
    })
    
    .delete(async function (req, res){
      try {
        const { _id } = req.body;
        if(!_id) throw { error: 'missing _id' };

        const results = await Issue.deleteOne({ _id });
        if(!results.deletedCount) throw { error: 'could not delete', _id };

        res.json({ result: 'successfully deleted', '_id': _id });
      } catch (error) {
        res.json(error);
      }
    });
    
};
