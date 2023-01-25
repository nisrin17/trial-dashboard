import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@lib/prisma'

export const _getMenu = async (param: any) => {
    const username = "root";
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
                    m_view : 1,
                    isDeleted: 0
                }
            },
        },
        orderBy: {
            sort: 'asc'
        }
    })
}

export const _sidebarMenu = async (username: string) => {
    return prisma.$queryRaw`SELECT A.id menu_header, A.description menu, A.path, A.level, A.header sub, A.icon
        FROM menu A, access_det B, access C, users D 
        WHERE A.id = B."menuId"
            AND B."accessId" = C.id
            AND C.id = D."accessId"
            AND D.username = ${username}
            AND B.m_view = 1
        ORDER BY A.sort`
}

export const sortMenus = (rawMenu: any) => {
    let menu = []
    let tempMenu: any = {}
    const data = rawMenu

    for (let index = 0; index < data.length; index++) {
        const header = data[index].menu_header

        tempMenu = []

        Object.assign(data[index], {[`key`]: header});

        if (data[index].sub == 0) {
            tempMenu = data[index]
        }

        if (data[index].sub != 0) {
            continue
        }
        
        for (let j = 0; j < data.length; j++) {
            const headDTL = data[j].sub
            if (header == headDTL && headDTL != 0) {
                if (!tempMenu.children) {
                    Object.assign(tempMenu, {[`children`]: []});
                }

                tempMenu[`children`].push({...data[j], key: data[j].menu_header})
            }

            if (j == data.length - 1) {
                menu.push(tempMenu)
            }  
        }
    }

    return menu
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const find = await _sidebarMenu("root")
        const result = sortMenus(find)
        
        res.status(200).json({
            message: 'success',
            status: 200,
            data: result
        })
    } catch (error) {
        res.status(500).end('Something Went Wrong')
    }
}

export default handler