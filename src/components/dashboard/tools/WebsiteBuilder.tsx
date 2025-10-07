import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe,
  Palette,
  Type,
  Image,
  Settings,
  Eye,
  Save,
  Download,
  ExternalLink,
  CheckCircle,
  Plus,
  Edit3,
  Trash2
} from "lucide-react";

interface WebsitePage {
  id: string;
  name: string;
  slug: string;
  content: {
    hero: {
      title: string;
      subtitle: string;
      buttonText: string;
      buttonLink: string;
    };
    sections: Array<{
      id: string;
      type: 'text' | 'image' | 'features' | 'contact';
      content: string;
      title?: string;
    }>;
  };
}

interface ColorScheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export const WebsiteBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("design");
  const [currentPage, setCurrentPage] = useState(0);
  const [websiteSettings, setWebsiteSettings] = useState({
    title: "My Business",
    description: "Professional business website",
    domain: "mybusiness.cortexcloud.com",
    favicon: ""
  });

  const [colorScheme, setColorScheme] = useState<ColorScheme>({
    primary: "#3b82f6",
    secondary: "#6366f1", 
    background: "#ffffff",
    text: "#1f2937"
  });

  const [websitePages, setWebsitePages] = useState<WebsitePage[]>([
    {
      id: "home",
      name: "Home",
      slug: "/",
      content: {
        hero: {
          title: "Welcome to My Business",
          subtitle: "Professional service you can trust",
          buttonText: "Get Started",
          buttonLink: "/contact"
        },
        sections: [
          {
            id: "about",
            type: "text",
            title: "About Us",
            content: "We are a professional service company dedicated to helping our clients succeed. With years of experience and expertise, we deliver exceptional results."
          },
          {
            id: "features",
            type: "features",
            title: "Our Services",
            content: "Service 1,Service 2,Service 3"
          },
          {
            id: "contact",
            type: "contact",
            title: "Contact Us",
            content: "Get in touch with us today!"
          }
        ]
      }
    }
  ]);

  const [websiteTemplates] = useState([
    {
      id: "professional",
      name: "Professional",
      preview: "/api/placeholder/300/200",
      color: "blue",
      style: "clean"
    },
    {
      id: "creative",
      name: "Creative",
      preview: "/api/placeholder/300/200", 
      color: "purple",
      style: "modern"
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: "/api/placeholder/300/200",
      color: "gray",
      style: "simple"
    }
  ]);

  const updateWebsiteSettings = (field: string, value: string) => {
    setWebsiteSettings(prev => ({ ...prev, [field]: value }));
  };

  const updateColorScheme = (colorType: keyof ColorScheme, value: string) => {
    setColorScheme(prev => ({ ...prev, [colorType]: value }));
  };

  const updatePageContent = (sectionId: string, updates: Partial<WebsitePage['content']['sections'][0]>) => {
    setWebsitePages(pages => 
      pages.map((page, index) => 
        index === currentPage 
          ? {
              ...page,
              content: {
                ...page.content,
                sections: page.content.sections.map(section =>
                  section.id === sectionId ? { ...section, ...updates } : section
                )
              }
            }
          : page
      )
    );
  };

  const addNewPage = () => {
    const newPage: WebsitePage = {
      id: `page-${Date.now()}`,
      name: "New Page",
      slug: "/new-page",
      content: {
        hero: {
          title: "New Page",
          subtitle: "Add your content here",
          buttonText: "Learn More",
          buttonLink: "#"
        },
        sections: [
          {
            id: "content",
            type: "text",
            title: "Content",
            content: "Add your page content here..."
          }
        ]
      }
    };
    setWebsitePages([...websitePages, newPage]);
    setCurrentPage(websitePages.length);
  };

  const publishWebsite = () => {
    toast({
      title: "Website Published!",
      description: "Your website is now live and accessible to visitors.",
    });
  };

  const previewWebsite = () => {
    try {
      const previewUrl = `/preview/${websiteSettings.domain}`;
      const newWindow = window.open(previewUrl, '_blank');
      if (!newWindow) {
        toast({
          title: "Popup blocked",
          description: "Please allow popups for this site to preview your website",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Preview error",
        description: "Unable to open preview. Please check your domain settings.",
        variant: "destructive"
      });
    }
  };

  const currentPageData = websitePages[currentPage] || websitePages[0];

  return (
    <div className="space-y-6">
      {/* Website Builder Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Website Builder</h3>
          <p className="text-sm text-muted-foreground">Create and customize your business website</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={previewWebsite}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="hero" size="sm" onClick={publishWebsite}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          {/* Website Settings */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <span>Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site-title">Site Title</Label>
                <Input
                  id="site-title"
                  value={websiteSettings.title}
                  onChange={(e) => updateWebsiteSettings('title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="site-description">Description</Label>
                <Textarea
                  id="site-description"
                  value={websiteSettings.description}
                  onChange={(e) => updateWebsiteSettings('description', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="site-domain">Domain</Label>
                <Input
                  id="site-domain"
                  value={websiteSettings.domain}
                  onChange={(e) => updateWebsiteSettings('domain', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pages */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <span>Pages</span>
                </CardTitle>
                <Button size="sm" variant="outline" onClick={addNewPage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {websitePages.map((page, index) => (
                  <Button
                    key={page.id}
                    variant={currentPage === index ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setCurrentPage(index)}
                  >
                    <Globe className="h-6 w-4 mr-2" />
                    {page.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Builder Area */}
        <div className="xl:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            {/* Design Tab */}
            <TabsContent value="design" className="mt-6">
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <span>Choose Template</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {websiteTemplates.map((template) => (
                      <Card 
                        key={template.id}
                        className="cursor-pointer border-primary/10 hover:border-primary/30 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                            <Globe className="h-8 w-8 text-gray-400" />
                          </div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{template.style} design</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {template.color}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="mt-6">
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Type className="h-5 w-5 text-primary" />
                    <span>Page Content - {currentPageData.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Hero Section */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Hero Section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                      value={currentPageData.content.hero.title}
                          onChange={(e) => setWebsitePages(pages => 
                            pages.map((page, index) =>
                              index === currentPage 
                                ? {
                                    ...page,
                                    content: {
                                      ...page.content,
                                      hero: { ...page.content.hero, title: e.target.value }
                                    }
                                  }
                                : page
                            )
                          )}
                        />
                      </div>
                      <div>
                        <Label>Subtitle</Label>
                        <Input
                          value={currentPageData.content.hero.subtitle}
                          onChange={(e) => setWebsitePages(pages => 
                            pages.map((page, index) =>
                              index === currentPage 
                                ? {
                                    ...page,
                                    content: {
                                      ...page.content,
                                      hero: { ...page.content.hero, subtitle: e.target.value }
                                    }
                                  }
                                : page
                            )
                          )}
                        />
                      </div>
                      <div>
                        <Label>Button Text</Label>
                        <Input
                          value={currentPageData.content.hero.buttonText}
                          onChange={(e) => setWebsitePages(pages => 
                            pages.map((page, index) =>
                              index === currentPage 
                                ? {
                                    ...page,
                                    content: {
                                      ...page.content,
                                      hero: { ...page.content.hero, buttonText: e.target.value }
                                    }
                                  }
                                : page
                            )
                          )}
                        />
                      </div>
                      <div>
                        <Label>Button Link</Label>
                        <Input
                          value={currentPageData.content.hero.buttonLink}
                          onChange={(e) => setWebsitePages(pages => 
                            pages.map((page, index) =>
                              index === currentPage 
                                ? {
                                    ...page,
                                    content: {
                                      ...page.content,
                                      hero: { ...page.content.hero, buttonLink: e.target.value }
                                    }
                                  }
                                : page
                            )
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Page Sections</h4>
                    {currentPageData.content.sections.map((section) => (
                      <Card key={section.id} className="border-primary/10">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium">{ section.title }</h5>
                              <Badge variant="outline">{section.type}</Badge>
                            </div>
                            <div>
                              <Label>Section Title</Label>
                              <Input
                                value={section.title || ''}
                                onChange={(e) => updatePageContent(section.id, { title: e.target.value })}
                                placeholder="Section title"
                              />
                            </div>
                            <div>
                              <Label>Content</Label>
                              <Textarea
                                value={section.content}
                                onChange={(e) => updatePageContent(section.id, { content: e.target.value })}
                                rows={3}
                                placeholder="Section content"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customize Tab */}
            <TabsContent value="customize" className="mt-6">
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <span>Colors & Styling</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label>Primary Color</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          type="color"
                          value={colorScheme.primary}
                          onChange={(e) => updateColorScheme('primary', e.target.value)}
                          className="w-12 h-8"
                        />
                        <Input
                          value={colorScheme.primary}
                          onChange={(e) => updateColorScheme('primary', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Secondary Color</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          type="color"
                          value={colorScheme.secondary}
                          onChange={(e) => updateColorScheme('secondary', e.target.value)}
                          className="w-12 h-8"
                        />
                        <Input
                          value={colorScheme.secondary}
                          onChange={(e) => updateColorScheme('secondary', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Background</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          type="color"
                          value={colorScheme.background}
                          onChange={(e) => updateColorScheme('background', e.target.value)}
                          className="w-12 h-8"
                        />
                        <Input
                          value={colorScheme.background}
                          onChange={(e) => updateColorScheme('background', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Text Color</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          type="color"
                          value={colorScheme.text}
                          onChange={(e) => updateColorScheme('text', e.target.value)}
                          className="w-12 h-8"
                        />
                        <Input
                          value={colorScheme.text}
                          onChange={(e) => updateColorScheme('text', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="mt-6">
              <Card className="glass-effect border-primary/20">
                <CardContent className="p-6">
                  <div className="border border-primary/10 rounded-lg overflow-hidden">
                    {/* Browser Header */}
                    <div className="bg-gray-100 p-3 flex items-center space-x-2">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
                        {websiteSettings.domain}
                      </div>
                    </div>
                    
                    {/* Website Preview */}
                    <div 
                      className="p-8 min-h-96"
                      style={{ 
                        backgroundColor: colorScheme.background,
                        color: colorScheme.text 
                      }}
                    >
                      {/* Hero Section */}
                      <div className="text-center mb-12">
                        <h1 
                          className="text-4xl font-bold mb-4"
                          style={{ color: colorScheme.primary }}
                        >
                          {currentPageData.content.hero.title}
                        </h1>
                        <p className="text-xl mb-8 text-gray-600">
                          {currentPageData.content.hero.subtitle}
                        </p>
                        <Button 
                          className="px-8 py-3"
                          style={{ 
                            backgroundColor: colorScheme.primary,
                            color: 'white'
                          }}
                        >
                          {currentPageData.content.hero.buttonText}
                        </Button>
                      </div>

                      {/* Content Sections */}
                      {currentPageData.content.sections.map((section) => (
                        <div key={section.id} className="mb-12">
                          {section.title && (
                            <h2 
                              className="text-2xl font-semibold mb-4"
                              style={{ color: colorScheme.primary }}
                            >
                              {section.title}
                      </h2>
                          )}
                          <div className="text-gray-700 leading-relaxed">
                            {section.type === 'features' ? (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {section.content.split(',').map((feature, index) => (
                                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                    <h4 className="font-medium">{feature.trim()}</h4>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>{section.content}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 mt-6">
                    <Button variant="outline" onClick={previewWebsite}>
                      <Eye className="h-4 w-4 mr-2" />
                      Full Preview
                    </Button>
                    <Button variant="hero" onClick={publishWebsite}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Publish Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Website Status */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Website Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-500">Live</div>
              <div className="text-sm text-muted-foreground">Website Status</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">2,347</div>
              <div className="text-sm text-muted-foreground">Monthly Views</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">67</div>
              <div className="text-sm text-muted-foreground">New Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">94%</div>
              <div className="text-sm text-muted-foreground">Mobile Optimized</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
