from sentence_transformers import SentenceTransformer

_model = None


def _get_model():
    """Lazy-load the model on first use with ONNX backend for speed."""
    global _model
    if _model is None:
        try:
            _model = SentenceTransformer(
                "all-MiniLM-L6-v2",
                backend="onnx"
            )
        except Exception:
            # Fallback to default PyTorch if ONNX isn't available
            _model = SentenceTransformer(
                "all-MiniLM-L6-v2"
            )
    return _model


def generate_embeddings(chunks):

    embeddings = _get_model().encode(chunks)

    return embeddings


def generate_query_embedding(query):

    embedding = _get_model().encode(query)

    return embedding