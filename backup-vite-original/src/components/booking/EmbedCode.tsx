import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const EmbedCode = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const currentDomain = window.location.origin;
  
  const iframeCode = `<iframe 
  src="${currentDomain}/booking" 
  width="100%" 
  height="800" 
  frameborder="0" 
  style="border-radius: 8px;">
</iframe>`;

  const scriptCode = `<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${currentDomain}/booking';
    iframe.width = '100%';
    iframe.height = '800px';
    iframe.frameBorder = '0';
    iframe.style.borderRadius = '8px';
    iframe.style.maxWidth = '600px';
    iframe.style.margin = '0 auto';
    iframe.style.display = 'block';
    
    var container = document.getElementById('booking-widget-container');
    if (container) {
      container.appendChild(iframe);
    }
  })();
</script>`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
      
      toast({
        title: "Copied!",
        description: `${type} code copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="gradient-text flex items-center gap-2">
            Embed Your Booking Widget
            <Badge variant="secondary">Integration Options</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Iframe Embed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Iframe Embed</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(iframeCode, "Iframe")}
                className="flex items-center gap-2"
              >
                {copied === "Iframe" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied === "Iframe" ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Simple iframe embed - works on any website. Just paste this HTML code where you want the booking widget to appear.
            </p>
            <Textarea
              value={iframeCode}
              readOnly
              className="font-mono text-sm min-h-[120px]"
            />
          </div>

          {/* Script Embed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">JavaScript Embed</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(scriptCode, "Script")}
                className="flex items-center gap-2"
              >
                {copied === "Script" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied === "Script" ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced script embed - add this script tag to your HTML and create a div with id="booking-widget-container" where you want the widget to appear.
            </p>
            <Textarea
              value={scriptCode}
              readOnly
              className="font-mono text-sm min-h-[160px]"
            />
          </div>

          {/* Direct Link */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Direct Link</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`${currentDomain}/booking`, "Link")}
                className="flex items-center gap-2"
              >
                {copied === "Link" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied === "Link" ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this direct link to your booking page.
            </p>
            <Textarea
              value={`${currentDomain}/booking`}
              readOnly
              className="font-mono text-sm h-12"
            />
          </div>

          {/* Usage Instructions */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Usage Instructions:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• For the script embed, create a container: <code className="bg-background px-1 rounded">&lt;div id="booking-widget-container"&gt;&lt;/div&gt;</code></li>
              <li>• The widget is fully responsive and will adapt to your website's styling</li>
              <li>• All bookings will be stored in your database and confirmation emails will be sent automatically</li>
              <li>• You can customize the availability through the admin panel</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};