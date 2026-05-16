import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  LogOut,
  ChevronRight,
  Sparkles,
  Pencil,
  Check,
  X,
  Crown,
  Flame,
  UtensilsCrossed,
  CalendarDays,
  BookmarkCheck,
  Zap,
} from "lucide-react";
import { auth } from "@/firebase";
import { signOut, getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import PageWrapper from "@/components/layout/PageWrapper";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/* ─── glass token ─── */
const glass = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 16,
};

const glassHover = {
  background: "rgba(255,255,255,0.12)",
};

/* ─── reusable card wrapper ─── */
function GlassCard({ children, className = "", style = {}, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{ ...glass, ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ─── pill selector ─── */
function PillGroup({ label, options, selected, onSelect }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/70">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected === opt;
          return (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(opt)}
              className="relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: active ? "rgba(255,255,255,0.95)" : "transparent",
                color: active ? "#111" : "rgba(255,255,255,0.7)",
                border: active
                  ? "1px solid rgba(255,255,255,0.95)"
                  : "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── stat card ─── */
function StatCard({ icon: Icon, value, label, delay = 0, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center p-4 text-center"
      style={glass}
    >
      <Icon className="w-5 h-5 mb-2" style={{ color }} />
      <span className="text-2xl font-extrabold text-white">{value}</span>
      <span className="text-[11px] text-white/70 mt-0.5 font-medium tracking-wide uppercase">
        {label}
      </span>
    </motion.div>
  );
}

/* ─── action button ─── */
function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  delay = 0,
}) {
  const isDestructive = variant === "destructive";
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer group"
      style={{
        ...glass,
        ...(isDestructive
          ? {
              background: "rgba(239,68,68,0.10)",
              border: "1px solid rgba(239,68,68,0.25)",
            }
          : {}),
      }}
    >
      <div className="flex items-center gap-3">
        <Icon
          className="w-[18px] h-[18px]"
          style={{
            color: isDestructive
              ? "rgba(248,113,113,0.9)"
              : "rgba(255,255,255,0.6)",
          }}
        />
        <span
          className="text-sm font-medium"
          style={{
            color: isDestructive
              ? "rgba(248,113,113,0.9)"
              : "rgba(255,255,255,0.85)",
          }}
        >
          {label}
        </span>
      </div>
      <ChevronRight
        className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
        style={{
          color: isDestructive
            ? "rgba(248,113,113,0.5)"
            : "rgba(255,255,255,0.25)",
        }}
      />
    </motion.button>
  );
}

/* ─── main page ─── */
export default function Account() {
  const navigate = useNavigate();

  // Profile state
  const [username, setUsername] = useState("forkcast_foodie");
  const [bio, setBio] = useState("eating good since 2024 🍕");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingField, setEditingField] = useState(null); // 'username' | 'bio' | null
  const [tempValue, setTempValue] = useState("");

  // Preferences state
  const [diet, setDiet] = useState("Anything");
  const [vibe, setVibe] = useState("Quick & Easy");
  const [budget, setBudget] = useState("Mid");

  const streakDays = 12;
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    const loadAvatar = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      // Check if signed in with Google
      const isGoogle = user.providerData.some(p => p.providerId === 'google.com');
      setIsGoogleUser(isGoogle);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.uid)
          .single();
        console.log("Profile data:", data);
        console.log("Profile error:", error);
        if (data?.avatar_url) {
          setAvatarUrl(data.avatar_url + "?t=" + Date.now());
        } else {
          setAvatarUrl(user.photoURL);
        }
      } catch (e) {
        console.log("Fetch failed:", e);
        setAvatarUrl(user.photoURL);
      }
    };
    loadAvatar();
  }, []);

  // Also fetch username/bio from Supabase on mount
  const fetchProfile = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("username, bio")
      .eq("id", user.uid)
      .single();
    if (data) {
      setUsername(data.username || "forkcast_foodie");
      setBio(data.bio || "eating good since 2024 🍕");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Upload avatar to Supabase Storage
  const uploadAvatar = async (file) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!file || !user) return;
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.uid}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) {
        console.error(uploadError);
        return;
      }
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user.uid);
      const timestamp = Date.now();
      const freshUrl = `https://blgtsjjjelzngvlvruoh.supabase.co/storage/v1/object/public/avatars/${user.uid}/avatar.${fileExt}?t=${timestamp}`;
      setAvatarUrl(freshUrl);
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (field) => {
    setEditingField(field);
    setTempValue(field === "username" ? username : bio);
  };

  const saveEdit = () => {
    if (editingField === "username") setUsername(tempValue);
    if (editingField === "bio") setBio(tempValue);
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      /* noop */
    }
    window.location.href = "/";
  };

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both fields.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    setChangingPassword(true);
    try {
      const authInstance = getAuth();
      const user = authInstance.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password changed successfully!");
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      if (e.code === "auth/wrong-password" || e.code === "auth/invalid-credential") {
        toast.error("Current password is incorrect.");
      } else {
        toast.error(`Error: ${e.message}`);
      }
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <PageWrapper>
      <div className="w-full max-w-[480px] mx-auto pb-12 space-y-5">
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center pt-2 pb-1"
        >
          <h1
            className="text-2xl font-bold text-white tracking-tight"
            style={{ fontWeight: 700 }}
          >
            my account
          </h1>
          <p className="text-white/30 text-sm mt-0.5">u look good today btw</p>
        </motion.div>

        {/* ═══════════════════════════════════════════
            1. PROFILE CARD
        ═══════════════════════════════════════════ */}
        <GlassCard className="p-6" style={{ ...glass }}>
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Avatar with gradient ring + upload */}
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => uploadAvatar(e.target.files[0])}
            />
            <div
              onClick={() => document.getElementById("avatarInput").click()}
              className="relative"
              style={{ cursor: "pointer" }}
            >
              <div
                className="rounded-full p-[3px]"
                style={{
                  width: 126,
                  height: 126,
                  background:
                    "linear-gradient(135deg, #a855f7, #7c3aed, #ec4899, #a855f7)",
                  backgroundSize: "300% 300%",
                  animation: "gradientSpin 4s ease infinite",
                }}
              >
                <img
                  src={avatarUrl || ""}
                  alt="profile"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                    background: "rgba(255,255,255,0.1)",
                  }}
                  onError={(e) => {
                    const auth = getAuth();
                    e.target.src = auth.currentUser?.photoURL || "";
                  }}
                />
              </div>
              {/* Edit badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  padding: 4,
                  fontSize: 12,
                  backdropFilter: "blur(8px)",
                }}
              >
                ✏️
              </div>
            </div>
            {uploading && (
              <p className="text-xs text-white/50 mt-1">Uploading...</p>
            )}

            {/* Username */}
            <div className="w-full">
              {editingField === "username" ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-white/40">@</span>
                  <input
                    autoFocus
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-center text-base font-semibold outline-none focus:border-purple-400 transition-colors w-48"
                  />
                  <button
                    onClick={saveEdit}
                    className="p-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4 text-white/50" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit("username")}
                  className="group inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span
                    className="font-semibold text-white"
                    style={{ fontSize: 20, fontWeight: 600 }}
                  >
                    @{username}
                  </span>
                  <Pencil className="w-3 h-3 text-white/20 group-hover:text-white/60 transition-colors" />
                </button>
              )}
            </div>

            {/* Bio */}
            <div className="w-full">
              {editingField === "bio" ? (
                <div className="flex items-center justify-center gap-2">
                  <input
                    autoFocus
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white/60 text-center text-sm outline-none focus:border-purple-400 transition-colors w-56"
                  />
                  <button
                    onClick={saveEdit}
                    className="p-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-white/50" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit("bio")}
                  className="group inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-sm text-white/50">{bio}</span>
                  <Pencil className="w-2.5 h-2.5 text-white/15 group-hover:text-white/50 transition-colors" />
                </button>
              )}
            </div>

            {/* Streak badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(251,146,60,0.2), rgba(239,68,68,0.15))",
                border: "1px solid rgba(251,146,60,0.3)",
              }}
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-300">
                {streakDays} day streak
              </span>
            </motion.div>
          </div>
        </GlassCard>

        {/* ═══════════════════════════════════════════
            2. HOW I EAT
        ═══════════════════════════════════════════ */}
        <GlassCard className="p-5 space-y-5" style={{ ...glass }}>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/70">
            How I Eat
          </p>
          <PillGroup
            label="Diet"
            options={["Anything", "Veggie", "Vegan", "Keto", "Paleo"]}
            selected={diet}
            onSelect={setDiet}
          />
          <PillGroup
            label="Vibe"
            options={["Quick & Easy", "Meal Prep", "Date Night", "Comfort"]}
            selected={vibe}
            onSelect={setVibe}
          />
          <PillGroup
            label="Budget"
            options={["Broke", "Mid", "Bougie"]}
            selected={budget}
            onSelect={setBudget}
          />
        </GlassCard>

        {/* ═══════════════════════════════════════════
            3. STATS ROW
        ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={UtensilsCrossed}
            value="247"
            label="Explored"
            delay={0.1}
            color="#a78bfa"
          />
          <StatCard
            icon={CalendarDays}
            value="8"
            label="Weeks Planned"
            delay={0.15}
            color="#60a5fa"
          />
          <StatCard
            icon={BookmarkCheck}
            value="34"
            label="Saved"
            delay={0.2}
            color="#f472b6"
          />
          <StatCard
            icon={Zap}
            value={`${streakDays}`}
            label="Day Streak"
            delay={0.25}
            color="#fb923c"
          />
        </div>



        {/* ═══════════════════════════════════════════
            5. ACTION BUTTONS
        ═══════════════════════════════════════════ */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 px-1">
            Settings
          </p>

          {!isGoogleUser && (
            <AnimatePresence>
            {showChangePassword ? (
              <motion.div
                key="change-pass-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div
                  className="rounded-2xl p-5 space-y-3"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(18px)",
                  }}
                >
                  <p className="text-sm font-semibold text-white/80">Change Password</p>
                  <input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-400 transition-colors"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-400 transition-colors"
                  />
                  <div className="flex gap-2 pt-1">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleChangePassword}
                      disabled={changingPassword}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
                    >
                      {changingPassword ? "Saving..." : "Save"}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setShowChangePassword(false); setCurrentPassword(""); setNewPassword(""); }}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 cursor-pointer"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <ActionButton
                key="change-pass-btn"
                icon={Lock}
                label="Change password"
                onClick={() => setShowChangePassword(true)}
                delay={0.05}
              />
            )}
            </AnimatePresence>
          )}
          <ActionButton
            icon={LogOut}
            label="Peace out ✌️"
            onClick={handleLogout}
            variant="destructive"
            delay={0.1}
          />
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-[11px] text-white/20 pt-4"
        >
          ForkCast v1.0 · made with 🧡 and too much coffee
        </motion.p>
      </div>

      {/* Keyframe for avatar gradient spin */}
      <style>{`
        @keyframes gradientSpin {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </PageWrapper>
  );
}
