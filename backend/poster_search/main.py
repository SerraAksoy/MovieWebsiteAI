from api import fetch_movies_from_tmdb, get_poster_url
from utils import get_clip_embedding
import pandas as pd

CSV_FILE_NAME = "movies_with_embeddings.csv"

def transform_movies(raw_movies):
    transformed_movies = []

    for movie in raw_movies:
        poster_url = get_poster_url(movie.get("poster_path"))
        clip_embedding = get_clip_embedding(poster_url) if poster_url else None

        transformed_movies.append({
            "id": movie.get("id"),
            "title": movie.get("title"),
            "overview": movie.get("overview"),
            "release_date": movie.get("release_date"),
            "vote_average": movie.get("vote_average"),
            "poster_url": poster_url,
            "clip_embedding": clip_embedding.tolist() if clip_embedding is not None else None,
            "genres": ", ".join(movie.get("genres", []))
        })

    return transformed_movies

if __name__ == "__main__":
    all_movies = []
    for page in range(1, 11):  # İlk 10 sayfa popüler filmleri al
        print(f"📥 Fetching page {page}...")
        movies = fetch_movies_from_tmdb(page=page)
        transformed = transform_movies(movies)
        all_movies.extend(transformed)

    df = pd.DataFrame(all_movies)
    df.to_csv(CSV_FILE_NAME, index=False, encoding="utf-8")
    print(f"✅ CSV yazıldı: {CSV_FILE_NAME} ({len(df)} kayıt)")