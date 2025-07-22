from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np

class QARetriever:
    def __init__(self, csv_path='qa.csv'):
        self.df = pd.read_csv(csv_path)
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

        # Nettoyage + normalisation
        self.questions = [q.strip().lower() for q in self.df['question'].astype(str).tolist()]
        self.answers = [a.strip() for a in self.df['answer'].astype(str).tolist()]
        self.embeddings = self.model.encode(self.questions)

    def retrieve(self, query):
        query = query.strip().lower()
        if not self.embeddings.any():
            return "Base de connaissances vide."

        query_embedding = self.model.encode([query])
        scores = cosine_similarity(query_embedding, self.embeddings)[0]

        if np.isnan(scores).any():
            return "Erreur d'analyse de la question. Veuillez reformuler."

        best_index = int(np.argmax(scores))
        return self.answers[best_index]
