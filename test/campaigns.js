/* globals afterEach, before, beforeEach, describe, it */
import expect from 'expect';
import mockgoose from 'mockgoose';
import mongoose from 'mongoose';
import request from 'supertest';

import { createApiRequestHandler } from '../src/server/api';
import testCampaign from './data/campaign';
import config from '../src/server/config';

const app = createApiRequestHandler();

before(done => {
  mockgoose(mongoose).then(() => {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.mongodb.connectionUrl, (err) => done(err));
  });
});

describe('campaigns', () => {
  let campaignId = null;

  beforeEach(() => request(app)
    .post('/campaigns')
    .send(testCampaign)
    .then(res => {
      campaignId = res.body.data.id;
    })
  );

  it('should be getable', () => request(app)
    .get(`/campaigns/${campaignId}`)
    .send(testCampaign)
    .expect(200, {
      data: {
        ...testCampaign,
        id: campaignId,
      },
    })
  );

  it('should be creatable', () => request(app)
    .post('/campaigns')
    .send(testCampaign)
    .expect(201)
    .expect(res => {
      expect(res.body.data.name).toBe(testCampaign.name);
    })
  );

  it('should be listable', () => request(app)
    .get('/campaigns')
    .expect(200)
    .expect(res => {
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe(testCampaign.name);
    })
  );

  it('should be deletable', () => request(app)
    .del(`/campaigns/${campaignId}`)
    .expect(204)
  );
});

afterEach(() => {
  mockgoose.reset();
});
