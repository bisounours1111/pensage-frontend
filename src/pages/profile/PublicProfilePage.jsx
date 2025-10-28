import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import colors from "../../utils/constants/colors";
import { getCurrentUser, getUserExtend } from "../../lib/supabase";
import {
  followApi,
  webnovelsApi,
  likesApi,
  commentsApi,
  historyApi,
} from "../../lib/supabaseApi";

const PublicProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viewer, setViewer] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stories, setStories] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ views: 0, likes: 0, comments: 0 });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const current = await getCurrentUser();
        setViewer(current);
        const user = await getUserExtend(id);
        setProfile(user);
        const mine = await webnovelsApi.getByUser(id);
        setStories(mine || []);
        if (current) {
          const following = await followApi.isFollowing(current.id, id);
          setIsFollowing(following);
        }
        // Calcul des totaux (vues, likes, commentaires) sur toutes les œuvres
        if (mine && mine.length > 0) {
          const novelIds = mine.map((s) => s.id);
          const [viewsArr, likesArr, commentsArr] = await Promise.all([
            Promise.all(novelIds.map((nid) => historyApi.countViews(nid))),
            Promise.all(novelIds.map((nid) => likesApi.countLikes(nid))),
            Promise.all(
              novelIds.map((nid) =>
                commentsApi.countByWebnovel(nid, { rootOnly: false })
              )
            ),
          ]);
          const totalViews = (viewsArr || []).reduce((a, b) => a + (b || 0), 0);
          const totalLikes = (likesArr || []).reduce((a, b) => a + (b || 0), 0);
          const totalComments = (commentsArr || []).reduce(
            (a, b) => a + (b || 0),
            0
          );
          setTotals({
            views: totalViews,
            likes: totalLikes,
            comments: totalComments,
          });
        } else {
          setTotals({ views: 0, likes: 0, comments: 0 });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const toggleFollow = async () => {
    if (!viewer) return;
    if (isFollowing) {
      await followApi.unfollow(viewer.id, id);
      setIsFollowing(false);
    } else {
      await followApi.follow(viewer.id, id);
      setIsFollowing(true);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        {" "}
        <div style={{ color: colors.text }}>Chargement...</div>{" "}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        {" "}
        <div style={{ color: colors.text }}>Profil introuvable</div>{" "}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12">
      {/* En-tête public (pas d'édition) */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
            {profile.name || profile.username || "Utilisateur"}
          </h1>
          <p style={{ color: colors.text, opacity: 0.7 }}>
            @{profile.username}
          </p>
        </div>
        {viewer && viewer.id !== id && (
          <button
            onClick={toggleFollow}
            className="px-4 py-2 rounded-lg font-semibold"
            style={{ backgroundColor: colors.primary, color: colors.white }}
          >
            {isFollowing ? "Se désabonner" : "Suivre"}
          </button>
        )}
      </div>

      {/* Statistiques agrégées */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div
          className="rounded-lg p-4 text-center shadow"
          style={{ backgroundColor: colors.whiteTransparent }}
        >
          <div className="text-sm opacity-75" style={{ color: colors.text }}>
            Vues
          </div>
          <div className="text-2xl font-bold" style={{ color: colors.text }}>
            {totals.views}
          </div>
        </div>
        <div
          className="rounded-lg p-4 text-center shadow"
          style={{ backgroundColor: colors.whiteTransparent }}
        >
          <div className="text-sm opacity-75" style={{ color: colors.text }}>
            Likes
          </div>
          <div className="text-2xl font-bold" style={{ color: colors.text }}>
            {totals.likes}
          </div>
        </div>
        <div
          className="rounded-lg p-4 text-center shadow"
          style={{ backgroundColor: colors.whiteTransparent }}
        >
          <div className="text-sm opacity-75" style={{ color: colors.text }}>
            Commentaires
          </div>
          <div className="text-2xl font-bold" style={{ color: colors.text }}>
            {totals.comments}
          </div>
        </div>
      </div>

      {/* Histoires */}
      <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
        Histoires publiées
      </h2>
      {stories.length === 0 ? (
        <div style={{ color: colors.text, opacity: 0.8 }}>Aucune histoire.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stories.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-lg cursor-pointer hover:shadow transition"
              style={{ backgroundColor: colors.whiteTransparent }}
              onClick={() => navigate(`/read/${s.id}`)}
            >
              <div className="font-bold mb-1" style={{ color: colors.text }}>
                {s.title}
              </div>
              <div
                className="text-sm"
                style={{ color: colors.text, opacity: 0.8 }}
              >
                {s.genre || "Non spécifié"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicProfilePage;
