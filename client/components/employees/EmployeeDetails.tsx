import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TEmployee } from '@/services/EmployeeApi/EmployeeApi.types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Building2,
  ChevronLeft,
  Mail,
  Phone,
  ShieldAlert,
  User as UserIcon,
} from 'lucide-react';
import React from 'react';

interface EmployeeDetailsProps {
  employee: TEmployee;
  onBack: () => void;
}

export const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted text-gray-700 dark:text-foreground shadow-sm border-gray-200 dark:border-border font-bold rounded-xl"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Profile Intro */}
        <Card className="lg:col-span-1 border-none shadow-sm bg-white dark:bg-card overflow-hidden rounded-2xl">
          <div className="h-24 bg-primary/10 dark:bg-primary/5 border-b border-primary/20 dark:border-primary/10" />
          <CardContent className="relative pt-0 pb-8 text-center">
            <div className="flex flex-col items-center -mt-12">
              <div className="h-28 w-28 rounded-full bg-white dark:bg-card p-1 shadow-md mb-4 border border-gray-100 dark:border-border">
                <div className="h-full w-full rounded-full bg-primary flex items-center justify-center text-white text-3xl font-black">
                  {employee.fullName.charAt(0)}
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-foreground tracking-tight">
                {employee.fullName}
              </h3>
              <p className="text-primary font-bold text-sm mt-1 uppercase tracking-wide opacity-80">
                {employee.jobTitle || 'Team Member'}
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Badge
                  variant="secondary"
                  className="px-3 py-1 font-black text-[10px] uppercase bg-gray-100 dark:bg-muted text-gray-700 dark:text-gray-300 border-none rounded-lg"
                >
                  {employee.employeeCode}
                </Badge>
                <Badge
                  className={cn(
                    'px-3 py-1 border-none font-black text-[10px] uppercase rounded-lg shadow-sm',
                    employee.employmentType === 'FULL_TIME'
                      ? 'bg-green-100/50 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                      : 'bg-blue-100/50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
                  )}
                >
                  {employee.employmentType.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <div className="mt-8 space-y-4 px-2 border-t border-gray-50 dark:border-border-/50 pt-8">
              <ContactItem icon={Mail} label="Work Email" value={employee.email} />
              <ContactItem icon={Phone} label="Direct Phone" value={employee.phoneNumber} />
              <ContactItem icon={Building2} label="Department" value={employee.departmentName} />
            </div>
          </CardContent>
        </Card>

        {/* Right Col: Details Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Information */}
          <SectionCard icon={Briefcase} title="Work Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <InfoItem label="Main Department" value={employee.departmentName} />
              <InfoItem label="Designation" value={employee.jobTitle} />
              <InfoItem
                label="Type of Contract"
                value={employee.employmentType.replace('_', ' ')}
                highlight
              />
              <InfoItem
                label="Joining Date"
                value={employee.hireDate ? format(new Date(employee.hireDate), 'PPP') : 'N/A'}
              />
              <InfoItem
                label="Probation Ends"
                value={
                  employee.probationEndDate
                    ? format(new Date(employee.probationEndDate), 'PPP')
                    : 'Not Set'
                }
              />
              <InfoItem label="Base Location" value={employee.workLocation || 'Main Office'} />
            </div>
          </SectionCard>

          {/* Personal Details */}
          <SectionCard icon={UserIcon} title="Personal Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <InfoItem label="Legal Full Name" value={employee.fullName} />
              <InfoItem
                label="Birth Date"
                value={employee.dateOfBirth ? format(new Date(employee.dateOfBirth), 'PPP') : 'N/A'}
              />
              <InfoItem label="Biological Gender" value={employee.gender} />
              <InfoItem label="Native Nationality" value={employee.nationality} />
              <InfoItem label="Marital Status" value={employee.maritalStatus} />
              <InfoItem label="Citizen Identification" value={employee.nationalId} />
              <InfoItem
                label="Residential Address"
                value={employee.currentAddress}
                className="md:col-span-2"
              />
            </div>
          </SectionCard>

          {/* Finance & Insurance */}
          <SectionCard icon={ShieldAlert} title="Government IDs & Tax">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
              <InfoItem label="Registered Tax ID" value={employee.taxCode} />
              <InfoItem label="SI Number (BHXH)" value={employee.socialInsuranceNumber} />
              <InfoItem label="HI Number (BHYT)" value={employee.healthInsuranceNumber} />
            </div>
          </SectionCard>
        </div>
      </div>
    </motion.div>
  );
};

// --- Subcomponents ---

const ContactItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) => (
  <div className="flex items-center gap-4 group">
    <div className="h-9 w-9 bg-gray-50 dark:bg-muted rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors">
      <Icon size={16} />
    </div>
    <div className="text-left flex-1 min-w-0">
      <div className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 tracking-widest leading-none mb-1">
        {label}
      </div>
      <div className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
        {value || 'N/A'}
      </div>
    </div>
  </div>
);

const SectionCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="border-none shadow-sm bg-white dark:bg-card overflow-hidden rounded-2xl">
    <CardHeader className="border-b border-gray-50 dark:border-border px-8 py-5 bg-gray-50/30 dark:bg-muted/30">
      <CardTitle className="text-base flex items-center gap-3 font-bold text-gray-900 dark:text-foreground">
        <Icon size={18} className="text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-8">{children}</CardContent>
  </Card>
);

const InfoItem = ({
  label,
  value,
  className,
  highlight = false,
}: {
  label: string;
  value: string | number | undefined;
  className?: string;
  highlight?: boolean;
}) => (
  <div className={cn('space-y-1.5', className)}>
    <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
      {label}
    </div>
    <div
      className={cn(
        'text-sm font-bold',
        highlight ? 'text-primary' : 'text-gray-900 dark:text-gray-200',
      )}
    >
      {value || '—'}
    </div>
  </div>
);
