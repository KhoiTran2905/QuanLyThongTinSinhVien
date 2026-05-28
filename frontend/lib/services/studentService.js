// frontend/lib/services/studentService.js
import apiClient from '../api';

// ===== Dashboard =====
export var studentDashboardService = {
  getDashboard: function () {
    return apiClient.get('/student/dashboard');
  },
  getTodaySchedule: function () {
    return apiClient.get('/student/dashboard/today');
  },
  getNotifications: function () {
    return apiClient.get('/student/dashboard/notifications');
  },
  getRecentGrades: function () {
    return apiClient.get('/student/dashboard/recent-grades');
  },
  getStats: function () {
    return apiClient.get('/student/dashboard/stats');
  },
};

// ===== Profile =====
export var profileService = {
  getProfile: function () {
    return apiClient.get('/student/profile');
  },
  updatePersonal: function (data) {
    return apiClient.put('/student/profile/personal', data);
  },
  updateContact: function (data) {
    return apiClient.put('/student/profile/contact', data);
  },
  updateFamily: function (data) {
    return apiClient.put('/student/profile/family', data);
  },
  updateAvatar: function (formData) {
    return apiClient.putFormData('/student/profile/avatar', formData);
  },
};

// ===== Registration =====
export var registrationService = {
  getInfo: function () {
    return apiClient.get('/student/registration/info');
  },
  getAvailable: function (params) {
    return apiClient.get('/student/registration/available', params || {});
  },
  getRegistered: function () {
    return apiClient.get('/student/registration/registered');
  },
  register: function (courseId) {
    return apiClient.post('/student/registration/register', {
      course_id: courseId,
    });
  },
  cancel: function (courseId) {
    return apiClient.delete('/student/registration/' + courseId);
  },
  confirm: function () {
    return apiClient.post('/student/registration/confirm');
  },
};

// ===== Schedule =====
export var scheduleService = {
  getSchedule: function (params) {
    return apiClient.get('/student/schedule', params || {});
  },
  getByWeek: function (year, weekNum) {
    return apiClient.get('/student/schedule/week/' + year + '/' + weekNum);
  },
  getStats: function () {
    return apiClient.get('/student/schedule/stats');
  },
};

// ===== Grades =====
export var gradeService = {
  getOverview: function () {
    return apiClient.get('/student/grades');
  },
  getBySemester: function (semesterCode) {
    return apiClient.get(
      '/student/grades/semester/' + encodeURIComponent(semesterCode)
    );
  },
  getAllGrades: function () {
    return apiClient.get('/student/grades/all');
  },
  getGPAScale: function () {
    return apiClient.get('/student/grades/gpa-scale');
  },
};

// ===== Tuition =====
export var tuitionService = {
  getCurrent: function () {
    return apiClient.get('/student/tuition/current');
  },
  getHistory: function () {
    return apiClient.get('/student/tuition/history');
  },
  getPaymentMethods: function () {
    return apiClient.get('/student/tuition/payment-methods');
  },
  getBankInfo: function () {
    return apiClient.get('/student/tuition/bank-info');
  },
  getReceipt: function (id) {
    return apiClient.get('/student/tuition/receipt/' + id);
  },
  pay: function (tuitionId, paymentMethod) {
    return apiClient.post('/student/tuition/pay', {
      tuition_id: tuitionId,
      payment_method: paymentMethod,
    });
  },
};

// ===== Notifications =====
export var notificationService = {
  getAll: function (params) {
    return apiClient.get('/student/notifications', params || {});
  },
  getUnreadCount: function () {
    return apiClient.get('/student/notifications/unread-count');
  },
  markAsRead: function (id) {
    return apiClient.put('/student/notifications/' + id + '/read');
  },
  markAllAsRead: function () {
    return apiClient.put('/student/notifications/read-all');
  },
  delete: function (id) {
    return apiClient.delete('/student/notifications/' + id);
  },
};