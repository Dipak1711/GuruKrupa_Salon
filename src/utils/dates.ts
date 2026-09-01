export const formatDate = (isoString?: string | null): string => {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
};

export const formatDateTime = (isoString?: string | null): string => {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return isoString;
  }
};

export const formatTimeOnly = (isoString?: string | null): string => {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return isoString;
  }
};

export const isToday = (isoString?: string | null): boolean => {
  if (!isoString) return false;
  const d = new Date(isoString);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

export const isThisMonth = (isoString?: string | null): boolean => {
  if (!isoString) return false;
  const d = new Date(isoString);
  const today = new Date();
  return (
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

export const isEmployeeOnLeaveToday = (leaves: { start_date: string; end_date: string; status: string; employee_id: string }[], employeeId: string): boolean => {
  const todayStr = new Date().toISOString().split('T')[0];
  return leaves.some((leave) => {
    return (
      leave.employee_id === employeeId &&
      leave.status === 'approved' &&
      todayStr >= leave.start_date &&
      todayStr <= leave.end_date
    );
  });
};
