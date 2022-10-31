import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import CategoryService from "../services/category.service";
import { Book, Category } from "../types";
import { useSearchParams } from "react-router-dom";
import { SkeletonCard } from "../components/SkeletonCard";
import SearchBar from "../components/SearchBar";
import BookService from "../services/book.service";
import { AxiosError } from "axios";
import SkeletonCategory from "../components/SkeletonCategory";
import { ReactComponent as BookmarkIcon } from "../assets/bookmark.svg";
import { ReactComponent as BookmarkFill } from "../assets/bookmark-fill.svg";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [page, setPage] = useState(0);
  const maxPage = useRef(false);
  const category = searchParams.get("category") || "1";
  const activeTabs = searchParams.get("tabs") || "browse";
  const loader = useRef(null);
  const [bookmarkList, setBookmarkList] = useState<number[]>(
    JSON.parse(localStorage.getItem("bookmarkList") || `[]`)
  );
  const [bookmarked, setBookmarked] = useState<Book[]>(
    JSON.parse(localStorage.getItem("bookmarked") || `[]`)
  );

  const loadBooks = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      BookService.getBooks(parseInt(category), page)
        .then((res) => {
          setBooks((prev) => [...prev, ...res]);
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 404) {
            maxPage.current = true ;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }, 1500);
  }, [category, page]);

  const resetState = () => {
    setBooks([]);
    setLoading(false);
    maxPage.current = false
    setPage(0);
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !maxPage.current) {
        setPage((prev) => prev + 1);
      }
    },
    []
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  useEffect(() => {
    if (activeTabs === "browse" && !maxPage.current) {
      loadBooks();
    }
  }, [activeTabs, loadBooks]);

  const getCategoriesAsync = useCallback(async () => {
    setCategories(await CategoryService.getCategories());
    setLoadingCategory(false);
  }, []);

  useEffect(() => {
    if (activeTabs === "browse") {
      setLoadingCategory(true);
      getCategoriesAsync();
    }
  }, [getCategoriesAsync, activeTabs]);

  useEffect(() => {
    if (search) {
      setFilteredBooks(
        books.filter(
          (obj) => obj.authors.includes(search) || obj.title.includes(search)
        )
      );
    }
  }, [search, books]);

  const onChangeCategory = (id: number) => {
    resetState();
    searchParams.set("category", `${id}`);
    setSearchParams(searchParams);
  };

  const onSearchType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onChangeTabs = (activeTabs: string) => {
    resetState();
    searchParams.set("tabs", activeTabs);
    if (activeTabs === "bookmark") {
      setCategories([]);
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  const onSaveBookmark = (obj: Book) => {
    const oldBookmark = JSON.parse(localStorage.getItem("bookmarked") || "[]");
    const oldBookmarkList = JSON.parse(
      localStorage.getItem("bookmarkList") || "[]"
    );
    if (oldBookmarkList.includes(obj.id)) {
      localStorage.setItem(
        "bookmarked",
        JSON.stringify(oldBookmark.filter((val: Book) => val.id !== obj.id))
      );
      localStorage.setItem(
        "bookmarkList",
        JSON.stringify(oldBookmarkList.filter((val: number) => val !== obj.id))
      );
      setBookmarkList((prev: number[]) => prev.filter((val) => val !== obj.id));
      setBookmarked((prev: Book[]) => prev.filter((val) => val.id !== obj.id));
    } else {
      localStorage.setItem("bookmarked", JSON.stringify([...oldBookmark, obj]));
      localStorage.setItem(
        "bookmarkList",
        JSON.stringify([...oldBookmarkList, obj.id])
      );
      setBookmarkList((prev: number[]) => [...prev, obj.id]);
      setBookmarked((prev: Book[]) => [...prev, obj]);
    }
  };

  return (
    <div className="p-16 h-screen flex flex-col gap-4 dark:text-white">
      <div className="grid grid-cols-2 text-center cursor-pointer">
        <div
          className={
            (activeTabs === "browse"
              ? " border-b-2 border-b-blue-400 rounded-lg "
              : "") + "py-4"
          }
          onClick={() => onChangeTabs("browse")}
        >
          Browse Books
        </div>
        <div
          className={
            (activeTabs === "bookmark"
              ? " border-b-2 border-b-blue-400 rounded-lg "
              : "") + "py-4  drop-shadow-md"
          }
          onClick={() => onChangeTabs("bookmark")}
        >
          Your Bookmark
        </div>
      </div>
      {activeTabs === "browse" ? (
        <React.Fragment>
          <div className="flex flex-row gap-8 flex-wrap w-full ">
            {categories.map((obj, index) => (
              <button
                className={
                  (parseInt(searchParams.get("category") || "1", 10) === obj.id
                    ? " transition-transform scale-y-110 font-bold bg-gradient-to-r from-indigo-300 to-purple-500 dark:from-black dark:to-gray-900 "
                    : " bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-gray-400 dark:to-gray-600 ") +
                  "p-8  text-white rounded-lg  flex-1 min-w-[150px]"
                }
                onClick={() => onChangeCategory(obj.id)}
                key={index}
              >
                {obj.name}
              </button>
            ))}
            {loadingCategory && <SkeletonCategory />}
          </div>
          <SearchBar search={search} handleChange={onSearchType} />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {!search &&
              books.length !== 0 &&
              books.map((obj, id) => {
                return (
                  <div
                    key={id}
                    className="relative min-w-[150px] mx-auto shadow-lg dark:shadow-gray-600 p-4"
                  >
                    <button
                      className="absolute top-5 right-5"
                      onClick={() => onSaveBookmark(obj)}
                    >
                      {bookmarkList.includes(obj.id) ? (
                        <BookmarkFill className="w-6 h-6 text-black" />
                      ) : (
                        <BookmarkIcon className="w-6 h-6 text-black" />
                      )}
                    </button>
                    <img
                      src={obj.cover_url}
                      alt={obj.title}
                      aria-label={obj.description}
                    />
                    <div className="font-semibold">
                      {obj.authors.join(", ")}
                    </div>
                    <div className="font-bold text-lg">{obj.title}</div>
                  </div>
                );
              })}
            {search &&
              filteredBooks.length !== 0 &&
              filteredBooks.map((obj, id) => {
                return (
                  <div
                    key={id}
                    className="relative min-w-[150px] mx-auto shadow-lg p-4"
                  >
                    <button
                      className="absolute top-5 right-5"
                      onClick={() => onSaveBookmark(obj)}
                    >
                      {bookmarkList.includes(obj.id) ? (
                        <BookmarkFill className="w-6 h-6 text-black" />
                      ) : (
                        <BookmarkIcon className="w-6 h-6 text-black" />
                      )}
                    </button>
                    <img
                      src={obj.cover_url}
                      alt={obj.title}
                      aria-label={obj.description}
                    />
                    <div className="font-semibold">
                      {obj.authors.join(", ")}
                    </div>
                    <div className="font-bold text-lg">{obj.title}</div>
                  </div>
                );
              })}
            {!search && loading && <SkeletonCard />}
          </div>
          {!search && books.length === 0 && !loading && (
            <div className="flex justify-center items-center bg-gray-100 w-full h-[50rem] rounded-lg dark:bg-gray-800">
              No book found with this category.
            </div>
          )}
          {search && filteredBooks.length === 0 && (
            <div className="flex justify-center items-center bg-gray-100 w-full h-[50rem] rounded-lg dark:bg-gray-800">
              No book match the query.
            </div>
          )}
          <div ref={loader} />
        </React.Fragment>
      ) : bookmarked.length !== 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {bookmarked.map((obj, id) => {
            return (
              <div
                key={id}
                className="relative min-w-[150px] mx-auto shadow-lg p-4"
              >
                <button
                  className="absolute top-5 right-5"
                  onClick={() => onSaveBookmark(obj)}
                >
                  {bookmarkList.includes(obj.id) ? (
                    <BookmarkFill className="w-6 h-6 text-black" />
                  ) : (
                    <BookmarkIcon className="w-6 h-6 text-black" />
                  )}
                </button>
                <img
                  src={obj.cover_url}
                  alt={obj.title}
                  aria-label={obj.description}
                />
                <div className="font-semibold">{obj.authors.join(", ")}</div>
                <div className="font-bold text-lg">{obj.title}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex w-full items-center justify-center h-[40rem] bg-gray-100 dark:bg-gray-800 rounded-lg">
          No bookmark added.
        </div>
      )}
    </div>
  );
};

export default Home;
