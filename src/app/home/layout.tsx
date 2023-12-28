"use client";

import { Link, Logo, Text } from "@/components";
import { STORAGE_KEY } from "@/constants";
import openai from "@/lib/openai";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { Edit } from "react-feather";

const HomeLayout = (props: PropsWithChildren) => {
  const [apiKey, setApiKey] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const apiKey = localStorage.getItem(STORAGE_KEY);
    if (!apiKey) router.push("/");
    else {
      setApiKey(apiKey);
      openai.apiKey = apiKey;
    }
  }, [router]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <Link href="/">
          <div className="flex gap-2 items-center">
            <Logo width="24px" height="24px" />
            <Text className="text-2xl font-medium">Playground+</Text>
          </div>
        </Link>
        <div className="hidden lg:flex gap-4 items-center bg-slate-100 px-4 py-2 rounded">
          <Text className="text-xs">{apiKey}</Text>
          <Link href="/">
            <Edit size={16} />
          </Link>
        </div>
      </div>
      <div className="flex-1 overflow-auto">{props.children}</div>
    </div>
  );
};

export default HomeLayout;
