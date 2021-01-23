import React from 'react';
import './App.css';

export default function Pagination({ gotoNextPage, gotoPrevPage }) {
  return (
    <div id = "botoes">
      {gotoPrevPage && <button id="prev" onClick={gotoPrevPage}>&laquo; Anterior</button>}
      {gotoNextPage && <button id="next" onClick={gotoNextPage}>&laquo; Próxima</button>}
    </div>
  )
}


/*import React from 'react';

export default function Pagination({ nextPage, previousPage }){
    return (
        <div>
            {previousPage && <button onClick="{previousPage}">PreviousPage</button>}
            {nextPage && <button onClick="{nextPage}">NextPage</button>}
        </div>
    )
}
*/