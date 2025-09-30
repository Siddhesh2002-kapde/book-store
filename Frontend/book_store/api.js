import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; 

let access_token = localStorage.getItem('access_token'); 
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/accounts/login/`, { email, password });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    access_token = access;
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

const axiosAuth = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    'Content-Type': 'application/json',
  }
});

// // Get all tasks
// export const getTasks = async () => {
//   try {
//     const token = localStorage.getItem('access_token'); // get saved token
//     const response = await axios.get(`${API_URL}/expenses/expenses/`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     console.log("get response------------", response);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     return [];
//   }
// };

// // Add a new task
// export const addTask = async (task) => {
//   try {
//     const response = await axios.post(
//       `${API_URL}/expenses/expenses/`, 
//       task,
//       { headers: {'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' } } // Set Content-Type to JSON
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error adding task:', error);
//     return { success: false };
//   }
// };

// // Update an existing task
// export const updateTask = async (task) => {
//   try {
//     const response = await axios.put(
//       `${API_URL}/expenses/expenses/${task.id}/`, 
//       task,
//       { headers: {'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' } } // Set Content-Type to JSON
      
//     );
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error('Error updating task:', error);
//     return { success: false };
//   }
// };

// // Delete a task
// export const deleteTask = async (id) => {
//   try {
//     const access_token = localStorage.getItem('access_token');
//     const response = await axios.delete(
//       `${API_URL}/expenses/expenses/${id}/`,
//       {
//         headers: {
//           'Authorization': `Bearer ${access_token}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error('Error deleting task:', error.response || error);
//     return { success: false };
//   }
// };