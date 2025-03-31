import { getHeaders } from "./utils";

const server_url = import.meta.env.VITE_SERVER_URL;

/**
 * Fetch all comments for a specific document
 * @param {string} docId - The document ID
 * @returns {Promise<any>} - The list of comments
 */
export const fetchComments = async (docId: string) => {
  try {
    const response = await fetch(`${server_url}/comments/${docId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch comments");

    return await response.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

/**
 * Fetch a specific comment by ID
 * @param {string} commentId - The comment ID
 * @returns {Promise<any>} - The comment data
 */
export const fetchComment = async (commentId: string) => {
  try {
    const response = await fetch(`${server_url}/comments/${commentId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch comment");

    return await response.json();
  } catch (error) {
    console.error("Error fetching comment:", error);
  }
};

export const fetchCommentsByThreadId = async (threadId: string) => {
  try {
    const response = await fetch(`${server_url}/comments/thread/${threadId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch comments");

    return await response.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

/**
 * Create a new comment
 * @param {string} docId - The document ID
 * @param {string} userId - The user ID
 * @param {string} content - The comment text
 * @param {number} startOffset - The initial start offset
 * @param {number} endOffset - The initial end offset
 * @param {boolean} [is_suggestion] - Whether this is a suggestion
 * @param {string} [suggested_text] - The suggested text (required if is_suggestion is true)
 * @param {string} [parentCommentId] - Optional parent comment ID (for replies)
 * @returns {Promise<any>} - The created comment
 */
export const createComment = async (
  docId: string,
  userId: string,
  content: string,
  startOffset: number,
  endOffset: number,
  threadId: string,
  is_suggestion?: boolean,
  suggested_text?: string,
  parentCommentId?: string
) => {
  try {
    const response = await fetch(`${server_url}/comments`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        docId,
        userId,
        content,
        initial_start_offset: startOffset,
        initial_end_offset: endOffset,
        threadId,
        is_suggestion,
        suggested_text,
        parentCommentId,
      }),
    });

    if (!response.ok) throw new Error("Failed to create comment");

    return await response.json();
  } catch (error) {
    console.error("Error creating comment:", error);
  }
};

/**
 * Update an existing comment
 * @param {string} commentId - The comment ID
 * @param {string} content - The updated content
 * @param {boolean} [is_suggestion] - Whether this is a suggestion
 * @param {string} [suggested_text] - The suggested text
 * @returns {Promise<any>} - The updated comment
 */
export const updateComment = async (
  commentId: string,
  content: string,
  is_suggestion?: boolean,
  suggested_text?: string
) => {
  try {
    const response = await fetch(`${server_url}/comments/${commentId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        content,
        is_suggestion,
        suggested_text,
      }),
    });

    if (!response.ok) throw new Error("Failed to update comment");

    return await response.json();
  } catch (error) {
    console.error("Error updating comment:", error);
  }
};

/**
 * Delete a comment
 * @param {string} commentId - The comment ID
 * @returns {Promise<void>}
 */
export const deleteComment = async (commentId: string) => {
  try {
    const response = await fetch(`${server_url}/comments/${commentId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to delete comment");
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};

/**
 * Create a suggestion comment
 * @param {string} docId - The document ID
 * @param {string} userId - The user ID
 * @param {string} content - The comment text explaining the suggestion
 * @param {number} startOffset - The initial start offset
 * @param {number} endOffset - The initial end offset
 * @param {string} suggested_text - The suggested replacement text
 * @returns {Promise<any>} - The created suggestion comment
 */
export const createSuggestion = async (
  docId: string,
  userId: string,
  content: string,
  startOffset: number,
  endOffset: number,
  suggested_text: string
) => {
  return createComment(
    docId,
    userId,
    content,
    startOffset,
    endOffset,
    true,
    suggested_text
  );
};
