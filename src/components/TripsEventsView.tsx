import React, { useState } from 'react';
import { ChevronRight, FileText, Check, X } from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import { DEMO_TRIPS } from '../services/api';
import { TripEvent } from '../types';

export const TripsEventsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [trips, setTrips] = useState<TripEvent[]>(DEMO_TRIPS);
  const [selectedTrip, setSelectedTrip] = useState<TripEvent | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  const handleRegister = (tripId: string) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, registered: true, consentGiven: true } : t));
    setSuccessNotice('Parental consent recorded and registration confirmed.');
    setTimeout(() => {
      setSuccessNotice('');
      setSelectedTrip(null);
    }, 2000);
  };

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-24 selection:bg-black selection:text-white">
      {/* Top Bar matching Screen 9 */}
      <ScreenHeader
        title="Trips & Events"
        onBack={onBack}
        backAriaLabel="Back to Home"
        className="border-b border-neutral-100"
      />

      <div className="p-4 space-y-4">
        {/* Tabs: Upcoming / Past matching Screen 9 */}
        <div className="flex space-x-2">
          {(['Upcoming', 'Past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-[#fafafa] border border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Trips / Events List */}
        <div className="space-y-2.5">
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => { setSelectedTrip(trip); setConsentChecked(trip.consentGiven); }}
              className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-neutral-400 cursor-pointer transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-700">
                  <FileText className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black">{trip.title}</h4>
                  <p className="text-xs text-neutral-500">{trip.date}</p>
                  {trip.registered && (
                    <span className="inline-block mt-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                      Registered
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Parental Consent & Registration Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50">
          <div className="w-full max-w-sm bg-white text-black border border-neutral-200 p-6 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-black">{selectedTrip.title}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Date: {selectedTrip.date}</p>
              </div>
              <button onClick={() => setSelectedTrip(null)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
              {selectedTrip.description}
            </p>

            {selectedTrip.cost ? (
              <p className="text-xs font-semibold text-black">Participation Fee: ₹{selectedTrip.cost}</p>
            ) : (
              <p className="text-xs font-semibold text-emerald-600">Complimentary School Event</p>
            )}

            {successNotice ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{successNotice}</span>
              </div>
            ) : selectedTrip.registered ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Your child is registered. Consent on file.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="flex items-start space-x-2 text-xs text-neutral-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="w-4 h-4 rounded text-black accent-black mt-0.5"
                  />
                  <span>I grant parental consent for my child to participate in this official school event.</span>
                </label>

                <button
                  type="button"
                  disabled={!consentChecked}
                  onClick={() => handleRegister(selectedTrip.id)}
                  className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 disabled:opacity-40"
                >
                  Confirm Registration
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
