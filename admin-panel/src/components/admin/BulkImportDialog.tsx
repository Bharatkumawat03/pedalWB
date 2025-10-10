import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (products: any[]) => Promise<void>;
}

const CSV_TEMPLATE = `name,description,price,originalPrice,category,brand,stock,images,features,isFeatured,isNew
"Mountain Explorer 2024","High-performance mountain bike with advanced suspension",45000,50000,"Mountain Bikes","Trek",15,"https://example.com/bike1.jpg","Lightweight frame|All-terrain tires|Advanced suspension",true,false
"City Cruiser Pro","Comfortable city bike perfect for daily commuting",25000,28000,"City Bikes","Giant",25,"https://example.com/bike2.jpg","Ergonomic design|LED lights|Basket included",false,true`;

export function BulkImportDialog({ open, onOpenChange, onImport }: BulkImportDialogProps) {
  const { toast } = useToast();
  const [csvData, setCsvData] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<any[]>([]);

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded successfully!"
    });
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(CSV_TEMPLATE);
    toast({
      title: "Template Copied",
      description: "CSV template has been copied to clipboard!"
    });
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must contain at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const requiredFields = ['name', 'description', 'price', 'category', 'brand', 'stock'];
    
    const missingFields = requiredFields.filter(field => !headers.includes(field));
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const products = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let char of lines[i]) {
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());

        if (values.length !== headers.length) {
          errors.push(`Row ${i + 1}: Column count mismatch`);
          continue;
        }

        const product: any = {};
        headers.forEach((header, index) => {
          let value = values[index].replace(/^"|"$/g, '');
          
          switch (header) {
            case 'price':
            case 'originalPrice':
            case 'stock':
              product[header] = value ? parseFloat(value) : (header === 'stock' ? 0 : undefined);
              break;
            case 'images':
              product[header] = value ? value.split('|').filter(img => img.trim()) : [];
              break;
            case 'features':
              product[header] = value ? value.split('|').filter(f => f.trim()) : [];
              break;
            case 'isFeatured':
            case 'isNew':
              product[header] = value.toLowerCase() === 'true';
              break;
            default:
              product[header] = value;
          }
        });

        // Validation
        if (!product.name || product.name.length < 1) {
          errors.push(`Row ${i + 1}: Product name is required`);
          continue;
        }
        if (!product.description || product.description.length < 10) {
          errors.push(`Row ${i + 1}: Description must be at least 10 characters`);
          continue;
        }
        if (product.price <= 0) {
          errors.push(`Row ${i + 1}: Price must be positive`);
          continue;
        }

        // Add ID and other defaults
        product.id = `import_${Date.now()}_${i}`;
        product.status = 'Draft';
        product.featured = product.isFeatured || false;
        
        // Ensure at least one image
        if (!product.images || product.images.length === 0) {
          product.images = ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'];
        }

        products.push(product);
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
      }
    }

    return { products, errors };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvData(text);
      try {
        const { products, errors } = parseCSV(text);
        setPreview(products.slice(0, 5)); // Show first 5 for preview
        setErrors(errors);
      } catch (error) {
        setErrors([error instanceof Error ? error.message : 'Parse error']);
        setPreview([]);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleTextImport = () => {
    if (!csvData.trim()) {
      toast({
        title: "No Data",
        description: "Please paste CSV data to import",
        variant: "destructive"
      });
      return;
    }

    try {
      const { products, errors } = parseCSV(csvData);
      setPreview(products.slice(0, 5));
      setErrors(errors);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Parse error']);
      setPreview([]);
    }
  };

  const handleImport = async () => {
    try {
      const { products, errors } = parseCSV(csvData);
      
      if (products.length === 0) {
        toast({
          title: "No Valid Products",
          description: "No valid products found to import",
          variant: "destructive"
        });
        return;
      }

      setImporting(true);
      setProgress(0);

      // Simulate import progress
      for (let i = 0; i <= products.length; i++) {
        setProgress((i / products.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await onImport(products);
      
      toast({
        title: "Import Successful",
        description: `${products.length} products imported successfully${errors.length > 0 ? ` (${errors.length} errors)` : ''}`
      });
      
      onOpenChange(false);
      setCsvData("");
      setFile(null);
      setPreview([]);
      setErrors([]);
      setProgress(0);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import products",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Bulk Import Products
          </DialogTitle>
          <DialogDescription>
            Import multiple products at once using a CSV file
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Upload CSV File</TabsTrigger>
            <TabsTrigger value="text">Paste CSV Data</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
                <Button
                  variant="outline"
                  onClick={copyTemplate}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Template
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="csvFile">Select CSV File</Label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
                <Button
                  variant="outline"
                  onClick={copyTemplate}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Template
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="csvData">Paste CSV Data</Label>
                <Textarea
                  id="csvData"
                  placeholder="Paste your CSV data here..."
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <Button onClick={handleTextImport} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Parse CSV Data
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Error Display */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Import Errors ({errors.length}):</p>
                <ul className="list-disc list-inside space-y-1">
                  {errors.slice(0, 5).map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                  {errors.length > 5 && (
                    <li className="text-sm font-medium">... and {errors.length - 5} more errors</li>
                  )}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Preview */}
        {preview.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <h4 className="font-medium">Preview ({preview.length} of {parseCSV(csvData || '').products.length} products)</h4>
            </div>
            <div className="border rounded-lg p-4 bg-muted/20 max-h-40 overflow-y-auto">
              {preview.map((product, index) => (
                <div key={index} className="text-sm py-1">
                  <span className="font-medium">{product.name}</span> - 
                  <span className="text-muted-foreground"> ₹{product.price} | {product.category} | Stock: {product.stock}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Import Progress */}
        {importing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Importing products...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={importing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={preview.length === 0 || importing}
          >
            {importing ? "Importing..." : `Import ${preview.length} Products`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}