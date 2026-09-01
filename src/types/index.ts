export type UserRole = 'customer' | 'employee' | 'admin';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Other';

export type LeaveType = 'full_day' | 'half_day';
export type LeaveStatus = 'approved' | 'pending' | 'cancelled' | 'rejected';

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone?: string;
  email?: string;
  description?: string;
  image_url?: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  branch_id?: string;
  avatar_url: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  short_description: string;
  description: string;
  price: number;
  duration_mins: number;
  benefits: string[];
  images: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Employee {
  id: string;
  branch_id: string;
  name: string;
  role_title: string;
  experience_years: number;
  specialization: string;
  phone: string;
  email?: string;
  avatar_url: string;
  rating: number;
  reviews_count: number;
  bio: string;
  is_active: boolean;
  assigned_service_ids: string[];
  created_at?: string;
}

export interface EmployeeLeave {
  id: string;
  employee_id: string;
  employee_name?: string;
  leave_type: LeaveType;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  reason: string;
  status: LeaveStatus;
  created_at: string;
}

export interface Appointment {
  id: string;
  branch_id: string;
  branch_name?: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  service_id: string;
  service_name?: string;
  service_price?: number;
  employee_id: string;
  employee_name?: string;
  employee_phone?: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  confirmed_at?: string | null;
  completed_at?: string | null;
  cancelled_at?: string | null;
  rejection_reason?: string | null;
}

export interface ServiceRecordItem {
  id: string;
  service_record_id: string;
  service_id: string;
  service_name: string; // snapshot of name at completion time
  unit_price: number;   // snapshot of price at completion time
  quantity: number;
  subtotal: number;
}

export interface PaymentRecord {
  id: string;
  service_record_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: 'completed' | 'refunded';
  transaction_ref?: string;
  created_at: string;
}

export interface ServiceRecord {
  id: string;
  branch_id: string;
  branch_name?: string;
  appointment_id?: string | null;
  customer_id?: string | null;
  customer_name: string;
  customer_phone: string;
  employee_id: string;
  employee_name?: string;
  is_walkin: boolean;
  items: ServiceRecordItem[];
  subtotal: number;
  discount: number;
  total_amount: number; // subtotal - discount (always >= 0)
  notes?: string;
  payment: PaymentRecord;
  completed_at: string;
  created_at: string;
}

export interface Offer {
  id: string;
  title: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_bill_amount: number;
  valid_until: string;
  description: string;
  banner_image: string;
  image_url?: string;
  is_active: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string;
  stylist_name?: string;
}

export interface Review {
  id: string;
  customer_name: string;
  employee_id?: string;
  employee_name?: string;
  rating: number;
  comment: string;
  service_name?: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
}

export interface SalonStats {
  todayRevenue: number;
  totalRevenue: number;
  todayAppointmentsCount: number;
  completedAppointmentsCount: number;
  pendingAppointmentsCount: number;
  cancelledAppointmentsCount: number;
  totalCustomers: number;
  totalEmployees: number;
}
