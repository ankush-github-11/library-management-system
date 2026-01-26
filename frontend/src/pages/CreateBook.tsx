import axios from "axios";
import { useState } from "react";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSnackbar } from "notistack";

interface Book {
  title: string;
  author: string;
  pages: string;
}

const CreateBook = () => {
  const [book, setBook] = useState<Book>({
    title: "",
    author: "",
    pages: "",
  });
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const handleChange = async () => {
    if (!book.title || !book.author || !book.pages) {
      enqueueSnackbar("All fields are required", {variant: "warning"});
      return;
    }
    if (isNaN(Number(book.pages))) {
      enqueueSnackbar("Pages must be a number", {variant: "warning"});
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:3000/books/", {
        ...book,
        pages: Number(book.pages),
      });
      setBook({
        title: "",
        author: "",
        pages: "",
      });
      enqueueSnackbar("Book is created successfully", {variant: "success"});
      setLoading(false);
    }
    catch (error) {
      console.log(error);
      enqueueSnackbar("Something went wrong", {variant: "error"});
      setLoading(false);
    }
  };

  return (
    <div className="bg-(--bg-main) min-h-screen p-6 sm:p-10 text-(--text-primary) flex items-start">
      <div className="max-w-3xl w-full mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="bg-(--bg-card) border border-(--border-default) rounded-2xl p-6 sm:p-8 shadow-(--shadow-medium)">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Create a Book</h1>

          <div className="flex flex-col gap-4 mt-2">
            <input
              className="w-full h-12 px-4 bg-(--bg-elevated) border border-(--border-muted) rounded-lg text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--gold-glow) transition-(--transition-normal)"
              type="text"
              placeholder="Enter the title"
              value={book.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBook({ ...book, title: e.target.value })
              }
            />

            <input
              className="w-full h-12 px-4 bg-(--bg-elevated) border border-(--border-muted) rounded-lg text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--gold-glow) transition-(--transition-normal)"
              type="text"
              placeholder="Enter the author"
              value={book.author}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBook({ ...book, author: e.target.value })
              }
            />

            <input
              className="w-full h-12 px-4 bg-(--bg-elevated) border border-(--border-muted) rounded-lg text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--gold-glow) transition-(--transition-normal)"
              type="text"
              placeholder="Enter the number of pages"
              value={book.pages}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBook({ ...book, pages: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              className={`mt-2 inline-flex items-center gap-3 px-5 py-2 rounded-full font-semibold shadow-(--shadow-gold) border border-(--border-gold) transition-(--transition-normal) ${loading ? "opacity-60 cursor-not-allowed" : "hover:brightness-95"} bg-(--gold-primary) text-(--text-inverted) cursor-pointer`}
              onClick={handleChange}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBook;
