import React, {useState} from 'react';
import "./PaginatedPanel.css"
const PaginatedPanel = ({items, title, itemsPerPage = 10, renderEntry}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    console.log(currentItems);
    return (
        <div className="panel">
            <div className={"list-container"}>
                <h1>{title}</h1>
                <ul>
                    {currentItems.map((item, index) => (
                        <li key={index}>
                            {renderEntry(item)}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                        Prev
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
        </div>
    );
};

export default PaginatedPanel;
