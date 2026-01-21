import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

interface Book {
  title: string;
  author: string;
  pages: string;
}
const EditBook = () => {
  const navigate = useNavigate();
  const [book, setBook] = useState<Book>({
    title: "",
    author: "",
    pages: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const {id} = useParams();
  useEffect(() =>{
    axios
      .get(`http://localhost:3000/books/${id}`)
      .then((res) =>{
        setLoading(false);
        setBook(res.data);
      })
      .catch((error) =>{
        console.log(error);
        setLoading(false);
      })
  }, [id]);
  const handleSubmit = () =>{
    if(!book.title || !book.author || !book.pages){
      alert("No fields should be blank");
      return;
    }
    if(isNaN(parseInt(book.pages))){
      alert("Pages should be Integer");
      return;
    }
    setSubmitting(true);
    axios
    .put(`http://localhost:3000/books/${id}`, book)
    .then(() =>{
      navigate('/', {replace: true});
    })
    .catch((error) => {
      console.log(error);
      setSubmitting(false);
    })
  }
  return (
    <div>
      <BackButton />
      <div>Edit the Book</div>
      {loading && (
        <div>
          <Spinner />
        </div>
      )}
      {!loading && (
        <div className="flex flex-col">
          <div>Book Title</div>
          <input type="text" placeholder="Enter the title" value={book.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
            setBook({...book, title: e.target.value});
          }}/>
          <div>Book Author</div>
          <input type="text" placeholder="Enter the author" value={book.author} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
            setBook({...book, author: e.target.value});
          }}/>
          <div>Book Title</div>
          <input type="text" placeholder="Enter the pages" value={book.pages} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
            setBook({...book, pages: e.target.value});
          }}/>
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Spinner /> : "Submit"}
          </button>
        </div>
        )
      }
    </div>
  )
};

export default EditBook;
