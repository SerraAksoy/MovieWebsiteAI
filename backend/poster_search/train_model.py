import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from poster_search.utils import get_clip_embedding
import os


def find_similar_movies(user_image_path, csv_file_path, selected_genre):
    df = pd.read_csv(csv_file_path)

    if selected_genre:
        df = df[df["genres"].str.contains(selected_genre, case=False, na=False)]

    df = df.dropna(subset=["clip_embedding"])
    df["clip_embedding"] = df["clip_embedding"].apply(
        lambda x: np.fromstring(x[1:-1], sep=',') if isinstance(x, str) else None
    )

    valid_embeddings = np.vstack(df["clip_embedding"].values)

    if valid_embeddings.shape[0] == 0:
        print("Geçerli embedding verisi bulunamadı.")
        return pd.DataFrame()

    user_embedding = get_clip_embedding(user_image_path)
    if user_embedding is None:
        print("Kullanıcı görselinin embedding'i alınamadı.")
        return pd.DataFrame()

    knn = NearestNeighbors(n_neighbors=min(10, len(valid_embeddings)), metric="cosine")
    knn.fit(valid_embeddings)

    distances, indices = knn.kneighbors([user_embedding])

    df_result = df.iloc[indices[0]].copy()
    df_result["similarity"] = 1 - distances[0]
    df_result["movie_id"] = df_result["id"]  # Bu satırı ekleyerek movie_id değerini frontend'e göndermeyi sağlıyoruz

    return df_result.sort_values(by="similarity", ascending=False)
