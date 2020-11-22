const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id1;

suite('Functional Tests', function() {
  
  suite('POST /api/issues/{project}', function() {
    
    test('Every field filled in', function(done) {
      chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA'
      })
      .end(function(err, res){
        const data = res.body;
        id1 = data._id;
        assert.equal(res.status, 200);
        assert.equal(data.issue_title, 'Title');
        assert.equal(data.issue_text, 'text');
        assert.equal(data.created_by, 'Functional Test - Every field filled in');
        assert.equal(data.assigned_to, 'Chai and Mocha');
        assert.equal(data.status_text, 'In QA');
        done();
      });
    });
    
    test('Required fields filled in, Optional Fields Blank', function(done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Every field filled in',
        })
        .end(function(err, res){
            const data = res.body;
            assert.equal(res.status, 200);
            assert.equal(data.issue_title, 'Title');
            assert.equal(data.issue_text, 'text');
            assert.equal(data.created_by, 'Functional Test - Every field filled in');
            assert.equal(data.assigned_to, '');
            assert.equal(data.status_text, '');
        });
      done();
    });
    
    test('Missing required fields => { error: "required field(s) missing" }', function(done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
            issue_title: 'Title',
            issue_text: 'text',
        })
        .end(function(err, res){
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { error: "required field(s) missing" });
        });
        done();
    });
    
  });

  suite('GET /api/issues/{project}', function() {
    
    test('No filter', function(done) {
      chai.request(server)
      .get('/api/issues/test')
      .query({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });
    
    test('One filter', function(done) {
      chai.request(server)
            .get('/api/issues/test')
            .query({ open: true })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.equal(res.body[0].open, true);
            });
      done();
    });
    
    test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
      chai.request(server)
            .get('/api/issues/test')
            .query({ open: true, created_by: 'Functional Test - Every field filled in' })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.equal(res.body[0].open, true);
                assert.equal(res.body[0].created_by, 'Functional Test - Every field filled in');
            });
      done();
    });
    
  });
  
  suite('PUT /api/issues/{project}', function() {
          
    test('One field to update => {result: "successfully updated", _id: _id}', function(done) {
      chai.request(server)
            .put('/api/issues/test')
            .send({
                _id: id1,
                issue_title: 'Updated title',
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {result: "successfully updated", _id: id1});
            });
        done();
    });
    
    test('Multiple fields to update => {result: "successfully updated", _id: _id}', function(done) {
      chai.request(server)
            .put('/api/issues/test')
            .send({
                _id: id1,
                issue_title: 'Updated title',
                issue_text: 'Updated text',
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {result: "successfully updated", _id: id1});
            });
        done();
    });

    test('No _id submitted => { error: "missing _id" }', function(done) {
      chai.request(server)
            .put('/api/issues/test')
            .send({ })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: "missing _id" });
            });
        done();
    });

    test('No fields to update => { error: "no update field(s) sent", _id: _id }', function(done) {
      chai.request(server)
            .put('/api/issues/test')
            .send({ 
                _id: id1,
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: "no update field(s) sent", _id: id1 });
            });
        done();
    });

    test('Invalid _id => { error: "missing _id" }', function(done) {
      chai.request(server)
            .put('/api/issues/test')
            .send({ 
                _id: 'hasdbjc',
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: "missing _id" });
            });
        done();
    });
    
  });
   
  
  suite('DELETE /api/issues/{project}', function() {

    test('Valid _id', function(done) {
      chai.request(server)
            .delete('/api/issues/test')
            .send({ 
                _id: id1,
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { result: 'successfully deleted', '_id': id1 });
            });
        done();
    });
    test('Invalid _id => { error: "could not delete", "_id": _id }', function(done) {
      const badId = "5f665eb46e296f6b9b6a504d";
        chai.request(server)
            .delete('/api/issues/test')
            .send({ 
                _id: badId,
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: "could not delete", "_id": badId });
            });
        done();
    });
    
    test('No _id => { error: "missing _id" }', function(done) {
      chai.request(server)
            .delete('/api/issues/test')
            .send({ })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: "missing _id" });
            });
      done();
    });
  });
});
