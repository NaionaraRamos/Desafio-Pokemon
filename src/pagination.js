import React from 'react';

export default function Pagination({ nextPage, previousPage, paginate }){
    return (
        <div>
            {previousPage && <button onClick={() => paginate("previous")}>PreviousPage</button>}
            {nextPage && <button onClick={() => paginate("next")}>NextPage</button>}
        </div>
    )
}