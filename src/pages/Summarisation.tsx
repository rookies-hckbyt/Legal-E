import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  Upload, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  FileText
} from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const steps: Step[] = [
  {
    title: "Upload Document",
    description: "Select or drag & drop your legal document",
    icon: Upload
  },
  {
    title: "AI Processing",
    description: "Our AI analyzes and extracts key information",
    icon: Scale
  },
  {
    title: "Review Summary",
    description: "Get a concise summary of your document",
    icon: FileText
  }
];

const DocumentSummarizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setActiveStep(1);
      processDocument(selectedFile);
    }
  };

  const processDocument = async (selectedFile: File) => {
    setIsProcessing(true);
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    setSummary(`CASE SUMMARY - ${selectedFile.name}

KEY POINTS:
1. Contract dispute between Tech Corp and Innovation Ltd
2. Breach of service agreement dated June 1, 2023
3. Damages claimed: $500,000

COURT'S DECISION:
- Partial summary judgment granted
- Tech Corp liable for breach of contract
- Damages reduced to $350,000

REASONING:
The court found substantial evidence of contract breach but determined that some claimed damages were speculative.

IMPLICATIONS:
1. Sets precedent for similar tech service agreements
2. Emphasizes importance of clear deliverable timelines
3. Highlights damage calculation methodology

NEXT STEPS:
- Appeal period: 30 days from judgment
- Payment schedule to be determined
- Parties to meet for settlement conference`);
    setIsProcessing(false);
    setActiveStep(2);
  };

  const resetForm = () => {
    setFile(null);
    setSummary('');
    setActiveStep(0);
    setIsProcessing(false);
  };

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
            <Scale className="w-6 h-6 text-primary" />
            <span>Legal Document Summarizer</span>
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
              onClick={resetForm}
              className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
          <div className="p-6">
            {/* Steps */}
            <div className="grid gap-4 mb-8 md:grid-cols-3">
              <AnimatePresence>
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      activeStep === index 
                        ? 'border-primary bg-primary/5' 
                        : activeStep > index 
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <step.icon className={`w-6 h-6 ${
                          activeStep === index ? 'text-primary' : 
                          activeStep > index ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <span className={`text-lg font-semibold ${
                          activeStep === index ? 'text-primary' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                      {activeStep > index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Main Content */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* Left Panel - Upload */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl"
              >
                <h2 className="mb-4 text-xl font-semibold text-primary">Upload Document</h2>
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="p-8 text-center transition-colors border-2 border-dashed rounded-lg cursor-pointer border-primary/30 hover:bg-gray-50"
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <p className="mb-4 text-gray-600">Drag and drop your document here or</p>
                  <label className="px-4 py-2 text-white transition-colors rounded-lg cursor-pointer bg-primary hover:bg-primary/90">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                  <p className="mt-4 text-sm text-gray-500">Supported formats: PDF, DOC, DOCX, TXT</p>
                </motion.div>

                <AnimatePresence>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between p-4 mt-4 rounded-lg bg-primary/5"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-gray-700">{file.name}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-primary" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Right Panel - Summary */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl"
              >
                <h2 className="mb-4 text-xl font-semibold text-primary">Document Summary</h2>
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-64"
                    >
                      <div className="w-16 h-16 border-4 rounded-full border-primary border-t-transparent animate-spin" />
                      <p className="mt-4 text-gray-600">Analyzing document...</p>
                    </motion.div>
                  ) : summary ? (
                    <motion.div
                      key="summary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <motion.div 
                        className="p-4 overflow-y-auto font-mono text-sm rounded-lg bg-gray-50 max-h-64"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                      >
                        <pre className="whitespace-pre-wrap">{summary}</pre>
                      </motion.div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const blob = new Blob([summary], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'summary.txt';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
                      >
                        <Download className="w-5 h-5" />
                        Download Summary
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-64 text-gray-400"
                    >
                      <AlertCircle className="w-12 h-12 mb-2" />
                      <p>Upload a document to see the summary</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentSummarizer;