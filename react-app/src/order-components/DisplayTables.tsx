import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';

import { makeStyles } from '@material-ui/core/styles';

import Filters from './Filters';
import axios from 'axios';
import { Paper, Table, TableHead, TableRow, TablePagination, TableCell, FormControl, InputLabel, Input, Grid, TableBody, TableFooter } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    formControl: {
        margin: '10px',
    },
}
);

const DisplayTable: React.FC<any> = (props: any) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [displayedOrders, setDisplayedOrders] = useState<any[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [limit] = useState(props.limit)
    const [size, setSize] = useState(0)
    const classes = useStyles();

    useEffect(() => {
        setOffset(0)
        console.log(props);
        getAndSet(offset)
    }, [props.limit])

    const getAndSet = (offset: number) => {
        axios.get(`http://localhost:3010/orders/get-orders?offset=${offset}&limit=${limit}`).then(result => {
            setOrders(result.data.orders);
            setDisplayedOrders(result.data.orders);
            setSize(result.data.size)
        })
    }

    const setCurrentOffset = (e: any) => {
        const newOffset = limit + offset;
        setOffset(newOffset);
        getAndSet(newOffset)
    }

    const dateFilterEmitter = (date: string) => {
        setOrders(orders)
        if (orders.length > 0) {
            const filteredOrders: any[] = orders.filter((order: any) => order.orderDate.includes(date));
            setDisplayedOrders(filteredOrders)
        }
    }

    const pincodeFilterEmitter = (pincode: string) => {
        setOrders(orders)
        if (orders.length > 0) {
            const filteredOrders: any[] = orders.filter((order: any) => order.deliveryPincode.includes(pincode));
            setDisplayedOrders(filteredOrders)
        }
    }

    return (
        <div>
            <Paper className={classes.root}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <Pagination count={size} currentPage={setCurrentOffset} offset={offset} />
                        </TableRow>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                                <Filters dateEmitter={dateFilterEmitter} pincodeEmitter={pincodeFilterEmitter} />
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Order Id</TableCell>
                            <TableCell>Customer Id</TableCell>
                            <TableCell>Delivery Pincode</TableCell>
                            <TableCell>Order Date</TableCell>
                            <TableCell>Items</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedOrders.length > 0 ?

                            displayedOrders.map((order: any) => {
                                const items = order.items.split(';')
                                return <TableRow key={order.orderId}>
                                    <TableCell component="th" scope="row">
                                        {order.orderId}
                                    </TableCell>
                                    <TableCell>{order.customerId}</TableCell>
                                    <TableCell>{order.deliveryPincode}</TableCell>
                                    <TableCell>{order.orderDate}</TableCell>
                                    <TableCell align='justify'>{items.map((dun: string, i: number) => <div key={i}>{dun.split(':').join(" - ")}</div>)}</TableCell>
                                </TableRow>
                            })
                            : 'No matches to display'}

                    </TableBody>
                    <TableFooter>

                    </TableFooter>
                </Table>
            </Paper>
        </div>
    )
};
export default DisplayTable;



