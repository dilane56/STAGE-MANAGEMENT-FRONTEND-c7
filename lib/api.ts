const API_BASE_URL = "http://localhost:9001"

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    }
    
    console.log("Token utilisé dans les headers:", token);

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    return headers
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers
    }
    
    console.log('Request:', { url, headers })
    
    const response = await fetch(url, {
      ...options,
      headers
    })

    if (response.status === 401 || response.status === 403) {
      // Token expired or invalid, try to refresh
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
          console.error("Token refresh failed:", error)
        }
      }
      
      // If refresh fails or no refresh token, redirect to login
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      window.location.href = "/"
      return response
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