import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination, TextField, FormControl, InputLabel, Input, Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import * as _ from "lodash";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

interface CSVProps {
    loadCSV: boolean,
    offset: number,
    limit: number,
}

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
});


const CSV: React.FC<CSVProps> = (props: any) => {


    const [orders, setOrders] = useState<any[]>([]);
    const [displayedOrders, setDisplayedOrders] = useState<any[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [limit] = useState(props.limit)
    const [size, setSize] = useState(0)
    const classes = useStyles();
    const [page, setPage] = useState<number>(0);


    const [pincodeFilter, setPincodeFilter] = useState<any>(0);
    const [dateFilter, setDateFilter] = useState<string>('');

    const getAndSet = (offset: number) => {
        if (offset) { 
            
            axios.get(`http://localhost:3010/users/get-orders?offset=${offset}&limit=${limit}`).then(result => {
                setOrders(result.data.orders);
                setDisplayedOrders(result.data.orders);
                setSize(result.data.size)
            })
        }
    }

    useEffect(() => {
        setOffset(props.offset)
        getAndSet(props.offset)
    }, [props.offset, props.limit, props.orders, props.displayedOrders])

    const handleChangePage = _.throttle((event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
        setOffset(limit + offset);
        getAndSet(limit + offset)
    }, 2000)


    const handlePincodeFilterChange = (event: any) => {
        setPincodeFilter(event.target.value)
        setOrders(orders)
        if (orders.length > 0) {
            const filteredOrders: any[] = orders.filter((order: any) => order.deliveryPincode.includes(event.target.value));
            setDisplayedOrders(filteredOrders)
        }
    }

    const handleDateChange = (date: any) => {
        const newDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        console.log(newDate, orders.length);
        setOrders(orders)
        console.log(newDate, orders.length);
        setDateFilter(newDate)
        if (orders.length > 0) {
            const filteredOrders: any[] = orders.filter((order: any) => order.orderDate.includes(newDate));
            setDisplayedOrders(filteredOrders)
        }
    }

    /*     const handleDateChange = (date: any) => {
            const newDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    
            if (orders.length > 0) {
                return orders.filter((order: any) => order.orderDate.includes())
            } else {
                setOrders([])
            }
        }; */
    // _.throttle((event: any) => console.log(event.target), 1000)

    // _.debounce(, 400);

    // const handleChange = _.debounce((event: any | null) => {
    //     console.log(event.target.value);
    //     if (orders.length > 0) {
    //         return orders.filter((order: any) => order.deliveryPincode.includes())
    //     } else {
    //         setOrders([])
    //     }
    // }, 2000)

    return (
        <Paper className={classes.root}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[]}
                            colSpan={5}
                            count={size}
                            rowsPerPage={20}
                            page={page}
                            onChangePage={handleChangePage} />
                    </TableRow>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="pincodeFilter">Pin Code Filter</InputLabel>
                                <Input id="pincodeFilter" name="pincodeFilter" value={pincodeFilter} onChange={handlePincodeFilterChange} />
                            </FormControl>
                        </TableCell>
                        <TableCell>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="Date picker inline"
                                        defaultValue="11/04/2019"
                                        value={dateFilter}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
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
                    {displayedOrders.map((order: any) => {
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
                    })}
                </TableBody>
                <TableFooter>

                </TableFooter>
            </Table>
        </Paper>
    )
};
export default CSV;