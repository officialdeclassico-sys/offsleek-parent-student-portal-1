import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Users, 
  GraduationCap, 
  MapPin, 
  Check,
  PhoneCall
} from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import { VerifiedAvatarBadge } from './VerifiedAvatarBadge';

export const ParentPersonalInfoView: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const { user, currentStudent, linkedStudents } = useAuth();

  const parentName = user?.name || 'Mrs. Priya Sharma';
  const parentEmail = user?.email || 'priya.sharma@example.com';
  const parentPhone = user?.phone || '+91 98765 43210';
  const relationship = user?.relationship || 'Mother';
  const linkedChildName = currentStudent?.name || 'Aarav Sharma';
  const childClass = `${currentStudent?.grade || 'Class 6'} - ${currentStudent?.section || 'Section A'}`;
  const emergencyContact = user?.emergencyContact || '+91 98765 43210';
  const address = user?.address || 'Bengaluru, Karnataka';
  const parentId = user?.id || 'P-001';
  const linkedChildrenCount = linkedStudents.length || 1;
  const parentAvatar = user?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-28 selection:bg-black selection:text-white">
      {/* 1. Standardized Header */}
      <ScreenHeader
        title="Personal Information"
        subtitle="Your information registered with the school"
        onBack={onBack}
        backAriaLabel="Back to Profile"
      />

      <div className="p-4 space-y-4">
        {/* 2. Parent Profile Summary Card */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex items-center space-x-4 shadow-2xs">
          <div className="relative w-16 h-16 rounded-full shrink-0">
            <img
              src={parentAvatar}
              alt={parentName}
              className="w-full h-full rounded-full object-cover border border-neutral-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';
              }}
            />
            <VerifiedAvatarBadge size="md" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <h2 className="text-base font-bold text-black leading-tight truncate">{parentName}</h2>
            </div>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">Parent / Guardian</p>
            <p className="text-xs text-neutral-500 mt-0.5">Linked Children: {linkedChildrenCount}</p>
            <p className="text-xs text-neutral-400 mt-0.5">Parent ID: {parentId}</p>
          </div>
        </div>

        {/* 3. Personal Information Card (Enclosing container with 8 rows) */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl shadow-2xs divide-y divide-neutral-100/90 overflow-hidden">
          
          {/* Row 1: Full Name */}
          <div className="p-3.5 flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100/80 flex items-center justify-center text-neutral-700 shrink-0">
              <User className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Full Name</p>
              <p className="text-xs font-bold text-black mt-0.5 truncate">{parentName}</p>
            </div>
          </div>

          {/* Row 2: Email Address */}
          <div className="p-3.5 flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100/80 flex items-center justify-center text-neutral-700 shrink-0">
              <Mail className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Email Address</p>
              <p className="text-xs font-bold text-black mt-0.5 truncate">{parentEmail}</p>
            </div>
          </div>

          {/* Row 3: Contact Number */}
          <div className="p-3.5 flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100/80 flex items-center justify-center text-neutral-700 shrink-0">
              <Phone className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Contact Number</p>
              <p className="text-xs font-bold text-black mt-0.5 truncate">{parentPhone}</p>
            </div>
          </div>

          {/* Row 4: Relationship */}
          <div className="p-3.5 flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100/80 flex items-center justify-center text-neutral-700 shrink-0">
              <Users className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Relationship</p>
              <p className="text-xs font-bold text-black mt-0.5 truncate">{relationship}</p>
            </div>
          </div>

          {/* Row 5: Linked Child */}
          <div className="p-3.5 flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100/80 flex items-center justify-center text-neutral-700 shrink-0">
              <User className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Linked Child</p>
              <p className="text-xs font-bold text-black mt-0.5 truncate">{linkedChildName}</p>
            </div>
          </div>

          {/* Row 6: Child's Class */}
          <div className="p-3.5 flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100/80 flex items-center justify-center text-neutral-700 shrink-0">
              <GraduationCap className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Child's Class</p>
              <p className="text-xs font-bold text-black mt-0.5 truncate">{childClass}</p>
            </div>
          </div>

          {/* Row 7: Emergency Contact */}
          <div className="p-3.5 flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100/80 flex items-center justify-center text-neutral-700 shrink-0">
              <PhoneCall className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Emergency Contact</p>
              <p className="text-xs font-bold text-black mt-0.5 truncate">{emergencyContact}</p>
            </div>
          </div>

          {/* Row 8: Address */}
          <div className="p-3.5 flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100/80 flex items-center justify-center text-neutral-700 shrink-0">
              <MapPin className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Address</p>
              <p className="text-xs font-bold text-black mt-0.5 truncate">{address}</p>
            </div>
          </div>

        </div>

        {/* 4. School-managed information note */}
        <p className="text-[11px] text-neutral-400 text-center px-4 leading-relaxed pt-1">
          Some information is managed by the school. Contact the school to request corrections.
        </p>
      </div>
    </div>
  );
};
