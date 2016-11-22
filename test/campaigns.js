/* globals after, afterEach, before, beforeEach, describe, it */
import expect from 'expect';
import express from 'express';
import request from 'supertest';

import { createCampaignRequestHandler } from '../src/server/controllers/campaigns';
import testCampaign from './data/campaign';
import badTestCampaign from './data/bad-campaign';
import config from '../src/server/config';

describe('campaigns', () => {
  const app = express();
  let campaignId = null;

  app.use((req, res, next) => {
    // eslint-disable-next-line no-param-reassign
    req.store = {
      currentUser: {
        id: 1,
      },
    };

    next();
  });

  app.use(createCampaignRequestHandler(config));

  beforeEach(() => request(app)
    .post('/')
    .send(testCampaign)
    .then(res => {
      campaignId = res.body.data.id;
    })
  );

  afterEach(() => request(app)
    .del(`/${campaignId}`)
  );

  it('should fetch existing campaign', () => request(app)
    .get(`/${campaignId}`)
    .expect(200)
    .expect(res => {
      expect(res.body.data.attributes.name).toBe(testCampaign.attributes.name);
    })
  );

  it('should fail to fetch missing campaign with invalid format id', () => request(app)
    .get('/not-an-id')
    .expect(400)
  );

  it('should fail to fetch missing campaign with valid format id', () => request(app)
    .get('/-1')
    .expect(404)
  );

  it('should create new campaign', () => {
    let newCampaignId;

    return request(app)
      .post('/')
      .send(testCampaign)
      .expect(201)
      .expect(res => {
        newCampaignId = res.body.data.id;

        expect(res.body.data.name).toBe(testCampaign.name);
      })
      .then(() => request(app)
        .del(`/${newCampaignId}`)
        .expect(204)
      );
  });

  it('should fail to create new campaign with bad data', () => request(app)
    .post('/')
    .send(badTestCampaign)
    .expect(400)
  );

  it('should list all campaigns', () => request(app)
    .get('/')
    .expect(res => {
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe(testCampaign.name);
    })
  );

  it('should delete existing campaign', () => request(app)
    .del(`/${campaignId}`)
    .expect(204)
  );

  it('should fail to delete invalid campaign id', () => request(app)
    .del('/not-an-id')
    .expect(400)
  );

  it('should fail to delete missing campaign id', () => request(app)
    .del('/-1')
    .expect(404)
  );
});
