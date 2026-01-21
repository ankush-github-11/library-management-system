import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
const DeleteBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams();
  const handleDelete = async () => {
    setLoading(true);
    axios
      .delete(`http://localhost:3000/books/${id}`)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div className="h-screen overflow-hidden p-8">
      <div className="w-fit">
        <BackButton />
      </div>
      <h1>Delete the book</h1>
      <div className="w-full h-full flex justify-center items-center flex-col">
        <div className="w-fit">Do you want to delete the book?</div>
        <button
          className="mb-25 w-fit px-4 py-2 bg-red-500 rounded-full cursor-pointer"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Yes, delete"}
        </button>
      </div>
    </div>
  );
};

export default DeleteBook;
