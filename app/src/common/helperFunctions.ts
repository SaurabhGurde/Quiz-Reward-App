import {useEffect, useState} from 'react';
import { getItem, setItem } from './AsyncStorage';

export const getRemainingTime = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  const remainingMs = Math.max(0, midnight.getTime() - now.getTime());

  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m`; 
};

export const canClaimBonus = async () => {
  const lastClaim = await getItem('lastDailyBonus');
  if (!lastClaim) return true; 

  const lastClaimTime = new Date(parseInt(lastClaim, 10));
  const now = new Date();

  return now.toDateString() !== lastClaimTime.toDateString();
};

export const handleDailyBonus = async () => {
  const eligible = await canClaimBonus();
  if (!eligible) return; 

  await setItem('lastDailyBonus', Date.now().toString());
  
};
