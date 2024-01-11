"use client";

import { usePathname, useRouter } from "next/navigation";
import { HTMLAttributeAnchorTarget, PropsWithChildren, useEffect } from "react";
import { OpenAISVG, GithubSVG } from "@/components/svgs";
import { Link, Text } from "@/components/ui";
import { STORAGE_KEY } from "@/lib/constants";
import openai from "@/lib/openai";

type Menu = { name: string; path: string; target?: HTMLAttributeAnchorTarget };

const menus: Menu[] = [
  {
    name: "Chat",
    path: "/home/chat",
  },
  {
    name: "Images",
    path: "/home/images",
  },
  {
    name: "Files",
    path: "/home/files",
  },
  {
    name: "Assistants",
    path: "/home/assistants",
  },
  {
    name: "Moderations",
    path: "/home/moderations",
  },
  {
    name: "Tokenizer",
    path: "/home/tokenizer",
  },
  {
    name: "API Reference",
    path: "https://platform.openai.com/docs/api-reference",
    target: "_blank",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const activeMenu: Menu = menus.find((menu) => menu.path === pathname)!;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b gap-8">
      <Link variant="ghost" href="/">
        <OpenAISVG width="24" height="24" className="mr-2" />
        <Text variant="heading">Playground+</Text>
      </Link>
      <div className="flex gap-8 overflow-auto">
        {menus.map((menu, index) => (
          <Link
            key={index}
            href={menu.path}
            variant={menu === activeMenu ? "active" : "default"}
            target={menu.target}
          >
            {menu.name}
          </Link>
        ))}
        <Link
          href="https://github.com/hkurma/openai-playground-plus"
          target="_blank"
        >
          <GithubSVG width="26" height="26" />
        </Link>
      </div>
    </div>
  );
};

const HomeLayout = (props: PropsWithChildren) => {
  const router = useRouter();

  useEffect(() => {
    const apiKey = localStorage.getItem(STORAGE_KEY);
    if (!apiKey) router.push("/");
    else openai.apiKey = apiKey;
  }, [router]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-auto">{props.children}</div>
    </div>
  );
};

export default HomeLayout;
