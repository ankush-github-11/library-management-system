import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
interface Book{
  _id: string;
  title: string;
  author: string;
  pages: number;
}
const Home : React.FC = () => {
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
  return (
    <div className="p-6 h-screen w-screen">
      <h1 className="text-2xl font-bold mb-4">Books</h1>

      {loading && (
        <div className="flex justify-center items-center h-fit w-full">
          <Spinner />
        </div>
      )}

      {!loading && books.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-transparent rounded-lg shadow overflow-hidden">
            <thead className="bg-gray-500/30">
              <tr>
                <th className="border-2 border-gray-500/50 px-4 py-2 text-left">No.</th>
                <th className="border-2 border-gray-500/50 px-4 py-2 text-left">Title</th>
                <th className="border-2 border-gray-500/50 px-4 py-2 text-left">Author</th>
                <th className="border-2 border-gray-500/50 px-4 py-2 text-left">Pages</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book, index) => (
                <tr key={book._id} className="hover:bg-gray-500/5 transition">
                  <td className="border-2 border-gray-500/50  px-4 py-2">{index + 1}</td>
                  <td className="border-2 border-gray-500/50 px-4 py-2 font-medium">{book.title}</td>
                  <td className="border-2 border-gray-500/50 px-4 py-2">{book.author}</td>
                  <td className="border-2 border-gray-500/50 px-4 py-2">{book.pages}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && books.length === 0 && <div>No Books Found</div>}
    </div>
  );
};

export default Home;
