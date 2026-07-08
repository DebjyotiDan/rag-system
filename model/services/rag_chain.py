import os

from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_answer(query, retrieved_chunks):

    context = "\n\n".join(retrieved_chunks)

    prompt = f"""
You are a PDF assistant.

Answer ONLY from the provided context.

If the answer is not found,
say:
"I could not find this in the document."

Context:
{context}

Question:
{query}
"""
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )
    except Exception as e:
        print(f"Error generating answer: {e}")
        return "I could not find this in the document."
   

    return response.text