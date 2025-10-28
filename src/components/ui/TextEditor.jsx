import React, { useState, useEffect } from "react";
import colors from "../../utils/constants/colors";
import storyApi from "../../utils/api/storyApi";
import { getCurrentUser } from "../../lib/supabase";
import { pointsApi } from "../../lib/supabaseApi";

const TextEditor = ({
  text,
  onTextChange,
  placeholder = "Saisissez votre texte...",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [actionPosition, setActionPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [points, setPoints] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.id);
        try {
          const balance = await pointsApi.getBalance(user.id);
          setPoints(balance);
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, []);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selected = selection.toString().trim();

    if (selected.length > 0) {
      setSelectedText(selected);

      // Positionner le menu d'actions près de la sélection
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setActionPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 60, // Au-dessus de la sélection
      });

      setShowActions(true);
    } else {
      setShowActions(false);
    }
  };

  const handleFixText = async () => {
    setLoading(true);
    try {
      const result = await storyApi.fixText(selectedText);
      const fixedText = result.fixed_text;

      // Remplacer le texte sélectionné par le texte corrigé
      const newText = text.replace(selectedText, fixedText);
      onTextChange(newText);

      setShowActions(false);
      window.getSelection().removeAllRanges();

      // Débit 2 points
      if (userId) {
        try {
          const newBalance = await pointsApi.debit(userId, 2);
          setPoints(newBalance);
        } catch (e) {
          if (e?.code === "INSUFFICIENT_FUNDS") {
            alert("Solde insuffisant (2 tokens requis)");
          } else {
            console.error(e);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la correction:", error);
      alert("Erreur lors de la correction du texte");
    } finally {
      setLoading(false);
    }
  };

  const handleRephraseText = async () => {
    setLoading(true);
    try {
      const result = await storyApi.rephraseText(text, selectedText);
      const rephrasedText = result.rephrased_text;

      // Remplacer le texte sélectionné par le texte reformulé
      const newText = text.replace(selectedText, rephrasedText);
      onTextChange(newText);

      setShowActions(false);
      window.getSelection().removeAllRanges();

      // Débit 2 points
      if (userId) {
        try {
          const newBalance = await pointsApi.debit(userId, 2);
          setPoints(newBalance);
        } catch (e) {
          if (e?.code === "INSUFFICIENT_FUNDS") {
            alert("Solde insuffisant (2 tokens requis)");
          } else {
            console.error(e);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la reformulation:", error);
      alert("Erreur lors de la reformulation du texte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-end mb-2">
        <button
          className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 text-sm"
          style={{
            backgroundColor: isEditing ? colors.primary : colors.primaryLight,
            color: colors.white,
          }}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Terminer l'édition" : "Éditer"}
        </button>
      </div>

      {isEditing ? (
        <textarea
          className="w-full p-6 rounded-lg border-2 resize-none focus:outline-none focus:ring-2"
          style={{
            borderColor: colors.primaryLight,
            backgroundColor: colors.white,
            color: colors.text,
            minHeight: "300px",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onMouseUp={handleTextSelection}
          placeholder={placeholder}
        />
      ) : (
        <div
          className="p-6 rounded-lg whitespace-pre-wrap cursor-text"
          style={{
            backgroundColor: colors.white,
            color: colors.text,
            minHeight: "300px",
            fontSize: "16px",
            lineHeight: "1.6",
            border: `2px solid ${colors.primaryLight}`,
          }}
          onMouseUp={handleTextSelection}
        >
          {text || (
            <span style={{ color: colors.textSecondary }}>{placeholder}</span>
          )}
        </div>
      )}

      {/* Menu d'actions IA */}
      {showActions && !loading && (
        <div
          className="fixed z-50 flex gap-2 p-2 rounded-lg shadow-xl"
          style={{
            left: `${actionPosition.x}px`,
            top: `${actionPosition.y}px`,
            transform: "translateX(-50%)",
            backgroundColor: colors.white,
            border: `2px solid ${colors.primary}`,
          }}
        >
          {points !== null && (
            <span
              className="px-2 py-1 rounded text-xs font-semibold"
              style={{
                backgroundColor: colors.whiteTransparent,
                color: colors.text,
              }}
            >
              {points} tokens
            </span>
          )}
          <button
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
            style={{
              backgroundColor: colors.primaryLight,
              color: colors.white,
            }}
            onClick={handleFixText}
          >
            Corriger (2 tokens)
          </button>
          <button
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
            }}
            onClick={handleRephraseText}
          >
            Reformuler (2 tokens)
          </button>
          <button
            className="px-2 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: colors.whiteTransparent,
              color: colors.text,
            }}
            onClick={() => {
              setShowActions(false);
              window.getSelection().removeAllRanges();
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Indicateur de chargement */}
      {loading && (
        <div
          className="fixed z-50 px-4 py-2 rounded-lg shadow-xl flex items-center gap-2"
          style={{
            left: `${actionPosition.x}px`,
            top: `${actionPosition.y}px`,
            transform: "translateX(-50%)",
            backgroundColor: colors.white,
            border: `2px solid ${colors.primary}`,
          }}
        >
          <div
            className="animate-spin rounded-full h-4 w-4 border-2"
            style={{
              borderColor: colors.primaryLight,
              borderTopColor: colors.primary,
            }}
          />
          <span className="text-sm" style={{ color: colors.text }}>
            Traitement...
          </span>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
