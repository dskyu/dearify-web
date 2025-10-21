"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, FileImage, FileAudio, FileVideo, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DragDropUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  selectedFile?: File | null;
  className?: string;
  placeholder?: string;
  description?: string;
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({
  accept = "*",
  maxSize = 10,
  onFileSelect,
  onFileRemove,
  selectedFile,
  className,
  placeholder = "拖拽文件到此处或点击上传",
  description,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File) => {
      if (file.size > maxSize * 1024 * 1024) {
        setError(`文件大小不能超过 ${maxSize}MB`);
        return false;
      }

      if (accept !== "*") {
        const acceptedTypes = accept.split(",").map((type) => type.trim());
        const fileType = file.type;
        const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

        const isValidType = acceptedTypes.some(
          (type) =>
            type === fileType ||
            type === fileExtension ||
            (type.startsWith(".") && fileExtension === type) ||
            (type.includes("/") && fileType.startsWith(type.split("/")[0])),
        );

        if (!isValidType) {
          setError(`不支持的文件类型。支持的类型：${accept}`);
          return false;
        }
      }

      setError(null);
      return true;
    },
    [accept, maxSize],
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        onFileSelect(file);
      }
    },
    [validateFile, onFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [handleFileSelect],
  );

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith("image/"))
      return <FileImage className="h-8 w-8 text-blue-500" />;
    if (type.startsWith("audio/"))
      return <FileAudio className="h-8 w-8 text-green-500" />;
    if (type.startsWith("video/"))
      return <FileVideo className="h-8 w-8 text-purple-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      {selectedFile ? (
        <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(selectedFile)}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            {onFileRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onFileRemove}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
            error && "border-red-300 bg-red-50",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "p-3 rounded-full transition-colors",
                isDragOver ? "bg-blue-100" : "bg-gray-100",
              )}
            >
              <Upload
                className={cn(
                  "h-6 w-6 transition-colors",
                  isDragOver ? "text-blue-600" : "text-gray-600",
                )}
              />
            </div>

            <div>
              <p
                className={cn(
                  "text-sm font-medium transition-colors",
                  error
                    ? "text-red-600"
                    : isDragOver
                      ? "text-blue-600"
                      : "text-gray-700",
                )}
              >
                {error || placeholder}
              </p>
              {description && !error && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              )}
            </div>

            <Button variant="outline" size="sm" className="mt-2">
              选择文件
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;
