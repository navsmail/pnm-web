
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
var Center = mongoose.model('Center');
var agent = request.agent(app);

var count

/**
 * Centers tests
 */

describe('Centers', function () {
  before(function (done) {
    helper.clearDb()

    // create a user
    var user = new User({
      email: 'foobar@example.com',
      name: 'Foo bar',
      username: 'foobar',
      password: 'foobar'
    })
    user.save(done)
  })

  describe('GET /centers', function () {
    it('should respond with Content-Type text/html', function (done) {
      agent
      .get('/centers')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(/Centers/)
      .end(done)
    })
  })

  describe('GET /centers/new', function () {
    context('When not logged in', function () {
      it('should redirect to /login', function (done) {
        agent
        .get('/centers/new')
        .expect('Content-Type', /plain/)
        .expect(302)
        .expect('Location', '/login')
        .expect(/Moved Temporarily/)
        .end(done)
      })
    })

    context('When logged in', function () {
      before(function (done) {
        // login the user
        agent
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .end(done)
      })

      it('should respond with Content-Type text/html', function (done) {
        agent
        .get('/centers/new')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/New Center/)
        .end(done)
      })
    })
  })

  describe('POST /centers', function () {
    context('When not logged in', function () {
      it('should redirect to /login', function (done) {
        request(app)
        .get('/centers/new')
        .expect('Content-Type', /plain/)
        .expect(302)
        .expect('Location', '/login')
        .expect(/Moved Temporarily/)
        .end(done)
      })
    })

    context('When logged in', function () {
      before(function (done) {
        // login the user
        agent
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .end(done)
      })

      describe('Invalid parameters', function () {
        before(function (done) {
          Center.count(function (err, cnt) {
            count = cnt
            done()
          })
        })

        it('should respond with error', function (done) {
          agent
          .post('/centers')
          .field('title', '')
          .field('body', 'foo')
          .expect('Content-Type', /html/)
          .expect(200)
          .expect(/Center title cannot be blank/)
          .end(done)
        })

        it('should not save to the database', function (done) {
          Center.count(function (err, cnt) {
            count.should.equal(cnt)
            done()
          })
        })
      })

      describe('Valid parameters', function () {
        before(function (done) {
          Center.count(function (err, cnt) {
            count = cnt
            done()
          })
        })

        it('should redirect to the new center page', function (done) {
          agent
          .post('/centers')
          .field('title', 'foo')
          .field('body', 'bar')
          .expect('Content-Type', /plain/)
          .expect('Location', /\/centers\//)
          .expect(302)
          .expect(/Moved Temporarily/)
          .end(done)
        })

        it('should insert a record to the database', function (done) {
          Center.count(function (err, cnt) {
            cnt.should.equal(count + 1)
            done()
          })
        })

        it('should save the center to the database', function (done) {
          Center
          .findOne({ title: 'foo'})
          .populate('user')
          .exec(function (err, center) {
            should.not.exist(err)
            center.should.be.an.instanceOf(Center)
            center.title.should.equal('foo')
            center.body.should.equal('bar')
            center.user.email.should.equal('foobar@example.com')
            center.user.name.should.equal('Foo bar')
            done()
          })
        })
      })
    })
  })

  after(function (done) {
    helper.clearDb()
    done()
  })
})
