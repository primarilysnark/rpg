import { Campaign, prettifyCampaign } from '../models';

export function createCampaign(req, res) {
  if (req.body.name == null) {
    return res.status(400).send('Campaigns must have a name');
  }

  if (typeof req.body.name !== 'string') {
    return res.status(400).send('Campaign names must be strings');
  }

  return new Campaign({
    name: req.body.name,
  })
    .save()
    .then(campaign => res.status(201).json({
      data: prettifyCampaign(campaign),
    }))
    .catch(err => res.status(400).send(err));
}

export function getCampaign(req, res) {
  if (req.params.campaignId == null) {
    return res.status(400).send();
  }

  return Campaign.findById(req.params.campaignId)
    .then(campaign => {
      if (campaign == null) {
        return res.status(404).send();
      }

      return res.status(200).json({
        data: prettifyCampaign(campaign),
      });
    })
    .catch(err => res.status(404).send(err));
}

export function getCampaigns(req, res) {
  return Campaign.find()
    .then(campaigns => res.status(200).json({
      data: campaigns.map(prettifyCampaign),
    }))
    .catch(err => res.status(500).send(err));
}

export function deleteCampaign(req, res) {
  return Campaign.findById(req.params.campaignId)
    .then(campaign => {
      if (campaign == null) {
        return res.status(404).send();
      }

      return Campaign.where({ _id: req.params.campaignId })
        .remove();
    })
    .then(() => res.status(204).send())
    .catch(err => res.status(404).send(err));
}
