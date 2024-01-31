'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OpenAISVG } from '@/components/svgs';
import { Text, Button, Input, Link } from '@/components/ui';
import { APP_DESCRIPTION, APP_TITLE, OPENAI_API_KEY } from '@/lib/constants';
import { ArrowUpRight } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const Index = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    setApiKey(localStorage.getItem(OPENAI_API_KEY) ?? '');
  }, []);

  const handleSubmit = () => {
    if (!apiKey) return;
    localStorage.setItem(OPENAI_API_KEY, apiKey);
    router.push('/home/text');
  };

  return (
    <div className="container h-screen flex flex-col justify-center items-center text-center gap-8">
      <div className="flex flex-col gap-4 justify-center items-center">
        <OpenAISVG width="48" height="48" />
        <Text variant="title">{APP_TITLE}</Text>
        <Text variant="large">{APP_DESCRIPTION}</Text>
      </div>
      <div className="w-full flex flex-col gap-4 justify-center items-center">
        <Input
          className="w-full lg:w-1/2 text-center"
          name="apiKey"
          placeholder="Enter your OpenAI API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <Link
        href="https://platform.openai.com/docs/api-reference/authentication"
        target="_blank"
      >
        Where to find API Key? <ArrowUpRight size={16} />
      </Link>
      <ModeToggle />
    </div>
  );
};

export default Index;
