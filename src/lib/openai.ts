import { STORAGE_KEY } from "@/constants";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "",
  dangerouslyAllowBrowser: true,
});

export default openai;