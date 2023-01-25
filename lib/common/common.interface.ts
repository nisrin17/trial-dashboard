export interface ISession {
    id: number
    username: string;
    email?: string;
    name: string;
    fullname: string;
    password?: string;
    accessId?: number;
    role: string;
    createdAt?: number;
    maxAge?: number;
}

export interface IMenu {
    menu_header: number
    menu: string
    path: string
    level: number
    sub: number
    icon: string | null
    m_insert: number
    m_delete: number
    m_update: number
    m_view: number
}

export interface IPagination {
    row: string | number
    page: string | number
    key: string
    direction: string
    column: string
    limit: number | string
}