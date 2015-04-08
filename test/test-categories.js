
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../server')
  , context = describe
  , User = mongoose.model('Category')
  , agent = request.agent(app)

var count

/**
 * Centers tests
 */

describe('Categories', function () {
  describe('POST /categories', function () {
    it('should respond with Content-Type text/html', function (done) {
      agent
      .get('/centers')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(/Centers/)
      .end(done)
    })
  })
