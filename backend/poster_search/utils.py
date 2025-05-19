import requests
import torch
import clip
from PIL import Image
from io import BytesIO

# Cihaz ayarı (GPU varsa kullan, yoksa CPU)
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

def get_clip_embedding(image_url_or_path):
    try:
        # URL ise indir, değilse dosyadan oku
        if image_url_or_path.startswith("http"):
            response = requests.get(image_url_or_path)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content)).convert("RGB")
        else:
            image = Image.open(image_url_or_path).convert("RGB")

        image_input = preprocess(image).unsqueeze(0).to(device)

        with torch.no_grad():
            image_features = model.encode_image(image_input)

        return image_features.cpu().numpy().flatten()

    except Exception as e:
        print(f"Error processing image: {e}")
        return None
