"use client";

import { Button, Select, Text } from "@/components";
import openai from "@/lib/openai";
import classNames from "classnames";
import { FileObject } from "openai/resources/files.mjs";
import { ChangeEvent, useEffect, useState } from "react";
import { Trash } from "react-feather";

const Files = () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [fileInfo, setFileInfo] = useState<FileObject | null>(null);
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
      setFileInfo(null);
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
    <div className="h-full w-full flex overflow-hidden">
      <div className="hidden lg:flex flex-col lg:w-1/4 xl:w-1/5 border-r">
        <Text className="font-medium p-4 border-b">Upload</Text>
        <div className="flex-1 p-4 flex flex-col gap-4">
          <div className="h-1/3 border p-2 rounded">
            <div className="h-full border border-dashed rounded bg-slate-100 flex flex-col gap-4 justify-center items-center">
              <label
                htmlFor="inputFile"
                className="text-primary-500 hover:text-primary-600 transition duration-200 ease-in-out cursor-pointer"
              >
                Select file
              </label>
              <input
                name="inputFile"
                id="inputFile"
                type="file"
                className="hidden"
                onChange={handleInputFileChange}
              />
              {inputFile && <Text className="text-sm">({inputFile.name})</Text>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="inputFilePurpose">Purpose</label>
            <Select
              name="inputFilePurpose"
              id="inputFilePurpose"
              options={[
                { label: "assistants", value: "assistants" },
                { label: "fine-tune", value: "fine-tune" },
              ]}
              onChange={(option) => setInputFilePurpose(option.value)}
            />
          </div>
          <Button onClick={handleFileUpload} disabled={pendingUpload}>
            {pendingUpload ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <Text className="font-medium p-4 border-b">Files</Text>
        <div className="flex-1 flex">
          <div className="w-1/2 border-r flex flex-col p-4 overflow-auto">
            {files.map((file) => (
              <Text
                className={classNames(
                  "p-4 cursor-pointer rounded transition duration-200 ease-in-out",
                  file.id === fileInfo?.id
                    ? "bg-primary-100 text-primary-500"
                    : "hover:bg-primary-50"
                )}
                key={file.id}
                onClick={() => {
                  setFileInfo(file);
                }}
              >
                {file.filename}
              </Text>
            ))}
          </div>
          <div className="w-1/2 flex p-4 justify-center items-center">
            {!fileInfo && <Text>Select a file to see details</Text>}
            {fileInfo && (
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <Text className="font-medium">Name:</Text>
                  <Text>{fileInfo.filename}</Text>
                </div>
                <div className="flex gap-4">
                  <Text className="font-medium">File ID:</Text>
                  <Text>{fileInfo.id}</Text>
                </div>
                <div className="flex gap-4">
                  <Text className="font-medium">Purpose:</Text>
                  <Text>{fileInfo.purpose}</Text>
                </div>
                <div className="flex gap-4">
                  <Text className="font-medium">Size:</Text>
                  <Text>{formatBytes(fileInfo.bytes)}</Text>
                </div>
                <div className="flex gap-4">
                  <Text className="font-medium">Created at:</Text>
                  <Text>{formatCreatedAt(fileInfo.created_at)}</Text>
                </div>
                <div className="flex gap-4">
                  <Text className="font-medium">Status:</Text>
                  <Text>{fileInfo.status}</Text>
                </div>
                <div
                  className="flex gap-2 justify-center items-center text-red-500 cursor-pointer"
                  onClick={() => handleDeleteFile(fileInfo)}
                >
                  <Trash size={16} />
                  <Text>Delete</Text>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Files;
