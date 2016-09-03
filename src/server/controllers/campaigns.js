import { Campaign, prettifyCampaign } from '../models';

export function createCampaign(req, res) {
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
  return Campaign.findById(req.params.campaignId)
    .then(campaign => {
      if (campaign == null) {
        return res.status(404).send();
      }

      return res.status(200).json({
        data: prettifyCampaign(campaign),
      });
    })
    .catch(err => res.status(400).send(err));
}

export function getCampaigns(req, res) {
  return Campaign.find()
    .then(campaigns => res.status(200).json({
      data: campaigns.map(prettifyCampaign),
    }))
    .catch(err => res.status(400).send(err));
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
    .catch(err => res.status(400).send(err));
}
