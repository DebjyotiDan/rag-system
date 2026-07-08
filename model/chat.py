
import sys
import os
import hashlib
import time

from services.pdfloader import extract_text
from services.chunker import chunk_text
from services.embedding import generate_embeddings, generate_query_embedding
from services.vectordb import store_embeddings, search_similar_chunks
from services.rag_chain import generate_answer


def create_document_id(pdf_path):
    """Create a unique document ID from the file path + timestamp."""
    basename = os.path.basename(pdf_path)
    name, _ = os.path.splitext(basename)
    # Use a short hash of path + time to ensure uniqueness
    unique_hash = hashlib.md5(
        f"{pdf_path}_{time.time()}".encode()
    ).hexdigest()[:8]
    return f"{name}_{unique_hash}"


def ingest_pdf(pdf_path):
    """Full ingestion pipeline: extract → chunk → embed → store."""

    print(f"\n Loading PDF: {pdf_path}")
    text = extract_text(pdf_path)
    print(f"   Extracted {len(text)} characters")

    print("Chunking text...")
    chunks = chunk_text(text)
    print(f"   Created {len(chunks)} chunks")

    print("Generating embeddings...")
    embeddings = generate_embeddings(chunks)
    print(f"   Generated {len(embeddings)} embeddings")

    document_id = create_document_id(pdf_path)

    print(f" Storing in vector DB (doc_id: {document_id})...")
    store_embeddings(document_id, chunks, embeddings)
    print(" Stored successfully\n")

    return document_id


def chat_loop(document_id):
    """Interactive terminal chat loop."""

    print("=" * 55)
    print("  PDF Chat — Ask anything about your document")
    print("     Type 'quit' or 'exit' to end the session")
    print("=" * 55)
    print()

    while True:
        try:
            query = input("You: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\n Goodbye!")
            break

        if not query:
            continue

        if query.lower() in ("quit", "exit", "q"):
            print("\nGoodbye!")
            break

        # Retrieve relevant chunks
        query_embedding = generate_query_embedding(query)

        retrieved_chunks = search_similar_chunks(
            query_embedding=query_embedding,
            document_id=document_id,
            top_k=5
        )

        if not retrieved_chunks:
            print("\nAssistant: No relevant content found in the document.\n")
            continue

        # Generate answer from LLM
        answer = generate_answer(
            query=query,
            retrieved_chunks=retrieved_chunks
        )

        print(f"\n Assistant: {answer}\n")


def main():
    if len(sys.argv) < 2:
        print("Usage: python chat.py <path-to-pdf>")
        print("Example: python chat.py /home/user/documents/notes.pdf")
        sys.exit(1)

    pdf_path = sys.argv[1]

    if not os.path.isfile(pdf_path):
        print(f" File not found: {pdf_path}")
        sys.exit(1)

    if not pdf_path.lower().endswith(".pdf"):
        print(f"  Warning: '{pdf_path}' doesn't look like a PDF file.")
        confirm = input("Continue anyway? (y/n): ").strip().lower()
        if confirm != "y":
            sys.exit(0)

    # Ingest the PDF
    document_id = ingest_pdf(pdf_path)

    # Start chatting
    chat_loop(document_id)


if __name__ == "__main__":
    main()
