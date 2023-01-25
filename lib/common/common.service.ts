import { compare, hash } from 'bcryptjs'
const saltOrRounds = 10

export const changePhone = async (hp: string, convertTo: string): Promise<string> => {
    const phone = hp.toString().replace(/\D/g, '')
    if (phone.length < 6 || phone.length >= 15) {
        return ("")
    }

    if (convertTo == "62") {
        if (phone.substring(0, 2) == "62") {
            return (phone)
        } else if (phone.substring(0, 2) == "08") {
            return (`62${phone.substring(1)}`)
        }
    }

    if (convertTo == "08") {
        if (phone.substring(0, 2) == "08") {
            return (phone)
        } else if (phone.substring(0, 2) == "62") {
            return (`0${phone.substring(2)}`)
        } else {
            return ("")
        }
    }

    return (phone)
}

export const formatNumber = (number: number, separator: string) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

export const pagination = async (page: number, row: number, totalRow: number) => {
    const dataPerPage = row;
    const totalPage = Math.ceil(totalRow / dataPerPage);
    const currentPage = page == 0 ? 1 : page;
    const firstData = dataPerPage * currentPage - dataPerPage;

    return {
        query: `LIMIT ${dataPerPage} OFFSET ${firstData}`,
        dataPerPage: dataPerPage,
        totalPage: totalPage,
        currentPage: currentPage,
        totalData: totalRow,
    };
};

export const hashPassword = async (string: string | undefined) => {
    const hashPassword = await hash(string ? string : "", saltOrRounds);
    return hashPassword
}

export async function verifyPwrd(password: string | undefined, hshPassword: string) {
    const isValid = await compare(password ? password : "", hshPassword)
    return isValid;
}