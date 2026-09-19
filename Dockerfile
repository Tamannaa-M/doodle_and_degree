FROM python:3.11-slim

WORKDIR /app

# Install basic dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create writable runtime directories and set user permissions
RUN mkdir -p uploads static/cache_slides sample_slides && \
    useradd -m -u 1000 user && \
    chown -R user:user /app

USER user
ENV PORT=7860
EXPOSE 7860

CMD ["python", "run.py"]
