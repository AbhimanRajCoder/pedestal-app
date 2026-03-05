"""
Progress service – user progress tracking and reporting.
"""

from uuid import UUID

from app.core.database import get_supabase
from app.schemas.progress import ProgressItem, ProgressResponse


class ProgressService:
    """Handles user progress queries and reporting."""

    def __init__(self):
        self.db = get_supabase()

    async def get_user_progress(self, user_profile_id: UUID) -> ProgressResponse:
        """
        Get comprehensive progress overview for a user:
        - All lesson progress records with lesson titles
        - Completion statistics
        - Current XP and level
        """
        # Get user profile for XP and level
        profile = (
            self.db.table("user_profiles")
            .select("xp_total, level, streak_days, assigned_track_id")
            .eq("id", str(user_profile_id))
            .single()
            .execute()
        )

        profile_data = profile.data or {
            "xp_total": 0,
            "level": 1,
            "streak_days": 0,
            "assigned_track_id": None,
        }

        # Get all lessons in user's assigned track
        total_lessons = 0
        if profile_data.get("assigned_track_id"):
            lessons_result = (
                self.db.table("lessons")
                .select("id, title")
                .eq("track_id", profile_data["assigned_track_id"])
                .eq("is_active", True)
                .execute()
            )
            total_lessons = len(lessons_result.data) if lessons_result.data else 0
            lesson_map = {
                l["id"]: l["title"] for l in (lessons_result.data or [])
            }
        else:
            lesson_map = {}

        # Get progress records
        progress_result = (
            self.db.table("user_progress")
            .select("*")
            .eq("user_id", str(user_profile_id))
            .order("created_at", desc=True)
            .execute()
        )

        progress_items = []
        completed_count = 0

        for record in (progress_result.data or []):
            is_completed = record.get("is_completed", False)
            if is_completed:
                completed_count += 1

            lesson_title = lesson_map.get(
                record["lesson_id"], "Unknown Lesson"
            )

            progress_items.append(
                ProgressItem(
                    lesson_id=record["lesson_id"],
                    lesson_title=lesson_title,
                    is_completed=is_completed,
                    quiz_score=record.get("quiz_score"),
                    best_score=record.get("best_score"),
                    attempts=record.get("attempts", 0),
                    xp_earned=record.get("xp_earned", 0),
                    completed_at=record.get("completed_at"),
                )
            )

        completion_pct = (
            (completed_count / total_lessons * 100) if total_lessons > 0 else 0
        )

        return ProgressResponse(
            total_lessons=total_lessons,
            completed_lessons=completed_count,
            completion_percentage=round(completion_pct, 1),
            total_xp=profile_data["xp_total"],
            current_level=profile_data["level"],
            current_streak=profile_data["streak_days"],
            progress=progress_items,
        )
