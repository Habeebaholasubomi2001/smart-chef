import HistoryClient from '../components/history-client';

export const metadata = {
  title: 'Recipe History - Smart Chef',
  description: 'View your recipe history',
};

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <HistoryClient />
    </div>
  );
}
