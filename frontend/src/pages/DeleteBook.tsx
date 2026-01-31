import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useSnackbar } from "notistack";
import { socket } from "../socket";

const DeleteBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const handleDelete = async () => {
    setLoading(true);
    axios
      .delete(`http://localhost:3000/books/${id}`)
      .then(() => {
        enqueueSnackbar("Book is deleted successfully", { variant: "success" });
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const handleBookDeleted = () => {
    navigate("/", { replace: true });
  };
  socket.on("book-deleted", handleBookDeleted);

  return (
    <div className="bg-(--bg-main) min-h-screen p-6 sm:p-10 text-(--text-primary)">
      <div className="max-w-md w-full mx-auto pt-30">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="bg-linear-to-br from-(--bg-card) to-(--gold-dark) border border-(--border-default) rounded-2xl p-6 sm:p-8 shadow-(--shadow-medium)">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-6">
            Delete the book
          </h1>
          <p className="text-sm text-(--text-secondary) mb-6">
            Are you sure you want to permanently delete this book? This action
            cannot be undone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className={`inline-flex items-center justify-center px-6 py-2 rounded-full font-semibold shadow-(--shadow-soft) border border-(--border-default) transition-(--transition-normal) ${loading ? "opacity-60 cursor-not-allowed" : "hover:brightness-90"} bg-red-500 text-white cursor-pointer`}
              onClick={handleDelete}
              disabled={loading}
              aria-label="confirm-delete"
            >
              {loading ? "Deleting" : "Yes, delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBook;
