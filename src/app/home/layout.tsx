"use client";

import { Link, Logo, Select, Text } from "@/components";
import { STORAGE_KEY } from "@/lib/constants";
import openai from "@/lib/openai";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { ArrowUpRight, Edit } from "react-feather";

const apis: { name: string; path: string; reference: string }[] = [
  {
    name: "Chat",
    path: "/home/chat",
    reference: "https://platform.openai.com/docs/api-reference/chat",
  },
  {
    name: "Images",
    path: "/home/images",
    reference: "https://platform.openai.com/docs/api-reference/images",
  },
  {
    name: "Files",
    path: "/home/files",
    reference: "https://platform.openai.com/docs/api-reference/files",
  },
  {
    name: "Assistants",
    path: "/home/assistants",
    reference: "https://platform.openai.com/docs/api-reference/assistants",
  },
  {
    name: "Moderations",
    path: "/home/moderations",
    reference: "https://platform.openai.com/docs/api-reference/moderations",
  },
];

const HomeLayout = (props: PropsWithChildren) => {
  const [apiKey, setApiKey] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const [api, setApi] = useState<
    { name: string; path: string; reference: string } | undefined
  >(apis.find((a) => a.path === pathname));

  useEffect(() => {
    const apiKey = localStorage.getItem(STORAGE_KEY);
    if (!apiKey) router.push("/");
    else {
      openai.apiKey = apiKey;
      setApiKey(apiKey);
    }
  }, [router]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Logo width="24px" height="24px" />
          <Text className="text-2xl font-medium">API Playground</Text>
        </div>
        {api && apiKey && (
          <div className="flex gap-4 items-center">
            <Link
              className="flex text-sm items-center"
              href={api.reference}
              target="_blank"
            >
              API Reference <ArrowUpRight size={16} />
            </Link>
            <div className="flex gap-1 text-sm items-center">
              <Text className="font-medium">API:</Text>
              <Select
                id="api"
                name="api"
                options={apis.map((api) => {
                  return { label: api.name, value: api.path };
                })}
                onChange={(option) => {
                  setApi(api);
                  router.push(option.value);
                }}
                value={api.path}
              ></Select>
            </div>
            <div className="hidden lg:flex gap-1 text-sm items-center">
              <Text className="font-medium">KEY:</Text>
              <Text>{apiKey}</Text>
            </div>
            <Link href="/">
              <Edit size={16} />
            </Link>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto">{props.children}</div>
    </div>
  );
};

export default HomeLayout;
