"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";

export type ImageFile = {
  id: string;
  preview: string;
  file: File;
};

interface ImageDropProps {
  setFiles: React.Dispatch<React.SetStateAction<ImageFile[]>>;
  maxFiles?: number;
}

export default function ImageDrop({ setFiles, maxFiles = 1 }: ImageDropProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      const newFiles: ImageFile[] = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        preview: URL.createObjectURL(file),
        file, // keep the original File object for uploading
      }));

      setFiles(newFiles);
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, open, isDragReject } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    maxFiles,
    maxSize: 300 * 1024, // 300 KB
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    onDropRejected: (rejections) => {
      const reason = rejections[0]?.errors[0]?.code;
      if (reason === "file-too-large") setError("File too large (max 300KB)");
      else if (reason === "file-invalid-type") setError("Only JPG / PNG / WebP allowed");
      else setError("Invalid file");
    },
  });

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      setFiles((files) => {
        files.forEach((file) => URL.revokeObjectURL(file.preview));
        return [];
      });
    };
  }, [setFiles]);

  return (
    <div className="border border-dashed border-blue-600 rounded-xl p-6 bg-zinc-900">
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center text-center gap-3 cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="text-white text-sm">Drag & drop an image here</p>
        <p className="text-zinc-400 text-xs">JPG / PNG / WebP • Max 300KB</p>
        <button
          type="button"
          onClick={open}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
        >
          Choose File
        </button>
        {isDragReject && <p className="text-red-400 text-xs">Invalid file type</p>}
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    </div>
  );
}
