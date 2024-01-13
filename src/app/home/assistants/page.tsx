'use client';

import { Link, Text } from '@/components/ui';
import { ArrowUpRight, MessageSquare } from 'lucide-react';

const Assistants = () => {
  return (
    <div className="h-full w-full flex overflow-hidden px-4 py-6 gap-4">
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <MessageSquare />
        <Text variant="medium">Assistants Coming Soon...!</Text>
        <Link
          href="https://platform.openai.com/docs/api-reference/assistants"
          target="_blank"
        >
          Learn more about assistants <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default Assistants;
