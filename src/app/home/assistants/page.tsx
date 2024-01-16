'use client';

import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Switch,
  Text,
  Textarea,
} from '@/components/ui';
import openai from '@/lib/openai';
import { cn } from '@/lib/utils';
import { File, MessageSquare, PlayCircle, Plus, RotateCw } from 'lucide-react';
import { Assistant } from 'openai/resources/beta/assistants/assistants.mjs';
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages.mjs';
import { Thread } from 'openai/resources/beta/threads/threads.mjs';
import { FileObject } from 'openai/resources/files.mjs';
import { useEffect, useRef, useState } from 'react';

const models = [{ name: 'gpt-3.5-turbo-1106' }, { name: 'gpt-4-1106-preview' }];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const newAssistant: Partial<Assistant> = {
  id: '0',
  name: '',
  instructions: '',
  model: '',
  tools: [],
  file_ids: [],
};

const Assistants = () => {
  const [assistants, setAssistants] = useState<Partial<Assistant>[]>([]);
  const [activeAssistant, setActiveAssistant] = useState<Partial<Assistant>>();
  const [files, setFiles] = useState<FileObject[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [thread, setThread] = useState<Thread | null>(null);
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    fetchAssistants();
    fetchFiles();
  }, []);

  const fetchAssistants = () => {
    openai.beta.assistants.list().then((res) => {
      setAssistants(res.data);
      if (res.data.length > 0) setActiveAssistant(res.data[0]);
      else setActiveAssistant(newAssistant);
    });
  };

  const fetchFiles = () => {
    openai.files.list().then((res) => {
      setFiles(res.data);
    });
  };

  const handleToolChange = (
    tool: 'function' | 'code_interpreter' | 'retrieval',
    checked: boolean
  ) => {
    if (!activeAssistant || !activeAssistant.tools) return;
    const tools = [...activeAssistant.tools];
    if (checked)
      tools.push({ type: tool } as
        | Assistant.CodeInterpreter
        | Assistant.Retrieval
        | Assistant.Function);
    else
      tools.splice(
        tools.findIndex((t) => t.type === tool),
        1
      );
    setActiveAssistant({ ...activeAssistant, tools: tools });
  };

  const resolveFilename = (fileId: string) => {
    return files.find((f) => f.id === fileId)?.filename;
  };

  const handleAddFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    createFile(file);
  };

  const createFile = (file: File) => {
    if (!activeAssistant) return;
    openai.files.create({ file: file, purpose: 'assistants' }).then((res) => {
      setFiles([...files, res]);
      setActiveAssistant({
        ...activeAssistant,
        file_ids: [...(activeAssistant.file_ids ?? []), res.id],
      });
    });
  };

  const handleSaveActiveAssistant = () => {
    setSaving(true);
    if (activeAssistant?.id === '0')
      openai.beta.assistants
        .create({
          name: activeAssistant.name,
          instructions: activeAssistant.instructions,
          model: activeAssistant.model as string,
          tools: activeAssistant.tools,
          file_ids: activeAssistant.file_ids,
        })
        .then(() => {
          fetchAssistants();
        })
        .finally(() => {
          setSaving(false);
        });
    else
      openai.beta.assistants
        .update(activeAssistant?.id!, {
          name: activeAssistant?.name,
          instructions: activeAssistant?.instructions,
          model: activeAssistant?.model,
          tools: activeAssistant?.tools,
          file_ids: activeAssistant?.file_ids,
        })
        .then(() => {
          fetchAssistants();
        })
        .finally(() => {
          setSaving(false);
        });
  };

  const handleDeleteActiveAssistant = () => {
    if (!activeAssistant?.id) return;
    openai.beta.assistants.del(activeAssistant.id).then(() => {
      fetchAssistants();
    });
  };

  const handleAddMessageClick = () => {
    addMessage(thread?.id);
  };

  const handleInputMessageKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      addMessage(thread?.id);
      event.preventDefault();
    }
  };

  const addMessage = (threadId?: string) => {
    setMessages([...messages, { role: 'user', content: inputMessage }]);
    if (!threadId) createThread();
    else createMessage(threadId);
  };

  const createThread = () => {
    openai.beta.threads.create().then((res) => {
      setThread(res);
      createMessage(res.id);
    });
  };

  const createMessage = (threadId: string) => {
    openai.beta.threads.messages
      .create(threadId, { role: 'user', content: inputMessage })
      .then(() => {
        setInputMessage('');
      });
  };

  const handleCreateRun = () => {
    setRunning(true);
    openai.beta.threads.runs
      .create(thread?.id as string, {
        assistant_id: activeAssistant?.id as string,
      })
      .then((res) => {
        checkRunStatus(res.id);
      });
  };

  const checkRunStatus = (runId: string) => {
    openai.beta.threads.runs
      .retrieve(thread?.id as string, runId)
      .then((res) => {
        if (res.status === 'completed') retrieveMessages();
        else setTimeout(() => checkRunStatus(runId), 1000);
      });
  };

  const retrieveMessages = () => {
    openai.beta.threads.messages.list(thread?.id as string).then((res) => {
      setMessages(
        res.data
          .map((m) => ({
            role: m.role,
            content: (m.content[0] as MessageContentText).text.value,
          }))
          .reverse()
      );
      setRunning(false);
    });
  };

  const handleClear = () => {
    setThread(null);
    setMessages([]);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full w-full flex overflow-hidden">
      <div className="w-1/3 border-r h-full flex flex-col gap-4">
        <div className="flex-1 flex flex-col gap-4 overflow-auto px-4 py-6">
          <div className="flex flex-col gap-3">
            <Label>Assistant</Label>
            <Select
              name="assistants"
              value={activeAssistant?.id}
              onValueChange={(value) =>
                setActiveAssistant(
                  assistants.find((assistant) => assistant.id === value) ??
                    newAssistant
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an assistant" />
              </SelectTrigger>
              <SelectContent>
                {assistants.length === 0 && (
                  <Text variant="muted" className="pl-8 py-2">
                    You don&apos;t have any assistants.
                  </Text>
                )}
                {assistants.map((assistant, index) => (
                  <SelectItem key={index} value={assistant.id as string}>
                    {assistant.name}
                  </SelectItem>
                ))}
                <SelectSeparator />
                <SelectItem value="0">New Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label>Name</Label>
            <Input
              placeholder="Enter a name for your assistant"
              value={activeAssistant?.name ?? ''}
              onChange={(e) =>
                setActiveAssistant({ ...activeAssistant, name: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label>Instructions</Label>
            <Textarea
              placeholder="You are a helpful assistant."
              value={activeAssistant?.instructions ?? ''}
              rows={4}
              onChange={(e) =>
                setActiveAssistant({
                  ...activeAssistant,
                  instructions: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label>Model</Label>
            <Select
              name="model"
              value={activeAssistant?.model}
              onValueChange={(value) =>
                setActiveAssistant({ ...activeAssistant, model: value })
              }
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
            <Text variant="muted">Tools</Text>
            <hr />
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Label>Functions</Label>
                <Switch
                  name="functions"
                  checked={activeAssistant?.tools?.some(
                    (t) => t.type === 'function'
                  )}
                  onCheckedChange={(checked) =>
                    handleToolChange('function', checked)
                  }
                />
              </div>
              <div className="flex justify-between items-center">
                <Label>Code Interpreter</Label>
                <Switch
                  name="code_interpreter"
                  checked={activeAssistant?.tools?.some(
                    (t) => t.type === 'code_interpreter'
                  )}
                  onCheckedChange={(checked) =>
                    handleToolChange('code_interpreter', checked)
                  }
                />
              </div>
              <div className="flex justify-between items-center">
                <Label>Retrieval</Label>
                <Switch
                  name="retrieval"
                  checked={activeAssistant?.tools?.some(
                    (t) => t.type === 'retrieval'
                  )}
                  onCheckedChange={(checked) =>
                    handleToolChange('retrieval', checked)
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Text variant="muted">Files</Text>
              <Label htmlFor="addFile" className="flex cursor-pointer px-2">
                <Plus size={14} className="mr-1" />
                Add
                <Input
                  id="addFile"
                  name="addFile"
                  type="file"
                  className="hidden"
                  onChange={handleAddFile}
                />
              </Label>
            </div>
            <hr />
            {activeAssistant?.file_ids?.length === 0 && (
              <Text variant="muted">
                Add files to use with code interpreter or retrieval.
              </Text>
            )}
            {activeAssistant?.file_ids?.map((fileId, index) => (
              <div key={index} className="flex gap-1">
                <File size={16} />
                <Text>{resolveFilename(fileId)}</Text>
              </div>
            ))}
          </div>
        </div>
        {activeAssistant && (
          <div className="flex gap-4 px-4 py-6">
            {activeAssistant.id !== '0' && (
              <Button
                className="flex-1"
                variant="destructive"
                onClick={handleDeleteActiveAssistant}
              >
                Delete
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={handleSaveActiveAssistant}
              disabled={saving}
            >
              {saving && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}{' '}
              {activeAssistant?.id === '0' ? 'Create' : 'Save'}
            </Button>
          </div>
        )}
      </div>
      <div className="flex-1 px-4 py-6 flex flex-col gap-4">
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          {messages.length === 0 && (
            <div className="w-full h-full flex flex-col justify-center items-center gap-3">
              <MessageSquare />
              <Text variant="medium">Send a message to start your chat</Text>
            </div>
          )}
          {messages.map((message, index) => (
            <Text
              key={index}
              className={cn(
                'p-3 border rounded-md w-fit',
                message.role === 'assistant' && 'bg-slate-100',
                message.role === 'user' && 'ml-auto'
              )}
            >
              {message.content as string}
            </Text>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {thread && <Text variant="muted">{thread.id}</Text>}
        <div className="flex gap-4">
          <Input
            name="inputMessage"
            className="flex-1"
            placeholder="Enter your message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyUp={handleInputMessageKeyUp}
          />
          <Button onClick={handleAddMessageClick} variant="outline">
            <Plus size={18} />
          </Button>
          <Button
            onClick={handleCreateRun}
            disabled={
              !activeAssistant ||
              activeAssistant.id === '0' ||
              !thread ||
              running
            }
          >
            <PlayCircle
              size={18}
              className={cn('mr-2', running && 'animate-spin')}
            />
            Run
          </Button>
          {thread && (
            <Button variant="secondary" size="small" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assistants;
