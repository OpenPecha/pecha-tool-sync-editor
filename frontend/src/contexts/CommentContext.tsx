import { fetchCommentsByThreadId } from "@/api/comment";
import emitter from "@/services/eventBus";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";

interface Position {
  top: number;
  left: number;
}

interface Comment {
  id: string;
  docId: string;
  threadId: string;
  initial_start_offset: number;
  initial_end_offset: number;
  user: { id: string; username: string };
  content: string;
  createdAt: string;
  suggested_text?: string;
}

interface CommentContextType {
  isModalOpen: boolean;
  position: Position;
  commentThread: Comment[] | null;
  setIsModalOpen: (isOpen: boolean) => void;
}

const CommentContext = createContext<CommentContextType | null>(null);

interface CommentProviderProps {
  children: ReactNode;
}

export const CommentProvider = ({ children }: CommentProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [commentThread, setCommentThread] = useState<Comment[] | null>(null);

  const value = useMemo(
    () => ({
      isModalOpen,
      position,
      commentThread,
      setIsModalOpen,
    }),
    [isModalOpen, position, commentThread]
  );

  useEffect(() => {
    const openHandler = (data: { position: Position; id: string }) => {
      setIsModalOpen(true);
      setPosition(data.position);
      fetchCommentsByThreadId(data.id).then((comments) => {
        setCommentThread(comments);
      });
    };

    emitter?.on("showCommentBubble", openHandler);

    return () => {
      emitter?.off("showCommentBubble", openHandler);
    };
  }, []);

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};

export const useComment = (): CommentContextType => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComment must be used within a CommentProvider");
  }
  return context;
};
