"use client";

import { Link, Text, Textarea } from "@/components/ui";
import { useState } from "react";
import cl100k_base from "gpt-tokenizer";
import { Switch } from "@/components/ui";
import { Label } from "@/components/ui/label";
import { ArrowUpRight } from "lucide-react";

const colors = [
  "rgba(107,64,216,.3)",
  "rgba(104,222,122,.4)",
  "rgba(244,172,54,.4)",
  "rgba(239,65,70,.4)",
  "rgba(39,181,234,.4)",
];

const Tokenizer = () => {
  const [inputText, setInputText] = useState<string>(
    "Tokenizer is a tool to understand how a piece of text might be tokenized by a language model, and the total count of tokens in that piece of text."
  );
  const [showTokenIds, setShowTokenIds] = useState<boolean>(false);

  const encodedTokens = cl100k_base.encode(inputText);
  const decodedTokens = [];
  for (const token of encodedTokens) {
    decodedTokens.push(cl100k_base.decode([token]));
  }

  return (
    <div className="h-full max-w-screen-lg m-auto flex flex-col justify-center px-4 py-6 gap-4">
      <Text className="font-semibold">
        Using cl100k_base (GPT-3.5-turbo and GPT-4) encoding.
      </Text>
      <Textarea
        name="text"
        className="w-full flex-1 resize-none"
        placeholder="Enter some text here"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Switch
            id="tokenIds"
            onCheckedChange={(checked) => setShowTokenIds(checked)}
          />
          <Label htmlFor="tokenIds">Token ID&apos;s</Label>
        </div>
        <Link href="https://platform.openai.com/tokenizer" target="_blank">
          Learn more about tokenization <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="w-full flex-1 border rounded-md px-4 py-4 overflow-auto bg-slate-100">
        {(showTokenIds ? encodedTokens : decodedTokens).map((token, index) => (
          <div
            key={index}
            style={{
              display: "inline-block",
              backgroundColor: colors[index % colors.length],
            }}
          >
            <pre>
              {String(token)
                .replaceAll(" ", "\u00A0")
                .replaceAll("\n", "<newline>")}
            </pre>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <div className="flex-1 border rounded-md text-center p-4 bg-slate-100">
          <Text variant="heading">{inputText.length}</Text>
          <Text>Characters</Text>
        </div>
        <div className="flex-1 border rounded-md text-center p-4 bg-slate-100">
          <Text variant="heading">{encodedTokens.length}</Text>
          <Text>Tokens</Text>
        </div>
      </div>
      <Text variant="muted" className="text-center">
        Created using{" "}
        <Link href="https://github.com/niieani/gpt-tokenizer" target="_blank">
          gpt-tokenizer <ArrowUpRight size={14} />
        </Link>
      </Text>
    </div>
  );
};

export default Tokenizer;
