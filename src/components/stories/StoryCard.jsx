import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import colors from "../../utils/constants/colors";
import {
  MdVisibility,
  MdFavorite,
  MdChatBubble,
  MdPublic,
  MdDrafts,
} from "react-icons/md";
import { likesApi, commentsApi, historyApi } from "../../lib/supabaseApi";

const StoryCard = ({ story, mode = "read" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // mode='read' pour la lecture, mode='manage' pour la gestion
    if (mode === "read") {
      navigate(`/read/${story.id}`);
    } else {
      navigate(`/episodes/${story.id}`);
    }
  };

  // Modal: supporte affichage d'utilisateurs ou de commentaires
  const [modal, setModal] = useState({
    open: false,
    title: "",
    type: "users",
    loading: false,
    users: [],
    comments: [],
  });

  const openUsersModal = (title, users) =>
    setModal({
      open: true,
      title,
      type: "users",
      loading: false,
      users,
      comments: [],
    });
  const openCommentsModal = (title, comments) =>
    setModal({
      open: true,
      title,
      type: "comments",
      loading: false,
      users: [],
      comments,
    });
  const closeUsersModal = () =>
    setModal({
      open: false,
      title: "",
      type: "users",
      loading: false,
      users: [],
      comments: [],
    });

  const handleShowViewers = async (e) => {
    e.stopPropagation();
    setModal((m) => ({
      ...m,
      open: true,
      type: "users",
      title: "Personnes ayant vu",
      loading: true,
      users: [],
      comments: [],
    }));
    const viewers = await historyApi.getViewers(story.id);
    openUsersModal(
      "Personnes ayant vu",
      (viewers || []).map((v) => v.user_extend).filter(Boolean)
    );
  };

  const handleShowLikers = async (e) => {
    e.stopPropagation();
    setModal((m) => ({
      ...m,
      open: true,
      type: "users",
      title: "Personnes qui ont liké",
      loading: true,
      users: [],
      comments: [],
    }));
    const likers = await likesApi.getLikers(story.id);
    openUsersModal(
      "Personnes qui ont liké",
      (likers || []).map((l) => l.user_extend).filter(Boolean)
    );
  };

  const handleShowComments = async (e) => {
    e.stopPropagation();
    setModal((m) => ({
      ...m,
      open: true,
      type: "comments",
      title: "Commentaires",
      loading: true,
      users: [],
      comments: [],
    }));
    const comments = await commentsApi.getByWebnovel(story.id);
    openCommentsModal(
      "Commentaires",
      (comments || []).map((c) => ({
        id: c.id,
        content: c.content,
        user: c.user_extend,
      }))
    );
  };

  const renderAvatar = (user) => {
    const label = (
      user?.username ||
      user?.name ||
      user?.lastname ||
      "?"
    ).toString();
    const initial = label.trim().charAt(0).toUpperCase();
    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
        style={{ backgroundColor: "#f17ca0" }}
      >
        {initial}
      </div>
    );
  };

  return (
    <div
      className="flex-shrink-0 w-48 md:w-56 group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-lg bg-white/30 backdrop-blur-sm shadow-lg aspect-[2/3] mb-2 border border-white/40">
        {/* Image de couverture */}
        <img
          src={story.cover}
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay au survol */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          style={{ backgroundColor: colors.overlay }}
        >
          <div className="text-white text-center p-4">
            <p className="text-sm font-semibold mb-1">{story.title}</p>
            <span className="text-xs text-white/90">{story.category}</span>
          </div>
        </div>

        {/* Stats overlay */}
        {story.stats && (
          <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-2">
            <button
              onClick={handleShowViewers}
              className="text-[11px] px-2 py-1 rounded bg-black/40 text-white/90 backdrop-blur-sm inline-flex items-center gap-1"
            >
              <MdVisibility size={14} /> {story.stats.views}
            </button>
            <button
              onClick={handleShowLikers}
              className="text-[11px] px-2 py-1 rounded bg-black/40 text-white/90 backdrop-blur-sm inline-flex items-center gap-1"
            >
              <MdFavorite size={14} /> {story.stats.likes}
            </button>
            <button
              onClick={handleShowComments}
              className="text-[11px] px-2 py-1 rounded bg-black/40 text-white/90 backdrop-blur-sm inline-flex items-center gap-1"
            >
              <MdChatBubble size={14} /> {story.stats.comments}
            </button>
          </div>
        )}
      </div>

      {/* Titre */}
      <h3
        className="font-medium text-sm truncate"
        style={{ color: colors.text }}
      >
        {story.title}
      </h3>

      {modal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeUsersModal}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative z-10 mx-4 max-w-md w-full rounded-lg bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[#7a4252]">{modal.title}</h4>
              <button
                onClick={closeUsersModal}
                className="text-sm px-2 py-1 rounded border border-black/10"
              >
                Fermer
              </button>
            </div>

            {modal.loading ? (
              <div className="text-sm text-[#7a4252] opacity-80">
                Chargement...
              </div>
            ) : modal.type === "users" ? (
              modal.users.length === 0 ? (
                <div className="text-sm text-[#7a4252] opacity-80">
                  Aucun utilisateur
                </div>
              ) : (
                <ul className="space-y-3 max-h-80 overflow-auto">
                  {modal.users.map((u) => (
                    <li
                      key={u.id}
                      className="flex items-center gap-3 p-2 rounded-lg border border-black/5 bg-[#f7e7eb]"
                    >
                      {renderAvatar(u)}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#7a4252] truncate">
                          {u?.username || u?.name || u?.lastname || u?.id}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            ) : modal.comments.length === 0 ? (
              <div className="text-sm text-[#7a4252] opacity-80">
                Aucun commentaire
              </div>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-auto">
                {modal.comments.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-start gap-3 p-2 rounded-lg border border-black/5 bg-[#f7e7eb]"
                  >
                    {renderAvatar(c.user)}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#7a4252]">
                        {c.user?.username ||
                          c.user?.name ||
                          c.user?.lastname ||
                          c.user?.id}
                      </div>
                      <div className="mt-1 text-sm text-[#7a4252] bg-white/80 rounded-lg p-2 border border-white/60 whitespace-pre-wrap">
                        {c.content}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryCard;
