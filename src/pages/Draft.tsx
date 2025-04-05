import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText,File, Loader, AlertCircle, CheckCircle, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type DocumentType = 'Rent Agreement' | 'Employment Contract' | 'Non-Disclosure Agreement' | 'Will' | 'Other';

interface FormInputs {
  documentType: DocumentType;
  partyA: string;
  partyB: string;
  additionalDetails: string;
  specificDetails: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const generateLegalDocument = async (params: FormInputs): Promise<string> => {
  const { documentType, partyA, partyB, additionalDetails, specificDetails } = params;

  const prompt = `Generate a ${documentType} between ${partyA} and ${partyB}. 
  Include the following details: ${additionalDetails}
  Specific details for this ${documentType}: ${specificDetails}
  The document should be properly formatted with appropriate sections, clauses, and legal language. 
  Include placeholders for dates, signatures, and any other variable information.
  Format the output as markdown, with appropriate headers, lists, and emphasis.`;

  try {
    const response = await axiosInstance.post(`${API_URL}?key=${API_KEY}`, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_ONLY_HIGH"
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    const data: GeminiResponse = response.data;
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0].text) {
      throw new Error('No valid response from the AI service');
    }
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      throw new Error(`Failed to generate legal document: ${error.response?.data?.error?.message || error.message}`);
    } else {
      console.error('Error generating legal document:', error);
      throw error;
    }
  }
};

const LegalDocumentGenerator: React.FC = () => {
  const [documentContent, setDocumentContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch 
  } = useForm<FormInputs>();

  const selectedDocumentType = watch('documentType');

  const onSubmit: SubmitHandler<FormInputs> = useCallback(async (data) => {
    setLoading(true);
    setApiError(null);

    try {
      const generatedDocument = await generateLegalDocument(data);
      setDocumentContent(generatedDocument);
    } catch (error) {
      console.error("Error:", error);
      setApiError(error instanceof Error ? error.message : "An error occurred while generating the document.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownloadDocx = useCallback((): void => {
    if (!documentContent) {
      setApiError("No content to generate DOCX. Please generate a document first.");
      return;
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: documentContent.split("\n").map(line => 
          new Paragraph({ children: [new TextRun(line)] })
        ),
      }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "legal_document.docx");
    }).catch(error => {
      console.error("DOCX generation error:", error);
      setApiError("Failed to generate DOCX. Please try again.");
    });
  }, [documentContent]);

  const resetForm = useCallback(() => {
    setDocumentContent('');
    setApiError(null);
  }, []);

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
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50"
        >
          <h2 className="flex items-center space-x-2 text-2xl font-bold text-primary">
            <FileText className="w-6 h-6 text-primary" />
            <span>AI Legal Document Generator</span>
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
              onClick={resetForm}
              className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
          <div className="p-6">
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-6"
            >
              <motion.div layout>
                <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
                  Document Type
                </label>
                <select
                  id="documentType"
                  {...register("documentType", { required: "Document type is required" })}
                  className="block w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Document Type</option>
                  <option value="Rent Agreement">Rent Agreement</option>
                  <option value="Employment Contract">Employment Contract</option>
                  <option value="Non-Disclosure Agreement">Non-Disclosure Agreement</option>
                  <option value="Will">Will</option>
                  <option value="Other">Other</option>
                </select>
                {errors.documentType && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.documentType.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div layout>
                <label htmlFor="partyA" className="block text-sm font-medium text-gray-700">
                  Party A (First Party)
                </label>
                <input
                  type="text"
                  id="partyA"
                  {...register("partyA", { required: "Party A is required" })}
                  className="block w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
                {errors.partyA && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.partyA.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div layout>
                <label htmlFor="partyB" className="block text-sm font-medium text-gray-700">
                  Party B (Second Party)
                </label>
                <input
                  type="text"
                  id="partyB"
                  {...register("partyB", { required: "Party B is required" })}
                  className="block w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
                {errors.partyB && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.partyB.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div layout>
                <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700">
                  Additional Details
                </label>
                <textarea
                  id="additionalDetails"
                  {...register("additionalDetails", { required: "Additional details are required" })}
                  placeholder="Enter any additional terms, conditions, or relevant information for the document..."
                  className="block w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary min-h-[100px]"
                />
                {errors.additionalDetails && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.additionalDetails.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div layout>
                <label htmlFor="specificDetails" className="block text-sm font-medium text-gray-700">
                  {selectedDocumentType ? `Specific Details for ${selectedDocumentType}` : 'Specific Details'}
                </label>
                <textarea
                  id="specificDetails"
                  {...register("specificDetails", { required: "Specific details are required" })}
                  placeholder={getPlaceholderForDocumentType(selectedDocumentType)}
                  className="block w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary min-h-[100px]"
                />
                {errors.specificDetails && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.specificDetails.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex items-center justify-center w-full px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5 mr-2" />
                )}
                {loading ? 'Generating...' : 'Generate Document'}
              </motion.button>
            </motion.form>

            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center p-4 mt-4 space-x-2 text-red-700 bg-red-100 border border-red-400 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>{apiError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 mt-6 space-y-4 border-2 border-gray-200 rounded-lg"
              >
                <div className="w-full h-5 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="w-3/4 h-5 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="w-1/2 h-5 bg-gray-200 rounded-md animate-pulse"></div>
              </motion.div>
            )}

            <AnimatePresence>
              {!loading && documentContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6"
                >
                  <div
                    className="p-6 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-auto max-h-[60vh]"
                  >
                    <ReactMarkdown>{documentContent}</ReactMarkdown>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownloadDocx}
                      className="flex items-center justify-center flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-secondary hover:bg-secondary/90"
                    >
                      <File className="w-5 h-5 mr-2" />
                      Download DOCX
                    </motion.button>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-center mt-4 space-x-2 text-green-600"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Document generated successfully!</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const getPlaceholderForDocumentType = (documentType: DocumentType | undefined): string => {
  switch (documentType) {
    case 'Rent Agreement':
      return 'Enter details such as property address, rent amount, lease term, security deposit...';
    case 'Employment Contract':
      return 'Enter details such as job title, salary, start date, working hours, benefits...';
    case 'Non-Disclosure Agreement':
      return 'Enter details such as confidential information definition, duration of agreement, permitted uses...';
    case 'Will':
      return 'Enter details such as beneficiaries, assets to be distributed, executor...';
    case 'Other':
    default:
      return 'Enter specific details relevant to this document type...';
  }
};

export default React.memo(LegalDocumentGenerator);