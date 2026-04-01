import useUserStore from "../stores/userStore";
import axios from "axios";


export const mainApi = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    }
})

mainApi.interceptors.request.use(config => {
    const token = useUserStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const apiRegister = async (body) => {
    return mainApi.post('/auth/register', body)
}

// ==========================================
// 1. AUTH API (การจัดการผู้ใช้งาน)
// ==========================================
export const registerUser = (body) => mainApi.post('/api/auth/register', body);
export const loginUser = (body) => mainApi.post('/api/auth/login', body);
export const getMe = () => mainApi.get('/api/auth/me');
export const editProfile = (body) => mainApi.put('/api/auth/me/profile', body);
export const deleteAccount = () => mainApi.delete('/api/auth/me');

// ==========================================
// 2. STORE API (การจัดการร้านค้า)
// ==========================================
export const getAllStores = () => mainApi.get('/store');
export const getStoreById = (id) => mainApi.get(`/store/${id}`);
export const createStore = (body) => mainApi.post('/store', body);
export const updateStore = (id, body) => mainApi.put(`/store/${id}`, body);
export const deleteStore = (id) => mainApi.delete(`/store/${id}`);

// ==========================================
// 3. RESERVATION API (การจัดการการจอง)
// ==========================================
export const getMyReservations = () => mainApi.get('/reservation'); // หรือ /reservations ขึ้นอยู่กับ app.js 
export const getReservationById = (id) => mainApi.get(`/reservation/${id}`);
export const createReservation = (body) => mainApi.post('/reservation', body);
export const editReservation = (id, body) => mainApi.put(`/reservation/${id}`, body);
export const deleteReservation = (id) => mainApi.delete(`/reservation/${id}`);

// ==========================================
// 4. HISTORY API (ประวัติการใช้งาน)
// ==========================================
export const getHistory = () => mainApi.get('/history');
export const getHistoryById = (id) => mainApi.get(`/history/${id}`);

// ==========================================
// 5. MEDIA API (การจัดการรูปภาพ/สื่อ)
// ==========================================
export const getAllMedia = (id) => mainApi.get(`/media/${id}`);
export const createMedia = (id, formData) => mainApi.post(`/media/${id}`, formData, {
    // กรณีอัปโหลดไฟล์ ต้องตั้ง headers แบบนี้
    headers: { 'Content-Type': 'multipart/form-data' } 
});
export const deleteMedia = (id) => mainApi.delete(`/media/${id}`);

// ==========================================
// 6. REVIEW API (การจัดการรีวิว)
// ==========================================
export const getReviewByStore = (storeId) => mainApi.get(`/review/store/${storeId}`);
export const createReview = (storeId, body) => mainApi.post(`/review/store/${storeId}`, body);
export const editReview = (storeId, body) => mainApi.put(`/review/store/${storeId}`, body);
export const deleteReview = (storeId) => mainApi.delete(`/review/store/${storeId}`);