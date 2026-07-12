from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, HTTPException
from services.embedding import generate_query_embedding
from services.vectordb import (
    search_similar_chunks,
    log_chat,
    verify_document_ownership,
    get_user_documents,
    get_user_chats,
)
from services.rag_chain import generate_answer

class QueryRequest(BaseModel):
    question: str
    document_id: str
    user_id: str

router = APIRouter()

@router.post("/chat")
def chat(query_req: QueryRequest):
    try:
        # Verify document ownership
        if not verify_document_ownership(query_req.user_id, query_req.document_id):
            raise HTTPException(
                status_code=403,
                detail="You do not have access to this document."
            )

        # Generate embedding for the user's question
        query_embedding = generate_query_embedding(query_req.question)

        # Search for similar chunks scoped to this document
        retrieved_chunks = search_similar_chunks(
            query_embedding=query_embedding,
            document_id=query_req.document_id,
            top_k=5
        )

        if not retrieved_chunks:
            answer = "I could not find relevant information in the document."
        else:
            # Generate answer using LLM with retrieved context
            answer = generate_answer(
                query=query_req.question,
                retrieved_chunks=retrieved_chunks
            )

        # Log the chat exchange to the database
        try:
            log_chat(
                user_id=query_req.user_id,
                document_id=query_req.document_id,
                question=query_req.question,
                answer=answer
            )
        except Exception as log_err:
            # Don't fail the response if logging fails
            print(f"Chat logging failed: {log_err}")

        return {"answer": answer}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/documents/{user_id}")
def get_documents(user_id: str):
    """Get all documents for a user."""
    try:
        docs = get_user_documents(user_id)
        return {"documents": docs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chats/{user_id}")
def get_chats(user_id: str, document_id: Optional[str] = None):
    """Get chat history for a user, optionally filtered by document."""
    try:
        chats = get_user_chats(user_id, document_id)
        return {"chats": chats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))