import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { socket } from "../socket";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Book {
  _id: string;
  title: string;
  author: string;
  pages: number;
  createdAt: string;
  updatedAt: string;
}
const ShowBook = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get<Book>(`${API_BASE_URL}/books/${id}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);
  const handleBookEdited = (updatedBook: Book) => {
    if (updatedBook && updatedBook._id === id) {
      setBook(updatedBook);
    }
  };
  const handleBookDeleted = () => {
    navigate("/", { replace: true });
  };
  socket.on("book-edited", handleBookEdited);
  socket.on("book-deleted", handleBookDeleted);
  return (
    <div className="bg-(--bg-main) min-h-screen p-6 sm:p-10 text-(--text-primary)">
      <div className="mb-4 max-w-2xl mx-auto">
        <BackButton />
      </div>
      <div className="max-w-2xl mx-auto w-full bg-linear-to-br from-(--bg-card) to-(--gold-dark) border border-(--border-muted) rounded-2xl p-6 sm:p-8 shadow-(--shadow-medium)">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6">
          Book Details
        </h1>

        {!loading && !book && (
          <div className="bg-(--bg-card) border border-(--border-default) rounded-xl p-6 text-(--text-secondary)">
            Book not found
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-40 w-full">
            <Spinner />
          </div>
        )}

        {book && (
          <div className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1">
                <div className="text-sm text-(--text-secondary)">Title</div>
                <div className="text-lg font-medium text-(--text-primary)">
                  {book.title}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-(--text-secondary)">Author</div>
                <div className="text-lg font-medium text-(--text-primary)">
                  {book.author}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-(--text-secondary)">Pages</div>
                <div className="text-lg font-medium text-(--text-primary)">
                  {book.pages}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-(--text-secondary)">
                  Created At
                </div>
                <div className="text-sm text-(--text-primary)">
                  {new Date(book.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <div className="text-sm text-(--text-secondary)">
                  Updated At
                </div>
                <div className="text-sm text-(--text-primary)">
                  {new Date(book.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowBook;
