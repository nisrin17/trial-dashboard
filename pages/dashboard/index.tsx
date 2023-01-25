import type { ReactElement } from 'react'
import * as React from 'react';
import DashboardLayout from "../../components/layouts/Dashboard";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import AreaChart from "../../components/charts/AreaChart";
import PieChart from "../../components/charts/PieChart";
import ColChart from "../../components/charts/ColChart";
import { GetServerSideProps, NextApiRequest } from 'next';
import { useRouter } from "next/router";
import { getLoginSession } from "@lib/auth/auth";
import { pageCheck } from "../api/auth/list";
import { getSummary, totalSummary, getSurveyStatistic, getOccupationStatistic, masterQuestion } from "../api/entries_summary/index";
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';



const EntriesSummary = (props: any) => {
    const [questionNumber, setQuestionNumber] = React.useState("1");
    const [entriesList, setEntriesList] = React.useState(props.data[0]);
    const handleChange = async (event: SelectChangeEvent) => {
        setQuestionNumber(event.target.value as string);
        await getList(event.target.value as string)
    };


    const getList = async (id: string) => {
        const res = await fetch(`/api/entries_summary?id=${id}`)
        if (res.status !== 404) {
            let dataList = await res.json();
            setEntriesList(dataList[0]);

        } else {
            return alert("Error 404");
        }
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack
                        direction="row"
                        alignItems="flex-end"
                        className="main-title"
                        spacing={1}>
                        <h2 style={{ lineHeight: "24px" }}>
                            Main Dashboard
                        </h2>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper className='card-custom'>
                        <Stack spacing={3} direction="row" justifyContent="space-evenly">
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}>
                                <h6>Total User Registered</h6>
                                <h2>{props.dataTotal.total_user}</h2>
                            </Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}>
                                <h6>Total Survey Entries</h6>
                                <h2>{props.dataTotal.total_survey}</h2>
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className='card-custom' >
                        <Grid container spacing={6}>
                            <Grid item xs={9}>
                                {entriesList.type[0] == 3 ?
                                    <ColChart
                                        title={"Entries Summary"}
                                        sub={entriesList.question}
                                        series={[
                                            {
                                                name: `Entries`,
                                                data: entriesList.data,
                                            }
                                        ]}
                                        categories={entriesList.categories}
                                        height={350}
                                    /> :
                                    <PieChart
                                        title={"Entries Summary"}
                                        sub={entriesList.question}
                                        legend={"bottom"}
                                        series={entriesList.data}
                                        categories={entriesList.categories}
                                        height={350}
                                    />

                                }

                            </Grid>
                            <Grid item xs={3} style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "flex-start", flexDirection: "column" }}>
                                <h5>Keterangan</h5>
                                <ol type="A">
                                    {entriesList.questiondet.map((answer: string, index: number) =>
                                        <li key={index}>{answer}</li>
                                    )}
                                </ol>
                            </Grid>

                        </Grid>

                    </Paper>
                </Grid>
                {/* Area Chart */}
                <Grid item xs={12} md={6} lg={6}>
                    <Paper className='card-custom'>
                        <AreaChart
                            title={"Incoming Survey Statistic"}
                            series={[
                                {
                                    name: `Survey Entries`,
                                    data: props.entriesStatistic.data,
                                }
                            ]}
                            categories={props.entriesStatistic.categories}
                            height={300}
                        />
                    </Paper>
                </Grid>
                {/* Pie Chart */}
                <Grid item xs={12} md={6} lg={6}>
                    <Paper className='card-custom'>
                        <PieChart
                            title={"Entries Submitter Jobs"}
                            series={props.occupationStatistic.data}
                            categories={props.occupationStatistic.categories}
                            height={310}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}



export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const trueRole = await pageCheck('root', ctx.resolvedUrl)
    if (trueRole.length < 1) {
        return {
            redirect: {
                destination: "/403",
                permanent: false
            }
        }
    }

    const data = await getSummary(1);
    const dataTotal = await totalSummary();
    const entriesStatistic = await getSurveyStatistic();
    const occupationStatistic = await getOccupationStatistic();
    const questionList = await masterQuestion();

    return {
        props: {
            data,
            dataTotal: dataTotal[0],
            entriesStatistic: entriesStatistic[0],
            occupationStatistic: occupationStatistic[0],
            questionList: questionList,
            access: {
                m_insert: trueRole[0].m_insert,
                m_update: trueRole[0].m_update,
                m_delete: trueRole[0].m_delete,
                m_view: trueRole[0].m_view
            },
        }
    }
}

export default EntriesSummary;

EntriesSummary.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashboardLayout>{page}</DashboardLayout>
    )
}