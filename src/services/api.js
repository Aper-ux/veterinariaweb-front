import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Url principal del backend

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    response => {
        // Verificar si la respuesta es un array (como en el caso del inventario)
        if (Array.isArray(response.data)) {
            return response.data;  // Devuelve directamente el array de datos
        }
        
        // Si la respuesta tiene un campo "success", manejarlo normalmente
        if (response.data && response.data.success) {
            return response.data.data;  // Devuelve los datos del campo "data"
        }
        
        // Si no es un array o no tiene el campo "success", devuelve la respuesta completa
        return response;
    },
    error => {
        // Manejar errores
        if (error.response && error.response.data && error.response.data.error) {
            return Promise.reject(error.response.data.error);
        }
        console.error("Axios error:", error);
        return Promise.reject(error);
    }
);

export const getDailyAppointments = async (veterinarianId) => {
    try {
      const response = await axios.get(`${API_URL}/api/appointments/daily`, {
        params: {
          veterinarianId: veterinarianId
        }
      });
      return response.data.data.appointments;
    } catch (error) {
      console.error('Error al obtener las citas diarias:', error);
      throw error;
    }
  };
// Función de login
export const loginApi = (credentials) => {
    return axios.post(`${API_URL}/auth/login`, credentials);
};
  // Función de registro normal (CLIENTE)
export const registerApi = (userData) => {
    return axios.post(`${API_URL}/auth/register`, userData);
};
  
  // Función de registro por admin (VETERINARIO)
export const adminRegisterApi = (userData) => {
    return axios.post(`${API_URL}/users/create-with-roles`, userData);
};

  
export const getUsersApi = (isActive, role) => {
    return axios.get(`${API_URL}/users`, { params: { isActive, role } });
};

export const createUserApi = (userData) => {
    return axios.post(`${API_URL}/users`, userData);
};

export const updateUserApi = (userId, userData) => {
    return axios.put(`${API_URL}/users/${userId}`, userData);
};

export const deleteUserApi = (userId) => {
    return axios.delete(`${API_URL}/users/${userId}`);
};

export const toggleUserStatusApi = (userId, isActive) => {
    return axios.post(`${API_URL}/users/${userId}/toggle-status`, { isActive });
};
//roles
export const getRolesApi = () => {
    return axios.get(`${API_URL}/roles`);
};

export const updateRolePermissionsApi = (roleName, permissions) => {
    return axios.put(`${API_URL}/roles/${roleName}`, permissions);
};

export const updateUserRolesApi = (userId, roles) => {
    return axios.put(`${API_URL}/users/${userId}/roles`, roles);
};

export const getAllPets = async (page = 0, size = 10) => {
    try {
        const response = await axios.get(`${API_URL}/pets`, {
            params: { page, size } // Pasar número de página y tamaño como parámetros
        });
        console.log('Respuesta completa:', response);
        if (response && response.content) {
            return response;
        } else {
            console.error('La respuesta no contiene el campo `content` esperado.');
            return { content: [], totalPages: 1 }; // Devuelve un array vacío si no hay contenido
        }
    } catch (error) {
        console.error('Error en la solicitud de mascotas:', error);
        throw error;
    }
};




export const getUserProfile = () => {
    return axios.get(`${API_URL}/users/me`);
};

export const updateUserProfile = (profileData) => {
    return axios.put(`${API_URL}/users/me`, profileData);
};

export const getUserPets = () => {
    return axios.get(`${API_URL}/users/me/pets`);
};

export const updatePet = (petId, petData) => {
    return axios.put(`${API_URL}/pets/${petId}`, petData);
};

export const changePassword = (passwordData) => {
    return axios.post(`${API_URL}/users/me/change-password`, passwordData);
};
// services/api.js

export const getCurrentUserPets = () => {
    return axios.get(`${API_URL}/pets/me`);
};

export const createPet = (petData) => {
    return axios.post(`${API_URL}/pets`, petData);
};


export const deletePet = (petId) => {
    return axios.delete(`${API_URL}/pets/${petId}`);
};
//endpoints de veterinario
export const getAllUsers = (isActive, role) => {
    let url = `${API_URL}/users`;
    const params = new URLSearchParams();
    if (isActive !== null) params.append('isActive', isActive);
    if (role) params.append('role', role);
    if (params.toString()) url += `?${params.toString()}`;

    return axios.get(url)
        .then(response => {
            console.log("Full response:", response);
            // Verificar si la respuesta es un array directamente
            if (Array.isArray(response)) {
                return response;
            }
            // Si no es un array, buscar en data o en data.data
            else if (response.data) {
                if (Array.isArray(response.data)) {
                    return response.data;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    return response.data.data;
                }
            }
            console.error("Unexpected response structure:", response);
            throw new Error("Unexpected response structure");
        })
        .catch(error => {
            console.error("Error in getAllUsers:", error);
            throw error;
        });
};

export const createUser = (userData) => {
    return axios.post(`${API_URL}/users`, userData);
};

export const updateUser = (userId, userData) => {
    return axios.put(`${API_URL}/users/${userId}`, userData);
};

export const deleteUser = (userId) => {
    return axios.delete(`${API_URL}/users/${userId}`);
};

export const toggleUserStatus = (userId, isActive) => {
    return axios.post(`${API_URL}/users/${userId}/toggle-status`, { isActive });
};
//inventario
export const getInventoryItems = async () => {
    try {
        const response = await axios.get(`${API_URL}/inventory`);
        console.log('API Response:', response);  // Aquí ahora debe mostrar el array directamente
        return response;  // Devuelve directamente el array de productos
    } catch (error) {
        console.error("Error fetching inventory items:", error);
        throw error;
    }
};




export const addInventoryItem = async (data) => {
    return axios.post(`${API_URL}/inventory`, data);
};
export const updateInventoryItem = async (id, data) => {
    if (!id || !data) {
        throw new Error("Missing id or data for update");
    }
    const response = await axios.put(`${API_URL}/inventory/${id}`, data);
    return response.data;
};

export const getLowStockProducts = async () => {
    const response = await axios.get(`${API_URL}/inventory/low-stock`);
    return response.data;
};

// endpoints de citas
export const getAllCitas = () => {
    return axios.get(`${API_URL}/appointments`);
};

export const createCita = (citaData) => {
    return axios.post(`${API_URL}/appointments`, citaData);
};

export const updateCita = (citaId, citaData) => {
    return axios.put(`${API_URL}/appointments/${citaId}`, citaData);
};

export const deleteCita = (citaId) => {
    return axios.delete(`${API_URL}/appointments/${citaId}`);
};

export const getAvailableTimes = (date) => {
    return axios.get(`${API_URL}/appointments/available-times`, { params: { date } });
};

export const getAvailableDates = () => {
    return axios.get(`${API_URL}/appointments/available-dates`);
};

// Endpoints de historial clínico
export const getAllHistorial = (petId) => {
    return axios.get(`${API_URL}/historial-clinico/mascota/${petId}`);
  };
  
export const createHistorial = (petId, historialData) => {
    return axios.post(`${API_URL}/historial-clinico/mascota/${petId}`, historialData);
};



export const updateHistorial = (historialId, historialData) => {
    // Endpoint para actualizar un historial existente
    return axios.put(`${API_URL}/historial-clinico/${historialId}`, historialData);
};

export const deleteHistorial = (historialId) => {
    // Endpoint para eliminar un historial específico
    return axios.delete(`${API_URL}/historial-clinico/${historialId}`);
};


// Obtener las citas del cliente autenticado
export const getMyAppointments = async () => {
    const response = await axios.get('/api/appointments/my-pets');
    return response.data;
};

// Cancelar una cita
export const cancelAppointment = async (appointmentId) => {
    await axios.put(`/api/appointments/${appointmentId}/cancel`);
};

// Reprogramar una cita
export const rescheduleAppointment = async (appointmentId, newDate) => {
    await axios.put(`/api/appointments/${appointmentId}/reschedule`, { newDate });
};

// Obtener todos los clientes
export const getAllClients = async () => {
    const response = await axios.get('/api/clients');
    return response.data;
};

// Obtener mascotas por cliente
export const getPetsByClient = async (clientId) => {
    const response = await axios.get(`/api/clients/${clientId}/pets`);
    return response.data;
};

// Comprobar disponibilidad del veterinario
export const checkVetAvailability = async (date, time) => {
    const response = await axios.post('/api/vet/check-availability', { date, time });
    return response.data.available;
};

// Crear una nueva cita
export const createAppointment = async (clientId, petId, date, time) => {
    await axios.post('/api/appointments', { clientId, petId, date, time });
};