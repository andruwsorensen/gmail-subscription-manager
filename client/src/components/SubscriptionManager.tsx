import React, { useState, useEffect } from 'react';


interface Subscription {
  id: string;
  email: string;
  unsubscribeLink: string;
  emailCount: number;
}

type SortField = 'emailCount' | 'email';
type SortDirection = 'asc' | 'desc';

const SubscriptionManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('emailCount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/subscriptions');
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      const data: Record<string, { unsubscribeLink: string; emailCount: number }> = await response.json();
      setSubscriptions(Object.entries(data).map(([email, details], index) => ({
        id: `sub_${index}`,
        email,
        unsubscribeLink: details.unsubscribeLink,
        emailCount: details.emailCount
      })));
    } catch (err) {
      setError('An error occurred while loading subscriptions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const cleanUrl = (url: string) => {
    return url.replace(/^<|>$/g, '');
  };

  const SortButton: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
    <button onClick={() => handleSort(field)} className="sort-button">
      {label} {sortField === field && (sortDirection === 'asc' ? '▲' : '▼')}
    </button>
  );

  return (
    <div className="subscription-manager">
      <button onClick={fetchSubscriptions} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Subscriptions'}
      </button>
      {error && <p className="error">{error}</p>}
      <div className="subscription-table">
        <div className="table-header">
          <div className="count-column">
            <SortButton field="emailCount" label="Count" />
          </div>
          <div className="email-column">
            <SortButton field="email" label="Email" />
          </div>
          <div className="action-column">Action</div>
        </div>
        {sortedSubscriptions.map((sub) => (
          <div key={sub.id} className="table-row">
            <div className="count-column">{sub.emailCount}</div>
            <div className="email-column">{sub.email}</div>
            <div className="action-column">
              <a 
                className="unsubscribe-link"
                href={cleanUrl(sub.unsubscribeLink)} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Unsubscribe
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionManager;