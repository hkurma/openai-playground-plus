"use client";

import { Button, Select, Text } from "@/components";
import openai from "@/lib/openai";
import classNames from "classnames";
import { FileObject } from "openai/resources/files.mjs";
import { ChangeEvent, useEffect, useState } from "react";
import { Trash } from "react-feather";

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
        <div className="flex-1 flex flex-col p-4 gap-2 overflow-auto">
          {files.map((file) => (
            <Text
              className={classNames(
                "p-4 cursor-pointer rounded transition duration-200 ease-in-out",
                file.id === fileDetails?.id
                  ? "bg-primary-100 text-primary-500"
                  : "hover:bg-primary-50"
              )}
              key={file.id}
              onClick={() => {
                setFileDetails(file);
              }}
            >
              {file.filename}
            </Text>
          ))}
        </div>
      </div>
      <div className="hidden md:flex flex-1 flex-col border-l">
        <Text className="font-medium p-4 border-b">Details</Text>
        <div className="flex-1 flex p-4 justify-center items-center">
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
                    <Button className="flex gap-2 justify-center items-center bg-slate-50  hover:bg-slate-100 border-slate-50 hover:border-slate-100">
                      <Trash size={16} className="text-red-500" />
                      <Text className="text-red-500">Delete</Text>
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
