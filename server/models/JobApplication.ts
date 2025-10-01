import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
  // Position Info
  positionTitle: string;
  positionDepartment: string;
  positionLocation: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Professional Information
  experience: string;
  currentCompany?: string;
  expectedSalary?: string;
  availableFrom?: Date;
  
  // Additional Information
  portfolio?: string;
  linkedin?: string;
  coverLetter?: string;
  
  // Resume
  resumeUrl?: string;
  resumeFileName?: string;
  
  // Application Status
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema: Schema = new Schema({
  // Position Info
  positionTitle: { type: String, required: true },
  positionDepartment: { type: String, required: true },
  positionLocation: { type: String, required: true },
  
  // Personal Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Professional Information
  experience: { type: String },
  currentCompany: { type: String },
  expectedSalary: { type: String },
  availableFrom: { type: Date },
  
  // Additional Information
  portfolio: { type: String },
  linkedin: { type: String },
  coverLetter: { type: String },
  
  // Resume
  resumeUrl: { type: String },
  resumeFileName: { type: String },
  
  // Application Status
  status: { 
    type: String, 
    enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  notes: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
