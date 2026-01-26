import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { FaList } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { socket } from "../socket";

interface Book {
  _id: string;
  title: string;
  author: string;
  pages: number;
}
const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    axios
      .get<{ data: Book[] }>("http://localhost:3000/books")
      .then((res) => {
        setBooks(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    const handleBookAdded = (newBook: Book) => {
      setBooks((prev) => [...prev, newBook]);
    };

    const handleBookEdited = (updatedBook: Book) => {
      setBooks((prev) =>
        prev.map((book) => (book._id === updatedBook._id ? updatedBook : book)),
      );
    };
    
    const handleBookDeleted = (id: string) => {
      setBooks((prev) => prev.filter((book) => book._id !== id));
    };

    socket.on("book-added", handleBookAdded);
    socket.on("book-edited", handleBookEdited);
    socket.on("book-deleted", handleBookDeleted);
    return () => {
      socket.off("book-added", handleBookAdded);
      socket.off("book-edited", handleBookEdited);
      socket.off("book-deleted", handleBookDeleted);
    };
  }, []);
  return (
    <div className="bg-(--bg-main) px-4 sm:px-8 py-8 min-h-screen w-full text-(--text-primary)">
      <div className="max-w-7xl mx-auto">
        <div className="w-full mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="h-fit">
            <h1 className="text-5xl font-bold bg-linear-to-r from-(--gold-soft) to-(--gold-muted) bg-clip-text text-transparent py-2">
              Library Dashboard
            </h1>
            <p className="text-(--text-secondary) text-base">
              Manage your books collection with elegance
            </p>
          </div>
          <Link
            to={'/books/create'}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-(--gold-primary) text-(--text-inverted) font-semibold shadow-(--shadow-gold) border border-(--border-gold) hover:brightness-95 transition-(--transition-normal)"
          >
            <span className="text-sm sm:text-base">+ Create a Book</span>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-40 w-full">
            <Spinner />
          </div>
        )}

        {!loading && books.length > 0 && (
          <div>
            <div className="w-full rounded-lg shadow-(--shadow-soft) overflow-hidden border border-(--border-default) bg-(--bg-elevated)">
              {/* Header row - hidden on small screens */}
              <div className="hidden md:grid grid-cols-[0.5fr_3fr_2fr_1fr_1.5fr] bg-(--bg-card) border-b border-(--border-default)">
                <div className="px-4 py-3 border-r border-(--border-default) font-semibold text-(--text-secondary)">No.</div>
                <div className="px-4 py-3 border-r border-(--border-default) font-semibold text-(--text-secondary)">Title</div>
                <div className="px-4 py-3 border-r border-(--border-default) font-semibold text-(--text-secondary)">Author</div>
                <div className="px-4 py-3 border-r border-(--border-default) font-semibold text-(--text-secondary)">Pages</div>
                <div className="px-4 py-3 font-semibold text-(--text-secondary) flex justify-center">Actions</div>
              </div>

              <div className="h-fit divide-y divide-(--border-default)">
                {books.map((book, index) => (
                  <div
                    key={book._id}
                    className="bg-(--bg-card) md:bg-transparent grid grid-cols-1 md:grid-cols-[0.5fr_3fr_2fr_1fr_1.5fr] gap-3 md:gap-0 p-4 md:p-0 hover:bg-(--bg-main) transition-(--transition-normal)"
                  >
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-2">
                      <h2 className="text-lg font-semibold text-(--text-primary)">
                        {book.title}
                      </h2>
                      <p className="text-sm text-(--text-secondary)">
                        Author: <span className="text-(--text-primary)">{book.author}</span>
                      </p>
                      <p className="text-sm text-(--text-secondary)">
                        Pages: <span className="text-(--text-primary)">{book.pages}</span>
                      </p>
                      <div className="flex gap-4 pt-2">
                        <Link
                          to={`/books/details/${book._id}`}
                          className="text-sm font-medium text-(--info) over:underline"
                        >
                          Details
                        </Link>
                        <Link
                          to={`/books/edit/${book._id}`}
                          className="text-sm font-medium text-(--gold-primary) hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/books/delete/${book._id}`}
                          className="text-sm font-medium text-(--error) over:underline"
                        >
                          Delete
                        </Link>
                      </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:flex px-4 py-3 items-center border-r border-(--border-default) text-(--text-secondary)">
                      {index + 1}
                    </div>

                    <div className="hidden md:flex px-4 py-3 items-center border-r border-(--border-default) font-medium text-(--text-primary)">
                      {book.title}
                    </div>

                    <div className="hidden md:flex px-4 py-3 items-center border-r border-(--border-default) text-(--text-secondary)">
                      {book.author}
                    </div>

                    <div className="hidden md:flex px-4 py-3 items-center border-r border-(--border-default) text-(--text-secondary)">
                      {book.pages}
                    </div>

                    <div className="hidden md:flex px-4 py-3 items-center gap-3 justify-center">
                      <Link
                        to={`/books/details/${book._id}`}
                        className="h-10 w-10 bg-(--bg-elevated) rounded-md flex justify-center items-center border-2 border-(--border-default) hover:scale-110 hover:border-2 hover:border-(--border-default) transition-(--transition-fast)"
                      >
                        <FaList size={18} className="text-(--info)" />
                      </Link>
                      <Link
                        to={`/books/edit/${book._id}`}
                        className="h-10 w-10 bg-(--bg-elevated) rounded-md flex justify-center items-center border-2 border-(--border-default) hover:scale-110 hover:border-2 hover:border-(--border-default) transition-(--transition-fast)"
                      >
                        <FaEdit size={18} className="text-(--gold-primary) ml-0.5" />
                      </Link>
                      <Link
                        to={`/books/delete/${book._id}`}
                        className="h-10 w-10 bg-(--bg-elevated) rounded-md flex justify-center items-center border-2 border-(--border-default) hover:scale-110 hover:border-2 hover:border-(--border-default) transition-(--transition-fast)"
                      >
                        <MdDelete size={20} className="text-(--error)" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="mt-6 text-(--text-secondary)">No Books Found</div>
        )}
      </div>
    </div>
  );
};

export default Home;
