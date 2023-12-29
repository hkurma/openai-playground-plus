"use client";

import { Button, Input, Select, Text } from "@/components";
import openai from "@/lib/openai";
import classNames from "classnames";
import { Moderation } from "openai/resources/moderations.mjs";
import { useState } from "react";
import { MessageSquare, Send } from "react-feather";

const Moderations = () => {
  const [inputText, setInputText] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [moderation, setModeration] = useState<Moderation>();
  const [options, setOptions] = useState<{
    model: string;
  }>({
    model: "text-moderation-latest",
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
    if (event.key === "Enter") {
      handleSend();
      event.preventDefault();
    }
  };

  return (
    <div className="h-full w-full flex">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 flex gap-4 px-4 pt-8 overflow-auto justify-center items-center flex-wrap">
          {!moderation && !pending && (
            <div className="flex flex-col gap-4 items-center">
              <MessageSquare />
              <Text className="font-medium">
                Send a text to check moderation.
              </Text>
            </div>
          )}
          {pending && (
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
          {moderation &&
            !pending &&
            Object.entries(moderation.categories).map((category) => (
              <div
                key={category[0]}
                className={classNames(
                  "flex flex-col items-center justify-center gap-4 border  rounded p-4",
                  category[1]
                    ? "border-red-300 text-red-500 bg-red-50"
                    : "border-primary-300 text-primary-500 bg-primary-50"
                )}
              >
                <Text className="text-xl text-medium">{category[0]}</Text>
                <Text>{(moderation.category_scores as any)[category[0]]}</Text>
              </div>
            ))}
        </div>
        <div className="flex gap-4 px-4 pb-8">
          <Input
            name="text"
            className="flex-1 p-4"
            placeholder="Enter your text"
            value={inputText}
            onChange={setInputText}
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
            <Select
              id="model"
              name="model"
              placeholder="Model"
              options={[
                {
                  label: "text-moderation-latest",
                  value: "text-moderation-latest",
                },
                {
                  label: "text-moderation-stable",
                  value: "text-moderation-stable",
                },
              ]}
              value={options.model}
              onChange={(option) =>
                setOptions({ ...options, model: option.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Moderations;
