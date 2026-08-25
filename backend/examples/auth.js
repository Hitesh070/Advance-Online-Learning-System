/**
 * Authentication Service for Vaxhakal
 * This file provides a client-side service for interacting with the authentication API
 */

class AuthService {
    constructor(baseUrl = '../api') {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('token') || null;
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    /**
     * Get the authentication headers
     * @returns {Object} Headers object with Authorization token if available
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    /**
     * Register a new user
     * @param {Object} userData User registration data
     * @returns {Promise} Promise with registration result
     */
    async register(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/auth.php?action=register`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(userData)
            });

            return await response.json();
        } catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again later.'
            };
        }
    }

    /**
     * Login a user
     * @param {Object} credentials User login credentials
     * @returns {Promise} Promise with login result
     */
    async login(credentials) {
        try {
            const response = await fetch(`${this.baseUrl}/auth.php?action=login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (data.success && data.token) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again later.'
            };
        }
    }

    /**
     * Logout the current user
     * @returns {Promise} Promise with logout result
     */
    async logout() {
        try {
            const response = await fetch(`${this.baseUrl}/auth.php?action=logout`, {
                method: 'POST',
                headers: this.getHeaders()
            });

            const data = await response.json();

            // Clear local storage and service state regardless of API response
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            return data;
        } catch (error) {
            // Still clear local data even if API call fails
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            return {
                success: true,
                message: 'Logged out successfully.'
            };
        }
    }

    /**
     * Request a password reset
     * @param {Object} data Email data
     * @returns {Promise} Promise with request result
     */
    async requestPasswordReset(data) {
        try {
            const response = await fetch(`${this.baseUrl}/auth.php?action=reset-password-request`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });

            return await response.json();
        } catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again later.'
            };
        }
    }

    /**
     * Reset password with token
     * @param {Object} data Reset data including token and new password
     * @returns {Promise} Promise with reset result
     */
    async resetPassword(data) {
        try {
            const response = await fetch(`${this.baseUrl}/auth.php?action=reset-password`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });

            return await response.json();
        } catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again later.'
            };
        }
    }

    /**
     * Refresh the authentication token
     * @returns {Promise} Promise with refresh result
     */
    async refreshToken() {
        if (!this.token) {
            return {
                success: false,
                message: 'No authentication token available.'
            };
        }

        try {
            const response = await fetch(`${this.baseUrl}/auth.php?action=refresh-token`, {
                method: 'POST',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (data.success && data.token) {
                this.token = data.token;
                localStorage.setItem('token', data.token);
            }

            return data;
        } catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again later.'
            };
        }
    }

    /**
     * Get the current user profile
     * @returns {Promise} Promise with user profile data
     */
    async getProfile() {
        if (!this.token) {
            return {
                success: false,
                message: 'Not authenticated.'
            };
        }

        try {
            const response = await fetch(`${this.baseUrl}/users.php`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (data.success && data.user) {
                this.user = data.user;
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again later.'
            };
        }
    }

    /**
     * Update the current user profile
     * @param {Object} profileData Updated profile data
     * @returns {Promise} Promise with update result
     */
    async updateProfile(profileData) {
        if (!this.token) {
            return {
                success: false,
                message: 'Not authenticated.'
            };
        }

        try {
            const response = await fetch(`${this.baseUrl}/users.php`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (data.success && data.user) {
                this.user = data.user;
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again later.'
            };
        }
    }

    /**
     * Check if the user is authenticated
     * @returns {Boolean} True if authenticated, false otherwise
     */
    isAuthenticated() {
        return !!this.token;
    }

    /**
     * Get the current user data
     * @returns {Object|null} User data or null if not authenticated
     */
    getCurrentUser() {
        return this.user;
    }

    /**
     * Check if the current user has a specific role
     * @param {String} role Role to check
     * @returns {Boolean} True if user has the role, false otherwise
     */
    hasRole(role) {
        if (!this.user || !this.user.role) {
            return false;
        }
        return this.user.role === role;
    }

    /**
     * Check if the current user has a specific permission
     * @param {String} permission Permission to check
     * @returns {Boolean} True if user has the permission, false otherwise
     */
    hasPermission(permission) {
        if (!this.user || !this.user.permissions || !Array.isArray(this.user.permissions)) {
            return false;
        }
        return this.user.permissions.includes(permission);
    }
}

// Create a global instance of the AuthService
const authService = new AuthService();

// Export the service
if (typeof module !== 'undefined' && module.exports) {
    module.exports = authService;
}