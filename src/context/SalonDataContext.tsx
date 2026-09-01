import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import {
  Branch,
  Category,
  Service,
  Employee,
  EmployeeLeave,
  Appointment,
  AppointmentStatus,
  ServiceRecord,
  PaymentMethod,
  Offer,
  GalleryItem,
  Review,
  SalonStats,
} from '../types';
import { supabase } from '../lib/supabase';
import { isToday, isThisMonth, isEmployeeOnLeaveToday } from '../utils/dates';

interface CompleteServicePayload {
  appointmentId?: string | null;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  employeeId: string;
  isWalkin: boolean;
  selectedServiceIds: string[];
  discount?: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  transactionRef?: string;
}

interface SalonDataContextType {
  // Loading & Connection State
  isLoading: boolean;
  error: string | null;

  // Multi-Branch Architecture
  branches: Branch[];
  activeBranchId: string;
  setActiveBranchId: (branchId: string) => void;

  // Entities
  categories: Category[];
  services: Service[];
  employees: Employee[];
  employeeLeaves: EmployeeLeave[];
  appointments: Appointment[];
  serviceRecords: ServiceRecord[];
  offers: Offer[];
  gallery: GalleryItem[];
  reviews: Review[];

  // Computed Stats
  salonStats: SalonStats;
  getEmployeeStats: (employeeId: string) => {
    todayRevenue: number;
    monthRevenue: number;
    totalRevenue: number;
    completedCount: number;
    pendingCount: number;
    clientsCount: number;
  };
  getServiceStats: () => {
    serviceId: string;
    serviceName: string;
    revenue: number;
    count: number;
  }[];
  getPaymentStats: () => {
    method: PaymentMethod;
    amount: number;
    percentage: number;
    count: number;
  }[];

  // Appointment Actions
  createAppointment: (data: {
    branchId?: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    serviceId: string;
    employeeId: string;
    notes?: string;
  }) => Promise<Appointment | null>;
  updateAppointmentStatus: (
    id: string,
    status: AppointmentStatus,
    rejectionReason?: string
  ) => Promise<void>;

  // Financial & Service Fulfillment Engine
  completeService: (payload: CompleteServicePayload) => Promise<ServiceRecord | null>;

  // Leave Management Actions
  addEmployeeLeave: (data: Omit<EmployeeLeave, 'id' | 'created_at'>) => Promise<void>;
  updateEmployeeLeaveStatus: (id: string, status: 'approved' | 'cancelled' | 'pending') => Promise<void>;
  deleteEmployeeLeave: (id: string) => Promise<void>;
  isEmployeeAvailable: (employeeId: string) => boolean;

  // Admin Category Management
  addCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, cat: Partial<Category>) => Promise<void>;
  toggleCategoryActive: (id: string) => Promise<void>;

  // Admin Service Management
  addService: (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  toggleServiceActive: (id: string) => Promise<void>;

  // Admin Employee Management
  addEmployee: (emp: Omit<Employee, 'id' | 'created_at'>) => Promise<void>;
  updateEmployee: (id: string, emp: Partial<Employee>) => Promise<void>;
  toggleEmployeeActive: (id: string) => Promise<void>;

  // Offers & Gallery
  addOffer: (offer: Omit<Offer, 'id'>) => Promise<void>;
  updateOffer: (id: string, offer: Partial<Offer>) => Promise<void>;
  toggleOfferActive: (id: string) => Promise<void>;
  addGalleryItem: (item: GalleryItem) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'created_at' | 'status'>) => Promise<void>;
  updateReviewStatus: (id: string, status: 'approved' | 'pending' | 'rejected') => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  // Utility & Refresh
  refreshData: () => Promise<void>;
  resetToDemoData: () => void;
}

const SalonDataContext = createContext<SalonDataContextType | undefined>(undefined);

export const SalonDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Multi-Branch Architecture State
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranchId, setActiveBranchId] = useState<string>('b1111111-1111-1111-1111-111111111111');

  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeLeaves, setEmployeeLeaves] = useState<EmployeeLeave[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // ----------------------------------------------------
  // FETCH ALL DATA FROM SUPABASE
  // ----------------------------------------------------
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 0. Fetch Branches
      const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .select('*')
        .order('code');

      let formattedBranches: Branch[] = (branchData || []).map((b: any) => ({
        id: b.id,
        name: b.name,
        code: b.code,
        address: b.address,
        phone: b.phone || '',
        email: b.email || '',
        description: b.description || '',
        image_url: b.image_url || '',
        status: b.status === 'active' ? 'active' : 'inactive',
        created_at: b.created_at,
        updated_at: b.updated_at,
      }));

      // Fallback seed branches if database has no branches yet
      if (formattedBranches.length === 0) {
        formattedBranches = [
          {
            id: 'b1111111-1111-1111-1111-111111111111',
            name: 'GuruKrupa Salon - Bandra Main Branch',
            code: 'BRANCH_1',
            address: 'Shop 4-5, Royal Grandeur Avenue, Linking Road, Bandra West, Mumbai, Maharashtra 400050',
            phone: '+91 98230 12345',
            email: 'bandra@gurukrupasalon.com',
            description: 'Flagship luxury grooming studio offering precision hair sculpting, beard architecture, and gold peptide facials.',
            image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
            status: 'active',
          },
          {
            id: 'b2222222-2222-2222-2222-222222222222',
            name: 'GuruKrupa Salon - Juhu Residency Branch',
            code: 'BRANCH_2',
            address: 'Suite 12, Horizon Sea Face Towers, Juhu Tara Road, Mumbai, Maharashtra 400049',
            phone: '+91 98230 54321',
            email: 'juhu@gurukrupasalon.com',
            description: 'Bespoke coastal stylist sanctuary with private grooming suites and organic scalp therapy.',
            image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
            status: 'active',
          },
        ];
      }

      setBranches(formattedBranches);
      if (formattedBranches.length > 0 && !formattedBranches.some((b) => b.id === activeBranchId)) {
        setActiveBranchId(formattedBranches[0].id);
      }

      // 1. Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from('service_categories')
        .select('*')
        .order('name');
      if (catError) throw catError;

      const formattedCategories: Category[] = (catData || []).map((c: any, index: number) => ({
        id: c.id,
        name: c.name,
        description: c.description || '',
        image_url: c.image_url || '',
        display_order: index + 1,
        is_active: c.status === 'active',
      }));

      // 2. Fetch Services & Images
      const { data: srvData, error: srvError } = await supabase
        .from('services')
        .select('*, service_images(image_url)')
        .order('name');
      if (srvError) throw srvError;

      const formattedServices: Service[] = (srvData || []).map((s: any) => {
        const imageList = (s.service_images || []).map((img: any) => img.image_url);
        return {
          id: s.id,
          category_id: s.category_id,
          name: s.name,
          short_description: s.description || '',
          description: s.description || '',
          price: Number(s.price),
          duration_mins: s.duration_minutes || 30,
          benefits: [],
          images: imageList.length > 0 ? imageList : ['https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'],
          is_active: s.status === 'active',
          created_at: s.created_at,
          updated_at: s.updated_at,
        };
      });

      // 3. Fetch Employees & Profiles (with branch_id)
      const { data: empData, error: empError } = await supabase
        .from('employees')
        .select('*, profiles(full_name, email, phone, avatar_url)');
      if (empError) throw empError;

      const formattedEmployees: Employee[] = (empData || []).map((e: any, idx: number) => ({
        id: e.id,
        branch_id: e.branch_id || (idx % 2 === 0 ? 'b1111111-1111-1111-1111-111111111111' : 'b2222222-2222-2222-2222-222222222222'),
        name: e.profiles?.full_name || 'Stylist',
        role_title: 'Master Stylist',
        specialization: e.specialization || 'Hair & Beard Specialist',
        phone: e.profiles?.phone || '+91 98230 12345',
        email: e.profiles?.email || 'stylist@gurukrupasalon.com',
        avatar_url: e.profile_image || e.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviews_count: 120,
        bio: 'Master stylist specializing in bespoke grooming & modern scissor craft.',
        is_active: e.status === 'active',
        assigned_service_ids: [],
        experience_years: e.experience_years || 5,
        created_at: e.created_at,
      }));

      // 4. Fetch Employee Leaves
      const { data: leaveData, error: leaveError } = await supabase
        .from('employee_leaves')
        .select('*');
      if (leaveError) throw leaveError;

      const formattedLeaves: EmployeeLeave[] = (leaveData || []).map((l: any) => {
        const emp = formattedEmployees.find((e) => e.id === l.employee_id);
        return {
          id: l.id,
          employee_id: l.employee_id,
          employee_name: emp?.name || 'Stylist',
          leave_type: l.leave_type as 'full_day' | 'half_day',
          start_date: l.start_date,
          end_date: l.end_date,
          reason: l.reason,
          status: l.status as 'approved' | 'pending' | 'cancelled' | 'rejected',
          created_at: l.created_at,
        };
      });

      // 5. Fetch Offers
      const { data: offerData, error: offerError } = await supabase
        .from('offers')
        .select('*');
      if (offerError) throw offerError;

      const formattedOffers: Offer[] = (offerData || []).map((o: any) => ({
        id: o.id,
        title: o.name,
        code: o.name,
        description: o.description || '',
        discount_type: o.discount_type as 'percentage' | 'fixed',
        discount_value: Number(o.discount_value),
        min_bill_amount: 0,
        valid_until: o.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        banner_image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
        image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
        is_active: o.status === 'active',
      }));

      // 6. Fetch Gallery
      const { data: galData, error: galError } = await supabase
        .from('gallery')
        .select('*');
      if (galError) throw galError;

      const formattedGallery: GalleryItem[] = (galData || []).map((g: any) => ({
        id: g.id,
        title: g.title,
        category: g.category,
        image_url: g.image_url,
        description: g.description || '',
        stylist_name: 'GuruKrupa Stylist',
      }));

      // 7. Fetch Reviews
      const { data: revData, error: revError } = await supabase
        .from('reviews')
        .select('*');
      if (revError) throw revError;

      const formattedReviews: Review[] = (revData || []).map((r: any) => ({
        id: r.id,
        customer_name: 'Valued Client',
        rating: r.rating,
        comment: r.comment,
        status: r.status || 'approved',
        created_at: r.created_at,
        service_name: 'Signature Grooming',
      }));

      // 8. Fetch Appointments
      const { data: aptData, error: aptError } = await supabase
        .from('appointments')
        .select('*, customers(profile_id, profiles(full_name, phone)), employees(profile_id, profiles(full_name, phone))');
      if (aptError) throw aptError;

      const formattedAppointments: Appointment[] = (aptData || []).map((a: any) => ({
        id: a.id,
        branch_id: a.branch_id || 'b1111111-1111-1111-1111-111111111111',
        customer_id: a.customer_id || '',
        customer_name: a.customers?.profiles?.full_name || 'Walk-in Client',
        customer_phone: a.customers?.profiles?.phone || '',
        service_id: '',
        service_name: 'Salon Service',
        service_price: 0,
        employee_id: a.employee_id || '',
        employee_name: a.employees?.profiles?.full_name || 'Stylist',
        employee_phone: a.employees?.profiles?.phone || '',
        status: a.status as AppointmentStatus,
        notes: a.notes || '',
        created_at: a.created_at,
        confirmed_at: a.confirmed_at,
        completed_at: a.completed_at,
        cancelled_at: a.cancelled_at,
      }));

      // 9. Fetch Service Records & Payments
      const { data: recData, error: recError } = await supabase
        .from('service_records')
        .select('*, service_record_items(*), payments(*)');
      if (recError) throw recError;

      const formattedRecords: ServiceRecord[] = (recData || []).map((r: any) => {
        const emp = formattedEmployees.find((e) => e.id === r.employee_id);
        const paymentObj = (r.payments || [])[0];
        return {
          id: r.id,
          branch_id: r.branch_id || emp?.branch_id || 'b1111111-1111-1111-1111-111111111111',
          appointment_id: r.appointment_id,
          customer_id: r.customer_id,
          customer_name: 'Salon Client',
          customer_phone: '+91 98765 00000',
          employee_id: r.employee_id,
          employee_name: emp?.name || 'Stylist',
          is_walkin: !r.appointment_id,
          items: (r.service_record_items || []).map((item: any) => ({
            id: item.id,
            service_record_id: item.service_record_id,
            service_id: item.service_id,
            service_name: item.service_name_snapshot,
            unit_price: Number(item.unit_price),
            quantity: item.quantity,
            subtotal: Number(item.total_price),
          })),
          subtotal: Number(r.subtotal),
          discount: Number(r.discount),
          total_amount: Number(r.total_amount),
          notes: r.notes || '',
          payment: paymentObj ? {
            id: paymentObj.id,
            service_record_id: paymentObj.service_record_id,
            amount: Number(paymentObj.amount),
            payment_method: paymentObj.payment_method === 'cash' ? 'Cash' : paymentObj.payment_method === 'upi' ? 'UPI' : paymentObj.payment_method === 'card' ? 'Card' : 'Other',
            payment_status: 'completed',
            transaction_ref: paymentObj.transaction_reference,
            created_at: paymentObj.paid_at,
          } : {
            id: `pay-def-${r.id}`,
            service_record_id: r.id,
            amount: Number(r.total_amount),
            payment_method: 'Cash',
            payment_status: 'completed',
            created_at: r.created_at,
          },
          completed_at: r.completed_at,
          created_at: r.created_at,
        };
      });

      setCategories(formattedCategories);
      setServices(formattedServices);
      setEmployees(formattedEmployees);
      setEmployeeLeaves(formattedLeaves);
      setOffers(formattedOffers);
      setGallery(formattedGallery);
      setReviews(formattedReviews);
      setAppointments(formattedAppointments);
      setServiceRecords(formattedRecords);
    } catch (err: any) {
      console.error('Supabase fetch error:', err);
      setError(err?.message || 'Failed to load live data from Supabase.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ----------------------------------------------------
  // COMPUTED STATS & LOGIC
  // ----------------------------------------------------
  const isEmployeeAvailable = (employeeId: string): boolean => {
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee || !employee.is_active) return false;
    return !isEmployeeOnLeaveToday(employeeLeaves, employeeId);
  };

  const createAppointment = async (data: {
    branchId?: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    serviceId: string;
    employeeId: string;
    notes?: string;
  }): Promise<Appointment | null> => {
    try {
      const emp = employees.find((e) => e.id === data.employeeId);
      const targetBranchId = data.branchId || emp?.branch_id || activeBranchId;

      const { data: newApt, error: err } = await supabase
        .from('appointments')
        .insert({
          branch_id: targetBranchId,
          employee_id: data.employeeId || null,
          status: 'pending',
          notes: data.notes || '',
        })
        .select()
        .single();

      if (err) throw err;
      await refreshData();
      return appointments.find((a) => a.id === newApt.id) || null;
    } catch (err) {
      console.error('Error creating appointment in Supabase:', err);
      return null;
    }
  };

  const updateAppointmentStatus = async (
    id: string,
    status: AppointmentStatus,
    rejectionReason?: string
  ): Promise<void> => {
    try {
      const now = new Date().toISOString();
      const payload: any = { status };
      if (status === 'confirmed') payload.confirmed_at = now;
      if (status === 'completed') payload.completed_at = now;
      if (status === 'cancelled') payload.cancelled_at = now;

      const { error: err } = await supabase
        .from('appointments')
        .update(payload)
        .eq('id', id);

      if (err) throw err;
      await refreshData();
    } catch (err) {
      console.error('Error updating appointment in Supabase:', err);
    }
  };

  const completeService = async (payload: CompleteServicePayload): Promise<ServiceRecord | null> => {
    try {
      const emp = employees.find((e) => e.id === payload.employeeId);
      const targetBranchId = emp?.branch_id || activeBranchId;

      const subtotal = payload.selectedServiceIds.reduce((sum, srvId) => {
        const srv = services.find((s) => s.id === srvId);
        return sum + (srv ? srv.price : 0);
      }, 0);

      const discount = Math.max(0, Math.min(subtotal, payload.discount || 0));
      const totalAmount = Math.max(0, subtotal - discount);

      // Insert service record header with branch_id
      const { data: recData, error: recError } = await supabase
        .from('service_records')
        .insert({
          branch_id: targetBranchId,
          appointment_id: payload.appointmentId || null,
          employee_id: payload.employeeId,
          subtotal,
          discount,
          total_amount: totalAmount,
          payment_status: 'paid',
          notes: payload.notes || '',
        })
        .select()
        .single();

      if (recError) throw recError;

      // Insert service record items
      const itemRows = payload.selectedServiceIds.map((srvId) => {
        const srv = services.find((s) => s.id === srvId);
        return {
          service_record_id: recData.id,
          service_id: srvId,
          service_name_snapshot: srv ? srv.name : 'Salon Service',
          quantity: 1,
          unit_price: srv ? srv.price : 0,
          total_price: srv ? srv.price : 0,
        };
      });

      if (itemRows.length > 0) {
        await supabase.from('service_record_items').insert(itemRows);
      }

      // Insert Payment
      await supabase.from('payments').insert({
        service_record_id: recData.id,
        amount: totalAmount,
        payment_method: payload.paymentMethod.toLowerCase(),
        payment_status: 'completed',
        transaction_reference: payload.transactionRef || null,
      });

      if (payload.appointmentId) {
        await updateAppointmentStatus(payload.appointmentId, 'completed');
      }

      await refreshData();
      return serviceRecords.find((r) => r.id === recData.id) || null;
    } catch (err) {
      console.error('Error completing service in Supabase:', err);
      return null;
    }
  };

  const addEmployeeLeave = async (data: Omit<EmployeeLeave, 'id' | 'created_at'>) => {
    try {
      const { error: err } = await supabase.from('employee_leaves').insert({
        employee_id: data.employee_id,
        leave_type: data.leave_type,
        start_date: data.start_date,
        end_date: data.end_date,
        reason: data.reason,
        status: data.status || 'approved',
      });
      if (err) throw err;
      await refreshData();
    } catch (err) {
      console.error('Error adding leave in Supabase:', err);
    }
  };

  const updateEmployeeLeaveStatus = async (id: string, status: 'approved' | 'cancelled' | 'pending') => {
    try {
      await supabase.from('employee_leaves').update({ status }).eq('id', id);
      await refreshData();
    } catch (err) {
      console.error('Error updating leave status:', err);
    }
  };

  const deleteEmployeeLeave = async (id: string) => {
    try {
      await supabase.from('employee_leaves').delete().eq('id', id);
      await refreshData();
    } catch (err) {
      console.error('Error deleting leave:', err);
    }
  };

  // Category CRUD
  const addCategory = async (data: Omit<Category, 'id'>) => {
    try {
      await supabase.from('service_categories').insert({
        name: data.name,
        description: data.description,
        image_url: (data as any).image_url || '',
        status: data.is_active ? 'active' : 'inactive',
      });
      await refreshData();
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    try {
      const payload: any = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.description !== undefined) payload.description = data.description;
      if ((data as any).image_url !== undefined) payload.image_url = (data as any).image_url;
      if (data.is_active !== undefined) payload.status = data.is_active ? 'active' : 'inactive';

      await supabase.from('service_categories').update(payload).eq('id', id);
      await refreshData();
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const toggleCategoryActive = async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      await updateCategory(id, { is_active: !cat.is_active });
    }
  };

  // Service CRUD
  const addService = async (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: newSrv, error: err } = await supabase
        .from('services')
        .insert({
          category_id: data.category_id,
          name: data.name,
          description: data.description,
          price: data.price,
          duration_minutes: data.duration_mins,
          status: data.is_active ? 'active' : 'inactive',
        })
        .select()
        .single();

      if (err) throw err;

      if (data.images && data.images.length > 0) {
        const imgRows = data.images.map((url, idx) => ({
          service_id: newSrv.id,
          image_url: url,
          sort_order: idx + 1,
        }));
        await supabase.from('service_images').insert(imgRows);
      }

      await refreshData();
    } catch (err) {
      console.error('Error adding service:', err);
    }
  };

  const updateService = async (id: string, data: Partial<Service>) => {
    try {
      const payload: any = {};
      if (data.category_id !== undefined) payload.category_id = data.category_id;
      if (data.name !== undefined) payload.name = data.name;
      if (data.description !== undefined) payload.description = data.description;
      if (data.price !== undefined) payload.price = data.price;
      if (data.duration_mins !== undefined) payload.duration_minutes = data.duration_mins;
      if (data.is_active !== undefined) payload.status = data.is_active ? 'active' : 'inactive';

      await supabase.from('services').update(payload).eq('id', id);
      await refreshData();
    } catch (err) {
      console.error('Error updating service:', err);
    }
  };

  const toggleServiceActive = async (id: string) => {
    const srv = services.find((s) => s.id === id);
    if (srv) {
      await updateService(id, { is_active: !srv.is_active });
    }
  };

  // Employee CRUD
  const addEmployee = async (data: Omit<Employee, 'id' | 'created_at'>) => {
    try {
      const targetBranchId = data.branch_id || activeBranchId;

      // 1. Create Profile
      const { data: prof, error: profErr } = await supabase
        .from('profiles')
        .insert({
          full_name: data.name,
          email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@gurukrupasalon.com`,
          phone: data.phone,
          role: 'employee',
          branch_id: targetBranchId,
          avatar_url: data.avatar_url,
        })
        .select()
        .single();

      if (profErr) throw profErr;

      // 2. Create Employee
      await supabase.from('employees').insert({
        profile_id: prof.id,
        branch_id: targetBranchId,
        employee_code: `EMP-${Date.now().toString().slice(-4)}`,
        specialization: data.specialization,
        experience_years: data.experience_years,
        profile_image: data.avatar_url,
        status: data.is_active ? 'active' : 'inactive',
      });

      await refreshData();
    } catch (err) {
      console.error('Error adding employee:', err);
    }
  };

  const updateEmployee = async (id: string, data: Partial<Employee>) => {
    try {
      const payload: any = {};
      if (data.specialization !== undefined) payload.specialization = data.specialization;
      if (data.experience_years !== undefined) payload.experience_years = data.experience_years;
      if (data.avatar_url !== undefined) payload.profile_image = data.avatar_url;
      if (data.is_active !== undefined) payload.status = data.is_active ? 'active' : 'inactive';

      await supabase.from('employees').update(payload).eq('id', id);
      await refreshData();
    } catch (err) {
      console.error('Error updating employee:', err);
    }
  };

  const toggleEmployeeActive = async (id: string) => {
    const emp = employees.find((e) => e.id === id);
    if (emp) {
      await updateEmployee(id, { is_active: !emp.is_active });
    }
  };

  // Offers & Gallery
  const addOffer = async (data: Omit<Offer, 'id'>) => {
    try {
      await supabase.from('offers').insert({
        name: data.title,
        description: data.description,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        end_date: data.valid_until,
        status: data.is_active ? 'active' : 'inactive',
      });
      await refreshData();
    } catch (err) {
      console.error('Error adding offer:', err);
    }
  };

  const updateOffer = async (id: string, data: Partial<Offer>) => {
    try {
      const payload: any = {};
      if (data.title !== undefined) payload.name = data.title;
      if (data.description !== undefined) payload.description = data.description;
      if (data.discount_type !== undefined) payload.discount_type = data.discount_type;
      if (data.discount_value !== undefined) payload.discount_value = data.discount_value;
      if (data.is_active !== undefined) payload.status = data.is_active ? 'active' : 'inactive';

      await supabase.from('offers').update(payload).eq('id', id);
      await refreshData();
    } catch (err) {
      console.error('Error updating offer:', err);
    }
  };

  const toggleOfferActive = async (id: string) => {
    const off = offers.find((o) => o.id === id);
    if (off) {
      await updateOffer(id, { is_active: !off.is_active });
    }
  };

  const addGalleryItem = async (item: GalleryItem) => {
    try {
      await supabase.from('gallery').insert({
        title: item.title,
        image_url: item.image_url,
        category: item.category,
        description: item.description,
        status: 'active',
      });
      await refreshData();
    } catch (err) {
      console.error('Error adding gallery item:', err);
    }
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'created_at' | 'status'>) => {
    try {
      await supabase.from('reviews').insert({
        rating: reviewData.rating,
        comment: reviewData.comment,
        status: 'approved',
      });
      await refreshData();
    } catch (err) {
      console.error('Error adding review:', err);
    }
  };

  const updateReviewStatus = async (id: string, status: 'approved' | 'pending' | 'rejected') => {
    try {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      await supabase.from('reviews').update({ status }).eq('id', id);
    } catch (err) {
      console.error('Error updating review status:', err);
    }
  };

  const deleteReview = async (id: string) => {
    try {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      await supabase.from('reviews').delete().eq('id', id);
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const resetToDemoData = () => {
    refreshData();
  };

  // ----------------------------------------------------
  // COMPUTED METRICS
  // ----------------------------------------------------
  const salonStats: SalonStats = useMemo(() => {
    const validPayments = serviceRecords.filter(
      (r) => r.payment && r.payment.payment_status === 'completed'
    );

    const totalRevenue = validPayments.reduce((sum, r) => sum + r.total_amount, 0);
    const todayRevenue = validPayments
      .filter((r) => isToday(r.completed_at))
      .reduce((sum, r) => sum + r.total_amount, 0);

    const todayAppointmentsCount = appointments.filter((a) => isToday(a.created_at)).length;
    const completedAppointmentsCount = appointments.filter((a) => a.status === 'completed').length;
    const pendingAppointmentsCount = appointments.filter((a) => a.status === 'pending').length;
    const cancelledAppointmentsCount = appointments.filter(
      (a) => a.status === 'cancelled' || a.status === 'rejected'
    ).length;

    const uniqueCustomers = new Set([
      ...appointments.map((a) => a.customer_phone),
      ...serviceRecords.map((r) => r.customer_phone),
    ]);

    return {
      todayRevenue,
      totalRevenue,
      todayAppointmentsCount,
      completedAppointmentsCount,
      pendingAppointmentsCount,
      cancelledAppointmentsCount,
      totalCustomers: Math.max(uniqueCustomers.size, 0),
      totalEmployees: employees.filter((e) => e.is_active).length,
    };
  }, [serviceRecords, appointments, employees]);

  const getEmployeeStats = (employeeId: string) => {
    const empRecords = serviceRecords.filter((r) => r.employee_id === employeeId);
    const validPayments = empRecords.filter(
      (r) => r.payment && r.payment.payment_status === 'completed'
    );

    const totalRevenue = validPayments.reduce((sum, r) => sum + r.total_amount, 0);
    const todayRevenue = validPayments
      .filter((r) => isToday(r.completed_at))
      .reduce((sum, r) => sum + r.total_amount, 0);
    const monthRevenue = validPayments
      .filter((r) => isThisMonth(r.completed_at))
      .reduce((sum, r) => sum + r.total_amount, 0);

    const empAppointments = appointments.filter((a) => a.employee_id === employeeId);
    const completedCount = empAppointments.filter((a) => a.status === 'completed').length + empRecords.filter(r => r.is_walkin).length;
    const pendingCount = empAppointments.filter((a) => a.status === 'pending').length;

    const uniqueClients = new Set([
      ...empAppointments.map((a) => a.customer_phone),
      ...empRecords.map((r) => r.customer_phone),
    ]);

    return {
      todayRevenue,
      monthRevenue,
      totalRevenue,
      completedCount,
      pendingCount,
      clientsCount: uniqueClients.size,
    };
  };

  const getServiceStats = () => {
    const statsMap: Record<string, { serviceName: string; revenue: number; count: number }> = {};

    services.forEach((s) => {
      statsMap[s.id] = { serviceName: s.name, revenue: 0, count: 0 };
    });

    serviceRecords.forEach((record) => {
      record.items.forEach((item) => {
        if (!statsMap[item.service_id]) {
          statsMap[item.service_id] = {
            serviceName: item.service_name,
            revenue: 0,
            count: 0,
          };
        }
        statsMap[item.service_id].revenue += item.subtotal;
        statsMap[item.service_id].count += item.quantity;
      });
    });

    return Object.entries(statsMap).map(([serviceId, data]) => ({
      serviceId,
      serviceName: data.serviceName,
      revenue: data.revenue,
      count: data.count,
    })).sort((a, b) => b.revenue - a.revenue);
  };

  const getPaymentStats = () => {
    const methodMap: Record<PaymentMethod, { amount: number; count: number }> = {
      Cash: { amount: 0, count: 0 },
      UPI: { amount: 0, count: 0 },
      Card: { amount: 0, count: 0 },
      Other: { amount: 0, count: 0 },
    };

    let total = 0;
    serviceRecords.forEach((rec) => {
      if (rec.payment && rec.payment.payment_status === 'completed') {
        const m = rec.payment.payment_method;
        if (methodMap[m]) {
          methodMap[m].amount += rec.total_amount;
          methodMap[m].count += 1;
          total += rec.total_amount;
        }
      }
    });

    return (Object.keys(methodMap) as PaymentMethod[]).map((method) => {
      const data = methodMap[method];
      return {
        method,
        amount: data.amount,
        percentage: total > 0 ? Math.round((data.amount / total) * 100) : 0,
        count: data.count,
      };
    });
  };

  return (
    <SalonDataContext.Provider
      value={{
        isLoading,
        error,
        branches,
        activeBranchId,
        setActiveBranchId,
        categories,
        services,
        employees,
        employeeLeaves,
        appointments,
        serviceRecords,
        offers,
        gallery,
        reviews,
        salonStats,
        getEmployeeStats,
        getServiceStats,
        getPaymentStats,
        createAppointment,
        updateAppointmentStatus,
        completeService,
        addEmployeeLeave,
        updateEmployeeLeaveStatus,
        deleteEmployeeLeave,
        isEmployeeAvailable,
        addCategory,
        updateCategory,
        toggleCategoryActive,
        addService,
        updateService,
        toggleServiceActive,
        addEmployee,
        updateEmployee,
        toggleEmployeeActive,
        addOffer,
        updateOffer,
        toggleOfferActive,
        addGalleryItem,
        addReview,
        updateReviewStatus,
        deleteReview,
        refreshData,
        resetToDemoData,
      }}
    >
      {children}
    </SalonDataContext.Provider>
  );
};

export const useSalonData = (): SalonDataContextType => {
  const context = useContext(SalonDataContext);
  if (!context) {
    throw new Error('useSalonData must be used within a SalonDataProvider');
  }
  return context;
};
