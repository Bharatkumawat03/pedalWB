import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, FileText } from 'lucide-react';

interface JobApplicationFormProps {
  position: {
    title: string;
    department: string;
    location: string;
    type: string;
    experience: string;
  };
  onClose: () => void;
}

const JobApplicationForm = ({ position, onClose }: JobApplicationFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experience: '',
    currentCompany: '',
    expectedSalary: '',
    availableFrom: '',
    coverLetter: '',
    portfolio: '',
    linkedin: ''
  });

  const [resume, setResume] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Application submitted:', formData, resume);
    alert('Application submitted successfully! We will get back to you within 48 hours.');
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Apply for {position.title}</CardTitle>
            <p className="text-muted-foreground">{position.department} • {position.location}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Professional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Years of Experience</label>
                  <Select value={formData.experience} onValueChange={(value) => setFormData({...formData, experience: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Current Company</label>
                  <Input
                    value={formData.currentCompany}
                    onChange={(e) => setFormData({...formData, currentCompany: e.target.value})}
                    placeholder="Current employer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expected Salary (₹LPA)</label>
                  <Input
                    value={formData.expectedSalary}
                    onChange={(e) => setFormData({...formData, expectedSalary: e.target.value})}
                    placeholder="e.g., 8-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Available From</label>
                  <Input
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Portfolio/Website</label>
                  <Input
                    type="url"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn Profile</label>
                  <Input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resume *</h3>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {resume ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-6 h-6 text-primary" />
                    <span className="font-medium">{resume.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setResume(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your resume (PDF, DOC, DOCX - Max 5MB)
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('resume-upload')?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Cover Letter</label>
              <Textarea
                value={formData.coverLetter}
                onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                rows={4}
                placeholder="Tell us why you're interested in this position and how your experience makes you a great fit..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Submit Application
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicationForm;