# app.py
from pathlib import Path

from src.adsb_viewer import ViewerConfig, create_dash_app

TRACK_OUTPUT_DIR = Path("track_output")
TITLE = "ADS-B 3D Flight Viewer"

dash_app = create_dash_app(
    config=ViewerConfig(title=TITLE),
    track_output_dir=TRACK_OUTPUT_DIR,
)

server = dash_app.server