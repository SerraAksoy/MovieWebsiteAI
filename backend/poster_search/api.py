import requests

API_KEY = "b9ab9730b2361f2b69dd705fba78ea16"  # Gerekirse .env'e taşıyabiliriz
BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

def fetch_genres_from_tmdb():
    url = f"{BASE_URL}/genre/movie/list"
    params = {"api_key": API_KEY, "language": "en-US"}
    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        return {genre['id']: genre['name'] for genre in data.get('genres', [])}
    else:
        print(f"[🚨] Tür bilgisi alınamadı: {response.status_code}")
        return {}

def fetch_movies_from_tmdb(page=1):
    url = f"{BASE_URL}/movie/popular"
    params = {"api_key": API_KEY, "language": "en-US", "page": page}
    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        genres = fetch_genres_from_tmdb()
        movies = data.get('results', [])

        for movie in movies:
            genre_ids = movie.get('genre_ids', [])
            movie['genres'] = [genres.get(gid, "Unknown") for gid in genre_ids]

        return movies
    else:
        print(f"[🚨] Film verisi alınamadı: {response.status_code}")
        return []

def get_poster_url(poster_path):
    return f"{IMAGE_BASE_URL}{poster_path}" if poster_path else None