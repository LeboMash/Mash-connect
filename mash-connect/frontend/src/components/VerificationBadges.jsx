import { BadgeCheck, Building2, GraduationCap, Image, ShieldCheck, Wrench } from "lucide-react";

const badgeIcons = {
  "Google Verified": ShieldCheck,
  "Photo Added": Image,
  "Qualification Added": GraduationCap,
  "Institution Linked": GraduationCap,
  "Trade Profile": Wrench,
  "Company Profile": Building2,
};

function VerificationBadges({ badges = [], compact = false }) {
  const visibleBadges = badges.length ? badges : ["Profile Started"];

  return (
    <div className={compact ? "verification-badges compact" : "verification-badges"}>
      {visibleBadges.map((badge) => {
        const Icon = badgeIcons[badge] || BadgeCheck;
        return (
          <span key={badge}>
            <Icon size={14} />
            {badge}
          </span>
        );
      })}
    </div>
  );
}

export default VerificationBadges;
