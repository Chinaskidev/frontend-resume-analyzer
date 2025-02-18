"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const handleSubmit = async () => {
    if (!file || !jobDesc) {
      setError("⚠️ Por favor, sube un archivo y escribe una descripción del trabajo.");
      return;
    }

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_desc", jobDesc);

    console.log("API URL:", API_URL);

    try {
      const response = await fetch(`${API_URL}/analyze/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error en la API. Verifica que el backend esté en línea.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("❌ Hubo un problema al analizar el CV. Inténtalo de nuevo.");
      console.error("Error al analizar el currículum:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 p-6">
      <Card className="w-full max-w-2xl bg-gray-900 text-white p-8 rounded-2xl shadow-lg border border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
            📄 Subir Currículum para Análisis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cargar Archivo */}
          <label className="text-gray-300 font-medium">Sube tu CV (PDF/DOCX):</label>
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            accept=".pdf,.docx"
            className="bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Descripción del Trabajo */}
          <label className="text-gray-300 font-medium">Descripción del Trabajo:</label>
          <Textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Escribe la descripción del trabajo aquí..."
            className="bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Botón de Análisis */}
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 shadow-lg" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : (
              "Analizar Currículum"
            )}
          </Button>

          {/* Mensajes de error */}
          {error && <p className="text-red-400 text-center mt-2">{error}</p>}

          {/* Resultados */}
          {result && (
            <Card className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-400">Resultados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p><strong>📄 Archivo:</strong> {result.file_name}</p>
                <p><strong>📊 Puntaje:</strong> {result.match_score}</p>
                <p><strong>🛠 Habilidades:</strong> {result.skills?.length ? result.skills.join(", ") : "No detectadas"}</p>
                <p><strong>📅 Experiencia:</strong> {result.experience?.length ? result.experience.join(" años") : "No detectada"}</p>
                <p>
                  <strong>✅ Decisión:</strong>{" "}
                  <span className={result.decision === "Selected" ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                    {result.decision}
                  </span>
                </p>
                <p><strong>📌 Razón:</strong> {result.reason}</p>
                <p><strong>💡 Feedback de IA:</strong> {result.feedback}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
