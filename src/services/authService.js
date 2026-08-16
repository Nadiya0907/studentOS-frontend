
import api, { USE_MOCK_API } from "./api"; 
 
const demoUser = (data) => ({ 
  id: "demo-user", 
  name: data.full_name || data.name || "Nadz", 
  email: data.email || "student@example.com", 
  role: 
    data.role || 
    (data.email === "admin@studentos.local" 
      ? "admin" 
      : "student"), 
}); 
 
export const authService = { 
  signup: async (data) => { 
    if (USE_MOCK_API) { 
      return { 
        data: { 
          message: "Account created", 
          user: demoUser(data), 
        }, 
      }; 
    } 
 
    return api.post("/auth/register", { 
      full_name: data.full_name, 
      email: data.email, 
      password: data.password, 
      role: data.role || "student", 
      roll_number: data.roll_number, 
    }); 
  }, 
 
  login: async (data) => { 
    if (USE_MOCK_API) { 
      return { 
        data: { 
          token: "demo-jwt-token", 
          user: demoUser(data), 
        }, 
      }; 
    } 
 
    return api.post("/auth/login", { 
      email: data.email, 
      password: data.password, 
    }); 
  }, 
 
  logout: async () => { 
    localStorage.removeItem("studentos_token"); 
    localStorage.removeItem("studentos_user"); 
  }, 
 
  forgotPassword: (data) => 
    USE_MOCK_API 
      ? Promise.resolve({ 
          data: { message: "Reset link sent" }, 
        }) 
      : api.post("/forgot-password", data), 
  resetPassword: (data) =>
  USE_MOCK_API
    ? Promise.resolve({
        data: {
          message: "Password reset successfully",
        },
      })
    : api.post("/reset-password", data),
 
  verifyEmail: (data) => 
    USE_MOCK_API 
      ? Promise.resolve({ 
          data: { message: "Email verified" }, 
        }) 
      : api.post("/verify-email", data), 
 
  getProfile: () => 
    USE_MOCK_API 
      ? Promise.resolve({ 
          data: demoUser({}), 
        }) 
      : api.get("/profile"), 
};