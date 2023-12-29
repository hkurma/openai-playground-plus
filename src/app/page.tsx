"use client";

import { Button, Link, Logo, Text } from "@/components";
import Input from "@/components/Input";
import { STORAGE_KEY } from "@/lib/constants";
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
    <div className="container p-4 m-auto h-screen flex flex-col justify-center items-center gap-4">
      <div className="flex gap-4">
        <Logo width="36px" height="36px" />
        <Text className="text-4xl font-medium">Playground+</Text>
      </div>
      <Text className="text-xl text-center">
        Play with OpenAI API&apos;s using your own API Key.
      </Text>
      <div className="w-full lg:w-1/2 flex gap-4 my-8">
        <Input
          name="apiKey"
          className="flex-1"
          placeholder="Enter your OpenAI API Key"
          value={apiKey}
          onChange={setApiKey}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default Index;
