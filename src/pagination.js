import React from 'react';
import { Button } from '@material-ui/core';

export default function Pagination({ nextPage, previousPage, paginate }){
    return (
        <div class="paginacao">         
            {previousPage && <Button color="primary" variant="contained" onClick={() => paginate("previous")}>ANTERIOR</Button>}
            {nextPage && <Button color="primary" variant="contained" onClick={() => paginate("next")}>PRÓXIMA</Button>}
        </div>
    )
}