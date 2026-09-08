import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  MapPin,
  Users,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';
import { challengesApi } from '../../services/api';
import { AISummaryCard } from '../../components/common/AISummaryCard';
import { useAuth } from '../../context/AuthContext';

const JHARKHAND_DISTRICTS = [
  'Ranchi', 'Dhanbad', 'East Singhbhum', 'Bokaro', 'Deoghar', 'Hazaribagh',
  'Dumka', 'Giridih', 'Ramgarh', 'Palamu', 'West Singhbhum', 'Khunti',
  'Gumla', 'Simdega', 'Latehar', 'Lohardaga', 'Chatra', 'Koderma',
  'Jamtara', 'Godda', 'Pakur', 'Sahibganj', 'Seraikela Kharsawan', 'Garhwa'
];

export const SubmitChallengeWizard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Agriculture');
  const [district, setDistrict] = useState(user?.district || 'Ranchi');
  const [block, setBlock] = useState('Kanke');
  const [village, setVillage] = useState('Arsande Tola');
  const [affectedPopulation, setAffectedPopulation] = useState(2500);
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [language, setLanguage] = useState('English');
  const [mediaUrls, setMediaUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
  ]);

  // Voice recording simulation
  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setTitle('Our irrigation pump frequently stops because of voltage fluctuations');
        setDescription(
          'Our village irrigation pumps burn out frequently due to severe voltage drops (140V) during afternoon pumping hours, affecting cauliflower and wheat crops across Arsande and Sukurhutu.'
        );
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handlePreFillGoldenScenario = () => {
    setTitle('Frequent irrigation pump tripping due to voltage fluctuations in Kanke fields');
    setDescription(
      'Our irrigation pump frequently stops because of voltage fluctuations, affecting crops across nearby villages in Kanke and Ratu blocks. Over 2,500 farming families face acute water shortage for Rabi crops.'
    );
    setCategory('Agriculture');
    setDistrict('Ranchi');
    setBlock('Kanke');
    setVillage('Arsande & Sukurhutu Tola');
    setAffectedPopulation(2500);
    setUrgency('high');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await challengesApi.create({
        title,
        description,
        primary_domain: category,
        district,
        block,
        village_locality: village,
        affected_population: affectedPopulation,
        urgency,
        media: mediaUrls.map((url) => ({ url, type: 'image' })),
      });
      setSubmissionResult(res.data);
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Error submitting challenge. Ensure you are signed in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
            Civic Problem Crowdsourcing
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Submit a Community Challenge
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step verified submission to the CivicForge Societal Innovation Pipeline
          </p>
        </div>

        {/* 1-Click Golden Scenario Fill */}
        <button
          onClick={handlePreFillGoldenScenario}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold hover:bg-purple-100 transition shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          Pre-fill Golden Scenario (Kanke Irrigation)
        </button>
      </div>

      {/* Stepper Wizard Indicator */}
      {!submissionResult && (
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            { s: 1, title: 'Describe' },
            { s: 2, title: 'Evidence' },
            { s: 3, title: 'Location' },
            { s: 4, title: 'Impact' },
            { s: 5, title: 'Submit' },
          ].map((item) => (
            <div
              key={item.s}
              className={`p-2.5 rounded-xl border transition-all ${
                currentStep === item.s
                  ? 'bg-brand-blue text-white font-bold shadow-md shadow-blue-500/20 border-blue-600'
                  : currentStep > item.s
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              <div className="text-[10px] uppercase opacity-80">Step {item.s}</div>
              <div className="truncate">{item.title}</div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: Describe the problem */}
      {!submissionResult && currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-extrabold text-slate-900">Step 1: Describe the Problem</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Input Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium outline-none"
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Nagpuri">नागपुरी (Nagpuri)</option>
                <option value="Santhali">ᱥᱟᱱᱛᱟᱲᱤ (Santhali)</option>
              </select>
            </div>
          </div>

          {/* Voice Input Demo Bar */}
          <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  isRecording ? 'bg-rose-500 text-white animate-ping' : 'bg-purple-600 text-white'
                }`}
              >
                <Mic className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {isRecording ? 'Listening in vernacular...' : 'Voice Input (Vernacular AI)'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isRecording ? 'Speak now in Hindi, Nagpuri or Santhali...' : 'Click mic to speak instead of typing'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                isRecording ? 'bg-rose-600 text-white' : 'bg-white border border-purple-300 text-purple-700 hover:bg-purple-100'
              }`}
            >
              {isRecording ? 'Stop Recording' : 'Simulate Voice Input'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Challenge Headline / Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Irrigation pump constantly trips because of voltage fluctuations in our fields"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Primary Problem Domain *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition"
              >
                <option value="Agriculture">Agriculture & Irrigation</option>
                <option value="Water Resources">Water Resources & Drinking Water</option>
                <option value="Healthcare">Healthcare & Diagnostics</option>
                <option value="Energy">Energy & Rural Grid</option>
                <option value="Environment">Environment & Pollution</option>
                <option value="Sanitation">Sanitation & Waste Management</option>
                <option value="Education">Education & Rural Schools</option>
                <option value="Accessibility">Accessibility & Assistive Mobility</option>
                <option value="Rural Livelihoods">Rural Livelihoods & Tribal Crafts</option>
                <option value="Urban Infrastructure">Urban Infrastructure & Roads</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Detailed Problem Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happens, how often it recurs, and how it impacts local residents..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              disabled={!title.trim() || !description.trim()}
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-40 transition shadow-sm"
            >
              <span>Next: Add Evidence</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Add Evidence */}
      {!submissionResult && currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-extrabold text-slate-900">Step 2: Ground Evidence & Photos</h3>
            <p className="text-xs text-slate-500">Provide photo or document proof to accelerate Panchayat validation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-brand-blue transition cursor-pointer flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 text-slate-400 mb-2" />
              <div className="text-xs font-bold text-slate-700">Upload Site Photo / Video</div>
              <div className="text-[10px] text-slate-400 mt-1">JPEG, PNG, MP4 up to 10MB</div>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden relative group">
              <img
                src={mediaUrls[0]}
                alt="Evidence"
                className="w-full h-40 object-cover"
              />
              <div className="p-2 bg-white text-[11px] text-slate-600 font-medium">
                Photo 1: Tripped capacitor and motor starter panel in field
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-blue-700 transition shadow-sm"
            >
              <span>Next: Location Details</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Location Details */}
      {!submissionResult && currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-extrabold text-slate-900">Step 3: Location Details</h3>
            <p className="text-xs text-slate-500">Pinpoint the administrative geography in Jharkhand</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none"
              >
                {JHARKHAND_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Block / Tehsil *
              </label>
              <input
                type="text"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Village / Locality / Tola *
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-blue" />
            <span>Estimated Coordinates: 23.4312° N, 85.3214° E (Ranchi Rural Sector)</span>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-blue-700 transition shadow-sm"
            >
              <span>Next: Estimated Impact</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Impact & Urgency */}
      {!submissionResult && currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-extrabold text-slate-900">Step 4: Affected Population & Urgency</h3>
            <p className="text-xs text-slate-500">Help the AI Priority Engine evaluate challenge severity</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                <span>Estimated Affected Population</span>
                <span className="text-brand-blue text-sm">~{affectedPopulation.toLocaleString()} Citizens</span>
              </div>
              <input
                type="range"
                min={100}
                max={20000}
                step={100}
                value={affectedPopulation}
                onChange={(e) => setAffectedPopulation(Number(e.target.value))}
                className="w-full accent-brand-blue cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>100 (Hamlet)</span>
                <span>5,000 (Panchayat)</span>
                <span>20,000+ (Entire Block)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Urgency Level *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'low', label: 'Low', desc: 'Can be addressed in 6 months' },
                  { id: 'medium', label: 'Medium', desc: 'Affects seasonal crops/work' },
                  { id: 'high', label: 'High', desc: 'Immediate income/health risk' },
                  { id: 'critical', label: 'Critical', desc: 'Emergency hazard/loss' },
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUrgency(u.id as any)}
                    className={`p-3 rounded-xl border text-left transition ${
                      urgency === u.id
                        ? 'bg-blue-50 border-brand-blue text-brand-blue ring-1 ring-brand-blue font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold uppercase">{u.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{u.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-blue-700 transition shadow-sm"
            >
              <span>Review & AI Screening</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Submit */}
      {!submissionResult && currentStep === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-extrabold text-slate-900">Step 5: Final Review & Submission</h3>
            <p className="text-xs text-slate-500">Review your challenge details before AI pipeline execution</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Title</span>
              <span className="text-sm font-bold text-slate-900">{title}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Description</span>
              <span className="text-slate-700 leading-relaxed">{description}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60">
              <div>
                <span className="text-slate-500">Domain:</span>
                <span className="font-semibold text-slate-800 block">{category}</span>
              </div>
              <div>
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800 block">{village}, {district}</span>
              </div>
              <div>
                <span className="text-slate-500">Affected Pop:</span>
                <span className="font-semibold text-slate-800 block">~{affectedPopulation}</span>
              </div>
              <div>
                <span className="text-slate-500">Urgency:</span>
                <span className="font-semibold text-rose-600 block uppercase">{urgency}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-md shadow-purple-500/25 transition transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>AI Analyzing Challenge...</span>
                </>
              ) : (
                <>
                  <span>Submit Societal Challenge</span>
                  <Sparkles className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* POST-SUBMISSION: AI PIPELINE RESULTS & DUPLICATE CLUSTER DETECTION */}
      {submissionResult && (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">
                  Challenge Submitted & Screened Successfully!
                </h4>
                <p className="text-xs text-emerald-700">
                  Challenge ID: <span className="font-mono font-bold">{submissionResult.challenge.id}</span> • Status: AI_SCREENED
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/challenge/${submissionResult.challenge.id}`)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              View In Pipeline
            </button>
          </div>

          {/* Visible AI Verification Pipeline */}
          <AISummaryCard
            analysis={submissionResult.ai_analysis}
            priority={submissionResult.priority_breakdown}
            isSimulating={false}
          />

          {/* Semantic Duplicate & Problem Cluster Notice */}
          {submissionResult.duplicates && submissionResult.duplicates.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-amber-800">
                <Layers className="h-5 w-5 text-amber-600" />
                <h4 className="text-sm font-bold">
                  Semantic Problem Clustering: {submissionResult.duplicates.length} Related Reports Discovered
                </h4>
              </div>
              <p className="text-xs text-slate-600">
                Our semantic similarity engine detected high concept overlap with existing challenges in {district}.
                These are linked under a shared systemic problem cluster to trigger high-level university intervention:
              </p>

              <div className="space-y-2">
                {submissionResult.duplicates.map((dup: any, i: number) => (
                  <div key={i} className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-700 mr-2">{dup.challenge.id}</span>
                      <span className="font-semibold text-slate-900">{dup.challenge.title}</span>
                      <div className="text-[10px] text-slate-500 mt-0.5">{dup.reason}</div>
                    </div>
                    <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-xs">
                      {dup.similarity}% Similarity
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setSubmissionResult(null);
                setCurrentStep(1);
                setTitle('');
                setDescription('');
              }}
              className="px-4 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Submit Another Challenge
            </button>
            <button
              onClick={() => navigate(`/challenge/${submissionResult.challenge.id}`)}
              className="px-6 py-2 bg-brand-blue text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition shadow-sm"
            >
              Go to Challenge Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
