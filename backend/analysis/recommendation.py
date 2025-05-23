import sys
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import json
import requests

TMDB_API_KEY = "b9ab9730b2361f2b69dd705fba78ea16"

def get_movie_details(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&language=tr-TR"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return {
                "title": data.get("title", "Bilinmiyor"),
                "poster_path": data.get("poster_path", "")
            }
        else:
            return {"title": "Bilinmiyor", "poster_path": ""}
    except Exception:
        return {"title": "Bilinmiyor", "poster_path": ""}

# CSV dosyasını oku
reviews_df = pd.read_csv("../data/reviews.csv", encoding="latin-1")
reviews_df["movieId"] = reviews_df["movieId"].astype(str)

pivot_table = reviews_df.pivot_table(index='user_id', columns='movieId', values='rating').fillna(0)
similarity = cosine_similarity(pivot_table)
similarity_df = pd.DataFrame(similarity, index=pivot_table.index, columns=pivot_table.index)

# Komut satırından kullanıcı ID'si al
if len(sys.argv) > 1 and sys.argv[1]:
    target_user = sys.argv[1]
else:
    target_user = pivot_table.index[0]

if target_user not in pivot_table.index:
    target_user = str(target_user)
    if target_user not in pivot_table.index:
        print(json.dumps({"error": "Hedef kullanıcı bulunamadı."}))
        sys.exit(1)

def recommend_movies(target_user, pivot_table, similarity_df, top_n=5):
    user_ratings = pivot_table.loc[target_user]
    movies_seen = user_ratings[user_ratings > 0].index.tolist()
    predicted_ratings = {}
    for movie in pivot_table.columns:
        if movie in movies_seen:
            continue
        sim_sum = 0
        weighted_sum = 0
        for other_user in pivot_table.index:
            if other_user == target_user:
                continue
            rating = pivot_table.loc[other_user, movie]
            if rating > 0:
                sim = similarity_df.loc[target_user, other_user]
                weighted_sum += sim * rating
                sim_sum += sim
        if sim_sum > 0:
            predicted_ratings[movie] = weighted_sum / sim_sum
    return pd.Series(predicted_ratings).sort_values(ascending=False).head(top_n)

recommendations = recommend_movies(target_user, pivot_table, similarity_df, top_n=10)

recommendations_with_titles = {}
for movie_id, pred_rating in recommendations.items():
    details = get_movie_details(movie_id)
    recommendations_with_titles[movie_id] = {
        "predicted_rating": pred_rating,
        "title": details["title"],
        "poster_path": details["poster_path"]
    }

print(json.dumps(recommendations_with_titles, ensure_ascii=False))