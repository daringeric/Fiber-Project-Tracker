"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Project, STAGE_CONFIGS } from "@/types";
import {
  emailConfig,
  emailSubjects,
  EmailTemplate,
  renderEmailTemplate,
} from "@/lib/email";
import { getWeightedProgress } from "@/lib/workflow";
import {
  Send,
  Loader2,
  Eye,
  Edit3,
  Mail,
  User,
  FileText,
  AlertCircle,
} from "lucide-react";

interface EmailComposeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onSend: (emailData: EmailSendData) => Promise<void>;
  defaultTemplate?: EmailTemplate;
}

export interface EmailSendData {
  template: EmailTemplate;
  to: string;
  subject: string;
  customMessage?: string;
  includeTrackingLink: boolean;
}

const TEMPLATE_OPTIONS: { value: EmailTemplate; label: string; description: string }[] = [
  {
    value: "stage-update",
    label: "Stage Update",
    description: "Notify customer about current stage progress",
  },
  {
    value: "welcome",
    label: "Welcome Email",
    description: "Send project welcome with tracking info",
  },
  {
    value: "completed",
    label: "Project Completed",
    description: "Congratulate customer on completion",
  },
];

export function EmailComposeModal({
  open,
  onOpenChange,
  project,
  onSend,
  defaultTemplate = "stage-update",
}: EmailComposeModalProps) {
  const [template, setTemplate] = useState<EmailTemplate>(defaultTemplate);
  const [to, setTo] = useState(project.customerEmail);
  const [subject, setSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [includeTrackingLink, setIncludeTrackingLink] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"compose" | "preview">("compose");
  const [previewHtml, setPreviewHtml] = useState("");

  // Update subject when template changes
  useEffect(() => {
    const templateData = {
      customerName: project.customerName,
      trackingCode: project.trackingCode,
      trackingUrl: `${emailConfig.baseUrl}/track/${project.trackingCode}`,
      stageName: STAGE_CONFIGS[project.currentStage].name,
    };
    setSubject(emailSubjects[template](templateData));
  }, [template, project]);

  // Generate preview when switching to preview tab
  useEffect(() => {
    if (activeTab === "preview") {
      try {
        const html = renderEmailTemplate(template, project);
        setPreviewHtml(html);
      } catch (error) {
        setPreviewHtml("<p>Error generating preview</p>");
      }
    }
  }, [activeTab, template, project]);

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend({
        template,
        to,
        subject,
        customMessage: customMessage || undefined,
        includeTrackingLink,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
    setIsSending(false);
  };

  const progress = getWeightedProgress(project);
  const currentStage = STAGE_CONFIGS[project.currentStage];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-wave-500" />
            Send Email Notification
          </DialogTitle>
          <DialogDescription>
            Compose and preview the email before sending to {project.customerName}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "compose" | "preview")} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compose" className="gap-2">
              <Edit3 className="w-4 h-4" />
              Compose
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="flex-1 overflow-auto space-y-4 mt-4">
            {/* Template Selection */}
            <div className="space-y-2">
              <Label>Email Template</Label>
              <Select value={template} onValueChange={(v) => setTemplate(v as EmailTemplate)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex flex-col">
                        <span>{opt.label}</span>
                        <span className="text-xs text-gray-500">{opt.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project Context */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="text-sm font-medium text-gray-700">Email Context</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Current Stage:</span>
                  <Badge variant="inProgress" className="ml-2">
                    {currentStage.name}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-500">Progress:</span>
                  <span className="ml-2 font-medium">{progress}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Tracking Code:</span>
                  <span className="ml-2 font-mono">{project.trackingCode}</span>
                </div>
                <div>
                  <span className="text-gray-500">Service:</span>
                  <span className="ml-2">{project.serviceType || "N/A"}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Recipient */}
            <div className="space-y-2">
              <Label htmlFor="to">
                <User className="w-4 h-4 inline mr-1" />
                Recipient
              </Label>
              <Input
                id="to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="customer@example.com"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">
                <FileText className="w-4 h-4 inline mr-1" />
                Subject Line
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject..."
              />
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label htmlFor="customMessage">
                Additional Message (Optional)
              </Label>
              <Textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add a personal note to the customer..."
                rows={3}
              />
              <p className="text-xs text-gray-500">
                This message will be included at the top of the email template.
              </p>
            </div>

            {/* Options */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeTracking"
                checked={includeTrackingLink}
                onChange={(e) => setIncludeTrackingLink(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="includeTracking" className="text-sm font-normal cursor-pointer">
                Include tracking link in email
              </Label>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-hidden mt-4">
            <div className="border rounded-lg overflow-hidden h-full flex flex-col">
              {/* Email Header Preview */}
              <div className="bg-gray-100 p-3 border-b space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 w-16">From:</span>
                  <span>{emailConfig.from}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 w-16">To:</span>
                  <span>{to}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 w-16">Subject:</span>
                  <span className="font-medium">{subject}</span>
                </div>
              </div>

              {/* Email Body Preview */}
              <div className="flex-1 overflow-auto bg-gray-200 p-4">
                {customMessage && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-amber-800 text-sm font-medium mb-1">
                      <AlertCircle className="w-4 h-4" />
                      Custom Message Added
                    </div>
                    <p className="text-sm text-amber-700">{customMessage}</p>
                  </div>
                )}
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-[400px] bg-white rounded-lg border-0"
                  title="Email Preview"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending || !to || !subject}>
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
