'use client';

import { LoadingSVG } from '@/components/svgs/LoadingSVG';
import {
  Button,
  Input,
  Label,
  Link,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from '@/components/ui';
import openai from '@/lib/openai';
import { cn } from '@/lib/utils';
import { ArrowUpRight, MessageSquare, Send } from 'lucide-react';
import { Moderation } from 'openai/resources/moderations.mjs';
import { useState } from 'react';

const models = [
  { name: 'text-moderation-latest' },
  { name: 'text-moderation-stable' },
];

const Moderations = () => {
  const [inputText, setInputText] = useState<string>('');
  const [pending, setPending] = useState<boolean>(false);
  const [moderation, setModeration] = useState<Moderation>();
  const [options, setOptions] = useState<{
    model: string;
  }>({
    model: 'text-moderation-latest',
  });

  const handleSend = async () => {
    setPending(true);
    const moderationResponse = await openai.moderations.create({
      input: inputText,
      model: options.model,
    });
    setModeration(moderationResponse.results[0]);
    setPending(false);
  };

  const handleInputMessageKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleSend();
      event.preventDefault();
    }
  };

  return (
    <div className="h-full w-full flex overflow-hidden px-4 py-6 gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 flex gap-4 justify-center items-center overflow-auto flex-wrap">
          {!moderation && !pending && (
            <div className="w-full h-full flex flex-col justify-center items-center gap-3">
              <MessageSquare />
              <Text variant="medium">Send a text to check moderation.</Text>
            </div>
          )}
          {pending && (
            <div className="p-3 border rounded w-fit bg-slate-100">
              <LoadingSVG />
            </div>
          )}
          {moderation &&
            !pending &&
            Object.entries(moderation.categories).map((category) => (
              <div
                key={category[0]}
                className={cn(
                  'flex flex-col items-center justify-center gap-4 border rounded-md p-4',
                  category[1]
                    ? 'border-red-300 text-red-500 bg-red-50'
                    : 'bg-slate-50'
                )}
              >
                <Text variant="medium">{category[0]}</Text>
                <Text>{(moderation.category_scores as any)[category[0]]}</Text>
              </div>
            ))}
        </div>
        <div className="flex gap-4">
          <Input
            name="text"
            className="flex-1"
            placeholder="Enter your text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyUp={handleInputMessageKeyUp}
          />
          <Button onClick={handleSend}>
            <Send size={18} />
          </Button>
        </div>
      </div>
      <div className="hidden lg:flex flex-col lg:w-1/4 xl:w-1/5 gap-6">
        <div className="flex flex-col gap-3">
          <Label>Model</Label>
          <Select
            name="model"
            value={options.model}
            onValueChange={(value) => setOptions({ ...options, model: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model, index) => (
                <SelectItem key={index} value={model.name}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Link
          href="https://platform.openai.com/docs/guides/moderation"
          target="_blank"
        >
          Learn more about moderations <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default Moderations;
