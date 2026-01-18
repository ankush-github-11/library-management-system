import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import axios from "axios";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
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
  useEffect(() => {
    axios
      .get<Book>(`http://localhost:3000/books/${id}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);
  return (
    <div className="min-h-screen h-fit p-8">
      <div className="w-20 rounded-lg">
        <BackButton />
      </div>
      <h1 className="text-2xl font-bold mb-5 mt-10">Book Detail</h1>
      {loading && (
        <div className="flex justify-center items-center h-fit w-full">
          <Spinner />
        </div>
      )}
      {book && (
        <div>
          <div className="flex gap-x-2">
            <div>Title</div>
            <div>-</div>
            <div>{book.title}</div>
          </div>

          <div className="flex gap-x-2">
            <div>Author</div>
            <div>-</div>
            <div>{book.author}</div>
          </div>

          <div className="flex gap-x-2">
            <div>Pages</div>
            <div>-</div>
            <div>{book.pages}</div>
          </div>

          <div className="flex gap-x-2">
            <div>Created At</div>
            <div>-</div>
            <div>{new Date(book.createdAt).toLocaleString()}</div>
          </div>

          <div className="flex gap-x-2">
            <div>Updated At</div>
            <div>-</div>
            <div>{new Date(book.updatedAt).toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBook;
