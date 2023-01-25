import { NextApiRequest, NextApiResponse } from 'next'
import cors from "../../../lib/cors";
import { getLoginSession } from "../../../lib/auth/auth";
import protectAPI from "../../../lib/protectApi";
import prisma from '@lib/prisma'
import moment from 'moment';

const today = new Date();
const priorDate = new Date(new Date().setDate(today.getDate() - 30));

interface IMasterQuestion {
    id: number;
    no: string
}

export const masterQuestion = async (): Promise<IMasterQuestion[]> => {
    return prisma.$queryRaw`SELECT id, no FROM survey_question A ORDER BY A.sort`
}

export const totalSummary = async () => {
    const users: any = await prisma.$queryRaw`SELECT COUNT(1)::INT AS total FROM survey_user`;
    const surveys: any = await prisma.$queryRaw`SELECT COUNT(1)::INT AS total FROM survey_answer`;
    const total_user = users.length > 0 ? users[0].total : 0;
    const total_survey = surveys.length > 0 ? surveys[0].total : 0;
    const data: any = [{
        total_user,
        total_survey,
    }];

    return data;
};

export const getSummary = async (id: number) => {
    const result: any = await prisma.$queryRaw`SELECT Q.id, Q."surveyQuestionTypeId" AS "type", Q."surveyQuestionTypeId", Q.no, Q."header", Q.description AS "question", QD.sort, QD.description AS "questiondet", CASE WHEN J."count" IS NULL THEN 0 ELSE J."count" END FROM survey_question Q JOIN survey_question_det QD ON Q.id = QD."surveyQuestionId" LEFT JOIN (SELECT "surveyQuestionDetId", COUNT(1)::INT AS "count" FROM survey_answer_det GROUP BY "surveyQuestionDetId" ORDER BY "surveyQuestionDetId") J ON J."surveyQuestionDetId" = QD.id WHERE Q.id = ${id} ORDER BY Q.sort, QD.sort ASC `;
    
    let question = "";
    const series = [];
    const questiondet = [];
    const data = [];
    const categories = [];
    const type = [];

    for (let index = 0; index < result.length; index++) {
        const element = result[index];
        const sort = element.sort - 1;
        question = element.question;
        questiondet.push(element.questiondet);
        data.push(element.count);
        categories.push(String.fromCharCode(sort + 'A'.charCodeAt(0)));
        type.push(element.type);
    }
    series.push({
        question,
        questiondet,
        data,
        categories,
        type
    })

    return series;
}

const enumerateDays = async (param: any) => {
    let now = moment(priorDate);
    let end = moment(today);
    let series = []
    const data = []
    const categories = [];

    while (now.isSameOrBefore(end)) {
        const dates = moment(now).format('YYYY-MM-DD');
        let check = false;
        for (let index = 0; index < param.length; index++) {
            const element = param[index];
            if (element.date == dates) {
                check = element.count
            }
        }
        if (check == false) {
            data.push(0);
        }
        if (check != false) {
            data.push(check)
        }
        categories.push(dates)
        now.add(1, 'days');
    }

    series = [{
        data,
        categories
    }]
    return series;
}

export const getSurveyStatistic = async () => {
    const result: any = await prisma.$queryRaw`SELECT TO_CHAR(created_at, 'YYYY-MM-DD') AS "date", COUNT(1)::INT FROM survey_answer WHERE DATE(created_at) BETWEEN ${priorDate} AND ${today} GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')`;

    const mapping = await enumerateDays(result);
    return mapping
}

export const getOccupationStatistic = async () => {
    const result: any = await prisma.$queryRaw`SELECT B.description, COUNT(1)::INT FROM survey_user A JOIN master_occupation B ON A."occupationId" = B.id GROUP BY "occupationId", description`;

    let series = [];
    let data = [];
    let categories = [];

    for (let index = 0; index < result.length; index++) {
        const element = result[index];
        data.push(element.count);
        categories.push(element.description);
    }
    series = [{
        data,
        categories,
    }]
    return series
}

export async function summary(req: NextApiRequest, res: NextApiResponse) {
    try {  

        if (req.method !== 'GET') {
            throw new Error('Forbidden Method')
        }

        const question = +req.query.question;
        const param = req.query.param;
        const find = question ? await getSummary(question) : param == "total" ? await totalSummary() : param == "stat" ? await getSurveyStatistic() : [];
        
        res.status(200).json({
            message: 'success',
            status: 200,
            data: find
        })
    } catch (error) {
        res.status(500).end('Something Went Wrong')
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await cors(req, res);
        //const session: any = await getLoginSession(req)
        //if (!session) {
        //    return res.status(401).json({message: "Unauthorized!"})
        //}

        if (req.method !== 'GET') {
            return res.status(403).json({message: "Forbidden!"})
        }

        const id : any = req.query.id;


        const data = await getSummary(parseInt(id))
        console.log("api", data)
        return res.json(data)




    } catch (err: any) {
        res.status(500).json({message: err.message})
    }
}

export default protectAPI(handler)
