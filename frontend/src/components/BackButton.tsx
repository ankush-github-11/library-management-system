import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

const BackButton = () => {
  return (
    <Link
      to="/"
      className="
        inline-flex items-center justify-center
        h-10 w-12
        rounded-xl
        bg-(--bg-elevated)
        border-2 border-(--border-muted)
        text-(--text-primary)
        transition-all duration-200
        hover:text-(--gold-primary)
        active:scale-95
      "
    >
      <IoIosArrowRoundBack size={28} />
    </Link>
  );
};

export default BackButton;
