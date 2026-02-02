import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { FaList } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { socket } from "../socket";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Book {
  _id: string;
  title: string;
  author: string;
  pages: number;
}
const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchBooks = async (query: string) => {
    try {
      setLoading(true);
      const res = await axios.get<{ data: Book[] }>(
        `${API_BASE_URL}/books?search=${encodeURIComponent(query)}`,
      );
      setBooks(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(debouncedSearch);
  }, [debouncedSearch]);
  useEffect(() => {
    const handleBookAdded = (newBook: Book) => {
      if (!search) {
        setBooks((prev) => [...prev, newBook]);
      } else {
        fetchBooks(search);
      }
    };

    const handleBookEdited = (updatedBook: Book) => {
      if (!search) {
        setBooks((prev) =>
          prev.map((book) =>
            book._id === updatedBook._id ? updatedBook : book,
          ),
        );
      } else {
        fetchBooks(search);
      }
    };

    const handleBookDeleted = (id: string) => {
      if (!search) {
        setBooks((prev) => prev.filter((book) => book._id !== id));
      } else {
        fetchBooks(search);
      }
    };

    socket.on("book-added", handleBookAdded);
    socket.on("book-edited", handleBookEdited);
    socket.on("book-deleted", handleBookDeleted);
    return () => {
      socket.off("book-added", handleBookAdded);
      socket.off("book-edited", handleBookEdited);
      socket.off("book-deleted", handleBookDeleted);
    };
  }, [search]);
  return (
    <div className="bg-(--bg-main) px-4 sm:px-8 py-8 min-h-screen w-full text-(--text-primary)">
      <div className="max-w-7xl mx-auto">
        <div className="w-full mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="h-fit">
            <h1 className="text-5xl font-bold bg-(--gold-soft)  bg-clip-text text-transparent py-2">
              Library Dashboard
            </h1>
            <p className="text-(--text-secondary) text-base">
              Manage your books collection with elegance
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => {
                setLoading(true);
                setSearch(e.target.value);
              }}
              className="
              w-full sm:w-80
              px-4 py-2
              rounded-xl
              bg-(--bg-elevated)
              outline-2 outline-(--gold-soft)/60
              text-(--text-secondary)
              placeholder:text-(--text-muted)
              focus:outline-2
              focus:outline-(--border-gold)/80
              select-none
              "
            />
          </div>
          <Link
            to="/books/create"
            aria-label="Create a book"
            className="group relative inline-flex mt-2 lg:mt-0 h-10.5 w-38 items-center justify-center rounded-full
           bg-[rgba(255,255,255,0.03)]
           backdrop-blur-sm transform transition-all duration-300
           hover:scale-105
           shadow-[0_0_0_1.5px_var(--gold-soft),0_0_15px_color-mix(in_srgb,var(--gold-soft)_25%,transparent),0_0_30px_color-mix(in_srgb,var(--gold-soft)_20%,transparent)]
           focus:outline-none focus-visible:ring-2
           focus-visible:ring-[var(--gold-soft)/20]
           overflow-hidden"
          >
            {/* soft gold halo (appears on hover) */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-80
               bg-linear-to-r from-(--gold-soft) via-transparent to-(--gold-soft)
               blur-2xl"
            />

            {/* thin beveled highlight at top-left */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 -z-5 h-8/40 w-7/10 rounded-tl-2xl rounded-br-2xl
              bg-linear-to-r from-(--gold-soft) to-transparent opacity-70 pointer-events-none blur-[5px]"
            />

            {/* thin beveled highlight at bottom-right */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 right-0 -z-5 h-8/40 w-7/10 rounded-tl-2xl rounded-br-2xl
               bg-linear-to-r from-transparent to-(--gold-soft) opacity-70 pointer-events-none blur-[5px]"
            />

            {/* subtle animated sheen that sweeps on hover */}
            <span
              aria-hidden="true"
              className="absolute left-[-80%] top-0 -z-10 h-full w-[70%] transform-gpu
               bg-linear-to-r from-transparent via-(--gold-soft)/50 to-transparent blur-md
               transition-transform duration-900 group-hover:translate-x-[260%]"
            />

            {/* content: icon + label */}
            <span className="relative z-10 flex items-center gap-2 px-4 font-semibold tracking-wide text-(--gold-soft) select-none">
              Create a Book
            </span>
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
                <div className="px-4 py-3 border-r border-(--border-default) font-semibold text-(--text-secondary)">
                  No.
                </div>
                <div className="px-4 py-3 border-r border-(--border-default) font-semibold text-(--text-secondary)">
                  Title
                </div>
                <div className="px-4 py-3 border-r border-(--border-default) font-semibold text-(--text-secondary)">
                  Author
                </div>
                <div className="px-4 py-3 border-r border-(--border-default) font-semibold text-(--text-secondary)">
                  Pages
                </div>
                <div className="px-4 py-3 font-semibold text-(--text-secondary) flex justify-center">
                  Actions
                </div>
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
                        Author:{" "}
                        <span className="text-(--text-primary)">
                          {book.author}
                        </span>
                      </p>
                      <p className="text-sm text-(--text-secondary)">
                        Pages:{" "}
                        <span className="text-(--text-primary)">
                          {book.pages}
                        </span>
                      </p>
                      <div className="flex gap-3 pt-2">
                        <Link
                          to={`/books/details/${book._id}`}
                          className="flex justify-center border border-gray-500/20 rounded-sm py-1.5 w-17 text-sm font-medium text-(--info) hover:underline"
                        >
                          Details
                        </Link>
                        <Link
                          to={`/books/edit/${book._id}`}
                          className="flex justify-center border border-gray-500/20 rounded-sm py-1.5 w-13.5 text-sm font-medium text-(--gold-primary) hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/books/delete/${book._id}`}
                          className="flex justify-center border border-gray-500/20 rounded-sm py-1.5 w-17 text-sm font-medium text-(--error) hover:underline"
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
                        <FaEdit
                          size={18}
                          className="text-(--gold-primary) ml-0.5"
                        />
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
          <div className="mt-12 text-center">
            <p className="text-lg font-medium text-(--text-secondary)">
              No books found
            </p>
            {search && (
              <p className="text-sm text-(--text-muted) mt-1">
                Try a different title or author
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
