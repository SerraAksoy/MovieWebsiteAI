from pymongo import MongoClient
import pandas as pd

# MongoDB Atlas bağlantı dizesini kendi bilgilerinize göre düzenleyin
connection_string = "mongodb+srv://serraaksoy:Serraak03.@serraaksoy.y6uxj.mongodb.net/serraaksoy?retryWrites=true&w=majority"
client = MongoClient(connection_string)
db = client["serraaksoy"]  # Örneğin: "filmapp"

# Review koleksiyonundaki verileri çekelim
reviews_cursor = db.reviews.find({})
reviews_data = list(reviews_cursor)

# Her kayıttaki userId'yi string'e çeviriyoruz
for r in reviews_data:
    r["user_id"] = str(r["userId"])  # Yeni alan: user_id
    # İsteğe bağlı: r["movieId"] zaten string olduğundan değiştirmemize gerek yok

# DataFrame oluşturma: Sadece öneri için gerekli alanlar: user_id, movieId, rating
reviews_df = pd.DataFrame(reviews_data)
reviews_df = reviews_df[["user_id", "movieId", "rating"]]

print("Reviews DataFrame İlk 5 Satır:")
print(reviews_df.head())

# CSV olarak kaydet (CSV dosyasını backend/data/ klasörüne kaydediyoruz)
reviews_df.to_csv("../data/reviews.csv", index=False, encoding="latin-1")