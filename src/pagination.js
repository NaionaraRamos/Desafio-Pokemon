import React from 'react';

export default function Pagination({ nextPage, previousPage }){
    return (
        <div>
            {previousPage && <button onClick="{previousPage}">PreviousPage</button>}
            {nextPage && <button onClick="{nextPage}">NextPage</button>}
        </div>
    )
}