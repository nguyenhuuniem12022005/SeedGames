import * as contestsService from '../services/contests.service.js';

export async function listContests(req, res) {
  try {
    const contests = await contestsService.listContests();
    res.json({ contests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contests' });
  }
}

export async function getContestById(req, res) {
  try {
    const id = req.params.id;
    const contest = await contestsService.getContestById(id);
    if (!contest) return res.status(404).json({ error: 'Contest not found' });
    res.json({ contest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contest' });
  }
}

export async function getContestRankings(req, res) {
  try {
    const contestId = req.params.id;
    const rankings = await contestsService.getContestRankings(contestId);
    res.json({ rankings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch rankings' });
  }
}

export async function registerContest(req, res) {
  try {
    const contestId = req.params.id;
    const userId = req.user.id; // from JWT
    const result = await contestsService.registerContest(contestId, userId);
    if (!result) return res.status(400).json({ error: 'Failed to register' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register contest' });
  }
}

export async function createContest(req, res) {
  try {
    const payload = req.body;
    const contest = await contestsService.createContest(payload);
    res.status(201).json({ contest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create contest' });
  }
}

export async function updateContest(req, res) {
  try {
    const id = req.params.id;
    const payload = req.body;
    const updated = await contestsService.updateContest(id, payload);
    if (!updated) return res.status(404).json({ error: 'Contest not found' });
    res.json({ contest: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update contest' });
  }
}

export async function deleteContest(req, res) {
  try {
    const id = req.params.id;
    const removed = await contestsService.deleteContest(id);
    if (!removed) return res.status(404).json({ error: 'Contest not found' });
    res.json({ message: 'Contest deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete contest' });
  }
}
