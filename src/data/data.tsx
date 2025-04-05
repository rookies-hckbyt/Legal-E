import { Case, Reminder } from '../types/types';

export const dummyCases: Case[] = [
  {
    id: '1',
    title: 'Sharma vs. Verma',
    court: 'Supreme Court of India',
    nextHearing: '2024-07-15',
    status: 'upcoming',
    documents: ['Complaint.pdf', 'Evidence_A.jpg'],
    notes: 'Key witness testimony scheduled for next hearing.'
  },
  {
    id: '2',
    title: 'Green Industries Insolvency Case',
    court: 'National Company Law Tribunal (NCLT)',
    nextHearing: '2024-06-30',
    status: 'pending',
    documents: ['Insolvency Petition.pdf', 'Financial_Statements.xlsx'],
    notes: 'Review latest financial statements before next hearing.'
  },
  {
    id: '3',
    title: 'Rajput Family Trust Dispute',
    court: 'Family Court, Delhi',
    nextHearing: '2024-08-05',
    status: 'upcoming',
    documents: ['Trust Deed.pdf', 'Asset_List.docx'],
    notes: 'Mediation scheduled for next week.'
  },
  {
    id: '4',
    title: 'Municipal Corporation of Mumbai vs. XYZ Builders',
    court: 'Bombay High Court',
    nextHearing: '2024-07-22',
    status: 'completed',
    documents: ['Environmental Impact Assessment.pdf', 'Settlement_Agreement.docx'],
    notes: 'Case closed. Monitoring compliance with settlement terms.'
  }
];

export const dummyReminders: Reminder[] = [
  {
    id: '1',
    title: 'File Motion for Sharma vs. Verma',
    date: '2024-07-01',
    time: '09:00',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Client Meeting - Green Industries Insolvency',
    date: '2024-06-25',
    time: '14:00',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Prepare for Rajput Family Mediation',
    date: '2024-07-30',
    time: '10:00',
    priority: 'high'
  },
  {
    id: '4',
    title: 'Review XYZ Builders Compliance Report',
    date: '2024-08-15',
    time: '11:00',
    priority: 'low'
  },
  {
    id: '5',
    title: 'Bar Council Meeting - Mumbai Chapter',
    date: '2024-07-10',
    time: '18:00',
    priority: 'medium'
  }
];