import torch
import clip
from PIL import Image

# Cihazı belirle (GPU varsa kullan)
device = "cuda" if torch.cuda.is_available() else "cpu"

# CLIP modelini ve ön işleme adımını yükle
model, preprocess = clip.load("ViT-B/32", device=device)


def get_clip_embedding(image_path):
    """
    Verilen bir görsel dosya yolundan embedding çıkarır.
    """
    try:
        image = Image.open(image_path).convert("RGB")
        image_input = preprocess(image).unsqueeze(0).to(device)

        with torch.no_grad():
            image_features = model.encode_image(image_input)

        return image_features.cpu().numpy().flatten()
    except Exception as e:
        print(f"CLIP işlem hatası: {e}")
        return None
