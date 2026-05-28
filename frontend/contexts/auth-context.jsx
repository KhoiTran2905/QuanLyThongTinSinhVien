"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(undefined);

// Mock user database
const MOCK_USERS = [
  {
    id: "admin-001",
    username: "admin",
    password: "admin123",
    name: "Quản trị viên",
    role: "admin",
    email: "admin@ptit.edu.vn",
  },
  {
    id: "sv-001",
    username: "B21DCCN001",
    password: "123456",
    name: "Nguyễn Văn An",
    role: "student",
    studentId: "B21DCCN001",
    email: "anb21dccn001@ptit.edu.vn",
  },
  {
    id: "sv-002",
    username: "B21DCCN002",
    password: "123456",
    name: "Trần Thị Bình",
    role: "student",
    studentId: "B21DCCN002",
    email: "binhb21dccn002@ptit.edu.vn",
  },
  {
    id: "sv-003",
    username: "B22DCCN123",
    password: "123456",
    name: "Lê Hoàng Cường",
    role: "student",
    studentId: "B22DCCN123",
    email: "cuongb22dccn123@ptit.edu.vn",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem("ptit_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("ptit_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundUser = MOCK_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        role: foundUser.role,
        studentId: foundUser.studentId,
        email: foundUser.email,
      };
      setUser(userData);
      localStorage.setItem("ptit_user", JSON.stringify(userData));
      
      // Redirect based on role
      if (foundUser.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/student");
      }
      
      return { success: true, message: "Đăng nhập thành công!" };
    }

    return { success: false, message: "Tên đăng nhập hoặc mật khẩu không đúng!" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ptit_user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
