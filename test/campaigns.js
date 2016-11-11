/* globals after, afterEach, before, beforeEach, describe, it */
import expect from 'expect';
import request from 'supertest';

import { createApiRequestHandler } from '../src/server/api';
import testCampaign from './data/campaign';
import badTestCampaign from './data/bad-campaign';
import config from '../src/server/config';

const app = createApiRequestHandler(config);

describe('campaigns', () => {
  let campaignId = null;

  beforeEach(() => request(app)
    .post('/campaigns')
    .send(testCampaign)
    .then(res => {
      campaignId = res.body.data.id;
    })
  );

  afterEach(() => request(app)
    .del(`/campaigns/${campaignId}`)
  );

  it('fetch existing campaign', () => request(app)
    .get(`/campaigns/${campaignId}`)
    .expect(200, {
      data: {
        ...testCampaign,
        id: campaignId,
      },
    })
  );

  it('fail to fetch missing campaign with invalid format id', () => request(app)
    .get('/campaigns/not-an-id')
    .expect(404)
  );

  it('fail to fetch missing campaign with valid format id', () => request(app)
    .get('/campaigns/57cb3f3e37237d091550e5ff')
    .expect(404)
  );

  it('create new campaign', () => {
    let newCampaignId;

    return request(app)
      .post('/campaigns')
      .send(testCampaign)
      .expect(201)
      .expect(res => {
        newCampaignId = res.body.data.id;

        expect(res.body.data.name).toBe(testCampaign.name);
      })
      .then(() => request(app)
        .del(`/campaigns/${newCampaignId}`)
        .expect(204)
      );
  });

  it('fail to create new campaign with bad data', () => request(app)
    .post('/campaigns')
    .send(badTestCampaign)
    .expect(400)
  );

  it('list all campaigns', () => request(app)
    .get('/campaigns')
    .expect(200)
    .expect(res => {
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe(testCampaign.name);
    })
  );

  it('delete existing campaign', () => request(app)
    .del(`/campaigns/${campaignId}`)
    .expect(204)
  );

  it('fail to delete missing campaign', () => request(app)
    .del('/campaigns/not-an-id')
    .expect(404)
  );
});
