import React from 'react';
import './InfoBox.css';
import {
    Card,
    CardContent,
    Typography
} from '@material-ui/core';

function InfoBox({ isRed, active, title, cases, total, ...props }) {
    return (
        <Card className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`} onClick={props.onClick}>
            < CardContent >
                <Typography
                    color="textSecondary"
                    className="infoBox__title"
                >
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${!isRed && 'info__cases__green'}`}>{cases}</h2>
                <Typography
                    color="textSecondary"
                    className="infoBox__total"
                >
                    {total} Total
                </Typography>
            </ CardContent>
        </Card>
    )
}

export default InfoBox;
