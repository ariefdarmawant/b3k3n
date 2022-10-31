import api from "./api";

const BookService = {
  getBooks: async (category: number, page: number) => {
    try{
        let url;
        if(page!==null && page > 0){
            url = `/fee-assessment-books?page=${page}&categoryId=${category}&size=10`
        } else{
            url = `/fee-assessment-books?categoryId=${category}&size=10`
        }
        return (await api.get(url)).data;
    } catch(error){
        throw error;
    }
  },
};

export default BookService;
