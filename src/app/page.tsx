"use client";

import { Button, Link, Logo, Text } from "@/components";
import Input from "@/components/Input";
import { APP_DESCRIPTION, APP_TITLE, STORAGE_KEY } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Index = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setApiKey(localStorage.getItem(STORAGE_KEY) ?? "");
  }, []);

  const handleSubmit = () => {
    if (!apiKey) return;
    localStorage.setItem(STORAGE_KEY, apiKey);
    router.push("/home/chat");
  };

  return (
    <div className="container p-4 m-auto h-screen flex flex-col justify-center items-center gap-8">
      <div className="flex flex-col gap-4 justify-center items-center">
        <Logo width="48px" height="48px" />
        <Text className="text-4xl font-medium">{APP_TITLE}</Text>
        <Text className="text-xl text-center">{APP_DESCRIPTION}</Text>
      </div>
      <div className="w-full flex flex-col gap-4 justify-center items-center">
        <Input
          className="w-full lg:w-1/2 text-center"
          name="apiKey"
          placeholder="Enter your OpenAI API Key"
          value={apiKey}
          onChange={setApiKey}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <Text className="flex gap-2 text-sm">
        Where to find API Key?
        <Link
          className="text-sm"
          href="https://platform.openai.com/docs/api-reference/authentication"
          target="_blank"
        >
          OpenAI API Reference
        </Link>
      </Text>
    </div>
  );
};

export default Index;
