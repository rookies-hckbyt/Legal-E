// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, Clock, FileText, Bell, Plus, Search, Maximize2, Minimize2, RotateCcw, Trash2, CheckCircle, Edit } from 'lucide-react';
import Calendar from '../components/Calender';
import { Case, Reminder } from '../types/types';
import { formatDate, filterItemsBySearch, combineEvents } from '../utils/utils';
import { dummyCases, dummyReminders } from '../data/data';

// Add these type definitions
type Tab = 'cases' | 'calendar' | 'reminders';
type Priority = 'high' | 'medium' | 'low';

const AdvocateDiary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('cases');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [cases, setCases] = useState<Case[]>(dummyCases);
  const [reminders, setReminders] = useState<Reminder[]>(dummyReminders);
  const [editingCase, setEditingCase] = useState<string | null>(null);
  const [editingReminder, setEditingReminder] = useState<string | null>(null);

  useEffect(() => {
    const storedCases = localStorage.getItem('cases');
    const storedReminders = localStorage.getItem('reminders');
    if (storedCases) setCases(JSON.parse(storedCases));
    if (storedReminders) setReminders(JSON.parse(storedReminders));
  }, []);

  useEffect(() => {
    localStorage.setItem('cases', JSON.stringify(cases));
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [cases, reminders]);

  const handleCaseClick = useCallback((caseId: string) => {
    setSelectedCase(prevSelected => prevSelected === caseId ? null : caseId);
  }, []);

  const createCase = useCallback((newCase: Omit<Case, 'id'>) => {
    setCases(prevCases => [
      ...prevCases,
      { ...newCase, id: Date.now().toString() }
    ]);
  }, []);

  

  const updateCase = useCallback((updatedCase: Case) => {
    setCases(prevCases => prevCases.map(case_ => 
      case_.id === updatedCase.id ? updatedCase : case_
    ));
    setEditingCase(null);
  }, []);

  const deleteCase = useCallback((id: string) => {
    setCases(prevCases => prevCases.filter(case_ => case_.id !== id));
  }, []);

  const toggleCaseStatus = useCallback((id: string) => {
    setCases(prevCases => prevCases.map(case_ =>
      case_.id === id ? { ...case_, status: case_.status === 'completed' ? 'upcoming' : 'completed' } : case_
    ));
  }, []);

  const createReminder = useCallback((newReminder: Omit<Reminder, 'id'>) => {
    setReminders(prevReminders => [
      ...prevReminders,
      { ...newReminder, id: Date.now().toString() }
    ]);
  }, []);

  const updateReminder = useCallback((updatedReminder: Reminder) => {
    setReminders(prevReminders => prevReminders.map(reminder => 
      reminder.id === updatedReminder.id ? updatedReminder : reminder
    ));
    setEditingReminder(null);
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prevReminders => prevReminders.filter(reminder => reminder.id !== id));
  }, []);


  const filteredCases = useMemo(() => 
    filterItemsBySearch(cases, searchQuery),
    [cases, searchQuery]
  );

  const filteredReminders = useMemo(() => 
      filterItemsBySearch(reminders, searchQuery),
      [reminders, searchQuery]
  );

  const combinedEvents = useMemo(() => 
    combineEvents(cases, reminders),
    [cases, reminders]
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-secondary/10"
    >
      <motion.div 
        layout
        className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out 
          ${isExpanded ? 'w-full h-full' : 'w-[90%] h-[85vh]'}`}
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50"
        >
          <h2 className="flex items-center space-x-2 text-2xl font-bold text-primary">
            <FileText className="w-6 h-6 text-primary" />
            <span>Advocate Diary</span>
          </h2>
          <div className="flex space-x-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)} 
              className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100"
            >
              {isExpanded ? 
                <Minimize2 className="w-5 h-5 text-gray-600" /> : 
                <Maximize2 className="w-5 h-5 text-gray-600" />
              }
            </motion.button>
            <motion.button 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-col h-[calc(100%-4rem)]">
          {/* Search and Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-gray-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search cases, documents, or reminders..."
                  className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 text-white rounded-lg bg-primary hover:bg-primary/90"
                onClick={() => setActiveTab('cases')}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Case
              </motion.button>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex px-4 space-x-4 border-b"
          >
            {[
              { id: 'cases', label: 'Cases', icon: FileText },
              { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
              { id: 'reminders', label: 'Reminders', icon: Bell }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center px-4 py-2 space-x-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-6 p-6 md:grid-cols-3">
              {/* Cases List */}
              {activeTab === 'cases' && (
                <div className="md:col-span-2">
                  <CaseForm onSubmit={createCase} />

                  <AnimatePresence>
                  {/* @ts-ignore  */}
                    {filteredCases.map((case_) => (
                      <motion.div
                        key={case_.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-4 mb-4 transition-all duration-200 border rounded-lg hover:shadow-md"
                        onClick={() => handleCaseClick(case_.id)}
                      >
                        {editingCase === case_.id ? (
                          <CaseForm 
                            initialData={case_} 
                            onSubmit={(updatedCase) => updateCase({ ...updatedCase, id: case_.id })}
                            onCancel={() => setEditingCase(null)}
                          />
                        ) : (
                          <CaseItem 
                            case_={case_ as Case}
                            isSelected={selectedCase === case_.id}
                            onToggleStatus={toggleCaseStatus}
                            onEdit={() => setEditingCase(case_.id)}
                            onDelete={deleteCase}
                          />
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Calendar Tab */}
              {activeTab === 'calendar' && (
                <div className="md:col-span-2">
                  <Calendar customEvents={combinedEvents} />
                </div>
              )}

              {/* Reminders Panel */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {activeTab === 'reminders' && (
                  <div className="p-6 bg-white shadow-sm rounded-xl">
                    <h2 className="mb-4 text-xl font-semibold text-primary">Add Reminder</h2>
                    <ReminderForm onSubmit={createReminder} />
                  </div>
                )}

                {/* Upcoming Reminders */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h2 className="mb-4 text-xl font-semibold text-primary">Upcoming Reminders</h2>
                  <AnimatePresence>
                  {/* @ts-ignore  */}
                    {filteredReminders.map((reminder) => (
                      <motion.div
                        key={reminder.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="mb-3"
                      >
                        {editingReminder === reminder.id ? (
                          <ReminderForm 
                            initialData={reminder} 
                            onSubmit={(updatedReminder) => updateReminder({ ...updatedReminder, id: reminder.id })}
                            onCancel={() => setEditingReminder(null)}
                          />
                        ) : (
                          <ReminderItem 
                            reminder={reminder} 
                            onEdit={() => setEditingReminder(reminder.id)}
                            onDelete={deleteReminder}
                          />
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Update CaseForm component
interface CaseFormProps {
  initialData?: Omit<Case, 'id'>;
  onSubmit: (caseData: Omit<Case, 'id'>) => void;
  onCancel?: () => void;
}

const CaseForm: React.FC<CaseFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [court, setCourt] = useState(initialData?.court || '');
  const [nextHearing, setNextHearing] = useState(initialData?.nextHearing || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      court,
      nextHearing,
      notes,
      status: initialData?.status || 'upcoming',
      documents: initialData?.documents || []
    });
    if (!initialData) {
      setTitle('');
      setCourt('');
      setNextHearing('');
      setNotes('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Case Title"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <input
        type="text"
        value={court}
        onChange={(e) => setCourt(e.target.value)}
        placeholder="Court"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <input
        type="date"
        value={nextHearing}
        onChange={(e) => setNextHearing(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Case Notes"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        rows={3}
      />
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 transition-colors duration-300 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-white transition-colors duration-300 rounded-md bg-primary hover:bg-primary-dark"
        >
          {initialData ? 'Update' : 'Add'} Case
        </button>
      </div>
    </form>
  );
};

// Update CaseItem component
interface CaseItemProps {
  case_: Case;
  isSelected: boolean;
  onToggleStatus: (id: string) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

const CaseItem: React.FC<CaseItemProps> = ({ case_, isSelected, onToggleStatus, onEdit, onDelete }) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-primary">{case_.title}</h3>
          <p className="text-sm text-gray-600">{case_.court}</p>
        </div>
        <div className="flex space-x-2">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(case_.id);
            }}
          >
            <CheckCircle className={`w-5 h-5 ${case_.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="w-5 h-5 text-blue-500" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(case_.id);
            }}
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </motion.button>
        </div>
      </div>
      
      <div className="flex items-center mt-4 space-x-4">
        <div className={`px-2 py-1 text-xs font-medium rounded-full ${
          case_.status === 'upcoming' ? 'bg-primary/10 text-primary' :
          case_.status === 'completed' ? 'bg-green-100 text-green-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {case_.status.charAt(0).toUpperCase() + case_.status.slice(1)}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          Next Hearing: {formatDate(case_.nextHearing)}
        </div>
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4"
          >
            <p className="mb-2 text-sm font-medium text-gray-700">Documents:</p>
            <div className="flex flex-wrap gap-2">
            {/* @ts-ignore  */}
              {case_.documents.map((doc, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center px-2 py-1 text-xs rounded-full text-primary bg-primary/10"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  {doc}
                </motion.span>
              ))}
            </div>
            {case_.notes && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-700">Notes:</p>
                <p className="text-sm text-gray-600">{case_.notes}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Update ReminderForm component
interface ReminderFormProps {
  initialData?: Omit<Reminder, 'id'>;
  onSubmit: (reminderData: Omit<Reminder, 'id'>) => void;
  onCancel?: () => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [time, setTime] = useState(initialData?.time || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, date, time, priority });
    if (!initialData) {
      setTitle('');
      setDate('');
      setTime('');
      setPriority('medium');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Reminder Title"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 transition-colors duration-300 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-white transition-colors duration-300 rounded-md bg-primary hover:bg-primary-dark"
        >
          {initialData ? 'Update' : 'Add'} Reminder
        </button>
      </div>
    </form>
  );
};

// Update ReminderItem component
interface ReminderItemProps {
  reminder: Reminder;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

const ReminderItem: React.FC<ReminderItemProps> = ({ reminder, onEdit, onDelete }) => {
  const priorityColors = {
    high: 'bg-primary/10 text-primary',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  return (
    <div className="flex items-center justify-between p-3 transition-colors border rounded-lg hover:bg-gray-50">
      <div>
        <h3 className="font-medium text-primary">{reminder.title}</h3>
        <div className="flex items-center mt-1 space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{formatDate(reminder.date)} at {reminder.time}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`px-2 py-1 text-xs font-medium rounded-full ${
            // @ts-ignore 
          priorityColors[reminder.priority]
        }`}>
          {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="text-blue-500 transition-colors duration-300 hover:text-blue-700"
        >
          <Edit className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(reminder.id)}
          className="text-red-500 transition-colors duration-300 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default AdvocateDiary;
