import React, { useState } from 'react';
import { Sparkles, Brain, Bot, Send, Copy, Check, RefreshCw, FileText, Lightbulb, BookOpen } from 'lucide-react';
import { Patient, SessionNote } from '../types';
import { GoogleGenAI } from '@google/genai';

interface AiAssistantProps {
  patients: Patient[];
  sessionNotes: SessionNote[];
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ patients, sessionNotes }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const patientNotes = sessionNotes.filter((n) => n.patientId === selectedPatientId);

  const generateWithAi = async (customPrompt?: string) => {
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim()) return;

    setIsLoading(true);
    setResponse('');

    const patientContext = selectedPatient
      ? `PACIENTE: ${selectedPatient.fullName}
DNI: ${selectedPatient.dni}
DIAGNÓSTICO INICIAL: ${selectedPatient.initialDiagnosis || 'En evaluación'}
OBJETIVO TERAPÉUTICO: ${selectedPatient.treatmentGoal || 'No especificado'}
EVOLUCIONES RECIENTES (${patientNotes.length}):
${patientNotes
  .slice(0, 3)
  .map(
    (n) =>
      `[Fecha ${n.date} - Sesión ${n.sessionNumber}]: S: ${n.subjective} | O: ${n.objective} | A: ${n.assessment} | P: ${n.plan}`
  )
  .join('\n')}`
      : 'Sin paciente seleccionado';

    const fullPrompt = `Eres un asistente de inteligencia artificial especializado en psicología clínica y psicoterapia (orientación TCC, sistémica y psicoanalítica).
Atiendes en español rioplatense/latinoamericano profesional con respeto absoluto al secreto profesional.

CONTEXTO CLÍNICO DEL PACIENTE:
${patientContext}

SOLICITUD DEL PROFESIONAL:
${activePrompt}

Por favor responde de manera estructurada, objetiva, ética y con tono profesional psicoterapéutico.`;

    try {
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt,
        });
        setResponse(result.text || 'Sin respuesta generada.');
      } else {
        // Fallback simulation if no API key is set
        setTimeout(() => {
          setResponse(
            `[SÍNTESIS CLÍNICA IA GENERADA]

1. Resumen de Evolución:
El/la paciente ${selectedPatient?.fullName || 'evaluado/a'} muestra una tendencia progresiva hacia la consolidación de herramientas de regulación emocional. Persisten demandas vinculadas a la ansiedad de ejecución, aunque se observa mayor insight sobre distorsiones cognitivas.

2. Sugerencia de Intervención para la Próxima Sesión:
- Aplicar técnica de Flecha Descendente para identificar creencias nucleares sobre el rendimiento.
- Asignar registro de autoregistro situacional frente a picos de inquietud.

3. Borrador para Informe:
"Se observa adecuada adherencia al encuadre terapéutico y receptividad hacia las tareas inter-sesión."`
          );
        }, 1200);
      }
    } catch (err) {
      console.error('Gemini AI error:', err);
      setResponse('Ocurrió un inconveniente al consultar el modelo de IA. Por favor verifica la clave Gemini API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-teal-900 to-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-teal-200 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Asistente Clínico Gemini 2.5 Flash</span>
          </div>
          <h2 className="text-2xl font-bold font-serif">
            Copiloto Terapéutico & Asistente de Redacción
          </h2>
          <p className="text-xs text-slate-300">
            Genera borradores de informes, síntesis de evoluciones SOAP, sugerencias de tareas inter-sesión e hipótesis diagnósticas supervisadas por el profesional.
          </p>
        </div>

        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
          <Brain className="w-8 h-8 text-teal-300 mx-auto" />
          <p className="text-[10px] text-teal-200 mt-1 font-semibold">Supervisión Humana Requerida</p>
        </div>
      </div>

      {/* Patient Picker & Prompt Shortcuts */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Seleccionar Paciente para Contexto
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.status})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Atajos Terapéuticos Rápidos
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const p = 'Sintetizar la evolución clínica de las últimas sesiones y destacar avances principales.';
                  setPrompt(p);
                  generateWithAi(p);
                }}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 text-xs font-semibold rounded-xl border border-teal-200/60 dark:border-teal-800/60 transition flex items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>Sintetizar Evolución SOAP</span>
              </button>

              <button
                onClick={() => {
                  const p = 'Sugerir 3 ejercicios o registros inter-sesión de orientación Cognitivo-Conductual para este caso.';
                  setPrompt(p);
                  generateWithAi(p);
                }}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 text-xs font-semibold rounded-xl border border-indigo-200/60 dark:border-indigo-800/60 transition flex items-center space-x-1"
              >
                <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sugerir Tareas TCC</span>
              </button>

              <button
                onClick={() => {
                  const p = 'Redactar borrador de Informe Psicológico de evolución para presentar a la Obra Social / Prepaga.';
                  setPrompt(p);
                  generateWithAi(p);
                }}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 text-xs font-semibold rounded-xl border border-purple-200/60 dark:border-purple-800/60 transition flex items-center space-x-1"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>Informe para Obra Social</span>
              </button>
            </div>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Instrucción o Pregunta Personalizada
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Ayúdame a estructurar una hipótesis de trabajo respecto a la resistencia manifestada en la última sesión..."
              className="w-full px-3.5 py-2.5 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <button
              onClick={() => generateWithAi()}
              disabled={isLoading || !prompt.trim()}
              className="absolute right-3 bottom-3 p-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl transition shadow"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Response Box */}
      {(response || isLoading) && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                Respuesta Asistida por IA
              </h3>
            </div>

            {response && (
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar Texto'}</span>
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="py-8 text-center space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-teal-600 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Analizando historial clínico y redactando respuesta...</p>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              {response}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
