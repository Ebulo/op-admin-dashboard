"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const Calendar = dynamic(() => import('@/components/calendar/Calendar'), {
  ssr: false,
  loading: () => <p>Loading calendar...</p>,
});

const CalendarWrapper: React.FC = () => {
  return <Calendar />;
};

export default CalendarWrapper;
