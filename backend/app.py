from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from poster_search.train_model import find_similar_movies

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), 'poster_search', 'movies_with_embeddings.csv')

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/api/poster-search", methods=["POST"])
def poster_search():
    if "poster" not in request.files:
        return jsonify({"error": "Poster dosyası gerekli"}), 400

    file = request.files["poster"]
    genre = request.form.get("genre", "")

    if file.filename == "":
        return jsonify({"error": "Dosya adı boş"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, "user_upload.jpg")
    file.save(filepath)

    try:
        result_df = find_similar_movies(filepath, CSV_FILE_PATH, selected_genre=genre)
        if result_df.empty:
            return jsonify({"message": "Eşleşen film bulunamadı."}), 404

        top_results = result_df.head(10)[["title", "poster_url", "similarity", "movie_id"]]
        results = top_results.to_dict(orient="records")
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": f"İşleme hatası: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(port=8000, debug=True)