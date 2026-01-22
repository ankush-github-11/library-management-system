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
    <div className="p-8">
      <div className="w-fit">
        <BackButton />
      </div>
      <h1 className="my-5">Create a Book</h1>
      <div className="flex flex-col gap-y-5">
        <input
          className="h-10 px-2 border-2 border-gray-500/50 rounded-md"
          type="text"
          placeholder="Enter the title"
          value={book.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setBook({ ...book, title: e.target.value })
          }
        />

        <input
          className="h-10 px-2 border-2 border-gray-500/50 rounded-md"
          type="text"
          placeholder="Enter the author"
          value={book.author}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setBook({ ...book, author: e.target.value })
          }
        />

        <input
          className="h-10 px-2 border-2 border-gray-500/50 rounded-md"
          type="text"
          placeholder="Enter the number of pages"
          value={book.pages}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setBook({ ...book, pages: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end">
        <button
          className="mt-5 w-fit px-4 py-2 bg-green-500 rounded-full cursor-pointer"
          onClick={handleChange}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Create"}
        </button>
      </div>
    </div>
  );
};

export default CreateBook;
