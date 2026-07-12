from pgvector.sqlalchemy import Vector
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)


def init_tables():
    """Create all required tables on startup."""
    with engine.connect() as conn:
        # User documents table — tracks which user uploaded which document
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS user_documents (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                document_id TEXT NOT NULL UNIQUE,
                file_name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """))

        # Chat logs table — scoped per user
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS chat_logs (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                document_id TEXT NOT NULL,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """))

        # ── Schema migrations ──────────────────────────────────────
        # If tables existed before the user_id column was introduced,
        # we need to add the missing columns.
        migrations = [
            ("chat_logs", "user_id", "TEXT"),
            ("chat_logs", "document_id", "TEXT"),
            ("user_documents", "user_id", "TEXT"),
        ]
        for table, column, col_type in migrations:
            exists = conn.execute(text("""
                SELECT 1 FROM information_schema.columns
                WHERE table_name = :table AND column_name = :column
            """), {"table": table, "column": column}).fetchone()
            if not exists:
                conn.execute(text(f"""
                    ALTER TABLE {table} ADD COLUMN {column} {col_type}
                """))
                print(f"  ✓ Added missing column {table}.{column}")

        conn.commit()


def store_user_document(user_id, document_id, file_name):
    """Register a document upload for a specific user."""
    with engine.connect() as conn:
        conn.execute(
            text("""
                INSERT INTO user_documents (user_id, document_id, file_name)
                VALUES (:user_id, :document_id, :file_name)
            """),
            {
                "user_id": user_id,
                "document_id": document_id,
                "file_name": file_name,
            }
        )
        conn.commit()


def get_user_documents(user_id):
    """Fetch all documents uploaded by a specific user."""
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT document_id, file_name, created_at
                FROM user_documents
                WHERE user_id = :user_id
                ORDER BY created_at DESC
            """),
            {"user_id": user_id}
        )
        rows = result.fetchall()

    return [
        {
            "document_id": row[0],
            "file_name": row[1],
            "created_at": row[2].isoformat() if row[2] else None,
        }
        for row in rows
    ]


def verify_document_ownership(user_id, document_id):
    """Check if a document belongs to a specific user."""
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT COUNT(*) FROM user_documents
                WHERE user_id = :user_id AND document_id = :document_id
            """),
            {"user_id": user_id, "document_id": document_id}
        )
        count = result.scalar()
    return count > 0


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


def log_chat(user_id, document_id, question, answer):
    """Log a chat exchange scoped to a user."""
    with engine.connect() as conn:
        conn.execute(
            text("""
                INSERT INTO chat_logs (user_id, document_id, question, answer)
                VALUES (:user_id, :document_id, :question, :answer)
            """),
            {
                "user_id": user_id,
                "document_id": document_id,
                "question": question,
                "answer": answer,
            }
        )
        conn.commit()


def get_user_chats(user_id, document_id=None, limit=50):
    """Fetch chat history for a user, optionally scoped to a document."""
    with engine.connect() as conn:
        if document_id:
            result = conn.execute(
                text("""
                    SELECT document_id, question, answer, created_at
                    FROM chat_logs
                    WHERE user_id = :user_id AND document_id = :document_id
                    ORDER BY created_at ASC
                    LIMIT :limit
                """),
                {"user_id": user_id, "document_id": document_id, "limit": limit}
            )
        else:
            result = conn.execute(
                text("""
                    SELECT document_id, question, answer, created_at
                    FROM chat_logs
                    WHERE user_id = :user_id
                    ORDER BY created_at DESC
                    LIMIT :limit
                """),
                {"user_id": user_id, "limit": limit}
            )

        rows = result.fetchall()

    return [
        {
            "document_id": row[0],
            "question": row[1],
            "answer": row[2],
            "created_at": row[3].isoformat() if row[3] else None,
        }
        for row in rows
    ]
