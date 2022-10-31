import api from "./api";

const CategoryService = {
  getCategories: async () => {
    return (await api.get("/fee-assessment-categories")).data;
  },
};

export default CategoryService;
