import React from 'react';
import { toast } from 'react-toastify';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';

const style = {
  background: '#F03737',
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '16px',
  lineHeight: '130%',
  color: '#FFFFFF',
};

export const notifyError = (message) => toast.error(message, {
  style,
  closeOnClick: true,
  icon: InfoIcon,
});

export const notifySuccess = (message) => toast.success(message, {
  style: { ...style, background: '#1A7C41' },
  closeOnClick: true,
  icon: CheckIcon,
});

export const notifyWarning = (message) => toast.warning(message, {
  style: { ...style, background: '#e3ad07' },
  closeOnClick: true,
  icon: InfoIcon,
});
