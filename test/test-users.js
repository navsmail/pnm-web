
/**
 * Module dependencies.
 */

var helper = require('./helper');
var mongoose = require('mongoose');
var should = require('should');
var request = require('supertest');
var app = require('../server');
var context = describe;
var User = mongoose.model('User');

var cookies, count

/**
 * Users tests
 */

describe('Users', function () {
  describe('POST /users', function () {
    describe('Invalid parameters', function () {
      before(function (done) {
        helper.clearDb()

        User.count(function (err, cnt) {
          count = cnt
          done()
        })
      })

      it('no email - should respond with errors', function (done) {
        request(app)
        .post('/users')
        .field('name', 'Foo bar')
        .field('username', 'foobar')
        .field('email', '')
        .field('password', 'foobar')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/Email cannot be blank/)
        .end(done)
      })

      it('no name - should respond with errors', function (done) {
        request(app)
        .post('/users')
        .field('name', '')
        .field('username', 'foobar')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/Name cannot be blank/)
        .end(done)
      })

      it('should not save the user to the database', function (done) {
        User.count(function (err, cnt) {
          count.should.equal(cnt)
          done()
        })
      })
    })

    describe('Valid parameters', function () {
      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt
          done()
        })
      })

      it('should redirect to /centers', function (done) {
        request(app)
        .post('/users')
        .field('name', 'Foo bar')
        .field('username', 'foobar')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect('Content-Type', /plain/)
        .expect('Location', /\//)
        .expect(302)
        .expect(/Moved Temporarily/)
        .end(done)
      })

      it('should insert a record to the database', function (done) {
        User.count(function (err, cnt) {
          cnt.should.equal(count + 1)
          done()
        })
      })

      it('should save the user to the database', function (done) {
        User.findOne({ username: 'foobar' }).exec(function (err, user) {
          should.not.exist(err)
          user.should.be.an.instanceOf(User)
          user.email.should.equal('foobar@example.com')
          done()
        })
      })
    })
  })

  after(function (done) {
    helper.clearDb();
    done()
  })
})
