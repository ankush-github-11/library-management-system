import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSnackbar } from "notistack";
import { socket } from "../socket";

interface Book {
  _id?: string;
  title: string;
  author: string;
  pages: string;
}
const EditBook = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [book, setBook] = useState<Book>({
    title: "",
    author: "",
    pages: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:3000/books/${id}`)
      .then((res) => {
        setLoading(false);
        setBook(res.data);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);
  const handleBookEdited = (updatedBook: Book) => {
    if(updatedBook && updatedBook._id === id) {
      setBook(updatedBook);
    }
  }
  socket.on("book-edited", handleBookEdited);
  const handleSubmit = () => {
    if (!book.title || !book.author || !book.pages) {
      alert("No fields should be blank");
      return;
    }
    if (isNaN(parseInt(book.pages))) {
      alert("Pages should be Integer");
      return;
    }
    setSubmitting(true);
    axios
      .put(`http://localhost:3000/books/${id}`, book)
      .then(() => {
        enqueueSnackbar("Book is edited successfully", {variant: "success"});
        navigate("/", { replace: true });
      })
      .catch(() => {
        enqueueSnackbar("Something went wrong", {variant: "error"});
        setSubmitting(false);
      });
  };
  return (
    <div className="bg-(--bg-main) min-h-screen p-6 sm:p-10 text-(--text-primary) flex items-start">
      <div className="max-w-3xl w-full mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="bg-(--bg-card) border border-(--border-default) rounded-2xl p-6 sm:p-8 shadow-(--shadow-medium)">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Edit the Book</h1>

          {(!loading && !book) && (
            <div className="text-(--text-secondary)">Book not found</div>
          )}

          {loading && (
            <div className="flex justify-center items-center h-40 w-full">
              <Spinner />
            </div>
          )}

          {!loading && book && (
            <div className="flex flex-col gap-4 mt-2">
              <label className="text-sm text-(--text-secondary)">Book Title</label>
              <input
                type="text"
                placeholder="Enter the title"
                value={book.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setBook({ ...book, title: e.target.value });
                }}
                className="w-full h-12 px-4 bg-(--bg-elevated) border border-(--border-muted) rounded-lg text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--gold-glow) transition-(--transition-normal)"
              />

              <label className="text-sm text-(--text-secondary)">Book Author</label>
              <input
                type="text"
                placeholder="Enter the author"
                value={book.author}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setBook({ ...book, author: e.target.value });
                }}
                className="w-full h-12 px-4 bg-(--bg-elevated) border border-(--border-muted) rounded-lg text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--gold-glow) transition-(--transition-normal)"
              />

              <label className="text-sm text-(--text-secondary)">Pages</label>
              <input
                type="text"
                placeholder="Enter the pages"
                value={book.pages}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setBook({ ...book, pages: e.target.value });
                }}
                className="w-full h-12 px-4 bg-(--bg-elevated) border border-(--border-muted) rounded-lg text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--gold-glow) transition-(--transition-normal)"
              />

              <div className="flex items-center justify-end gap-4 mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`inline-flex items-center gap-3 px-5 py-2 rounded-full font-semibold shadow-(--shadow-gold) border border-(--border-gold) transition-(--transition-normal) ${submitting ? "opacity-60 cursor-not-allowed" : "hover:brightness-95"} bg-(--gold-primary) text-(--text-inverted)`}
                >
                  {submitting ? "Editing" : "Submit"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBook;
