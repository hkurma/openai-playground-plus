"use client";

import { Text } from "@/components/ui";
import { MessageSquare } from "lucide-react";

const Assistants = () => {
  return (
    <div className="h-full w-full flex overflow-hidden px-4 py-6 gap-4">
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <MessageSquare />
        <Text variant="medium">Assistants Coming Soon...!</Text>
      </div>
    </div>
  );
};

export default Assistants;
