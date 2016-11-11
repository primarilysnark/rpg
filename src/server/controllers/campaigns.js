import {
  deleteCampaignById,
  fetchCampaignById,
  fetchCampaigns,
  saveCampaign,
} from '../models';

export function createCampaign(req, res) {
  if (req.body.name == null) {
    return res.status(400).send('Campaigns must have a name');
  }

  if (typeof req.body.name !== 'string') {
    return res.status(400).send('Campaign names must be strings');
  }

  return saveCampaign(req.connection, {
    name: req.body.name,
  })
    .then(campaign => res.status(201).json({
      data: campaign,
    }))
    .catch(err => res.status(400).send(err));
}

export function getCampaign(req, res) {
  if (req.params.campaignId == null) {
    return res.status(400).send();
  }

  const campaignId = parseInt(req.params.campaignId, 10);
  if (isNaN(campaignId)) {
    if (req.params.campaignId == null) {
      return res.status(404).send();
    }
  }

  return fetchCampaignById(req.connection, campaignId)
    .then(campaign => {
      if (campaign == null) {
        return res.status(404).send();
      }

      return res.status(200).json({
        data: campaign,
      });
    })
    .catch(err => res.status(404).send(err));
}

export function getCampaigns(req, res) {
  return fetchCampaigns(req.connection)
    .then(campaigns => res.status(200).json({
      data: campaigns,
    }))
    .catch(err => res.status(500).send(err));
}

export function deleteCampaign(req, res) {
  if (req.params.campaignId == null) {
    return res.status(400).send();
  }

  const campaignId = parseInt(req.params.campaignId, 10);
  if (isNaN(campaignId)) {
    if (req.params.campaignId == null) {
      return res.status(404).send();
    }
  }

  return fetchCampaignById(req.connection, campaignId)
    .then(campaign => {
      if (campaign == null) {
        return res.status(404).send();
      }

      return deleteCampaignById(req.connection, campaign.id);
    })
    .then(() => res.status(204).send())
    .catch(err => res.status(404).send(err));
}
