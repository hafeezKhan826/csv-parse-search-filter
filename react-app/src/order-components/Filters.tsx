import React, { Fragment } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { FormControl, InputLabel, Input, Grid } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import _ from 'lodash';

interface FilterProps {
    dateEmitter: (date: string) => void,
    pincodeEmitter: (pincode: string) => void,
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
}
);
const Filters: React.FC<any> = (props: FilterProps) => {

    const classes = useStyles();
    const [pincodeFilter, setPincodeFilter] = useState<any>(0);
    const [dateFilter, setDateFilter] = useState<string>('');

    const handlePincodeFilterChange = (event: any) => setPincodeFilter(event.target.value)

    const pincodeEmitter = _.debounce(() => {
        props.pincodeEmitter(pincodeFilter)
    }, 1000)

    const handleDateChange = _.debounce((date: any) => {
        const newDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        setDateFilter(newDate)
        props.dateEmitter(newDate)
    }, 1000, { leading: true })

    return (
        <Fragment>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="pincodeFilter">Pin Code Filter</InputLabel>
                <Input id="pincodeFilter" name="pincodeFilter" value={pincodeFilter} onChange={handlePincodeFilterChange} onKeyUp={pincodeEmitter} />
            </FormControl>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="mm/dd/yyyy"
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
        </Fragment>
    )
};
export default Filters;

