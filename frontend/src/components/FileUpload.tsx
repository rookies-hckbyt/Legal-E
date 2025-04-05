import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import * as w3up from '@web3-storage/w3up-client';

interface FileMetadata {
    fileName: string;
    cid: string;
    walletAddress: string;
}

export interface UploadedFile {
    name: string;
    cid: string;
    size: number;
    type?: string;
    uploadedAt: Date;
    txHash: string;
}

interface FileUploadProps {
    walletAddress?: string;
    onFileUploaded?: (file: UploadedFile) => void;
    isWalletConnected?: boolean;
}

// Interface for log messages
interface LogMessage {
    type: 'info' | 'error' | 'success';
    message: string;
    timestamp: Date;
    data?: any;
}

const FileUpload: React.FC<FileUploadProps> = ({
    walletAddress = 'addr_test1qz5uw8mt5npnx5z5eu5gx6f8aspncqpzql5qt4a2zlt7au04unfk4zva5dtxzmvq5x2y6790daclgmw9ykl7jzcfn8qwt9wfa',
    onFileUploaded,
    isWalletConnected = false
}) => {
    const [client, setClient] = useState<any>(null);
    const [clientError, setClientError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [contractCallStatus, setContractCallStatus] = useState<{
        success: boolean;
        message: string;
        txHash?: string;
    } | null>(null);
    const [showDebugConsole, setShowDebugConsole] = useState(false);
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Custom logger function
    const logger = useCallback((type: 'info' | 'error' | 'success', message: string, data?: any) => {
        // Log to browser console
        if (type === 'error') {
            console.error(message, data);
        } else if (type === 'info') {
            console.log(message, data);
        } else {
            console.log(`%c${message}`, 'color: green', data);
        }

        // Add to our logs state
        setLogs(prev => [...prev, {
            type,
            message,
            timestamp: new Date(),
            data
        }]);
    }, []);

    // Auto-scroll logs to bottom
    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    // Initialize IPFS client
    useEffect(() => {
        const initClient = async () => {
            try {
                // Clear any previous errors
                setClientError(null);

                logger('info', 'Initializing IPFS client...');

                // For demonstration purposes, we'll simulate the IPFS client
                // In a real app, you would use proper authentication and setup

                // Simulate the client functionality
                const mockClient = {
                    uploadFile: async (file: File) => {
                        // Simulate upload delay
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        // Generate a mock CID
                        const mockCid = 'bafybeig' +
                            Array.from({ length: 44 }, () =>
                                Math.floor(Math.random() * 36).toString(36)).join('');

                        logger('success', `File uploaded to IPFS with CID: ${mockCid}`);

                        return {
                            toString: () => mockCid
                        };
                    }
                };

                // Set the mock client
                setClient(mockClient);
                logger('success', 'IPFS client initialized successfully (mock mode)');

                /* 
                // This is how you would use the actual w3up client
                const c = await w3up.create();
                const space = await c.createSpace('file-upload-demo');
                await c.setCurrentSpace(space.did());
                setClient(c);
                */

            } catch (error) {
                logger('error', 'Failed to initialize IPFS client:', error);
                setClientError('Failed to initialize IPFS client. Using fallback mode.');
            }
        };

        initClient();
    }, [logger]);

    // Handle file drop
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!client || acceptedFiles.length === 0 || !isWalletConnected) return;

        setUploading(true);
        setContractCallStatus(null);

        try {
            const file = acceptedFiles[0];
            logger('info', `Processing file: ${file.name} (${file.size} bytes)`);

            // Upload to IPFS
            logger('info', 'Uploading file to IPFS...');
            const cid = await client.uploadFile(file);
            const cidString = cid.toString();

            // Generate transaction hash
            const metadata = {
                fileName: file.name,
                cid: cidString,
                walletAddress,
            };
            logger('info', 'Preparing blockchain transaction with metadata:', metadata);

            const txHash = await storeFileMetadataOnChain(metadata);

            // Create uploaded file object
            const newFile: UploadedFile = {
                name: file.name,
                cid: cidString,
                size: file.size,
                type: file.type,
                uploadedAt: new Date(),
                txHash
            };

            // Update local state
            setUploadedFiles(prev => [newFile, ...prev]);
            logger('success', 'File processing complete:', newFile);

            // Notify parent component
            if (onFileUploaded) {
                onFileUploaded(newFile);
            }

        } catch (error) {
            logger('error', 'Upload failed:', error);
            setContractCallStatus({
                success: false,
                message: 'Error uploading file or storing metadata on chain.',
            });
        } finally {
            setUploading(false);
        }
    }, [client, walletAddress, isWalletConnected, onFileUploaded, logger]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt']
        },
        multiple: false
    });

    /**
     * Simulates a call to the Midnight blockchain Compact contract
     * In a real implementation, this would use the Midnight SDK to interact with the contract
     */
    const storeFileMetadataOnChain = async (metadata: FileMetadata): Promise<string> => {
        logger('info', "Simulating Compact contract call:", metadata);

        // Simulate network delay
        logger('info', "Waiting for blockchain confirmation...");
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate a mock transaction hash
        const txHash = '0x' + Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)).join('');

        // In a real implementation, you would call something like:
        // const result = await midnightClient.callContract({
        //   contract: 'file_storage_contract',
        //   entryPoint: 'store_file',
        //   args: [metadata.fileName, metadata.cid],
        //   sender: metadata.walletAddress,
        // });

        logger('success', `Transaction confirmed! Hash: ${txHash}`);

        // Set status with success message
        setContractCallStatus({
            success: true,
            message: '✅ File metadata saved to Midnight chain!',
            txHash
        });

        return txHash;
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Debug toggle button */}
            <div className="flex justify-end mb-2">
                <button
                    onClick={() => setShowDebugConsole(prev => !prev)}
                    className="text-xs text-gray-500 flex items-center hover:text-gray-700"
                >
                    <span className="mr-1">{showDebugConsole ? '🔽 Hide' : '🔼 Show'} Debug Console</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 ml-1 text-xs font-semibold rounded-full bg-gray-200">
                        {logs.length}
                    </span>
                </button>
            </div>

            {/* Debug console */}
            {showDebugConsole && (
                <div className="mb-4 border border-gray-300 rounded-md overflow-hidden">
                    <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex justify-between items-center">
                        <div className="font-mono text-sm text-gray-700">Debug Console</div>
                        <button
                            onClick={() => setLogs([])}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            Clear
                        </button>
                    </div>
                    <div className="bg-gray-900 text-gray-100 font-mono text-xs p-2 h-48 overflow-y-auto">
                        {logs.length === 0 ? (
                            <div className="text-gray-500 italic">No logs yet</div>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="mb-1">
                                    <span className="text-gray-500">
                                        [{log.timestamp.toLocaleTimeString()}]
                                    </span>{' '}
                                    <span className={
                                        log.type === 'error' ? 'text-red-400' :
                                            log.type === 'success' ? 'text-green-400' :
                                                'text-blue-400'
                                    }>
                                        {log.type.toUpperCase()}:
                                    </span>{' '}
                                    <span>{log.message}</span>
                                    {log.data && (
                                        <pre className="ml-6 text-gray-400 whitespace-pre-wrap">{
                                            typeof log.data === 'object'
                                                ? JSON.stringify(log.data, null, 2)
                                                : String(log.data)
                                        }</pre>
                                    )}
                                </div>
                            ))
                        )}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            )}

            {/* Client error message */}
            {clientError && (
                <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded border border-yellow-200">
                    <p>{clientError}</p>
                    <p className="text-xs mt-1">Using simulated IPFS functionality.</p>
                </div>
            )}

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    } ${!isWalletConnected || !client ? 'opacity-50' : ''}`}
            >
                <input {...getInputProps()} disabled={!isWalletConnected || !client} />
                {uploading ? (
                    <p className="text-gray-500">Uploading...</p>
                ) : isDragActive ? (
                    <p className="text-blue-500">Drop the file here...</p>
                ) : (
                    <div>
                        <p className="text-gray-500 mb-2">Drag and drop a file here, or click to select</p>
                        <p className="text-xs text-gray-400">Supported formats: PDF, DOC, DOCX, TXT</p>
                        {!isWalletConnected && (
                            <p className="text-xs text-red-500 mt-2">Please connect your wallet to upload files</p>
                        )}
                        {!client && isWalletConnected && (
                            <p className="text-xs text-yellow-500 mt-2">Initializing upload service...</p>
                        )}
                    </div>
                )}
            </div>

            {/* Contract call status */}
            {contractCallStatus && (
                <div className={`mt-4 p-3 rounded ${contractCallStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                    <p>{contractCallStatus.message}</p>
                    {contractCallStatus.txHash && (
                        <p className="text-sm mt-1">
                            🔗 TX Hash: <span className="font-mono">{contractCallStatus.txHash.substring(0, 10)}...</span>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUpload; 