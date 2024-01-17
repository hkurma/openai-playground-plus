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
import { ArrowUpRight, MessageSquare, Send, XCircle } from 'lucide-react';
import Image from 'next/image';
import { Image as ImageResponse } from 'openai/resources/images.mjs';
import { useState } from 'react';

const models = [{ name: 'dall-e-2' }, { name: 'dall-e-3' }];

const styles = [{ name: 'vivid' }, { name: 'natural' }];

const Images = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [pendingGeneration, setPendingGeneration] = useState<boolean>(false);
  const [options, setOptions] = useState<{
    model: string;
    count: number;
    style: string;
  }>({
    model: 'dall-e-2',
    count: 1,
    style: 'vivid',
  });
  const [images, setImages] = useState<Array<ImageResponse>>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSend = async () => {
    setErrorMessage('');
    setImages([]);
    setPendingGeneration(true);
    openai.images
      .generate({
        model: options.model,
        prompt: prompt,
        n: options.count,
      })
      .then((generationResponse) => {
        setImages(generationResponse.data);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setPendingGeneration(false);
      });
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
          {!pendingGeneration && images.length === 0 && !errorMessage && (
            <div className="w-full h-full flex flex-col justify-center items-center gap-3">
              <MessageSquare />
              <Text variant="medium">Send a prompt to generate images</Text>
            </div>
          )}
          {pendingGeneration && (
            <div className="p-3 border rounded w-fit bg-secondary">
              <LoadingSVG />
            </div>
          )}
          {images.map((image, index) => (
            <Image
              key={index}
              alt={prompt}
              src={image.url!}
              width={256}
              height={256}
            />
          ))}
          {errorMessage && (
            <div className="w-full h-full flex flex-col justify-center items-center gap-4 text-red-500">
              <XCircle />
              <Text className="">{errorMessage}</Text>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <Input
            name="userMessage"
            className="flex-1"
            placeholder="Enter your prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
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
        <div className="flex flex-col gap-3">
          <Label>N</Label>
          <Input
            name="count"
            type="number"
            min={1}
            max={10}
            placeholder="Count"
            value={options.count}
            onChange={(e) =>
              setOptions({ ...options, count: Number(e.target.value) })
            }
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label>Style</Label>
          <Select
            name="style"
            value={options.style}
            onValueChange={(value) => setOptions({ ...options, style: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a stylee" />
            </SelectTrigger>
            <SelectContent>
              {styles.map((style, index) => (
                <SelectItem key={index} value={style.name}>
                  {style.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Link
          href="https://platform.openai.com/docs/guides/images"
          target="_blank"
        >
          Learn more about image generation <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default Images;
