export const USER_MODULES = ['products', 'inventory', 'services', 'projects', 'news', 'tenders', 'staff', 'careers', 'gallery', 'contacts', 'job_applications'] as const;
export type UserModule = (typeof USER_MODULES)[number];
