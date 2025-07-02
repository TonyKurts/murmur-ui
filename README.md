# MurmurUI

**MurmurUI** is a minimalistic, self-hosted web interface and REST API for [OpenAI’s Whisper](https://github.com/openai/whisper), powered by [FasterWhisper](https://github.com/guillaumekln/faster-whisper).

Transcribe, translate, and manage audio and video files on your own server — with privacy, performance, and extensibility in mind.

## Requirements

* Python 3.10+
* bash (for running `run.sh` script)
* pip (Python package installer)

## Installation and Launch

### 1. Clone the repository

```bash
git clone https://github.com/TonyKurts/murmur-ui
cd murmur-ui
```

### 2. Create and activate a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate  # For Linux/macOS
# venv\Scripts\activate  # For Windows (PowerShell)
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the application

```bash
./run.sh
```

> The `run.sh` script launches the FastAPI application using Uvicorn.

## License

MIT License

Copyright (c) 2025 Tony Kurts

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
