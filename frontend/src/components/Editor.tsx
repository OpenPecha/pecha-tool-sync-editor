import React, { useContext, useEffect, useId, useRef, useState } from "react";
import Quill from "quill";
import { QuillBinding } from "y-quill";
import { useAuth } from "../contexts/AuthContext";
import YjsContext from "../lib/yjsProvider";
import Toolbar from "./Toolbar";
import Permissions from "./Permissions";
import "quill/dist/quill.snow.css";
import quill_import from "./quillExtension";
import { createComment, fetchComments } from "../api/comment";
import Comments from "./Comments";
import OverlayLoading from "./OverlayLoading";
import { createSuggest, fetchSuggests } from "../api/suggest";
quill_import();

function Editor({ documentId,isEditable }:{documentId:string,isEditable:boolean}) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const toolbarId = "toolbar-container"+"-"+Math.random().toString(36).substring(7);
  const counterId = "counter-container"+"-"+Math.random().toString(36).substring(7);

  const { clearYjsProvider, toggleConnection, online, yText, yjsProvider } = useContext(YjsContext);
  const { currentUser } = useAuth();
  const [synced, setSynced] = useState(false);
  const [comments, setComments] = useState([]); // 🔥 Store comments in Editor
  const [suggestions, setSuggestions] = useState([]); // 🔥 Store comments in Editor

  useEffect(() => {
    const quill = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: { container: `#${toolbarId}` },
        cursors: { transformOnTextChange: false },
        history: { delay: 2000, maxStack: 500 },
        counter: { container: `#${counterId}`, unit: "character" },
      
      },
      readOnly: !isEditable,
      placeholder: "Start collaborating...",

    });

    quillRef.current = quill;
    new QuillBinding(yText, quill, yjsProvider?.awareness);

    yjsProvider?.on("sync", (isSynced) => {
      setSynced(isSynced);
    });

    // Fetch comments when the editor loads
    loadComments();
    loadSuggestions();
    return () => {
      clearYjsProvider();
    };
  }, []);

  // 🔥 Fetch comments
  const loadComments = async () => {
    try {
      const data = await fetchComments(documentId);
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const loadSuggestions = async () => {
    try {
      const data = await fetchSuggests(documentId);
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  // 🔥 Add a new comment
  async function addComment() {
    const range = quillRef.current.getSelection();
    if (!range) return;

    const commentText = prompt("Enter your comment");
    if (!commentText) return;

    const end = range.index + range.length;

    try {
      const createdComment = await createComment(documentId, currentUser.id, commentText, range.index, end);
      
      if (createdComment.id) {
        // 🔥 Update the Quill editor to highlight the text
        quillRef.current.formatText(range.index, range.length, "comment", {
          id: createdComment.id,
          suggestions:suggestions
        });

        // 🔥 Update the comments list dynamically
        setComments((prev) => [createdComment, ...prev]); // Add new comment to the top
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }
  async function addSuggestion() {
    const range = quillRef.current.getSelection();
    if (!range) return;

    const suggestion = prompt("Enter your suggestion");
    if (!suggestion) return;

    const end = range.index + range.length;
    const id= Math.random().toString(36).substring(7);
    const threadId=id;
    try {
      const createdSuggestion = await createSuggest(threadId,documentId, currentUser.id, suggestion, range.index, end);
      if (createdSuggestion.id) {
        // 🔥 Update the Quill editor to highlight the text
        quillRef.current.formatText(range.index, range.length, "suggest", {
          id: threadId,
        });

        // 🔥 Update the comments list dynamically
        // setComments((prev) => [createdComment, ...prev]); // Add new comment to the top
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }
  return (
    <div className="flex w-full flex-1 h-full overflow-scroll">
      <div className="editor-container">
        <div className="flex justify-between items-center mb-3">
        <div>online: {synced ? "🟢" : "🔴"}</div>
        <Permissions documentId={documentId} />
        </div>
        <Toolbar id={toolbarId} addComment={addComment} addSuggestion={addSuggestion} />
        {/* <OverlayLoading isLoading={!synced}/> */}
        <div className="relative max-h-[calc(100vh-100px)] overflow-y-auto">
          <div ref={editorRef} style={{  marginTop: "10px",fontFamily:"Monlam",fontSize:18}} />
          <div id={`${counterId}`}>0 characters</div>
        </div>
      </div>

      {/* 🔥 Pass comments and update function to Comments */}
      {/* <div className="comment-container w-1/4">
        <Comments  comments={comments}  />
      </div> */}
    </div>
  );
}

export default Editor;
