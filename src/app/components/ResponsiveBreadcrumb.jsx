"use client";

import { useState, useEffect } from 'react';
import BreadcrumbNavigation from './BreadcrumbNavigation';

/**
 * ResponsiveBreadcrumb - Auto truncate breadcrumb titles based on screen size
 * @param {Array} crumbs - Array of breadcrumb items {title, href}
 */
export default function ResponsiveBreadcrumb({ crumbs = [] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Truncate title based on screen size
  const truncateTitle = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Responsive max length: mobile = 10, PC = 25
  const maxLength = isMobile ? 10 : 25;

  // Truncate all breadcrumb titles
  const truncatedCrumbs = crumbs.map(crumb => ({
    ...crumb,
    title: truncateTitle(crumb.title, maxLength)
  }));

  return <BreadcrumbNavigation crumbs={truncatedCrumbs} />;
}
