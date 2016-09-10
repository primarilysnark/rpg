/* globals after, afterEach, before, beforeEach, describe, it */
import expect from 'expect';
import mockgoose from 'mockgoose';
import mongoose from 'mongoose';
import request from 'supertest';

import { createApiRequestHandler } from '../src/server/api';
import testRace from './data/race';
import badTestRace from './data/bad-race';
import config from '../src/server/config';

const app = createApiRequestHandler();

describe('races', () => {
  let raceId = null;

  before(done => {
    mockgoose(mongoose).then(() => {
      mongoose.Promise = global.Promise;
      mongoose.connect(config.mongodb.connectionUrl, (err) => done(err));
    });
  });

  beforeEach(() => request(app)
    .post('/races')
    .send(testRace)
    .then(res => {
      raceId = res.body.data.id;
    })
  );

  after(done => {
    mongoose.disconnect(() => done());
  });

  afterEach(() => {
    mockgoose.reset();
  });

  it('fetch existing race', () => request(app)
    .get(`/races/${raceId}`)
    .expect(200, {
      data: {
        ...testRace,
        id: raceId,
      },
    })
  );

  it('fail to fetch missing race with invalid format id', () => request(app)
    .get('/races/not-an-id')
    .expect(404)
  );

  it('fail to fetch missing race with valid format id', () => request(app)
    .get('/races/57cb3f3e37237d091550e5ff')
    .expect(404)
  );

  it('create new race', () => request(app)
    .post('/races')
    .send(testRace)
    .expect(201)
    .expect(res => {
      expect(res.body.data.name).toBe(testRace.name);
      expect(res.body.data.description).toBeA('object');
    })
  );

  it('fail to create new race with bad data', () => request(app)
    .post('/races')
    .send(badTestRace)
    .expect(400)
  );

  it('list all races', () => request(app)
    .get('/races')
    .expect(200)
    .expect(res => {
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe(testRace.name);
      expect(res.body.data[0].description).toBeA('object');
    })
  );

  it('delete existing race', () => request(app)
    .del(`/races/${raceId}`)
    .expect(204)
  );

  it('fail to delete missing race', () => request(app)
    .del('/races/not-an-id')
    .expect(404)
  );
});
