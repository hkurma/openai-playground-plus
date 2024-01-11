"use client";

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
} from "@/components/ui";
import openai from "@/lib/openai";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { FileObject } from "openai/resources/files.mjs";
import { ChangeEvent, useEffect, useState } from "react";

const purposes = [{ name: "assistants" }, { name: "fine-tune" }];

const Files = () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [fileDetails, setFileDetails] = useState<FileObject | null>(null);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputFilePurpose, setInputFilePurpose] =
    useState<string>("assistants");
  const [pendingUpload, setPendingUpload] = useState<boolean>(false);

  useEffect(() => {
    openai.files.list().then((page) => {
      setFiles(page.data);
    });
  }, []);

  const formatCreatedAt = (date: number) => {
    return new Date(date * 1000).toLocaleString();
  };

  const formatBytes = (bytes: number) => {
    return (bytes / 1024).toLocaleString();
  };

  const handleDeleteFile = (file: FileObject) => {
    openai.files.del(file.id).then(() => {
      setFileDetails(null);
      setFiles(files.filter((f) => f.id !== file.id));
    });
  };

  const handleInputFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) setInputFile(files[0]);
  };

  const handleFileUpload = () => {
    if (!inputFile) return;
    setPendingUpload(true);
    openai.files
      .create({
        file: inputFile,
        purpose: inputFilePurpose as "fine-tune" | "assistants",
      })
      .then((file) => {
        setInputFile(null);
        setFiles([file, ...files]);
        setPendingUpload(false);
      });
  };

  return (
    <div className="h-full w-full flex overflow-hidden px-4 py-6 gap-4">
      <div className="hidden lg:flex flex-col lg:w-1/4 xl:w-1/5 gap-6">
        <Text variant="medium">Upload</Text>
        <div className="flex-1 flex flex-col gap-6">
          <div className="h-1/3 border p-2 rounded-md">
            <div className="h-full border border-dashed rounded-md bg-slate-100 flex flex-col gap-4 justify-center items-center">
              {inputFile && <Text>({inputFile.name})</Text>}
              <Label
                htmlFor="inputFile"
                className="cursor-pointer hover:underline underline-offset-2"
              >
                Select a file
              </Label>
              <Input
                name="inputFile"
                id="inputFile"
                type="file"
                className="hidden"
                onChange={handleInputFileChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label>Purpose</Label>
            <Select
              name="purpose"
              value={inputFilePurpose}
              onValueChange={(value) => setInputFilePurpose(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a purpose" />
              </SelectTrigger>
              <SelectContent>
                {purposes.map((purpose, index) => (
                  <SelectItem key={index} value={purpose.name}>
                    {purpose.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleFileUpload} disabled={pendingUpload}>
            {pendingUpload ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <Text variant="medium">Files</Text>
        <div className="flex-1 flex flex-col gap-2 overflow-auto">
          {files.map((file) => (
            <Button
              key={file.id}
              variant="outline"
              className={cn(file.id === fileDetails?.id && "bg-slate-100")}
              onClick={() => {
                setFileDetails(file);
              }}
            >
              {file.filename}
            </Button>
          ))}
        </div>
      </div>
      <div className="hidden md:flex flex-1 flex-col gap-6">
        <Text variant="medium">Details</Text>
        <div className="flex-1 flex justify-center items-center">
          {!fileDetails && <Text>Select a file to see details</Text>}
          {fileDetails && (
            <table className="table-auto">
              <tbody>
                <tr>
                  <td className="p-4">
                    <Text className="font-medium">Name:</Text>
                  </td>
                  <td className="p-4">
                    <Text>{fileDetails.filename}</Text>
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <Text className="font-medium">File ID:</Text>
                  </td>
                  <td className="p-4">
                    <Text>{fileDetails.id}</Text>
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <Text className="font-medium">Purpose:</Text>
                  </td>
                  <td className="p-4">
                    <Text>{fileDetails.purpose}</Text>
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <Text className="font-medium">Size:</Text>
                  </td>
                  <td className="p-4">
                    <Text>{formatBytes(fileDetails.bytes)} KB</Text>
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <Text className="font-medium">Created at:</Text>
                  </td>
                  <td className="p-4">
                    <Text>{formatCreatedAt(fileDetails.created_at)}</Text>
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <Text className="font-medium">Status:</Text>
                  </td>
                  <td className="p-4">
                    <Text>{fileDetails.status}</Text>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td className="p-4">
                    <Button
                      variant="destructive"
                      size="small"
                      onClick={() => handleDeleteFile(fileDetails)}
                    >
                      <Trash size={16} className="mr-2" /> Delete
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Files;
