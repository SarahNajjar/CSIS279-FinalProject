import os
import sys
import torch
import json
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification

# ✅ Direct clean path to model
model_dir = "C:/AIModels/toxic-bert-model"

# ✅ Load model and tokenizer
model = DistilBertForSequenceClassification.from_pretrained(model_dir)
tokenizer = DistilBertTokenizerFast.from_pretrained(model_dir)

# ✅ Use GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()

# ✅ Get text from command-line
if len(sys.argv) < 2:
    print(json.dumps({"error": "No input text provided"}))
    sys.exit(1)

text = sys.argv[1]

# ✅ Tokenize + Predict
inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128)
inputs = {k: v.to(device) for k, v in inputs.items()}

with torch.no_grad():
    outputs = model(**inputs)
    probs = torch.softmax(outputs.logits, dim=1)

# ✅ Return result as JSON
result = {
    "non_toxic": float(probs[0][0]),
    "toxic": float(probs[0][1])
}

print(json.dumps(result))
