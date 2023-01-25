import { getLoginSession } from '@lib/auth/auth';
import { ISession } from '@lib/common/common.interface';
import prisma from '@lib/prisma'
import { NextApiRequest, NextApiResponse } from "next";

interface IPageCheck {
    menu_header: number;
    menu: string;
    path: string;
    level: number;
    sub: string;
    m_insert: number;
    m_update: number;
    m_delete: number;
    m_view: number;
    m_export: number;
    role: number
}

export const findUsername = async (param: any) => {
    const username = param;
    return prisma.users.findFirst({
        select: {
            username: true,
            password: true,
            accessId: true,
            fullname: true,
            access: {
                select: {
                    description: true
                },
            },
        },
        where: {
            username: username
        },
    })
}

export const _getMenu = async (param: any) => {
    const { username } = param;
    return prisma.menu.findMany({
        select: {
            id: true,
            description: true,
            path: true,
            level: true,
            header: true,
            icon: true,
            accessDet: {
                select: {
                    m_insert: true,
                    m_update: true,
                    m_delete: true,
                    m_view: true,
                    access: {
                        select: {
                            users: {
                                where: {
                                    username: username
                                }
                            }
                        }
                    }
                },
                where: {
                    m_view : 1
                }
            },
        },
        orderBy: {
            sort: 'asc'
        }
    })
}

export const pageCheck = async (username: string, path: string) => {
    const result = await prisma.$queryRaw<IPageCheck[]>`SELECT A.id menu_header, A.description menu, A.path, A.level, A.header sub, 
        B.m_insert, B.m_update, B.m_delete, B.m_view, B.m_export, C.id AS "role"
        FROM menu A,
            access_det B,
            access C,
            users D
        WHERE A.id = B."menuId"
            AND B."accessId" = C.id
            AND C.id = D."accessId"
            AND D.username = ${username} AND A.path = ${path} AND B.m_view = 1`

    if (result.length < 1) {
        return []
    }

    return result
}

export default async function pages(req: NextApiRequest, res: NextApiResponse) {
    try {  
        const session = await getLoginSession(req) as ISession
        if (!session) {
            return res.status(401).json({message: "Unauthorized!"})
        }

        if (req.method !== 'GET') {
            throw new Error('Forbidden')
        }

        const username = req.query.username;
        const path = req.query.path;
        const find = username && path ? await pageCheck(username.toString(), path.toString()) : [];
        
        res.status(200).json({
            message: 'success',
            status: 200,
            data: find
        })
    } catch (error) {
        res.status(500).end('Something Went Wrong')
    }
}