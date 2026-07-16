"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Download,
  Eye,
  Plus,
  Lock,
  Edit2,
  X,
  Camera,
  CheckCircle,
  FileUp,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CandidateProfilePage() {
  const { profile, updateProfile } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeViewPage, setResumeViewPage] = useState<1 | 2>(1);
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editDob, setEditDob] = useState(profile.dob);
  const [editStatus, setEditStatus] = useState(profile.status);
  const [editBio, setEditBio] = useState(profile.bio);
  const [prefRoles, setPrefRoles] = useState(profile.preferences.roles.join(", "));
  const [prefLocations, setPrefLocations] = useState(profile.preferences.locations.join(", "));
  const [prefJobTypes, setPrefJobTypes] = useState(profile.preferences.jobTypes);
  const [prefExperience, setPrefExperience] = useState(profile.preferences.experience);

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      email: editEmail,
      phone: editPhone,
      location: editLocation,
      dob: editDob,
      status: editStatus,
      bio: editBio,
    });
    setShowEditModal(false);
  };

  const handleUpdatePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      preferences: {
        roles: prefRoles.split(",").map((s) => s.trim()).filter(Boolean),
        locations: prefLocations.split(",").map((s) => s.trim()).filter(Boolean),
        jobTypes: prefJobTypes,
        experience: prefExperience,
      },
    });
    setShowPreferencesModal(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    if (profile.skills.includes(newSkill.trim())) {
      toast.error("Skill already exists!");
      return;
    }

    updateProfile({
      skills: [...profile.skills, newSkill.trim()],
    });
    setNewSkill("");
    setShowAddSkillInput(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    updateProfile({
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
  };

  const simulateResumeUpload = () => {
    toast.loading("Uploading resume...", { id: "resume-up" });
    setTimeout(() => {
      updateProfile({
        resumeName: "Devansh_Pujari_Resume_v2.pdf",
        resumeUpdated: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      });
      toast.dismiss("resume-up");
      toast.success("New resume uploaded successfully!");
    }, 1500);
  };

  return (
    <>
      <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information and preferences.</p>
      </div>

      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center relative">
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 text-3xl font-extrabold flex items-center justify-center border border-blue-200">
            {profile.avatar}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-500">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-gray-950">{profile.name}</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
              Verified <CheckCircle className="w-3 h-3 text-green-600" />
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-gray-500">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4 text-gray-400" />
              {profile.email}
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              {profile.location}
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-gray-400" />
              {profile.phone}
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              Joined May 2025
            </span>
          </div>

          <p className="text-xs text-gray-500 max-w-2xl leading-relaxed mt-2 font-medium">
            {profile.bio}
          </p>
        </div>

        <button
          onClick={() => {
            setEditName(profile.name);
            setEditEmail(profile.email);
            setEditPhone(profile.phone);
            setEditLocation(profile.location);
            setEditDob(profile.dob);
            setEditStatus(profile.status);
            setEditBio(profile.bio);
            setShowEditModal(true);
          }}
          className="md:absolute md:top-6 md:right-6 px-4 py-2 border border-gray-200 text-xs font-bold text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit Profile
        </button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-950 text-base flex items-center gap-2 border-b border-gray-50 pb-2">
            <User className="w-4.5 h-4.5 text-blue-600" />
            Personal Information
          </h3>
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-gray-400">Full Name</span>
              <span className="font-bold text-gray-800">{profile.name}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-gray-400">Email</span>
              <span className="font-bold text-gray-800">{profile.email}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-gray-400">Phone</span>
              <span className="font-bold text-gray-800">{profile.phone}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-gray-400">Location</span>
              <span className="font-bold text-gray-800">{profile.location}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-gray-400">Date of Birth</span>
              <span className="font-bold text-gray-800">{profile.dob}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-gray-400">Current Status</span>
              <span className="px-2.5 py-1 font-bold text-[10px] rounded-full bg-green-50 text-green-700 border border-green-200/50">
                {profile.status}
              </span>
            </div>
          </div>
        </div>

      <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-950 text-base flex items-center gap-2 border-b border-gray-50 pb-2">
              <FileText className="w-4.5 h-4.5 text-blue-600" />
              Resume
            </h3>
            <div className="bg-slate-50 border border-gray-200/50 rounded-xl p-4.5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 font-extrabold text-[10px] rounded-lg flex items-center justify-center border border-purple-200">
                  PDF
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-950">{profile.resumeName}</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Updated on {profile.resumeUpdated}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    toast.loading("Preparing download...", { id: "resume-dl" });
                    setTimeout(() => {
                      toast.dismiss("resume-dl");
                      toast.success(`${profile.resumeName} downloaded!`);
                    }, 1200);
                  }}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all shadow-sm"
                  title="Download Resume"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setResumeViewPage(1);
                    setShowResumeModal(true);
                  }}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all shadow-sm"
                  title="Preview Resume"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={simulateResumeUpload}
              className="w-full py-2.5 border border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600 text-gray-500 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <FileUp className="w-4 h-4" />
              Upload New Resume
            </button>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-950 text-base flex items-center gap-2 border-b border-gray-50 pb-2">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-mono">
              &lt;/&gt;
            </span>
            Skills
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:bg-blue-100 rounded text-blue-500 hover:text-blue-700 p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="pt-2">
            {showAddSkillInput ? (
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter skill (e.g. Docker)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="block w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shrink-0"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSkillInput(false);
                    setNewSkill("");
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 shrink-0"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowAddSkillInput(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100/50"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </button>
            )}
          </div>
        </div>

        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <h3 className="font-bold text-gray-950 text-base flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-blue-600" />
              Preferences
            </h3>
            <button
              onClick={() => {
                setPrefRoles(profile.preferences.roles.join(", "));
                setPrefLocations(profile.preferences.locations.join(", "));
                setPrefJobTypes(profile.preferences.jobTypes);
                setPrefExperience(profile.preferences.experience);
                setShowPreferencesModal(true);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-gray-400">Preferred Job Roles</span>
              <span className="font-bold text-gray-800">{profile.preferences.roles.join(", ")}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-gray-400">Preferred Locations</span>
              <span className="font-bold text-gray-800">{profile.preferences.locations.join(", ")}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-gray-400">Job Types</span>
              <span className="font-bold text-gray-800">{profile.preferences.jobTypes}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-gray-400">Experience Level</span>
              <span className="font-bold text-gray-800">{profile.preferences.experience}</span>
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 md:col-span-2">
          <h3 className="font-bold text-gray-950 text-base flex items-center gap-2 border-b border-gray-50 pb-2">
            <Lock className="w-4.5 h-4.5 text-blue-600" />
            Account Security
          </h3>
          <div className="flex justify-between items-center">
            <div className="text-xs">
              <p className="font-bold text-gray-900">Password</p>
              <p className="text-gray-400 mt-1 font-medium">â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢</p>
            </div>
            <button
              onClick={() => toast.success("Password change link sent to email!")}
              className="px-4 py-2 border border-gray-200 text-xs font-bold text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in my-8 max-h-[90vh] flex flex-col">
            
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Edit Profile</h3>
                <p className="text-xs text-gray-400 mt-0.5">Update your personal information.</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            
            <form onSubmit={handleUpdateProfileSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              <div className="flex items-center gap-4.5 pb-4 border-b border-gray-50">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold shrink-0">
                  {profile.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Profile Photo</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG or WebP. Max size 2MB.</p>
                  <button
                    type="button"
                    onClick={() => toast.success("Change photo dialog simulated")}
                    className="mt-2 px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-50 shadow-sm flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Change Photo
                  </button>
                </div>
              </div>

              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter phone"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <select
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Bangalore, India">Bangalore, India</option>
                  <option value="Hyderabad, India">Hyderabad, India</option>
                  <option value="Pune, India">Pune, India</option>
                  <option value="Mumbai, India">Mumbai, India</option>
                  <option value="Delhi, India">Delhi, India</option>
                </select>
              </div>

              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12 Jan 2003"
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Current Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Actively looking for opportunities">Actively looking for opportunities</option>
                    <option value="Open to opportunities">Open to opportunities</option>
                    <option value="Not looking for opportunities">Not looking for opportunities</option>
                  </select>
                </div>
              </div>

              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  About You
                </label>
                <textarea
                  placeholder="Tell us about yourself..."
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-sm font-bold text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 hover:shadow-lg transition-all"
                >
                  Update Profile
                </button>
              </div>

              
              <p className="text-[10px] font-bold text-gray-400 flex items-center justify-center gap-1 text-center pt-2">
                <Lock className="w-3.5 h-3.5 text-gray-300" />
                Your changes are secure and private.
              </p>
            </form>
          </div>
        </div>
      )}

      
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-scale-in">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <h3 className="font-extrabold text-gray-900 text-lg">Edit Job Preferences</h3>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePreferencesSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Preferred Job Roles (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Developer, UI/UX Designer"
                  value={prefRoles}
                  onChange={(e) => setPrefRoles(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Preferred Locations (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore, Pune, Hyderabad"
                  value={prefLocations}
                  onChange={(e) => setPrefLocations(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Job Type
                  </label>
                  <select
                    value={prefJobTypes}
                    onChange={(e) => setPrefJobTypes(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={prefExperience}
                    onChange={(e) => setPrefExperience(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Freshers">Freshers</option>
                    <option value="1 - 3 Years">1 - 3 Years</option>
                    <option value="3 - 5 Years">3 - 5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPreferencesModal(false)}
                  className="px-4 py-2 border border-gray-200 text-xs font-bold text-gray-600 rounded-xl hover:bg-gray-50 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-xs font-bold text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

      
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[92vh]">

            
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-950 text-sm">{profile.resumeName}</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Last updated {profile.resumeUpdated}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    toast.loading("Preparing download...", { id: "resume-dl-modal" });
                    setTimeout(() => {
                      toast.dismiss("resume-dl-modal");
                      toast.success(`${profile.resumeName} downloaded!`);
                    }, 1200);
                  }}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            
            <div className="flex-1 flex overflow-hidden">

              
              <div className="w-28 border-r border-gray-100 bg-slate-50/30 p-4 space-y-4 shrink-0 overflow-y-auto hidden sm:flex flex-col items-center">
                {([1, 2] as const).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setResumeViewPage(pg)}
                    className={`w-20 p-1 bg-white border-2 rounded-xl transition-all shadow-sm flex flex-col items-center gap-1 ${
                      resumeViewPage === pg
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-full aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 font-bold">
                      Page {pg}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">{pg}</span>
                  </button>
                ))}
              </div>

              
              <div className="flex-1 flex flex-col bg-slate-100/50 p-6 overflow-hidden">

                
                <div className="flex items-center justify-between pb-4 border-b border-gray-200/60 shrink-0 mb-4 text-xs font-semibold text-gray-500">
                  <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                    <button className="p-1 hover:bg-slate-50 rounded" onClick={() => setResumeViewPage(1)}>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-1 text-[10px] font-bold text-gray-800">{resumeViewPage} / 2</span>
                    <button className="p-1 hover:bg-slate-50 rounded" onClick={() => setResumeViewPage(2)}>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                      <button className="p-1 hover:bg-slate-50 rounded" title="Zoom out"><ZoomOut className="w-3.5 h-3.5" /></button>
                      <span className="px-1 text-[10px] font-bold text-gray-800">100%</span>
                      <button className="p-1 hover:bg-slate-50 rounded" title="Zoom in"><ZoomIn className="w-3.5 h-3.5" /></button>
                    </div>
                    <button className="p-1.5 bg-white border border-gray-200 hover:bg-slate-50 rounded-lg shadow-sm" title="Rotate">
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                
                <div className="flex-1 bg-white border border-gray-200 shadow-lg rounded-2xl p-8 overflow-y-auto max-w-xl mx-auto w-full select-text font-serif">
                  {resumeViewPage === 1 ? (
                    <div className="space-y-6">
                      
                      <div className="border-b border-gray-200 pb-5">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{profile.name}</h2>
                        <p className="text-sm text-blue-600 font-sans font-semibold uppercase tracking-wider mt-0.5">
                          {profile.preferences.roles[0] || "Software Developer"}
                        </p>
                        <div className="flex flex-wrap gap-x-3 text-[10px] text-gray-500 font-sans font-medium mt-2">
                          <span>{profile.email}</span>
                          <span>&bull;</span>
                          <span>{profile.phone}</span>
                          <span>&bull;</span>
                          <span>{profile.location}</span>
                        </div>
                      </div>

                      
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-blue-600">Summary</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">{profile.bio}</p>
                      </div>

                      
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-blue-600">Skills</h3>
                        <div className="flex flex-wrap gap-1.5 font-sans">
                          {profile.skills.map((skill, i) => (
                            <span key={i} className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200/50">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-blue-600 border-b border-gray-100 pb-1">Experience</h3>
                        <div className="space-y-3 text-xs">
                          <div className="space-y-1">
                            <h4 className="font-bold text-gray-800">Frontend Developer â€” Tech Solutions (Jan 2024 â€“ Present)</h4>
                            <ul className="list-disc pl-4 text-[11px] text-gray-500 space-y-0.5 leading-relaxed font-sans">
                              <li>Built scalable React + Next.js applications serving 10,000+ daily users.</li>
                              <li>Improved page load performance by 35% through code splitting and lazy loading.</li>
                              <li>Collaborated with designers on pixel-perfect UI implementations.</li>
                            </ul>
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-gray-800">Junior Developer Intern â€” Webcraft Technologies (Aug 2023 â€“ Dec 2023)</h4>
                            <ul className="list-disc pl-4 text-[11px] text-gray-500 space-y-0.5 leading-relaxed font-sans">
                              <li>Developed REST API integrations using Node.js and Express.</li>
                              <li>Wrote unit tests covering 80% of new feature code.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-blue-600 border-b border-gray-100 pb-1">Education</h3>
                        <div className="text-xs">
                          <h4 className="font-bold text-gray-800">Bachelor of Computer Applications (BCA)</h4>
                          <p className="text-[10px] text-gray-500 font-sans mt-0.5">Christ University, Bangalore &mdash; 2020 â€“ 2023</p>
                          <p className="text-[10px] text-gray-400 font-sans mt-0.5">CGPA: 8.7 / 10</p>
                        </div>
                      </div>

                      
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-blue-600 border-b border-gray-100 pb-1">Key Projects</h3>
                        <div className="space-y-3 text-xs">
                          <div>
                            <h4 className="font-bold text-gray-800">Career Connect Platform</h4>
                            <p className="text-[11px] text-gray-600 leading-relaxed mt-1">Built a full-stack job portal using Next.js 15, React Context API, and Tailwind CSS. Features role-based dashboards for candidates and employers.</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">E-Commerce Checkout Redesign</h4>
                            <p className="text-[11px] text-gray-600 leading-relaxed mt-1">Refactored a checkout flow with Redux Toolkit and React, reducing cart abandonment by 12% and improving conversion rates.</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">Real-Time Dashboard</h4>
                            <p className="text-[11px] text-gray-600 leading-relaxed mt-1">Developed a live analytics dashboard with WebSocket integration, charting performance metrics using Recharts.</p>
                          </div>
                        </div>
                      </div>

                      
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-blue-600 border-b border-gray-100 pb-1">Job Preferences</h3>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                          <div><span className="text-gray-400 font-semibold">Preferred Roles: </span><span className="text-gray-700">{profile.preferences.roles.join(", ")}</span></div>
                          <div><span className="text-gray-400 font-semibold">Job Type: </span><span className="text-gray-700">{profile.preferences.jobTypes}</span></div>
                          <div><span className="text-gray-400 font-semibold">Locations: </span><span className="text-gray-700">{profile.preferences.locations.join(", ")}</span></div>
                          <div><span className="text-gray-400 font-semibold">Experience: </span><span className="text-gray-700">{profile.preferences.experience}</span></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            
            <div className="px-6 py-3 border-t border-gray-100 bg-slate-50/50 shrink-0 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 font-medium">Page {resumeViewPage} of 2 &mdash; {profile.resumeName}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setResumeViewPage(1)}
                  disabled={resumeViewPage === 1}
                  className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  â† Prev
                </button>
                <button
                  onClick={() => setResumeViewPage(2)}
                  disabled={resumeViewPage === 2}
                  className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next â†’
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
