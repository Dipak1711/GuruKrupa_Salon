import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  activeEmployeeId: string; // The employee record mapped when role is employee
  setActiveEmployeeId: (empId: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'gurukrupa_salon_auth_role';

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-customer',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '+91 98765 11111',
    role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'user-employee',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gurukrupasalon.com',
    phone: '+91 98765 43210',
    role: 'employee',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'user-admin',
    name: 'GuruKrupa Director',
    email: 'admin@gurukrupasalon.com',
    phone: '+91 98230 12345',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved === 'customer' || saved === 'employee' || saved === 'admin') {
      return saved;
    }
    return 'customer';
  });

  const [activeEmployeeId, setActiveEmployeeId] = useState<string>('');

  const [users, setUsers] = useState<UserProfile[]>(DEFAULT_USERS);

  const currentUser = users.find((u) => u.role === currentRole) || users[0];

  const setRole = (role: UserRole) => {
    setCurrentRoleState(role);
    localStorage.setItem(AUTH_STORAGE_KEY, role);
  };

  const loginAs = (role: UserRole) => {
    setRole(role);
  };

  const logout = () => {
    setRole('customer');
  };

  const updateUserProfile = (updatedFields: Partial<UserProfile>) => {
    setUsers((prev) => {
      return prev.map((u) => {
        if (u.role === currentRole) {
          return { ...u, ...updatedFields };
        }
        return u;
      });
    });
  };

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, currentRole);
  }, [currentRole]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        setRole,
        activeEmployeeId,
        setActiveEmployeeId,
        updateUserProfile,
        loginAs,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
