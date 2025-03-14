import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createDocument, deleteDocument, fetchDocuments } from '../api/document';
import { MdDelete } from "react-icons/md";
import { CiCirclePlus } from 'react-icons/ci';


const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDocIdentifier, setNewDocIdentifier] = useState('');
  const navigate = useNavigate();

 

  useEffect(() => {
    async function fetch(){
      try{
        let documents = await fetchDocuments();
        setDocuments(documents)
        setIsLoading(false)
      }catch(e){
        setError('Failed to fetch documents')
        setIsLoading(true)
      }
    }
    fetch();
  }, []);

  const createDoc = async () => {
    if (!newDocIdentifier) {
      return;
    }

    try {
     createDocument(newDocIdentifier).then(
      response=>{
        setNewDocIdentifier('');
        setShowCreateModal(false);
        navigate(`/documents/${response.id}`);
      }
     ).catch(e=>{console.log(e)
      const data = e.response.data;
      setError(data.detail || 'Failed to create document');
     })

    } catch (error) {
      console.error('Error creating document:', error);
      setError('Network error');
    }
  };
  
  

  return (
    <div className="document-list-container ">
      <div className="flex gap-2 pb-3">
        <h1 >My Pechas</h1>
        <button className="flex gap-2 items-center rounded-xl uppercase" onClick={() => setShowCreateModal(true)}>
        <CiCirclePlus  size={30}/>
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="no-documents">
          <p>You don't have any documents yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="document-grid">
          {documents.map(doc => (
            <EachDocument doc={doc} key={doc.id} setDocuments={setDocuments}/>
          ))}
        </div>
      )}

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Document</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="docIdentifier">Document Identifier</label>
                <input
                  type="text"
                  id="docIdentifier"
                  value={newDocIdentifier}
                  onChange={(e) => setNewDocIdentifier(e.target.value)}
                  placeholder="Enter document identifier"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={createDoc} disabled={!newDocIdentifier}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


function EachDocument({doc,setDocuments}){

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent navigation
        e.stopPropagation();
     let permission= confirm(' delete the document ?')
      if(permission){
        try{ 
          let deleted=await deleteDocument(doc.id)
          if(deleted?.id){
            setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
          }
        }
        catch(e){ console.log(e)}
  };
};

return <div>
  <Link to={`/documents/${doc.id}`} className="document-card" key={doc.id}>
<div className="document-card-header">
  <h3 className='text-xl font-semibold capitalize'>{doc.identifier}</h3>
<button onClick={handleDelete}   className="z-20 p-2 rounded-md transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-110"
  ><MdDelete/></button>
</div>
<div className="document-card-footer">
  <span className="document-date">
    Last updated: {formatDate(doc.updatedAt)}
  </span>
</div>
</Link>
</div>

}


export default DocumentList;
