import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Accordion, AccordionSummary, Button, Card, CardContent, CardHeader, Container } from '@material-ui/core';
import clsx from 'clsx';

import { getGridDateOperators } from '@material-ui/data-grid';
import { useState } from 'react';
import { useEffect } from 'react';
import Resalt from '../Resalt';
import axios from 'axios';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',

    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,

    },
    root: {
        height: 100,
        flexGrow: 1,
        maxWidth: 400,


    },
    rootcard: {
        maxWidth: 400,


    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),

    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    secondaryHeading: {
        paddingLeft: "20px"
    }

}));

export default function Data() {
    const classes = useStyles();
    const [rows, setRow] = useState([])
    const [startDate, setStartDate] = useState()
    const [finishDate, setFinishDate] = useState()
    const [loading, setLoading] = useState(false)
    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const get = () => {
        axios("https://politic-map-server.herokuapp.com/api/googlesheets/getDataFromSpreadSheet?id=1E0-R3MSi296MfaXSt7MvjlLJu9jZICEMBEAU7U-QDe4&range=Загальна структура").then(res => {


            console.log(res.data)

            var resAr = res.data.data.values.filter((el) => {
                try {
                    var parts = el[6].split('.');
                    var mydate = new Date(parts[2], parts[1] - 1, parts[0], 4, 0, 0);

                    if ((mydate >= new Date(startDate)) && (mydate <= new Date(finishDate))) return el
                } catch (error) {
                    // console.log(el)
                }

            }).map((el, index) => { return { id: index + 1, Name: el[5], check: el[11], task: el[9], date: el[6], obl: el[0], rada: el[1], objectEdit: el[8], tipTask: el[15] } })

            var resAr = resAr.sort((a, b) => {
                if (a.Name + a.check + a.tipTask + a.obl < b.Name + b.check + b.tipTask + b.obl) //сортируем строки по возрастанию
                    return -1
                if (a.Name + a.check + a.tipTask + a.obl > b.Name + b.check + b.tipTask + b.obl)
                    return 1
                return 0 // Никакой сортировки
            })

            // console.log(resAr)
            var objIsp = {}

            var isp = ""

            resAr.forEach(e => {
                if (isp != e.Name) {
                    isp = e.Name
                    if (e.check === "TRUE") {
                        objIsp[isp] = { checkTrue: 1, checkFalse: 0, arrT: {}, arrF: {} }
                    } else {
                        objIsp[isp] = { checkTrue: 0, checkFalse: 1, arrT: {}, arrF: {} }
                    }
                }
                else {
                    if (e.check === "TRUE") {
                        objIsp[isp].checkTrue += 1
                    } else {
                        objIsp[isp].checkFalse += 1
                    }
                }


                if (e.check === "TRUE") {
                    if (!objIsp[isp].arrT[e.tipTask]) {
                        objIsp[isp].arrT[e.tipTask] = []
                    }

                    objIsp[isp].arrT[e.tipTask].push({ rigin: e.obl, object: e.objectEdit })
                } else {
                    if (!objIsp[isp].arrF[e.tipTask]) {
                        objIsp[isp].arrF[e.tipTask] = []
                    }

                    objIsp[isp].arrF[e.tipTask].push({ rigin: e.obl, object: e.objectEdit })
                }


            }
            );


            //  console.log(objIsp)
            var id = 1
            var resArEnd = []
            Object.keys(objIsp).forEach(el => {
                resArEnd.push({
                    id: id, Name: el,
                    Plan: objIsp[el].checkTrue + objIsp[el].checkFalse,
                    Fact: objIsp[el].checkTrue,
                    Ostatok: objIsp[el].checkFalse,
                    arrT: { ...objIsp[el].arrT },
                    arrF: { ...objIsp[el].arrF },
                })
                id += 1
            })

            setRow(resArEnd)
            setLoading(false)
            console.log(resArEnd)
        })

    }

    useEffect(() => {
        var now = new Date();
        var next_week_start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (2 - now.getDay()));

        const dateNow = next_week_start
        const year = dateNow.getFullYear(); // Getting current year from the created Date object
        const monthWithOffset = dateNow.getUTCMonth() + 1; // January is 0 by default in JS. Offsetting +1 to fix date for calendar.
        const month = // Setting current Month number from current Date object
            monthWithOffset.toString().length < 2 // Checking if month is < 10 and pre-prending 0 to adjust for date input.
                ? `0${monthWithOffset}`
                : monthWithOffset;
        const date =
            dateNow.getUTCDate().toString().length < 2 // Checking if date is < 10 and pre-prending 0 if not to adjust for date input.
                ? `0${dateNow.getUTCDate()}`
                : dateNow.getUTCDate();

        const materialDateInput = `${year}-${month}-${date}`;

        setStartDate(materialDateInput)

    }, [])


    useEffect(() => {
        var now = new Date(startDate)
        var next_week_start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (8 - now.getDay()));

        const dateNow = next_week_start
        const year = dateNow.getFullYear(); // Getting current year from the created Date object
        const monthWithOffset = dateNow.getUTCMonth() + 1; // January is 0 by default in JS. Offsetting +1 to fix date for calendar.
        const month = // Setting current Month number from current Date object
            monthWithOffset.toString().length < 2 // Checking if month is < 10 and pre-prending 0 to adjust for date input.
                ? `0${monthWithOffset}`
                : monthWithOffset;
        const date =
            dateNow.getUTCDate().toString().length < 2 // Checking if date is < 10 and pre-prending 0 if not to adjust for date input.
                ? `0${dateNow.getUTCDate()}`
                : dateNow.getUTCDate();

        const materialDateInput = `${year}-${month}-${date}`;


        setFinishDate(materialDateInput)
    }, [startDate])

    useEffect(() => {
        console.log(finishDate)
        if (finishDate) {
            setLoading(true)
            get()
        }
    }, [finishDate])

    return (
        <>
            {loading && <div> <Skeleton />
                <Skeleton animation={false} />
                <Skeleton animation="wave" /> </div>}

            {!loading && <>
                <div style={{ display: "flex", justifyContent: "space-around", background: '#0000ff1f' }}>
                    <TextField
                        id="date"
                        label="start"
                        type="date"
                        value={startDate}
                        onChange={(e) => { setStartDate(e.target.value) }}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="date"
                        label="finish"
                        type="date"
                        value={finishDate}
                        onChange={(e) => { setFinishDate(e.target.value) }}

                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button variant="outlined" onClick={() => { get() }}>click</Button>

                </div>
                {/* <Container style = {{width: '100%'}}> */}
                <Resalt rows={rows} />
                {/* </Container> */}

                <TreeView
                    className={classes.rootcard}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    multiSelect
                >

                    {rows && rows.map((el, ind) => {

                        return <TreeItem nodeId={el.id} label={el.Name}>
                            <TreeItem nodeId={el.Name + ind} label={"Виконано " + el.Fact}>
                                {Object.keys(el.arrT).map(elT => {
                                    // console.log(Array([...el.arrT[elT]].length))
                                    return (
                                        // <div>{elT + " " + Array([...el.arrT[elT]])[0].length}</div>
                                        <Accordion style={{ backgroundColor: "#e4ecec" }} expanded={expanded === el.Name + "виконано  " + elT} onChange={handleChange(el.Name + "виконано  " + elT)}>
                                            <AccordionSummary
                                                style={{
                                                    margin: "3px",
                                                    display: "flex",
                                                    flexGrow: "1",
                                                    // transition: margin 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                                                    justifyContent: "space-between",
                                                    alignItems: "center",

                                                }}
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1bh-content"
                                                id="panel1bh-header"
                                            >
                                                <Typography className={classes.heading}>{elT}</Typography>
                                                <Typography className={classes.secondaryHeading}>{Array([...el.arrT[elT]])[0].length}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails style={{
                                                flexDirection: "column", padding: "3px"
                                            }}>
                                                {Array([...el.arrT[elT]])[0].map(elA => {
                                                    return <Typography paragraph><a href={"https://politic-map.cc.ua/index.php?title=" + elA.object} target="_blank" >
                                                        {elA.object};
                                                    </a> </Typography>
                                                })}
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                })}
                            </TreeItem>

                            <TreeItem nodeId={el.Name + ind + "2"} label={"Не викнано " + el.Ostatok} >
                                {Object.keys(el.arrF).map(elF => {
                                    // console.log(Array([...el.arrF[elF]].length))
                                    return (
                                        <Accordion style={{ backgroundColor: "#e4ecec", borderRadius: "5px" }} expanded={expanded === el.Name + "Не виконано  " + elF} onChange={handleChange(el.Name + "Не виконано  " + elF)}>
                                            <AccordionSummary
                                                style={{
                                                    margin: "3px",
                                                    display: "flex",
                                                    flexGrow: "1",
                                                    // transition: margin 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}

                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1bh-content"
                                                id="panel1bh-header"
                                            >
                                                <Typography className={classes.heading}>{elF}</Typography>
                                                <Typography className={classes.secondaryHeading}>{Array([...el.arrF[elF]])[0].length}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails style={{
                                                flexDirection: "column", padding: "5px", margin: "3px"
                                            }}>
                                                {Array([...el.arrF[elF]])[0].map(elA => {
                                                    return <Typography paragraph>
                                                        <a href={"https://politic-map.cc.ua/index.php?title=" + elA.object} target="_blank" >
                                                            {elA.object};
                                                        </a>

                                                    </Typography>

                                                })}
                                            </AccordionDetails>
                                        </Accordion>

                                    )
                                })}

                            </TreeItem>
                        </TreeItem>

                    })}

                </TreeView>

            </>}

        </>
    );

}