import { motion } from "framer-motion";

function StatCard({ icon: Icon, label, value, tone = "gold" }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`stat-card tone-${tone}`}
    >
      <span className="stat-icon">{Icon ? <Icon size={22} /> : null}</span>
      <span>{label}</span>
      <strong>{value}</strong>
    </motion.article>
  );
}

export default StatCard;
