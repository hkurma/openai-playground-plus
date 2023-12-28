"use client";

import { Button, Input, Text, Textarea } from "@/components";
import { DEFAULT_SYSTEM_MESSAGE } from "@/constants";
import openai from "@/lib/openai";
import classNames from "classnames";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send } from "react-feather";

const Chat = () => {
  const [systemMessage, setSystemMessage] = useState<string>("");
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [pendingCompletion, setPendingCompletion] = useState<boolean>(false);
  const [options, setOptions] = useState<{
    model: string;
    temperature: number;
  }>({
    model: "gpt-4-1106-preview",
    temperature: 1,
  });

  const handleSend = async () => {
    setPendingCompletion(true);
    const newMessages = [...messages];
    newMessages.push({
      role: "user",
      content: userMessage,
    });
    setMessages(newMessages);
    setUserMessage("");
    const completionResponse = await openai.chat.completions.create({
      model: options.model,
      messages: [
        { role: "system", content: systemMessage ?? DEFAULT_SYSTEM_MESSAGE },
        ...newMessages,
      ],
      temperature: options.temperature,
    });
    newMessages.push(completionResponse.choices[0].message);
    setMessages(newMessages);
    setPendingCompletion(false);
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
    <div className="h-full w-full flex overflow-hidden">
      <div className="hidden lg:flex flex-col lg:w-1/4 xl:w-1/5 border-r">
        <Text className="font-medium p-4 border-b">System Message</Text>
        <Textarea
          name="systemMessage"
          className="flex-1 border-none resize-none"
          placeholder={DEFAULT_SYSTEM_MESSAGE}
          onChange={setSystemMessage}
          value={systemMessage}
        />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <div
          className={classNames(
            "flex-1 flex flex-col gap-4 px-4 pt-8 overflow-auto",
            messages.length === 0 && "justify-center items-center"
          )}
        >
          {messages.length === 0 && (
            <>
              <MessageSquare />
              <Text className="font-medium">
                Send a message to start your chat
              </Text>
            </>
          )}
          {messages
            .filter((m) => m.role != "system")
            .map((message, index) => (
              <Text
                key={index}
                className={classNames(
                  "p-4 border border-primary-300 rounded w-fit",
                  message.role === "assistant" && "bg-primary-50",
                  message.role === "user" && "ml-auto"
                )}
              >
                {message.content as string}
              </Text>
            ))}
          {pendingCompletion && (
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
            placeholder="Enter your message"
            value={userMessage}
            onChange={setUserMessage}
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
            <label htmlFor="temperature" className="text-sm">
              Temperature
            </label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              min={0}
              max={2}
              placeholder="Temperature"
              value={String(options.temperature)}
              onChange={(value) =>
                setOptions({ ...options, temperature: Number(value) })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
