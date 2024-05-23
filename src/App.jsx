import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [bookData, setBookData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://openlibrary.org/search.json?title=the+lord+of+the+rings"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setBookData(result.docs);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const sortedData = [...bookData].sort((a, b) => {
    const aValue = a[sortConfig.key] || "";
    const bValue = b[sortConfig.key] || "";
    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const toggleSortDirection = () => {
    setSortConfig((prevState) => ({
      ...prevState,
      direction:
        prevState.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(bookData.length / pageSize);

  return (
    <div className="flex justify-center items-center p-8">
      <div className="flex flex-col justify-between w-full md:w-[85%] gap-8">
        <h1 className="text-2xl font-bold text-center">ADMIN DASHBOARD</h1>
        <div className="flex justify-between items-center mb-4">
          <div>
            Show
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="mx-2 p-2 border border-gray-300 rounded"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            entries
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleSortDirection}
              className="mx-2 px-4 py-2 border border-gray-300 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Sort {sortConfig.direction === "ascending" ? "▲" : "▼"}
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-2 px-4 py-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-2 px-4 py-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="border border-red-500 w-full">
            <thead className="">
              <tr className="bg-red-300">
                <th className="border border-red-500 px-4 py-2">
                  Ratings Average
                </th>
                <th className="border border-red-500 px-4 py-2">Author Name</th>
                <th className="border border-red-500 px-4 py-2">Title</th>
                <th className="border border-red-500 px-4 py-2">
                  First Published Year
                </th>
                <th className="border border-red-500 px-4 py-2">Subject</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((book, index) => (
                <tr key={index} className="cursor-pointer hover:bg-gray-100">
                  <td className="border border-red-500 px-4 py-2">
                    {book.ratings_average || "N/A"}
                  </td>
                  <td className="border border-red-500 px-4 py-2">
                    {book.author_name && book.author_name.length > 0
                      ? book.author_name.join(", ")
                      : "N/A"}
                  </td>
                  <td className="border border-red-500 px-4 py-2">
                    {book.title || "N/A"}
                  </td>
                  <td className="border border-red-500 px-4 py-2">
                    {book.first_publish_year || "N/A"}
                  </td>
                  <td className="border border-red-500 px-4 py-2">
                    {book.subject && book.subject.length > 0
                      ? book.subject[0]
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-2 px-4 py-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="mx-2 px-4 py-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
