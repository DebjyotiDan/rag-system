from services.pdfloader import extract_text
from services.chunker import chunk_text
from services.embedding import generate_embeddings
from services.vectordb import store_embeddings

#test pdf
pdf_path = "/home/arnav/Desktop/Computer_Organization_Memory_and_Cache_Notes.pdf"
document_id = "doc_1"


text = extract_text(pdf_path)

print("\nExtracted Text")
print(text[:100])


chunks = chunk_text(text)

print(f"Length is {len(chunks)} ")

print("---------------------")
print(chunks[0])


test_chunk = [chunks[0]]
embeddings = generate_embeddings(test_chunk)

print("================= Embeddings =================")
print("\nEmbedding Shape:")
print(embeddings.shape)
print("\nFirst Embedding:")
print(embeddings[0])



store_embeddings(
    document_id,
    test_chunk,
    embeddings
)
print("Embedding stored in DB succesfully")
