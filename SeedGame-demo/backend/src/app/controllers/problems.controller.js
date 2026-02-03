import * as problemsService from '../services/problems.service.js';

export async function getAllProblems(req, res) {
    try {
        const problems = await problemsService.getAllProblems();
        res.json({ problems, message: 'Lấy danh sách bài toán thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách bài toán' });
    }
}

export async function getProblemDetail(req, res) {
    try {
        const problem = await problemsService.getProblemDetail(req.params.idOrSlug);
        if (!problem) {
            return res.status(404).json({ message: 'Bài toán không tìm thấy' });
        }
        res.json({ problem, message: 'Lấy chi tiết bài toán thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết bài toán' });
    }
}

export async function submitProblem(req, res) {
    try {
        const { userId, problemId, codeContent, status, judgeResult } = req.body;
        const submission = await problemsService.submitProblem({
            userId,
            problemId,
            codeContent,
            status,
            judgeResult
        });
        res.status(201).json({ submission, message: 'Nộp bài thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi nộp bài' });
    }
}

export async function getUserSubmissions(req, res) {
    try {
        const { problemId, userId } = req.params;
        const submissions = await problemsService.getUserSubmissions(problemId, userId);
        res.json({ submissions, message: 'Lấy danh sách nộp bài thành công!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách nộp bài' });
    }
}
