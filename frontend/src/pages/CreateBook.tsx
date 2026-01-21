import axios from "axios";
import { useState } from "react";
import Spinner from "../components/Spinner";

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
  const [popup, setPopup] = useState(false);

  const handleChange = async () => {
    // ✅ Validation first
    if (!book.title || !book.author || !book.pages) {
      alert("All fields are required");
      return;
    }

    if (isNaN(Number(book.pages))) {
      alert("Pages must be a number");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:3000/books/", {
        ...book,
        pages: Number(book.pages),
      });

      // reset form
      setBook({
        title: "",
        author: "",
        pages: "",
      });

      // show popup
      setPopup(true);
      setTimeout(() => setPopup(false), 2000);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {popup && <div>Book Created Successfully</div>}

      <h2>Create a Book</h2>

      <input
        type="text"
        placeholder="Enter the title"
        value={book.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setBook({ ...book, title: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Enter the author"
        value={book.author}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setBook({ ...book, author: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Enter the number of pages"
        value={book.pages}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setBook({ ...book, pages: e.target.value })
        }
      />

      <button onClick={handleChange} disabled={loading}>
        {loading ? <Spinner /> : "Create"}
      </button>
    </div>
  );
};

export default CreateBook;
