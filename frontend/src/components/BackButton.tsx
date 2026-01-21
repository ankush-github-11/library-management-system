import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
const BackButton = () => {
  return (
    <Link to={`/`} className="cursor-pointer w-20">
      <IoIosArrowRoundBack size={40} className="w-20 bg-gray-500/40 rounded-lg cursor-pointer hover:bg-purple-600" />
    </Link>
  )
}

export default BackButton
