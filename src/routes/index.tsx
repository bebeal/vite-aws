import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram';

import '../index.css';

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true);
    }
  }, [setMounted]);

  if (!mounted) return null;

  return (
    <div className='w-full h-screen flex flex-col transition-all duration-300 overflow-auto'>
      <ArchitectureDiagram />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: Index,
});
