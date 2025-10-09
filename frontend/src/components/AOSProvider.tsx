'use client';
import { useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';

interface Props {
  children: React.ReactNode;
}

export default function AOSProvider({ children }: Props) {
  useEffect(() => {
    Aos.init({
      duration: 1000, // default animation duration
      once: true,     // animate only once
    });
  }, []);

  return <>{children}</>;
}
