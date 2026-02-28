import Link from 'next/link';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import FeatureGrid from '@/components/FeatureGrid';
import PageTransition from '@/components/PageTransition';
import CtaBanner from '@/components/CtaBanner';

export default function HomePage() {
  return (
    <PageTransition>
      <div className="space-y-20 pb-20">
        <Hero />

        <section className="container">
          <Stats />
        </section>

        <section className="container">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="section-title">Why teams choose Pipeline Hub</h2>
              <p className="section-subtitle">Built for organisations that value transparency and efficiency.</p>
            </div>
            <Link
              className="hidden text-sm font-semibold text-primary-500 transition-colors hover:text-primary-700 sm:inline-flex items-center gap-1"
              href="/projects"
            >
              Browse projects
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
          <FeatureGrid />
        </section>

        <CtaBanner />
      </div>
    </PageTransition>
  );
}
