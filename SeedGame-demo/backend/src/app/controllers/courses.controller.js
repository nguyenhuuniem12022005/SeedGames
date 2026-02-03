import * as coursesService from '../services/courses.service.js';

export async function listCourses(req, res) {
  try {
    const courses = await coursesService.listCourses();
    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

export async function getCourseById(req, res) {
  try {
    const id = req.params.id;
    const course = await coursesService.getCourseById(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
}

export async function createCourse(req, res) {
  try {
    const payload = req.body;
    const course = await coursesService.createCourse(payload);
    res.status(201).json({ course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create course' });
  }
}

export async function updateCourse(req, res) {
  try {
    const id = req.params.id;
    const payload = req.body;
    const updated = await coursesService.updateCourse(id, payload);
    if (!updated) return res.status(404).json({ error: 'Course not found' });
    res.json({ course: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update course' });
  }
}

export async function deleteCourse(req, res) {
  try {
    const id = req.params.id;
    const removed = await coursesService.deleteCourse(id);
    if (!removed) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
}

export async function getModule(req, res) {
  try {
    const { courseId, moduleId } = req.params;
    const module = await coursesService.getModuleById(courseId, moduleId);
    if (!module) return res.status(404).json({ error: 'Module not found' });
    res.json({ module });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
}
