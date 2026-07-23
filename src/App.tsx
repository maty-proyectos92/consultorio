import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, testFirestoreConnection, handleFirestoreError, OperationType } from './firebase';
import {
  Patient,
  Appointment,
  SessionNote,
  Payment,
  ClinicalDocument,
  AppointmentStatus,
  PaymentStatus,
} from './types';
import {
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_SESSION_NOTES,
  INITIAL_PAYMENTS,
  INITIAL_DOCUMENTS,
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/PatientList';
import { PatientDetail } from './components/PatientDetail';
import { AgendaCalendar } from './components/AgendaCalendar';
import { ClinicalNotes } from './components/ClinicalNotes';
import { PaymentsModule } from './components/PaymentsModule';
import { DocumentsModule } from './components/DocumentsModule';
import { AiAssistant } from './components/AiAssistant';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Main State Collections
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>(INITIAL_SESSION_NOTES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [documents, setDocuments] = useState<ClinicalDocument[]>(INITIAL_DOCUMENTS);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Initial Firestore Connection & Realtime Listeners
  useEffect(() => {
    let unsubscribePatients: () => void = () => {};
    let unsubscribeAppointments: () => void = () => {};
    let unsubscribeNotes: () => void = () => {};
    let unsubscribePayments: () => void = () => {};
    let unsubscribeDocs: () => void = () => {};

    async function initFirestore() {
      const connected = await testFirestoreConnection();
      setIsOnline(connected);

      if (connected) {
        try {
          // Listen to patients
          unsubscribePatients = onSnapshot(
            collection(db, 'patients'),
            (snapshot) => {
              if (!snapshot.empty) {
                const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Patient));
                setPatients(list);
              }
            },
            (error) => {
              console.warn('Patients snapshot offline fallback:', error);
            }
          );

          // Listen to appointments
          unsubscribeAppointments = onSnapshot(
            collection(db, 'appointments'),
            (snapshot) => {
              if (!snapshot.empty) {
                const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Appointment));
                setAppointments(list);
              }
            },
            (error) => {
              console.warn('Appointments snapshot offline fallback:', error);
            }
          );

          // Listen to session notes
          unsubscribeNotes = onSnapshot(
            collection(db, 'session_notes'),
            (snapshot) => {
              if (!snapshot.empty) {
                const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SessionNote));
                setSessionNotes(list);
              }
            },
            (error) => {
              console.warn('Session notes snapshot offline fallback:', error);
            }
          );

          // Listen to payments
          unsubscribePayments = onSnapshot(
            collection(db, 'payments'),
            (snapshot) => {
              if (!snapshot.empty) {
                const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Payment));
                setPayments(list);
              }
            },
            (error) => {
              console.warn('Payments snapshot offline fallback:', error);
            }
          );

          // Listen to documents
          unsubscribeDocs = onSnapshot(
            collection(db, 'documents'),
            (snapshot) => {
              if (!snapshot.empty) {
                const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ClinicalDocument));
                setDocuments(list);
              }
            },
            (error) => {
              console.warn('Documents snapshot offline fallback:', error);
            }
          );
        } catch (err) {
          console.warn('Error setting up Firestore listeners:', err);
        }
      }
    }

    initFirestore();

    return () => {
      unsubscribePatients();
      unsubscribeAppointments();
      unsubscribeNotes();
      unsubscribePayments();
      unsubscribeDocs();
    };
  }, []);

  // Handlers for Patients
  const handleAddPatient = async (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPatients((prev) => [newPatient, ...prev]);
    showToast(`Paciente ${newPatient.fullName} guardado con éxito.`);

    if (isOnline) {
      try {
        await addDoc(collection(db, 'patients'), newPatient);
      } catch (err) {
        console.warn('Firestore patient write fallback:', err);
      }
    }
  };

  const handleUpdatePatient = async (updated: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Ficha de ${updated.fullName} actualizada.`);

    if (isOnline) {
      try {
        const ref = doc(db, 'patients', updated.id);
        await updateDoc(ref, { ...updated });
      } catch (err) {
        console.warn('Firestore update error fallback:', err);
      }
    }
  };

  // Handlers for Appointments
  const handleAddAppointment = async (appData: Omit<Appointment, 'id'>) => {
    const newApp: Appointment = {
      ...appData,
      id: `app-${Date.now()}`,
    };

    setAppointments((prev) => [newApp, ...prev]);
    showToast(`Cita agendada para ${newApp.patientName}.`);

    if (isOnline) {
      try {
        await addDoc(collection(db, 'appointments'), newApp);
      } catch (err) {
        console.warn('Firestore appointment write error fallback:', err);
      }
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status } : a))
    );
    showToast(`Estado de cita actualizado a: ${status}`);

    if (isOnline) {
      try {
        const ref = doc(db, 'appointments', appointmentId);
        await updateDoc(ref, { status });
      } catch (err) {
        console.warn('Firestore appointment status error fallback:', err);
      }
    }
  };

  // Handlers for Clinical Notes
  const handleAddNote = async (noteData: Omit<SessionNote, 'id' | 'createdAt'>) => {
    const newNote: SessionNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setSessionNotes((prev) => [newNote, ...prev]);
    showToast('Evolución clínica SOAP registrada.');

    if (isOnline) {
      try {
        await addDoc(collection(db, 'session_notes'), newNote);
      } catch (err) {
        console.warn('Firestore note write error fallback:', err);
      }
    }
  };

  // Handlers for Payments
  const handleAddPayment = async (payData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...payData,
      id: `pay-${Date.now()}`,
    };

    setPayments((prev) => [newPayment, ...prev]);
    showToast(`Cobro registrado para ${newPayment.patientName}.`);

    if (isOnline) {
      try {
        await addDoc(collection(db, 'payments'), newPayment);
      } catch (err) {
        console.warn('Firestore payment write error fallback:', err);
      }
    }
  };

  const handleUpdatePaymentStatus = async (paymentId: string, status: PaymentStatus) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status } : p))
    );
    showToast(`Estado de cobro actualizado a: ${status}`);

    if (isOnline) {
      try {
        const ref = doc(db, 'payments', paymentId);
        await updateDoc(ref, { status });
      } catch (err) {
        console.warn('Firestore payment update error fallback:', err);
      }
    }
  };

  // Handlers for Documents
  const handleAddDocument = async (docData: Omit<ClinicalDocument, 'id' | 'createdAt'>) => {
    const newDoc: ClinicalDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Documento ${newDoc.title} generado.`);

    if (isOnline) {
      try {
        await addDoc(collection(db, 'documents'), newDoc);
      } catch (err) {
        console.warn('Firestore document write error fallback:', err);
      }
    }
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const pendingPaymentsCount = payments.filter((p) => p.status === 'pendiente').length;
  const upcomingAppointmentsCount = appointments.filter(
    (a) => a.status === 'confirmada' || a.status === 'reprogramada'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 border border-slate-700 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        isOnline={isOnline}
        onOpenNewPatient={() => {
          setActiveTab('patients');
          setSelectedPatientId(null);
        }}
        onOpenNewAppointment={() => setActiveTab('agenda')}
        onOpenNewPayment={() => setActiveTab('payments')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Body Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedPatientId(null);
          }}
          pendingPaymentsCount={pendingPaymentsCount}
          upcomingAppointmentsCount={upcomingAppointmentsCount}
        />

        {/* Main View Display */}
        <main className="flex-1 min-w-0">
          {selectedPatient ? (
            <PatientDetail
              patient={selectedPatient}
              appointments={appointments}
              sessionNotes={sessionNotes}
              payments={payments}
              documents={documents}
              onBack={() => setSelectedPatientId(null)}
              onUpdatePatient={handleUpdatePatient}
              onAddNote={handleAddNote}
              onAddPayment={handleAddPayment}
              onAddAppointment={handleAddAppointment}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  patients={patients}
                  appointments={appointments}
                  payments={payments}
                  setActiveTab={setActiveTab}
                  onSelectPatient={(pId) => setSelectedPatientId(pId)}
                  onOpenNewPatient={() => setActiveTab('patients')}
                  onOpenNewAppointment={() => setActiveTab('agenda')}
                  onOpenNewPayment={() => setActiveTab('payments')}
                />
              )}

              {activeTab === 'patients' && (
                <PatientList
                  patients={patients}
                  onSelectPatient={(pId) => setSelectedPatientId(pId)}
                  onAddPatient={handleAddPatient}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              )}

              {activeTab === 'agenda' && (
                <AgendaCalendar
                  appointments={appointments}
                  patients={patients}
                  onAddAppointment={handleAddAppointment}
                  onUpdateStatus={handleUpdateAppointmentStatus}
                />
              )}

              {activeTab === 'notes' && (
                <ClinicalNotes
                  sessionNotes={sessionNotes}
                  patients={patients}
                  onSelectPatient={(pId) => setSelectedPatientId(pId)}
                  onAddNote={handleAddNote}
                />
              )}

              {activeTab === 'payments' && (
                <PaymentsModule
                  payments={payments}
                  patients={patients}
                  onAddPayment={handleAddPayment}
                  onUpdatePaymentStatus={handleUpdatePaymentStatus}
                />
              )}

              {activeTab === 'documents' && (
                <DocumentsModule
                  documents={documents}
                  patients={patients}
                  onAddDocument={handleAddDocument}
                />
              )}

              {activeTab === 'ai-assistant' && (
                <AiAssistant patients={patients} sessionNotes={sessionNotes} />
              )}
            </>
          )}
        </main>

      </div>

    </div>
  );
}
