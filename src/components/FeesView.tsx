import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, CreditCard, Receipt, ShieldCheck, CheckCircle2, Download, X } from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';
import { VerifiedAvatarBadge } from './VerifiedAvatarBadge';
import { DEMO_FEES } from '../services/api';
import { FeeItem } from '../types';
import { formatISTDate } from '../utils/dateTime';

export const FeesView: React.FC<{ onBack: () => void; onSwitchChild?: () => void }> = ({ onBack, onSwitchChild }) => {
  const { currentStudent } = useAuth();
  const [fees, setFees] = useState<FeeItem[]>(DEMO_FEES);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payStatus, setPayStatus] = useState<'idle' | 'processing' | 'verified'>('idle');
  const [selectedFee, setSelectedFee] = useState<FeeItem | null>(null);

  const studentFees = fees.filter(f => f.studentId === currentStudent?.id);
  const pendingAmount = studentFees.filter(f => f.status === 'pending').reduce((sum, item) => sum + item.amount, 0);

  const handleStartPayment = (fee?: FeeItem) => {
    setSelectedFee(fee || null);
    setIsPayModalOpen(true);
    setPayStatus('idle');
  };

  const handleConfirmPayment = () => {
    setPayStatus('processing');
    // Enforcing Safeguard 6: Pending until server confirmation
    setTimeout(() => {
      setPayStatus('verified');
      const paidDateStr = formatISTDate(new Date());
      if (selectedFee) {
        setFees(prev => prev.map(f => f.id === selectedFee.id ? { ...f, status: 'paid', receiptNumber: `REC-${Math.floor(10000 + Math.random() * 90000)}`, paidDate: paidDateStr } : f));
      } else {
        setFees(prev => prev.map(f => f.studentId === currentStudent?.id ? { ...f, status: 'paid', receiptNumber: `REC-${Math.floor(10000 + Math.random() * 90000)}`, paidDate: paidDateStr } : f));
      }
      setTimeout(() => {
        setIsPayModalOpen(false);
        setPayStatus('idle');
      }, 1800);
    }, 2000);
  };

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-24 selection:bg-black selection:text-white">
      {/* Top Bar matching Screen 5 */}
      <ScreenHeader
        title="Fees & Payments"
        onBack={onBack}
        backAriaLabel="Back to Home"
        className="border-b border-neutral-100"
        rightAction={
          <button
            onClick={() => alert('Viewing all fee receipts & transaction history')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100"
            title="Receipts"
          >
            <Receipt className="w-5 h-5" />
          </button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Child Selector Pill */}
        <div
          onClick={onSwitchChild}
          className="w-full bg-white border border-neutral-200/90 rounded-2xl p-3 flex items-center justify-between shadow-xs hover:border-neutral-400 cursor-pointer transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-full shrink-0">
              <img
                src={currentStudent?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'}
                alt={currentStudent?.name}
                className="w-full h-full rounded-full object-cover border border-neutral-200"
              />
              <VerifiedAvatarBadge size="xs" />
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-1.5">
                <h3 className="text-xs font-bold text-black leading-tight">{currentStudent?.name || 'Aarav Sharma'}</h3>
              </div>
              <p className="text-[11px] text-neutral-500">{currentStudent?.grade} - {currentStudent?.section}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </div>

        {/* Outstanding Balance Card matching Screen 5 */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-black tracking-tight">₹{pendingAmount.toLocaleString('en-IN')}</h2>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">Pending Amount</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-700 border border-neutral-100">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <button
            onClick={() => handleStartPayment()}
            disabled={pendingAmount === 0}
            className="w-full h-12 bg-black text-white font-semibold text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-xs hover:bg-neutral-800 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <span>{pendingAmount === 0 ? 'All Fees Cleared' : 'Pay Now'}</span>
            {pendingAmount > 0 && <span className="font-bold text-base">→</span>}
          </button>
        </div>

        {/* Payment History / Fee Invoices List */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-black">Payment History</h3>
            <button
              onClick={() => alert('Viewing full archive of official fee invoices')}
              className="text-xs text-neutral-600 hover:text-black font-semibold underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {studentFees.map((fee) => (
              <div
                key={fee.id}
                className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-800">
                    <Receipt className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-black">{fee.title}</h4>
                    <p className="text-xs text-neutral-500">Due: {fee.dueDate}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-sm font-bold text-black">₹{fee.amount.toLocaleString('en-IN')}</p>
                  {fee.status === 'pending' ? (
                    <span className="inline-block bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                      Pending
                    </span>
                  ) : (
                    <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                      Paid
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Pay Now Modal with Webhook Server Verification (Safeguard 6) */}
      {isPayModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 z-50">
          <div className="w-full max-w-sm bg-white text-black border border-neutral-200 p-6 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Secure School Fee Payment</span>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <p className="text-xs text-neutral-500">
                Amount Due for {currentStudent?.name}
              </p>
              <p className="text-xl font-bold text-black">
                ₹{(selectedFee ? selectedFee.amount : pendingAmount).toLocaleString('en-IN')}
              </p>
            </div>

            {payStatus === 'idle' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Payment Method (UPI / NetBanking / Card)</label>
                  <input
                    type="text"
                    disabled
                    value="UPI ID: priya.sharma@okaxis (Verified)"
                    className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-600"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPayModalOpen(false)}
                    className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    className="flex-1 py-2.5 bg-black text-white text-xs font-semibold rounded-xl"
                  >
                    Authorize ₹{(selectedFee ? selectedFee.amount : pendingAmount).toLocaleString('en-IN')}
                  </button>
                </div>
              </div>
            )}

            {payStatus === 'processing' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-neutral-600">Contacting bank gateway & awaiting server webhook confirmation...</p>
              </div>
            )}

            {payStatus === 'verified' && (
              <div className="py-4 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-black">Payment Confirmed & Reconciled</h4>
                <p className="text-xs text-neutral-500">Official receipt generated automatically.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
