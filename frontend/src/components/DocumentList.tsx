import  { useState, useEffect } from 'react';
import { fetchDocuments } from '../api/document';
import { CiCirclePlus } from 'react-icons/ci';
import EachDocument from './EachDocument';
import DocumentCreateModal from './DocumentCreateModal';

interface Document {
  id: string;
  identifier: string;
  isRoot: boolean;
  rootId: string | null;
  updatedAt: string;
}



const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await fetchDocuments();
        setDocuments(docs);
        setIsLoading(false);
      } catch (e) {
        setError('Failed to fetch documents');
        setIsLoading(true);
        console.error('Error fetching documents:', e);
      }
    };
    fetchDocs();
  }, []);

 

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-4">Loading documents...</div>;
    }
    
    if (documents.length === 0) {
      return (
        <div className="text-center py-8">
          <p>You don't have any documents yet. Create one to get started!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map(doc => (
          <EachDocument 
            key={doc.id} 
            doc={doc} 
            setDocuments={setDocuments}
            documents={documents}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 pb-3">
        <h1 className="text-2xl font-bold">Pechas</h1>
        <button className="flex gap-2 items-center rounded-xl uppercase" onClick={() => setShowCreateModal(true)}>
          <CiCirclePlus size={30}/>
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {renderContent()}
      {showCreateModal && (
       <DocumentCreateModal
       documents={documents}
       setShowCreateModal={setShowCreateModal}
       />
      )}
    </div>
  );
};


export default DocumentList;