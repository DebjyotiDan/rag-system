from services.embedding import (
    generate_query_embedding
)

from services.vectordb import (
    search_similar_chunks
)

from services.rag_chain import (
    generate_answer
)


document_id = "doc_x"

query = f"summarise the whole document {document_id}"


# Generate query embedding
query_embedding = generate_query_embedding(query)


# Retrieve similar chunks
retrieved_chunks = search_similar_chunks(
    query_embedding=query_embedding,
    document_id=document_id,
    top_k=5
)

print("\n===== RETRIEVED CHUNKS =====\n")

for i, chunk in enumerate(retrieved_chunks, start=1):
    print(f"Chunk {i}:\n")
    print(chunk)
    print("\n-------------------\n")


# Generate final answer
answer = generate_answer(
    query=query,
    retrieved_chunks=retrieved_chunks
)

print("\n===== FINAL ANSWER =====\n")

print(answer)