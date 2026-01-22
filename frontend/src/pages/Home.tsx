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
    <div className="px-8 py-8 h-fit w-full">
      <div className="mx-auto">
        <div className="h-fit w-full mb-10 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Books</h1>
          <Link
            to={"/books/create"}
            className="py-2 px-4 rounded-full border-2 bg-purple-900 border-gray-500/50 hover:border-gray-200/50"
          >
            <span className="text-gray-200">Create a Book</span>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-fit w-full">
            <Spinner />
          </div>
        )}

        {!loading && books.length > 0 && (
          <div className="">
            <div className="w-full rounded-lg shadow overflow-hidden border-2 border-gray-500/50">
              <div className="grid grid-cols-[0.5fr_3fr_2fr_1fr_1.5fr] bg-gray-500/30">
                <div className="px-4 py-2 border-r-2 border-b-2 border-gray-500/50 font-semibold">
                  No.
                </div>
                <div className="px-4 py-2 border-r-2 border-b-2 border-gray-500/50 font-semibold">
                  Title
                </div>
                <div className="px-4 py-2 border-r-2 border-b-2 border-gray-500/50 font-semibold">
                  Author
                </div>
                <div className="px-4 py-2 border-r-2 border-b-2 border-gray-500/50 font-semibold">
                  Pages
                </div>
                <div className="px-4 py-2 font-semibold border-b-2 border-gray-500/50 flex justify-center">
                  Actions
                </div>
              </div>

              <div className="h-fit divide-y divide-gray-500/50">
                {books.map((book, index) => (
                  <div
                    key={book._id}
                    className="h-fit grid grid-cols-[0.5fr_3fr_2fr_1fr_1.5fr] items-center hover:bg-gray-500/5 transition"
                  >
                    <div className="px-4 py-2 h-full flex items-center border-r-2 border-gray-500/50">
                      {index + 1}
                    </div>

                    <div className="px-4 py-2 h-full flex items-center border-r-2 border-gray-500/50 font-medium">
                      {book.title}
                    </div>

                    <div className="px-4 py-2 h-full flex items-center border-r-2 border-gray-500/50">
                      {book.author}
                    </div>

                    <div className="px-4 py-2 h-full flex items-center border-r-2 border-gray-500/50">
                      {book.pages}
                    </div>

                    <div className="px-4 py-2 h-full flex items-center gap-3 justify-center">
                      <Link
                        to={`/books/details/${book._id}`}
                        className="hover:border-2 hover:border-gray-500/50 h-10 w-10 bg-gray-500/30 rounded-md flex justify-center items-center"
                      >
                        <FaList size={18} className="text-cyan-500" />
                      </Link>
                      <Link
                        to={`/books/edit/${book._id}`}
                        className="hover:border-2 hover:border-gray-500/50 h-10 w-10 bg-gray-500/30 rounded-md flex justify-center items-center"
                      >
                        <FaEdit size={18} className="text-yellow-500 ml-1" />
                      </Link>
                      <Link
                        to={`/books/delete/${book._id}`}
                        className="hover:border-2 hover:border-gray-500/50 h-10 w-10 bg-gray-500/30 rounded-md flex justify-center items-center"
                      >
                        <MdDelete size={20} className="text-pink-500" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && books.length === 0 && <div>No Books Found</div>}
      </div>
    </div>
  );
};

export default Home;
