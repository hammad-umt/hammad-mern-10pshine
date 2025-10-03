'use client';

import { Provider } from 'react-redux';
import store from '@/store/store';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>;
}
