/* eslint-disable @next/next/no-img-element */
"use client";

import { Button, Input, Text } from "@/components";
import openai from "@/lib/openai";
import classNames from "classnames";
import { Image as ImageResponse } from "openai/resources/images.mjs";
import { useState } from "react";
import { Image as ImageIcon, Send, XCircle } from "react-feather";

const Images = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [pendingGeneration, setPendingGeneration] = useState<boolean>(false);
  const [options, setOptions] = useState<{
    model: string;
    count: number;
    style: string;
  }>({
    model: "dall-e-3",
    count: 1,
    style: "vivid",
  });
  const [images, setImages] = useState<Array<ImageResponse>>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSend = async () => {
    setErrorMessage("");
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
    if (event.key === "Enter") {
      handleSend();
      event.preventDefault();
    }
  };

  return (
    <div className="h-full w-full flex">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 flex gap-4 px-4 pt-8 overflow-auto justify-center items-center">
          {!errorMessage && !pendingGeneration && images.length === 0 && (
            <div className="flex flex-col gap-4 items-center">
              <ImageIcon />
              <Text className="font-medium">
                Send a prompt to generate images
              </Text>
            </div>
          )}
          {images.map((image, index) => (
            <img
              key={index}
              alt={prompt}
              src={image.url!}
              width={240}
              height="auto"
            />
          ))}
          {errorMessage && (
            <div className="flex flex-col items-center gap-4 text-red-500">
              <XCircle />
              <Text className="">{errorMessage}</Text>
            </div>
          )}
          {pendingGeneration && (
            <div
              className={classNames(
                "p-4 border border-primary-300 rounded w-fit bg-primary-50 text-primary-500"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <circle cx="4" cy="12" r="3" fill="currentColor">
                  <animate
                    id="svgSpinners3DotsBounce0"
                    attributeName="cy"
                    begin="0;svgSpinners3DotsBounce1.end+0.25s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".33,.66,.66,1;.33,0,.66,.33"
                    values="12;6;12"
                  />
                </circle>
                <circle cx="12" cy="12" r="3" fill="currentColor">
                  <animate
                    attributeName="cy"
                    begin="svgSpinners3DotsBounce0.begin+0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".33,.66,.66,1;.33,0,.66,.33"
                    values="12;6;12"
                  />
                </circle>
                <circle cx="20" cy="12" r="3" fill="currentColor">
                  <animate
                    id="svgSpinners3DotsBounce1"
                    attributeName="cy"
                    begin="svgSpinners3DotsBounce0.begin+0.2s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines=".33,.66,.66,1;.33,0,.66,.33"
                    values="12;6;12"
                  />
                </circle>
              </svg>
            </div>
          )}
        </div>
        <div className="flex gap-4 px-4 pb-8">
          <Input
            name="userMessage"
            className="flex-1 p-4"
            placeholder="Enter your prompt"
            value={prompt}
            onChange={setPrompt}
            onKeyUp={handleInputMessageKeyUp}
          />
          <Button className="p-4" onClick={handleSend}>
            <Send size={18} />
          </Button>
        </div>
      </div>
      <div className="hidden lg:flex flex-col lg:w-1/4 xl:w-1/5 border-l">
        <Text className="font-medium p-4 border-b">Options</Text>
        <div className="flex-1 p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="model" className="text-sm">
              Model
            </label>
            <Input
              id="model"
              name="model"
              placeholder="Model"
              value={options.model}
              onChange={(value) => setOptions({ ...options, model: value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="count" className="text-sm">
              N
            </label>
            <Input
              id="count"
              name="count"
              type="number"
              min={1}
              max={10}
              placeholder="Count"
              value={String(options.count)}
              onChange={(value) =>
                setOptions({ ...options, count: Number(value) })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="style" className="text-sm">
              Style
            </label>
            <Input
              id="style"
              name="style"
              type="text"
              placeholder="Style"
              value={String(options.style)}
              onChange={(value) => setOptions({ ...options, style: value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Images;
