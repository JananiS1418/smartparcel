import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Truck,
  User
} from 'lucide-react';
import useParcelStore from '../store/parcelStore';
import { formatCurrency, formatParcelStatus, getParcelTimeline, getParcelStepIndex } from '../utils/parcel';

const SenderRouteWorkspace = () => {
  const { parcels, matches, fetchUserParcels, createParcel, findMatches, loading } = useParcelStore();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [formData, setFormData] = useState({
    pickupLocation: 'Chennai',
    dropoffLocation: 'Bangalore',
    weight: '5',
    volume: '1',
    parcelType: 'Documents',
    collectorName: '',
    collectorEmail: '',
    collectorPhone: '',
    paymentMethod: 'sender_pay'
  });

  useEffect(() => {
    fetchUserParcels();
  }, [fetchUserParcels]);

  const activeParcels = useMemo(
    () => parcels.filter((parcel) => parcel.status?.toLowerCase() !== 'delivered'),
    [parcels]
  );

  const latestParcel = activeParcels[0];
  const estimatedPrice = useMemo(() => {
    const base = 80;
    const weightRate = Number(formData.weight || 0) * 18;
    const volumeRate = Number(formData.volume || 0) * 12;
    const surcharge = formData.paymentMethod === 'collector_pay' ? 25 : 0;
    return base + weightRate + volumeRate + surcharge;
  }, [formData.paymentMethod, formData.volume, formData.weight]);

  const handleChange = (key, value) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleFindDrivers = async () => {
    const result = await findMatches({
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      weight: formData.weight,
      volume: formData.volume
    });

    if (!result?.length) {
      setSelectedMatch(null);
      toast.error('No driver route matches this sender route yet.');
    }
  };

  const handleCreateParcel = async (event) => {
    event.preventDefault();

    if (!selectedMatch) {
      toast.error('Please search and select a matching driver route first.');
      return;
    }

    const created = await createParcel({
      ...formData,
      driverId: selectedMatch.driver?._id,
      tripId: selectedMatch._id
    });

    if (!created) {
      toast.error('We could not create the parcel. Please check the details and try again.');
      return;
    }

    toast.success('Shipment created and the driver has been notified.');
    fetchUserParcels();
    setSelectedMatch(null);
    setFormData((current) => ({
      ...current,
      collectorName: '',
      collectorEmail: '',
      collectorPhone: ''
    }));
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_55%,#eef8f2_100%)] pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-10 space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-sm font-semibold text-sky-300">Sender workspace</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Choose a route, match the right driver, and keep the collector informed.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                If the sender route and the driver route are the same, that driver becomes visible here. Booking sends a notification directly to the driver.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Badge icon={Package} text={`${parcels.length} total parcels`} />
                <Badge icon={Truck} text={`${matches.length} route matches`} />
                <Badge icon={ShieldCheck} text="Driver and collector notifications enabled" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <MetricCard label="Active shipments" value={activeParcels.length} tone="sky" />
              <MetricCard label="Delivered" value={parcels.filter((parcel) => parcel.status === 'delivered').length} tone="emerald" />
              <MetricCard label="Estimated price" value={formatCurrency(estimatedPrice)} tone="amber" />
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <form onSubmit={handleCreateParcel} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-sky-700">Create shipment</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">Route-based booking</h2>
              </div>
              <div className="rounded-full bg-sky-50 p-3 text-sky-700">
                <Plus className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Field label="Pickup city">
                <input value={formData.pickupLocation} onChange={(e) => handleChange('pickupLocation', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Drop-off city">
                <input required value={formData.dropoffLocation} onChange={(e) => handleChange('dropoffLocation', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Parcel type">
                <select value={formData.parcelType} onChange={(e) => handleChange('parcelType', e.target.value)} className={inputClass}>
                  <option>Documents</option>
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Fragile goods</option>
                </select>
              </Field>
              <Field label="Collector name">
                <input required value={formData.collectorName} onChange={(e) => handleChange('collectorName', e.target.value)} placeholder="Example: Jeni" className={inputClass} />
              </Field>
              <Field label="Collector email">
                <input type="email" value={formData.collectorEmail} onChange={(e) => handleChange('collectorEmail', e.target.value)} placeholder="Optional" className={inputClass} />
              </Field>
              <Field label="Collector phone">
                <input required value={formData.collectorPhone} onChange={(e) => handleChange('collectorPhone', e.target.value)} placeholder="Required for updates" className={inputClass} />
              </Field>
              <Field label="Weight (kg)">
                <input type="number" min="0.1" step="0.1" value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Volume">
                <input type="number" min="0.1" step="0.1" value={formData.volume} onChange={(e) => handleChange('volume', e.target.value)} className={inputClass} />
              </Field>
            </div>

            <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Matching drivers for this route</p>
                  <p className="mt-1 text-sm text-slate-500">Drivers only appear when their route matches the sender route.</p>
                </div>
                <button type="button" onClick={handleFindDrivers} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600">
                  Find drivers
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {matches.length ? (
                  matches.map((match) => (
                    <button
                      key={match._id}
                      type="button"
                      onClick={() => setSelectedMatch(match)}
                      className={`flex w-full items-center justify-between rounded-[1.25rem] px-4 py-3 text-left transition-standard ${
                        selectedMatch?._id === match._id ? 'border border-sky-500 bg-sky-50' : 'border border-transparent bg-white hover:border-slate-200'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{match.driver?.name}</p>
                        <p className="text-sm text-slate-500">{match.source} to {match.destination}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-950">{match.driver?.truckDetails?.model || 'Route available'}</p>
                        <p className="text-xs text-slate-500">{match.driver?.rating || 5} rating</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <EmptyPanel text="No route matches yet. Ask the driver to add a trip from the same pickup city to the same drop-off city." />
                )}
              </div>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => handleChange('paymentMethod', 'sender_pay')}
                className={`rounded-[1.5rem] border p-5 text-left transition-standard ${
                  formData.paymentMethod === 'sender_pay' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <CreditCard className="h-5 w-5 text-sky-600" />
                <p className="mt-4 text-sm font-semibold text-slate-950">Sender pays now</p>
                <p className="mt-1 text-sm text-slate-500">Best when you want the collector to receive the parcel without paying.</p>
              </button>
              <button
                type="button"
                onClick={() => handleChange('paymentMethod', 'collector_pay')}
                className={`rounded-[1.5rem] border p-5 text-left transition-standard ${
                  formData.paymentMethod === 'collector_pay' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <Phone className="h-5 w-5 text-emerald-600" />
                <p className="mt-4 text-sm font-semibold text-slate-950">Collector pays later</p>
                <p className="mt-1 text-sm text-slate-500">The collector will settle the parcel during handoff.</p>
              </button>
            </div>

            <div className="mt-7 flex flex-col gap-4 rounded-[1.5rem] bg-slate-950 px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-300">Estimated shipment price</p>
                <p className="mt-1 text-3xl font-bold text-white">{formatCurrency(estimatedPrice)}</p>
                <p className="mt-2 text-sm text-slate-400">
                  {selectedMatch ? `Selected driver: ${selectedMatch.driver?.name}` : 'Choose a matching route before booking'}
                </p>
              </div>
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-100 disabled:opacity-60">
                {loading ? 'Creating shipment...' : 'Create shipment'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700">Latest parcel</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-950">
                    {latestParcel ? `#${latestParcel._id.slice(-6).toUpperCase()}` : 'No active parcel'}
                  </h2>
                </div>
                <Sparkles className="h-6 w-6 text-emerald-500" />
              </div>

              {latestParcel ? (
                <>
                  <div className="mt-5 grid gap-3">
                    <SummaryRow icon={User} label="Collector" value={latestParcel.collectorName || 'Not set'} />
                    <SummaryRow icon={Truck} label="Driver" value={latestParcel.carrier?.name || 'Pending assignment'} />
                    <SummaryRow icon={MapPin} label="Route" value={`${latestParcel.pickupLocation} -> ${latestParcel.dropoffLocation}`} />
                    <SummaryRow icon={CreditCard} label="Status" value={formatParcelStatus(latestParcel.status)} />
                  </div>

                  <div className="mt-6 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${((getParcelStepIndex(latestParcel.status) + 1) / 5) * 100}%` }} />
                  </div>

                  <div className="mt-6 space-y-3">
                    {getParcelTimeline(latestParcel).map((step) => (
                      <div key={step.key} className="flex gap-3">
                        <div className={`mt-1 h-3 w-3 rounded-full ${step.state === 'complete' ? 'bg-emerald-500' : step.state === 'active' ? 'bg-sky-500' : 'bg-slate-300'}`} />
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{step.label}</p>
                          <p className="text-sm text-slate-500">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link to="/tracking" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                    Open tracking
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <EmptyPanel text="Create your first parcel to see live progress here." />
              )}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold text-sky-700">Active shipments</p>
              <div className="mt-5 space-y-4">
                {activeParcels.length ? (
                  activeParcels.map((parcel) => (
                    <div key={parcel._id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{parcel.parcelType}</p>
                          <p className="mt-1 text-sm text-slate-500">{parcel.collectorName || 'No collector yet'} • {parcel.dropoffLocation}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          {formatParcelStatus(parcel.status)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyPanel text="No shipments are active right now." />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const inputClass =
  'w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition-standard focus:border-sky-500 focus:bg-white';

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</span>
    {children}
  </label>
);

const Badge = ({ icon: Icon, text }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
    <Icon className="h-4 w-4 text-sky-300" />
    <span>{text}</span>
  </div>
);

const MetricCard = ({ label, value, tone }) => {
  const tones = {
    sky: 'from-sky-500/20 to-sky-400/5 text-sky-300',
    emerald: 'from-emerald-500/20 to-emerald-400/5 text-emerald-300',
    amber: 'from-amber-500/20 to-amber-400/5 text-amber-300'
  };

  return (
    <div className={`rounded-[1.5rem] border border-white/10 bg-gradient-to-br ${tones[tone]} p-5`}>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  );
};

const SummaryRow = ({ icon: Icon, label, value }) => (
  <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
  </div>
);

const EmptyPanel = ({ text }) => (
  <div className="rounded-[1.5rem] border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-500">
    {text}
  </div>
);

export default SenderRouteWorkspace;
