import AppCreditSection from '@/components/app-credit-section';
import PollApp from '@/components/poll-app';

export default function Home() {
  return (
    <main className='z-10 flex min-h-dvh w-screen flex-col items-center p-4 text-gray-200'>
      <AppCreditSection />
      <PollApp />
    </main>
  );
}
