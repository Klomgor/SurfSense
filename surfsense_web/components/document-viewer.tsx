import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { FileText } from "lucide-react";

interface DocumentViewerProps {
  title: string;
  content: string;
  trigger?: React.ReactNode;
}

export function DocumentViewer({ title, content, trigger }: DocumentViewerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <FileText size={16} />
            <span>View Content</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <MarkdownViewer content={content} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 