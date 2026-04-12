import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TEmployee } from '@/services/EmployeeApi/EmployeeApi.types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChevronLeft,
  Save,
  UserPlus,
  Info,
  Building2,
  Briefcase,
  Wallet,
  MapPin,
  ShieldCheck,
  Heart,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useDepartmentPickers, usePositionPickers } from '@/hook/MasterHook/Master.pickers';
import { cn } from '@/lib/utils';

const employeeSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  personalEmail: z.string().email('Invalid personal email').optional().or(z.literal('')),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationalId: z.string().min(1, 'National ID is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']),
  currentAddress: z.string().min(1, 'Current address is required'),
  permanentAddress: z.string().optional().or(z.literal('')),

  // Work Info
  departmentId: z.coerce.number().min(1, 'Department is required'),
  positionId: z.coerce.number().min(1, 'Position is required'),
  jobTitle: z.string().optional().or(z.literal('')),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']),
  hireDate: z.string().min(1, 'Hire date is required'),
  probationEndDate: z.string().optional().or(z.literal('')),
  workLocation: z.string().optional().or(z.literal('')),

  // Tax & Insurance
  taxCode: z.string().optional().or(z.literal('')),
  socialInsuranceNumber: z.string().optional().or(z.literal('')),
  healthInsuranceNumber: z.string().optional().or(z.literal('')),
  numberOfDependents: z.coerce.number().int().min(0).default(0),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  initialData?: TEmployee;
  onBack: () => void;
  onSubmit: (data: EmployeeFormValues) => void;
  isLoading?: boolean;
}

// Common class for inputs to ensure consistency and modern look
const inputClasses = "h-11 rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-800 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 shadow-sm px-4";
const labelClasses = "text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 block";

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onBack,
  onSubmit,
  isLoading = false,
}) => {
  const { pickers: departmentPickers, isLoading: loadingDepts } = useDepartmentPickers();
  const { pickers: positionPickers, isLoading: loadingPositions } = usePositionPickers();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData
      ? ({
          ...initialData,
          departmentId: initialData.departmentId,
          positionId: initialData.positionId,
          personalEmail: initialData.personalEmail || '',
          permanentAddress: initialData.permanentAddress || '',
          probationEndDate: initialData.probationEndDate
            ? new Date(initialData.probationEndDate).toISOString().split('T')[0]
            : '',
          hireDate: initialData.hireDate
            ? new Date(initialData.hireDate).toISOString().split('T')[0]
            : '',
          dateOfBirth: initialData.dateOfBirth
            ? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
            : '',
          workLocation: initialData.workLocation || '',
          taxCode: initialData.taxCode || '',
          socialInsuranceNumber: initialData.socialInsuranceNumber || '',
          healthInsuranceNumber: initialData.healthInsuranceNumber || '',
          numberOfDependents: initialData.numberOfDependents || 0,
        } as any)
      : {
          fullName: '',
          email: '',
          personalEmail: '',
          phoneNumber: '',
          gender: 'MALE',
          employmentType: 'FULL_TIME',
          maritalStatus: 'SINGLE',
          nationality: 'Vietnamese',
          numberOfDependents: 0,
          jobTitle: '',
          departmentId: undefined,
          positionId: undefined,
        },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between pb-4">
        <Button
          variant="default"
          size="icon"
          onClick={onBack}
          className="hover:bg-primary dark:hover:bg-muted text-gray-700 dark:text-foreground font-bold rounded-full h-11 w-11 shadow-sm border border-gray-100 dark:border-border transition-all active:scale-95"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </Button>
      </div>


      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-5">
            {/* 1. Identity & Personal Info */}
            <Card className="group border shadow-2xl shadow-gray-200/40 dark:shadow-none bg-white dark:bg-card overflow-hidden rounded-[2.5rem] transition-all duration-300 hover:shadow-primary/5">
              <CardHeader className="relative overflow-hidden bg-gradient-to-br from-primary/[0.03] to-transparent border-b border-gray-100/50 dark:border-white/[0.02 px-10 py-9">
                {/* Decorative background blur */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                
                <div className="flex items-center gap-6 relative z-10">
                  <div className="flex-shrink-0 relative group/icon">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative p-4 bg-white dark:bg-muted/10 border border-primary/10 rounded-[1.25rem] shadow-sm text-primary transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-lg group-hover:bg-primary group-hover:text-white">
                      <UserPlus size={26} strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <CardTitle className="text-2xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                      Personal Identity
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-8 h-[2px] bg-primary/20 rounded-full" />
                      <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                        Legal identification & basic contacts
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className={labelClasses}>Legal Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Nguyen Van A"
                            {...field}
                            className={inputClasses}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClasses}>Corporate Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="user@company.com"
                            {...field}
                            className={inputClasses}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClasses}>Mobile Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="09xx xxx xxx"
                            {...field}
                            className={inputClasses}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClasses}>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputClasses}>
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark:bg-[#1a1f2e] border-gray-800 border rounded-xl">
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClasses}>Birth Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className={inputClasses}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClasses}>Identity Card (CCCD)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="12-digit number"
                            {...field}
                            className={inputClasses}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClasses}>Nationality</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Vietnam"
                            {...field}
                            className={inputClasses}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. Employment Details */}
            <div className="space-y-8">
              <Card className="group border shadow-2xl shadow-gray-200/40 dark:shadow-none bg-white dark:bg-card overflow-hidden rounded-[2.5rem] transition-all duration-300 hover:shadow-primary/5">
                <CardHeader className="relative overflow-hidden bg-gradient-to-br from-primary/[0.03] to-transparent border-b border-gray-100/50 dark:border-white/[0.02 px-10 py-9">
                  {/* Decorative background blur */}
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="flex-shrink-0 relative group/icon">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative p-4 bg-white dark:bg-muted/10 border border-primary/10 rounded-[1.25rem] shadow-sm text-primary transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-lg group-hover:bg-primary group-hover:text-white">
                        <Briefcase size={26} strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <CardTitle className="text-2xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                        Work & Career
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-8 h-[2px] bg-primary/20 rounded-full" />
                        <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                          Assign department & professional role
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className={labelClasses}>Department / Project Team</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value?.toString()}
                            disabled={loadingDepts}
                          >
                            <FormControl>
                              <SelectTrigger className={inputClasses}>
                                {loadingDepts ? (
                                  <div className="flex items-center gap-2 text-gray-400">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Fetching...
                                  </div>
                                ) : (
                                  <SelectValue placeholder="Select Department" />
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="dark:bg-[#1a1f2e] border-gray-800 border rounded-xl">
                              {departmentPickers.map((dept) => (
                                <SelectItem key={dept.value} value={dept.value}>
                                  <div className="flex justify-between items-center w-full">
                                    <span>{dept.label}</span>
                                    <span className="text-[9px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-500 ml-4 font-bold">{dept.type}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="positionId"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className={labelClasses}>Professional Position</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value?.toString()}
                            disabled={loadingPositions}
                          >
                            <FormControl>
                              <SelectTrigger className={inputClasses}>
                                {loadingPositions ? (
                                  <div className="flex items-center gap-2 text-gray-400">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Fetching...
                                  </div>
                                ) : (
                                  <SelectValue placeholder="Select Position" />
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="dark:bg-[#1a1f2e] border-gray-800 border rounded-xl">
                              {positionPickers.map((pos) => (
                                <SelectItem key={pos.value} value={pos.value}>
                                  <div className="flex justify-between items-center w-full">
                                    <span>{pos.label}</span>
                                    <span className="text-[9px] text-primary bg-primary/5 px-2 py-0.5 rounded-full ml-4 font-bold">{pos.code}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClasses}>Contract Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className={inputClasses}>
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="dark:bg-[#1a1f2e] border-gray-800 border rounded-xl">
                              <SelectItem value="FULL_TIME">Full Time</SelectItem>
                              <SelectItem value="PART_TIME">Part Time</SelectItem>
                              <SelectItem value="CONTRACT">Contract</SelectItem>
                              <SelectItem value="INTERN">Intern</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hireDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClasses}>Hire Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className={inputClasses}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 3. Address Section */}
              <Card className="group border shadow-2xl shadow-gray-200/40 dark:shadow-none bg-white dark:bg-card overflow-hidden rounded-[2.5rem] transition-all duration-300 hover:shadow-primary/5">
                <CardHeader className="relative overflow-hidden bg-gradient-to-br from-primary/[0.03] to-transparent border-b border-gray-100/50 dark:border-white/[0.02 px-10 py-9">
                  {/* Decorative background blur */}
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="flex-shrink-0 relative group/icon">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative p-4 bg-white dark:bg-muted/10 border border-primary/10 rounded-[1.25rem] shadow-sm text-primary transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-lg group-hover:bg-primary group-hover:text-white">
                        <MapPin size={26} strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <CardTitle className="text-2xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                        Location Hub
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-8 h-[2px] bg-primary/20 rounded-full" />
                        <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                          Current & Permanent Addresses
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 pt-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="currentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClasses}>Present Residential Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 123 Nguyen Hue, Dist 1, HCMC"
                            {...field}
                            className={inputClasses}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Bar for Action */}
          <div className="fixed bottom-4 left-0 right-0 z-50 px-6">
            <div className="max-w-4xl mx-auto bg-white/80 dark:bg-card/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 p-4 rounded-3xl shadow-2xl flex items-center justify-between">
              <div className="hidden md:block pl-4">
                <p className="text-sm font-bold text-gray-500">
                  {initialData ? 'Modifying existing record' : 'Creating new employee profile'}
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Antigravity HRM Suite v1.0</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onBack}
                  disabled={isLoading}
                  className="flex-1 md:flex-none h-14 px-8 rounded-2xl font-bold transition-all"
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 md:flex-none font-bold gap-3 h-14 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  {initialData ? 'Update Profile' : 'Finalize & Create'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};
