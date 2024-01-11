"use client";

import { LoadingSVG } from "@/components/svgs/LoadingSVG";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
  Textarea,
} from "@/components/ui";
import { DEFAULT_SYSTEM_INSTRUCTIONS } from "@/lib/constants";
import openai from "@/lib/openai";
import { cn } from "@/lib/utils";
import { MessageSquare, Send, XCircle } from "lucide-react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { useState } from "react";

const models = [
  { name: "gpt-3.5-turbo-1106" },
  { name: "gpt-4-1106-preview" },
  {
    name: "gpt-4-vision-preview",
  },
];

const Chat = () => {
  const [systemInstructions, setSystemInstructions] = useState<string>("");
  const [userMessage, setUserMessage] = useState<string>("");
  const [userFile, setUserFile] = useState<string>("");
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [pendingCompletion, setPendingCompletion] = useState<boolean>(false);
  const [options, setOptions] = useState<{
    model: string;
    temperature: number;
    maxtokens: number;
  }>({
    model: "gpt-3.5-turbo-1106",
    temperature: 1,
    maxtokens: 4096,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSend = () => {
    setPendingCompletion(true);
    const newMessages = [...messages];
    if (!userFile) {
      newMessages.push({
        role: "user",
        content: userMessage,
      });
    } else {
      newMessages.push({
        role: "user",
        content: [
          { type: "text", text: userMessage },
          { type: "image_url", image_url: { url: userFile } },
        ],
      });
    }
    setMessages(newMessages);
    setUserMessage("");
    setUserFile("");
    openai.chat.completions
      .create({
        model: options.model,
        messages: [
          {
            role: "system",
            content: systemInstructions ?? DEFAULT_SYSTEM_INSTRUCTIONS,
          },
          ...newMessages,
        ],
        temperature: options.temperature,
        max_tokens: 4096,
      })
      .then((completionResponse) => {
        newMessages.push(completionResponse.choices[0].message);
        setMessages(newMessages);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setPendingCompletion(false);
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

  const handleInputFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log;
      setUserFile(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full w-full flex overflow-hidden px-4 py-6 gap-4">
      <div className="hidden lg:flex flex-col lg:w-1/4 xl:w-1/5 gap-6">
        <div className="flex-1 flex flex-col gap-3">
          <Label htmlFor="systemMessage">System Message</Label>
          <Textarea
            name="systemMessage"
            id="systemMessage"
            className="h-full resize-none"
            placeholder={DEFAULT_SYSTEM_INSTRUCTIONS}
            onChange={(e) => setSystemInstructions(e.target.value)}
            value={systemInstructions}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          {messages.length === 0 && (
            <div className="w-full h-full flex flex-col justify-center items-center gap-3">
              <MessageSquare />
              <Text variant="medium">Send a message to start your chat</Text>
            </div>
          )}
          {messages
            .filter((m) => m.role != "system")
            .map((message, index) => (
              <Text
                key={index}
                className={cn(
                  "p-3 border rounded-md w-fit",
                  message.role === "assistant" && "bg-slate-100",
                  message.role === "user" && "ml-auto"
                )}
              >
                {typeof message.content == "string"
                  ? message.content
                  : (message.content as any)[0].text}
              </Text>
            ))}
          {pendingCompletion && (
            <div className="p-3 border rounded w-fit bg-slate-100">
              <LoadingSVG />
            </div>
          )}
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
            placeholder="Enter your message"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
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
          <Label htmlFor="temperature">Temperature</Label>
          <Input
            id="temperature"
            name="temperature"
            type="number"
            min={0}
            max={2}
            placeholder="Temperature"
            value={options.temperature}
            onChange={(e) =>
              setOptions({ ...options, temperature: Number(e.target.value) })
            }
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="maxtokens">Max Tokens</Label>
          <Input
            id="maxtokens"
            name="maxtokens"
            type="number"
            min={0}
            max={4096}
            placeholder="Max Tokens"
            value={options.maxtokens}
            onChange={(e) =>
              setOptions({ ...options, maxtokens: Number(e.target.value) })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
