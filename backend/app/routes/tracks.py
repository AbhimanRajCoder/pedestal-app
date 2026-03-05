"""
Track routes – learning track endpoints.
"""

from fastapi import APIRouter, Depends
from uuid import UUID

from app.core.auth import get_current_user
from app.schemas.track import TrackListResponse, TrackResponse
from app.services.track_service import TrackService

router = APIRouter(prefix="/tracks", tags=["Tracks"])


@router.get("", response_model=TrackListResponse)
async def list_tracks(_: str = Depends(get_current_user)):
    """List all available learning tracks."""
    service = TrackService()
    return await service.list_tracks()


@router.get("/{track_id}", response_model=TrackResponse)
async def get_track(track_id: UUID, _: str = Depends(get_current_user)):
    """Get a specific track by ID."""
    service = TrackService()
    return await service.get_track(track_id)
