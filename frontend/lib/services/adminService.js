// frontend/lib/services/adminService.js
import apiClient from '../api';

// ===== Dashboard =====
export var dashboardService = {
  getStats: function () {
    return apiClient.get('/admin/dashboard/stats');
  },
  getRecentStudents: function () {
    return apiClient.get('/admin/dashboard/recent-students');
  },
  getEvents: function () {
    return apiClient.get('/admin/dashboard/events');
  },
  getDistribution: function () {
    return apiClient.get('/admin/dashboard/distribution');
  },
  getPendingRequests: function () {
    return apiClient.get('/admin/dashboard/pending-requests');
  },
};

// ===== Students =====
export var adminStudentService = {
  getAll: function (params) {
    return apiClient.get('/admin/students', params || {});
  },
  getById: function (id) {
    return apiClient.get('/admin/students/' + id);
  },
  create: function (data) {
    return apiClient.post('/admin/students', data);
  },
  update: function (id, data) {
    return apiClient.put('/admin/students/' + id, data);
  },
  delete: function (id) {
    return apiClient.delete('/admin/students/' + id);
  },
};

// ===== Instructors =====
export var instructorService = {
  getAll: function (params) {
    return apiClient.get('/admin/instructors', params || {});
  },
  getById: function (id) {
    return apiClient.get('/admin/instructors/' + id);
  },
  getStats: function () {
    return apiClient.get('/admin/instructors/stats');
  },
  getTopRated: function () {
    return apiClient.get('/admin/instructors/top-rated');
  },
  create: function (data) {
    return apiClient.post('/admin/instructors', data);
  },
  update: function (id, data) {
    return apiClient.put('/admin/instructors/' + id, data);
  },
  delete: function (id) {
    return apiClient.delete('/admin/instructors/' + id);
  },
};

// ===== Courses =====
export var courseService = {
  getAll: function (params) {
    return apiClient.get('/admin/courses', params || {});
  },
  getById: function (id) {
    return apiClient.get('/admin/courses/' + id);
  },
  getStats: function () {
    return apiClient.get('/admin/courses/stats');
  },
  getTopEnrolled: function () {
    return apiClient.get('/admin/courses/top-enrolled');
  },
  create: function (data) {
    return apiClient.post('/admin/courses', data);
  },
  update: function (id, data) {
    return apiClient.put('/admin/courses/' + id, data);
  },
  delete: function (id) {
    return apiClient.delete('/admin/courses/' + id);
  },
};

// ===== Classes =====
export var classService = {
  getAll: function (params) {
    return apiClient.get('/admin/classes', params || {});
  },
  getById: function (id) {
    return apiClient.get('/admin/classes/' + id);
  },
  getStudents: function (id, params) {
    return apiClient.get('/admin/classes/' + id + '/students', params || {});
  },
  getStats: function () {
    return apiClient.get('/admin/classes/stats');
  },
  create: function (data) {
    return apiClient.post('/admin/classes', data);
  },
  update: function (id, data) {
    return apiClient.put('/admin/classes/' + id, data);
  },
  delete: function (id) {
    return apiClient.delete('/admin/classes/' + id);
  },
};

// ===== Schedules =====
export var adminScheduleService = {
  getAll: function (params) {
    return apiClient.get('/admin/schedules', params || {});
  },
  getByWeek: function (year, weekNum, params) {
    return apiClient.get(
      '/admin/schedules/week/' + year + '/' + weekNum,
      params || {}
    );
  },
  getStats: function () {
    return apiClient.get('/admin/schedules/stats');
  },
  create: function (data) {
    return apiClient.post('/admin/schedules', data);
  },
  update: function (id, data) {
    return apiClient.put('/admin/schedules/' + id, data);
  },
  delete: function (id) {
    return apiClient.delete('/admin/schedules/' + id);
  },
};

// ===== Grades =====
export var adminGradeService = {
  getAll: function (params) {
    return apiClient.get('/admin/grades', params || {});
  },
  getById: function (id) {
    return apiClient.get('/admin/grades/' + id);
  },
  getStats: function () {
    return apiClient.get('/admin/grades/stats');
  },
  getDistribution: function () {
    return apiClient.get('/admin/grades/distribution');
  },
  getGPATrends: function () {
    return apiClient.get('/admin/grades/gpa-trends');
  },
  create: function (data) {
    return apiClient.post('/admin/grades', data);
  },
  update: function (id, data) {
    return apiClient.put('/admin/grades/' + id, data);
  },
  approve: function (id) {
    return apiClient.put('/admin/grades/' + id + '/approve');
  },
  reject: function (id) {
    return apiClient.put('/admin/grades/' + id + '/reject');
  },
  approveAll: function (data) {
    return apiClient.put('/admin/grades/approve-all', data);
  },
};

// ===== Reports =====
export var reportService = {
  getOverview: function () {
    return apiClient.get('/admin/reports/overview');
  },
  getEnrollmentTrends: function () {
    return apiClient.get('/admin/reports/enrollment-trends');
  },
  getAcademicRanking: function () {
    return apiClient.get('/admin/reports/academic-ranking');
  },
  getGPAByDepartment: function (params) {
    return apiClient.get('/admin/reports/gpa-by-department', params || {});
  },
  getGraduationRate: function () {
    return apiClient.get('/admin/reports/graduation-rate');
  },
  getTopDepartments: function () {
    return apiClient.get('/admin/reports/top-departments');
  },
  getGenderDistribution: function () {
    return apiClient.get('/admin/reports/gender-distribution');
  },
  getDepartmentDetails: function () {
    return apiClient.get('/admin/reports/department-details');
  },
};

// ===== Settings =====
export var settingService = {
  getAll: function () {
    return apiClient.get('/admin/settings');
  },
  updateGeneral: function (data) {
    return apiClient.put('/admin/settings/general', data);
  },
  updateProfile: function (data) {
    return apiClient.put('/admin/settings/profile', data);
  },
  updateNotifications: function (data) {
    return apiClient.put('/admin/settings/notifications', data);
  },
  getSystemStatus: function () {
    return apiClient.get('/admin/settings/system-status');
  },
  getSessions: function () {
    return apiClient.get('/admin/settings/sessions');
  },
  revokeSession: function (id) {
    return apiClient.delete('/admin/settings/sessions/' + id);
  },
  backupDatabase: function () {
    return apiClient.post('/admin/settings/database/backup');
  },
};
