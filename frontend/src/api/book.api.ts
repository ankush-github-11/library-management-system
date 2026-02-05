import axiosInstance from './axiosInstance';
interface Book {
  _id: string;
  title: string;
  author: string;
  pages: number;
}
export const getBooks = async (search: string) : Promise<Book[]> =>{
    const res = await axiosInstance.get('/books', {
        params: {search: search},
    });
    return res.data.data;
};