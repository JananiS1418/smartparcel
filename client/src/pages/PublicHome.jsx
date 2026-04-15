import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wallet
} from 'lucide-react';
import useUserStore from '../store/userStore';

const fallbackDriverImage =
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200';

const PublicHome = () => {
  const [cityName, setCityName] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { publicDrivers, fetchPublicDrivers, loadingPublicDrivers } = useUserStore();

  useEffect(() => {
    fetchPublicDrivers();
  }, [fetchPublicDrivers]);

  const displayedDrivers = useMemo(() => publicDrivers, [publicDrivers]);

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchPublicDrivers(cityName.trim() ? { city: cityName.trim() } : {});
    setShowResults(true);

    setTimeout(() => {
      document.getElementById('driver-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  return (
    <div className="bg-[linear-gradient(180deg,#fbfcff_0%,#f3f9ff_45%,#ffffff_100%)] text-slate-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.15),transparent_40%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_35%)]" />

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Smart parcel handoff for sender, driver, and collector
              </div>

              <h1 className="mt-8 max-w-3xl text-5xl font-bold tracking-tight text-slate-950 md:text-7xl">
                Ship with <span className="text-sky-600">clarity</span>, speed, and a better handoff experience.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Search real upcoming driver routes from MongoDB, then continue into the sender dashboard to book the parcel with the matching route.
              </p>

              <form onSubmit={handleSearch} className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="flex flex-1 items-center gap-3 rounded-[1.3rem] bg-slate-50 px-4 py-4">
                    <MapPin className="h-5 w-5 text-sky-600" />
                    <input
                      type="text"
                      value={cityName}
                      onChange={(event) => setCityName(event.target.value)}
                      placeholder="Search a city with active driver routes"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-[1.3rem] bg-slate-950 px-7 py-4 text-sm font-semibold text-white transition-standard hover:bg-sky-600"
                  >
                    Find drivers
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
                <FeatureChip icon={ShieldCheck} text="MongoDB-backed search results" />
                <FeatureChip icon={Globe2} text="Live route visibility for all roles" />
                <FeatureChip icon={Wallet} text="Flexible payment handoff" />
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition-standard hover:bg-slate-950"
                >
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-standard hover:border-slate-300 hover:text-slate-950"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-sky-200/50 blur-2xl" />
              <div className="absolute -right-8 bottom-10 h-24 w-24 rounded-full bg-emerald-200/60 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white p-4 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
                <img
                  src={fallbackDriverImage}
                  alt="Parcel delivery truck"
                  className="h-[560px] w-full rounded-[2rem] object-cover"
                />
                <div className="absolute inset-x-10 bottom-10 rounded-[1.7rem] bg-slate-950/78 p-6 text-white backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.22em] text-sky-300">Live operations view</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <HeroMetric label="Public routes" value={`${displayedDrivers.length || 0}`} />
                    <HeroMetric label="Search source" value="MongoDB" />
                    <HeroMetric label="Booking flow" value="Server-backed" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <ShowcaseCard icon={Package} title="Senders" text="Search live driver routes, book a parcel, and keep the collector informed from one place." />
          <ShowcaseCard icon={Truck} title="Drivers" text="Create a route once and become discoverable on the public search instantly." />
          <ShowcaseCard icon={CheckCircle2} title="Collectors" text="See only the parcels assigned to your details and confirm the final handoff cleanly." />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2.5rem] bg-slate-950 px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
            <p className="text-sm font-semibold text-sky-300">Why teams choose SmartParcel</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white">A cleaner delivery product, not just another parcel form.</h2>
            <div className="mt-8 space-y-5">
              <ReasonItem title="One consistent flow" text="The same parcel status updates are visible to senders, drivers, and collectors." />
              <ReasonItem title="Real route discovery" text="Public search now reads driver routes directly from the server instead of demo arrays." />
              <ReasonItem title="Professional dashboards" text="Each role gets a purpose-built workspace with clearer actions and less clutter." />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard number={`${displayedDrivers.length || 0}`} label="Public driver routes" />
            <StatCard number="MongoDB" label="Primary data source" />
            <StatCard number="24/7" label="Access to tracking" />
            <StatCard number="3 roles" label="Unified handoff" />
          </div>
        </div>
      </section>

      {showResults && (
        <section id="driver-results" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-700">Driver results</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                Available options {cityName ? `for ${cityName}` : 'from active routes'}
              </h2>
            </div>
            <p className="text-sm text-slate-500">These cards are pulled from real upcoming trips stored in MongoDB.</p>
          </div>

          <div className="mt-10">
            {loadingPublicDrivers ? (
              <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <div className="h-56 animate-pulse rounded-[1.5rem] bg-slate-100" />
                    <div className="mt-6 space-y-3">
                      <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                      <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                      <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedDrivers.length ? (
              <div className="grid gap-6 md:grid-cols-3">
                {displayedDrivers.map((driver) => (
                  <article key={driver._id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <img src={driver.image || fallbackDriverImage} alt={driver.name} className="h-56 w-full object-cover" />
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold text-slate-950">{driver.name}</h3>
                          <p className="mt-1 text-sm text-slate-500">{driver.vehicle}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
                          <Star className="h-4 w-4 fill-current" />
                          {Number(driver.rating || 5).toFixed(1)}
                        </span>
                      </div>

                      <div className="mt-6 grid gap-3">
                        <InfoPill label="City" value={driver.city} />
                        <InfoPill label="Route" value={driver.route} />
                        <InfoPill label="Capacity" value={`${driver.availableWeight} kg • ${driver.availableVolume} vol`} />
                        <InfoPill label="Departure" value={new Date(driver.departureDate).toLocaleDateString()} />
                      </div>

                      <Link to="/login" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-standard hover:bg-sky-600">
                        Continue to booking
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <Truck className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-2xl font-bold text-slate-950">No live routes found yet</h3>
                <p className="mt-2 text-sm text-slate-500">
                  No MongoDB driver routes matched this city. Ask a driver to create a route from the dashboard and try again.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="overflow-hidden rounded-[2.8rem] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#10b981_130%)] px-8 py-14 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-sky-200">Ready to send smarter?</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">Create an account and start with a cleaner parcel workflow today.</h2>
              <p className="mt-4 max-w-2xl text-base text-white/80">
                The public search now surfaces real driver availability, and the dashboards continue the same server-backed flow after sign-in.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-standard hover:bg-slate-100">
                Create account
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-standard hover:bg-white/15">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureChip = ({ icon: Icon, text }) => (
  <div className="inline-flex items-center gap-2">
    <Icon className="h-4 w-4 text-sky-600" />
    <span>{text}</span>
  </div>
);

const HeroMetric = ({ label, value }) => (
  <div className="rounded-[1.2rem] bg-white/8 px-4 py-4">
    <p className="text-xs uppercase tracking-[0.2em] text-white/60">{label}</p>
    <p className="mt-2 text-2xl font-bold text-white">{value}</p>
  </div>
);

const ShowcaseCard = ({ icon: Icon, title, text }) => (
  <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
  </div>
);

const ReasonItem = ({ title, text }) => (
  <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
    <h3 className="text-lg font-bold text-white">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-white/70">{text}</p>
  </div>
);

const StatCard = ({ number, label }) => (
  <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
    <p className="text-4xl font-bold tracking-tight text-slate-950">{number}</p>
    <p className="mt-2 text-sm text-slate-500">{label}</p>
  </div>
);

const InfoPill = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 rounded-[1rem] bg-slate-50 px-4 py-3">
    <span className="text-sm font-medium text-slate-500">{label}</span>
    <span className="text-right text-sm font-semibold text-slate-950">{value}</span>
  </div>
);

export default PublicHome;
