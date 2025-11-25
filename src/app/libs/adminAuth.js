// Admin authentication helper

export function checkAdmin(userEmail) {
  if (!userEmail) return false;
  
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
  return adminEmails.includes(userEmail);
}

export function getAdminEmails() {
  return process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
}
