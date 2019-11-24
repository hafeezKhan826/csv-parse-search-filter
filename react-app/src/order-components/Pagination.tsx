import React, { Fragment } from 'react';
import { TablePagination } from '@material-ui/core';

import { useEffect, useState } from 'react';
import _ from 'lodash';


interface PaginationProps {
    count: number,
    offset: number,
    currentPage: (page: number) => void,
}



const Pagination: React.FC<PaginationProps> = (props: any) => {

    const [page, setPage] = useState<number>(0);
    const [count, setCount] = useState<number>(props.count);

    const handleChangePage = _.throttle((event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        props.currentPage(page)
        setPage(page)
    }, 500, { leading: false });


    useEffect(() => {
        setCount(props.count)
    }, [props.count, page])

    return (
        <Fragment>
            <TablePagination
                rowsPerPageOptions={[]}
                colSpan={5}
                count={count}
                rowsPerPage={20}
                page={page}
                onChangePage={handleChangePage} />
        </Fragment>
    )
};
export default Pagination;