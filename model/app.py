#importing modules
from services.pdfloader import extract_text
from services.chunker import chunk_text
from services.embedding import generate_embeddings
from services.vectordb import store_embeddings


#PDF extracted from Supabase bucket via url
pdf_path = ""  
document_id = ""

#Extracting chunks from PDF
full_text = extract_text(pdf_path)
print("Text Extracted")

#Generating chunks with overlap
chunks = chunk_text(full_text)
print("Chunks are created")

#Generating embeddings
embeddings = generate_embeddings(chunks)
print("Embeddings created")

#store embeddings in db
store_embeddings(
    document_id,
    chunks,
    embeddings
)
print("Embedding stored in DB succesfully")
