import React, { useState, useMemo, useEffect } from 'react';

interface Email {
  id: string;
  from: string;
  subject: string;
  dateReceived: string;
  snippet: string;
}

function EmailManager() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const fetchEmails = async () => {
    try {
      const response = await fetch('http://localhost:3000/emails', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        console.log('Network response was not ok');
        console.log(response);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched Emails:', data); // Log the fetched data

      // Extract relevant fields from the nested structure
      const extractedEmails = data.map((email: any) => ({
        id: email.id,
        from: email.payload.headers.find((header: any) => header.name === 'From')?.value || 'Unknown',
        subject: email.payload.headers.find((header: any) => header.name === 'Subject')?.value || 'No Subject',
        dateReceived: new Date(parseInt(email.internalDate)).toLocaleString(),
        snippet: email.snippet,
      }));

      setEmails(extractedEmails);
    } catch (error) {
      console.error('Error fetching emails', error);
    }
  };

  const groupedEmails = useMemo(() => {
    const groups = emails.reduce((acc, email) => {
      if (!acc[email.from]) {
        acc[email.from] = [];
      }
      acc[email.from].push(email);
      return acc;
    }, {} as Record<string, Email[]>);

    // Convert to array and sort by count
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [emails]);

  const toggleGroup = (from: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(from)) {
        newSet.delete(from);
      } else {
        newSet.add(from);
      }
      return newSet;
    });
  };

  return (
    <div className="email-manager">
      <button onClick={fetchEmails}>Fetch Emails</button>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {groupedEmails.map(([from, emails]) => (
            <React.Fragment key={from}>
              <tr className="expandable-row" onClick={() => toggleGroup(from)}>
                <td className="expandable">{from}</td>
                <td>{emails.length}</td>
              </tr>
              {expandedGroups.has(from) && emails.map(email => (
                <tr key={email.id} className="expanded-content">
                  <td colSpan={2}>
                    <div className="email-details">
                      <div><strong>Subject:</strong> {email.subject}</div>
                      <div><strong>Date:</strong> {email.dateReceived}</div>
                      <div><strong>Snippet:</strong> {email.snippet}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmailManager;