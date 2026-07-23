import React, { useState } from 'react';
import { FolderArchive, FileSignature, Plus, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { ClinicalDocument, Patient, DocumentType } from '../types';
import jsPDF from 'jspdf';

interface DocumentsModuleProps {
  documents: ClinicalDocument[];
  patients: Patient[];
  onAddDocument: (doc: Omit<ClinicalDocument, 'id' | 'createdAt'>) => void;
}

export const DocumentsModule: React.FC<DocumentsModuleProps> = ({
  documents,
  patients,
  onAddDocument,
}) => {
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<DocumentType>('consentimiento');
  const [content, setContent] = useState('');
  const [signed, setSigned] = useState(true);

  const handleSelectTemplate = (t: DocumentType) => {
    setType(t);
    const p = patients.find((pat) => pat.id === patientId);
    const name = p ? p.fullName : 'el/la paciente';

    if (t === 'consentimiento') {
      setTitle(`Consentimiento Informado - ${name}`);
      setContent(
        `Por la presente, ${name}, DNI ${p?.dni || '...'}, declara estar en pleno conocimiento del marco de atención psicoterapéutica propuesto, aceptando el encuadre, la reserva de confidencialidad en los términos de la Ley 25.326 y la frecuencia de encuentros pautada.`
      );
    } else if (t === 'informe_alta') {
      setTitle(`Informe Psicológico de Alta - ${name}`);
      setContent(
        `Se expide el presente informe clínico para certificar que ${name} ha concluido satisfactoriamente su proceso de tratamiento psicoterapéutico, habiendo cumplido los objetivos planteados inicialmente.`
      );
    } else if (t === 'certificado') {
      setTitle(`Certificado de Asistencia - ${name}`);
      setContent(
        `Certifico que ${name}, DNI ${p?.dni || '...'}, asiste a sesiones individuales de psicoterapia en mi consultorio profesional los días pautados.`
      );
    } else if (t === 'anamnesis') {
      setTitle(`Ficha Anamnesis Inicial - ${name}`);
      setContent(
        `Motivo de Consulta Principal: ${p?.initialDiagnosis || 'Registro inicial'}.\nAntecedentes Médicos / Psiquiátricos: Sin antecedentes de relevancia.\nEstructura Familiar y Red de Apoyo: Red contenida.`
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = patients.find((pat) => pat.id === patientId);
    if (!p || !title.trim()) return;

    onAddDocument({
      patientId: p.id,
      patientName: p.fullName,
      title,
      type,
      content,
      signed,
    });

    setTitle('');
    setContent('');
    setShowModal(false);
  };

  const exportDocPDF = (docItem: ClinicalDocument) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('CONSULTORIO DE PSICOLOGÍA', 20, 20);
    doc.setFontSize(12);
    doc.text(docItem.title, 20, 30);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(10);
    doc.text(`Fecha de Emisión: ${docItem.createdAt}`, 20, 45);
    doc.text(`Paciente: ${docItem.patientName}`, 20, 52);
    doc.text(`Estado de Firma: ${docItem.signed ? 'Firmado Electrónicamente' : 'Pendiente'}`, 20, 59);

    doc.line(20, 65, 190, 65);

    const splitText = doc.splitTextToSize(docItem.content, 170);
    doc.text(splitText, 20, 75);

    doc.line(20, 150, 190, 150);
    doc.text('Lic. Psicología Clínica - Firma y Sello Profesional', 20, 165);

    doc.save(`${docItem.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif flex items-center space-x-2">
            <FolderArchive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Documentación & Plantillas Clínicas</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generación de consentimientos informados, certificados e informes clínicos con PDF
          </p>
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            handleSelectTemplate('consentimiento');
          }}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Generar Documento</span>
        </button>
      </div>

      {/* Grid of Existing Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.length === 0 ? (
          <div className="col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 text-xs">
            Aún no se han generado documentos clínicos.
          </div>
        ) : (
          documents.map((docItem) => (
            <div
              key={docItem.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-indigo-400 transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <FileSignature className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {docItem.title}
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        Paciente: {docItem.patientName} • {docItem.createdAt}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    docItem.signed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {docItem.signed ? 'Firmado' : 'Pendiente'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-3 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  {docItem.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Tipo: {docItem.type}</span>
                <button
                  onClick={() => exportDocPDF(docItem)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-lg transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar PDF</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Document Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                Generar Documento / Informe Clínico
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Paciente *</label>
                <select
                  required
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Cargar Plantilla Prediseñada</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('consentimiento')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs rounded-lg font-medium"
                  >
                    Consentimiento Informado
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('informe_alta')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs rounded-lg font-medium"
                  >
                    Informe de Alta
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('certificado')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs rounded-lg font-medium"
                  >
                    Certificado Asistencia
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Título del Documento *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Contenido del Documento *</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="signed"
                  checked={signed}
                  onChange={(e) => setSigned(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <label htmlFor="signed" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Marcar como firmado e integrado al expediente
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow">Guardar Documento</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
