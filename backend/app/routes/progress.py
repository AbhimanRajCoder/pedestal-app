"""
Progress routes – user progress tracking endpoints.
"""

from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.schemas.progress import ProgressResponse
from app.services.progress_service import ProgressService
from app.utils import get_user_profile_id

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("", response_model=ProgressResponse)
async def get_progress(auth_uid: str = Depends(get_current_user)):
    """Get the current user's progress overview."""
    profile_id = await get_user_profile_id(auth_uid)
    service = ProgressService()
    return await service.get_user_progress(profile_id)
