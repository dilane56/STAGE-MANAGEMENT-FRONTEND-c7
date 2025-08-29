const API_BASE_URL = "http://localhost:9001"

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    })

    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshToken = localStorage.getItem("refreshToken")
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
          })
          
          const refreshData = await refreshResponse.json()
          
          if (refreshData.success) {
            localStorage.setItem("token", refreshData.token)
            // Retry original request with new token
            return fetch(url, {
              ...options,
              headers: {
                ...this.getAuthHeaders(),
                ...options.headers
              }
            })
          }
        } catch (error) {
          // Refresh failed, redirect to login
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("user")
          window.location.href = "/"
        }
      }
    }

    return response
  }

  async get(endpoint: string) {
    return this.request(endpoint)
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    })
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data)
    })
  }

  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: "DELETE"
    })
  }
}

export const apiService = new ApiService()