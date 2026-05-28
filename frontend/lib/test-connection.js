// frontend/lib/test-connection.js
// Chạy trong browser console hoặc tạo trang test
import api from './api';

export async function testConnection() {
  try {
    // Test health check (không cần auth)
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    console.log('✅ Backend connection OK:', data);
    return true;
  } catch (error) {
    console.error('❌ Backend connection FAILED:', error);
    return false;
  }
}