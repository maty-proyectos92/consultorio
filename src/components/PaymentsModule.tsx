import React, { useState } from 'react';
import { CreditCard, Plus, CheckCircle, Clock, FileSpreadsheet, FileText, Download, DollarSign } from 'lucide-react';
import { Payment, Patient, PaymentMethod, PaymentStatus } from '../types';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface PaymentsModuleProps {
  payments: Payment[];
  patients: Patient[];
  onAddPayment: (payment: Omit<Payment, 'id'>) => void;
  onUpdatePaymentStatus: (paymentId: string, status: PaymentStatus) => void;
}

export const PaymentsModule: React.FC<PaymentsModuleProps> = ({
  payments,
  patients,
  onAddPayment,
  onUpdatePaymentStatus,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'todos'>('todos');

  // New Payment Form
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [amount, setAmount] = useState(25000);
  const [method, setMethod] = useState<PaymentMethod>('transferencia');
  const [status, setStatus] = useState<PaymentStatus>('completado');
  const [concept, setConcept] = useState('Honorarios Sesión de Psicología');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredPayments = payments
    .filter((p) => filterStatus === 'todos' || p.status === filterStatus)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalCollected = payments
    .filter((p) => p.status === 'completado')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'pendiente')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const invoiceNum = `FC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    onAddPayment({
      patientId: patient.id,
      patientName: patient.fullName,
      date,
      amount: Number(amount),
      method,
      status,
      concept,
      invoiceNumber: invoiceNum,
    });

    setShowModal(false);
  };

  // Export Receipts PDF
  const exportPDF = (payment: Payment) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('CONSULTORIO DE PSICOLOGÍA', 20, 20);
    doc.setFontSize(12);
    doc.text(`COMPROBANDE DE PAGO DE HONORARIOS - ${payment.invoiceNumber || 'RECIBO'}`, 20, 30);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(10);
    doc.text(`Fecha: ${payment.date}`, 20, 45);
    doc.text(`Paciente: ${payment.patientName}`, 20, 52);
    doc.text(`Concepto: ${payment.concept}`, 20, 59);
    doc.text(`Método de Pago: ${payment.method.toUpperCase()}`, 20, 66);
    doc.text(`Monto Abonado: $${payment.amount.toLocaleString('es-AR')} ARS`, 20, 73);
    doc.text(`Estado: ${payment.status.toUpperCase()}`, 20, 80);

    doc.line(20, 90, 190, 90);
    doc.text('Lic. Psicología Clínica - Firma y Sello Profesional', 20, 105);

    doc.save(`Recibo_${payment.patientName.replace(/\s+/g, '_')}_${payment.date}.pdf`);
  };

  // Export All Payments Excel
  const exportExcel = () => {
    const data = payments.map((p) => ({
      Fecha: p.date,
      Paciente: p.patientName,
      Concepto: p.concept,
      Monto: p.amount,
      Método: p.method,
      Estado: p.status,
      Comprobante: p.invoiceNumber || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Honorarios');
    XLSX.writeFile(workbook, `Reporte_Honorarios_Consultorio_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Control de Honorarios y Cobros</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Registro de ingresos, recibos emitidos y facturación del consultorio
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportExcel}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-200 dark:border-emerald-800 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar Excel</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Cobro</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Cobrado (Completado)</p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ${totalCollected.toLocaleString('es-AR')} ARS
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Pendiente de Cobro</p>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              ${totalPending.toLocaleString('es-AR')} ARS
            </p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {(['todos', 'completado', 'pendiente'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              filterStatus === st
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {st === 'todos' ? 'Todos los registros' : st}
          </button>
        ))}
      </div>

      {/* Table List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Concepto</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4">Monto</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{p.date}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{p.patientName}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{p.concept}</td>
                  <td className="py-3 px-4 capitalize text-slate-500">{p.method}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    ${p.amount.toLocaleString('es-AR')}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onUpdatePaymentStatus(p.id, p.status === 'completado' ? 'pendiente' : 'completado')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize transition ${
                        p.status === 'completado'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {p.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => exportPDF(p)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition"
                      title="Descargar Recibo PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                Registrar Nuevo Cobro de Honorarios
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Paciente *</label>
                <select
                  required
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value);
                    const p = patients.find((p) => p.id === e.target.value);
                    if (p) setAmount(p.sessionFee);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Monto ($) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Fecha</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Método de Pago</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta de Débito/Crédito</option>
                    <option value="obra_social">Liquidación Obra Social</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="completado">Completado (Acreditado)</option>
                    <option value="pendiente">Pendiente de Cobro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Concepto</label>
                <input
                  type="text"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="Ej: Sesión N° 4 - Psicología"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow">Guardar Pago</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
