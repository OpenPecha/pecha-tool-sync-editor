import { useEditor } from "@/contexts/EditorContext";
import { GrDocumentTxt, GrDocumentWord } from "react-icons/gr";
import * as quillToWord from "quill-to-word";
function ExportButton({ doc_id }: { readonly doc_id: string }) {
  const { getQuill } = useEditor();
  const quill = getQuill(doc_id);
  const exportText = () => {
    if (quill) {
      const text = quill.getText();
      const blob = new Blob([text], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "exported_text.txt";
      a.click();
      URL.revokeObjectURL(a.href);
    }
  };

  const exportWord = async () => {
    if (quill) {
      const content = quill.getContents();
      const quillToWordConfig = {
        exportAs: "blob",
      };
      const blob = await quillToWord.generateWord(content, quillToWordConfig);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "exported_text.docx";
      a.click();
      URL.revokeObjectURL(a.href);
    }
  };

  return (
    <>
      <button onClick={exportText}>
        <GrDocumentTxt />
      </button>
      <button onClick={exportWord}>
        <GrDocumentWord />
      </button>
    </>
  );
}

export default ExportButton;
