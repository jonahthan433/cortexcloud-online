import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Trash2, 
  Copy, 
  Eye, 
  Download,
  Users,
  Mail,
  Phone,
  MessageSquare,
  ExternalLink,
  CheckCircle
} from "lucide-react";

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select';
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
}

export const LeadCaptureBuilder = () => {
  const { toast } = useToast();
  const [formTitle, setFormTitle] = useState("Contact Us");
  const [formDescription, setFormDescription] = useState("Get in touch for a free consultation");
  const [fields, setFields] = useState<FormField[]>([
    {
      id: '1',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true
    },
    {
      id: '2',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true
    },
    {
      id: '3',
      type: 'phone',
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      required: false
    }
  ]);
  const [previewMode, setPreviewMode] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1-555-0123",
      message: "Interested in your services",
      timestamp: "2024-01-15 10:30 AM",
      source: "Website"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@company.com",
      phone: "+1-555-0456",
      message: "Requesting a demo",
      timestamp: "2024-01-15 09:15 AM",
      source: "Social Media"
    }
  ]);

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: `Enter ${type}`,
      required: false
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const generateEmbedCode = () => {
    const code = `<div id="cortex-lead-form" data-form-id="lead-capture-01"></div>
<script>
  // Form configuration
  window.CortexForm = {
    title: "${formTitle}",
    description: "${formDescription}",
    fields: ${JSON.stringify(fields, null, 2)},
    onSubmit: function(data) {
      // Lead captured: " + data.email + "
      fetch('${window.location.origin}/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
  };
</script>
<script src="${window.location.origin}/cortex-form-widget.js"></script>`;
    
    setEmbedCode(code);
    toast({
      title: "Embed Code Generated",
      description: "Copy the code below to embed this form on your website.",
    });
  };

  const getFieldIcon = (type: FormField['type']) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'textarea': return <MessageSquare className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Builder Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Lead Capture Form Builder</h3>
          <p className="text-sm text-muted-foreground">Create forms to capture leads from your website</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="hero"
            size="sm"
            onClick={generateEmbedCode}
          >
            <Copy className="h-4 w-4 mr-2" />
            Get Embed Code
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Builder Panel */}
        <div className={`${previewMode ? 'hidden lg:block' : ''}`}>
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Form Builder</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Form Settings */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="form-title">Form Title</Label>
                  <Input
                    id="form-title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Enter form title"
                  />
                </div>
                <div>
                  <Label htmlFor="form-description">Description</Label>
                  <Textarea
                    id="form-description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Enter description"
                    rows={2}
                  />
                </div>
              </div>

              {/* Field Types */}
              <div>
                <Label>Add Field</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => addField('text')}>
                    Text Field
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField('email')}>
                    Email Field
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField('phone')}>
                    Phone Field
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField('textarea')}>
                    Message Field
                  </Button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <Label>Form Fields</Label>
                {fields.map((field) => (
                  <Card key={field.id} className="border-primary/10">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getFieldIcon(field.type)}
                            <Badge variant="outline">{field.type}</Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeField(field.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Input
                          placeholder="Field label"
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                        />
                        
                        <Input
                          placeholder="Placeholder text"
                          value={field.placeholder}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        />
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                          />
                          <Label className="text-sm">Required field</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className={`${!previewMode ? 'hidden lg:block' : ''}`}>
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-primary" />
                <span>Form Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-primary/10 rounded-lg p-6 bg-gray-50/50">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold">{formTitle}</h3>
                  <p className="text-sm text-muted-foreground">{formDescription}</p>
                </div>
                
                <form className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id}>
                      <Label className="flex items-center space-x-2">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      {field.type === 'textarea' ? (
                        <Textarea placeholder={field.placeholder} />
                      ) : (
                        <Input 
                          type={field.type}
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                  
                  <Button className="w-full" variant="hero">
                    Submit Form
                  </Button>
                </form>
              </div>
              
              {/* Embed Code */}
              {embedCode && (
                <div className="mt-6">
                  <Label>Embed Code</Label>
                  <div className="relative">
                    <Textarea
                      value={embedCode}
                      readOnly
                      rows={8}
                      className="font-mono text-xs"
                    />
                    <Button
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(embedCode);
                          toast({
                            title: "Copied!",
                            description: "Embed code copied to clipboard.",
                          });
                        } catch (error) {
                          // Fallback for older browsers
                          const textArea = document.createElement('textarea');
                          textArea.value = embedCode;
                          document.body.appendChild(textArea);
                          textArea.focus();
                          textArea.select();
                          try {
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            toast({
                              title: "Copied!",
                              description: "Embed code copied to clipboard.",
                            });
                          } catch (fallbackError) {
                            toast({
                              title: "Copy failed",
                              description: "Please manually copy the embed code.",
                              variant: "destructive"
                            });
                          }
                        }
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full mt-2">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Embed on Website
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Submissions */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Recent Form Submissions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {submissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-3 border border-primary/10 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{submission.name}</h4>
                    <p className="text-sm text-muted-foreground">{submission.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{submission.timestamp}</p>
                  <Badge variant="outline" className="text-xs">
                    {submission.source}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
