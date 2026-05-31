from pgvector.sqlalchemy import Vector
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)


def store_embeddings(document_id, chunks, embeddings):

    with engine.connect() as conn:

        for i, (chunk, embedding) in enumerate(
            zip(chunks, embeddings)
        ):

            embedding_list = embedding.tolist()

            query = text("""
                INSERT INTO document_chunks
                (
                    document_id,
                    chunk_index,
                    content,
                    embedding
                )
                VALUES
                (
                    :document_id,
                    :chunk_index,
                    :content,
                    :embedding
                )
            """)

            conn.execute(
                query,
                {
                    "document_id": document_id,
                    "chunk_index": i,
                    "content": chunk,
                    "embedding": embedding_list
                }
            )

        conn.commit()

    
def search_similar_chunks(
    query_embedding,
    document_id,
    top_k=5
):

    query_embedding_str = (
        "[" + ",".join(map(str, query_embedding)) + "]"
    )

    query = text("""
        SELECT
            content
        FROM document_chunks
        WHERE document_id = :document_id
        ORDER BY embedding <-> CAST(:query_embedding AS vector)
        LIMIT :top_k
    """)

    with engine.connect() as conn:

        result = conn.execute(
            query,
            {
                "document_id": document_id,
                "query_embedding": query_embedding_str,
                "top_k": top_k
            }
        )

        rows = result.fetchall()

    return [row[0] for row in rows]
