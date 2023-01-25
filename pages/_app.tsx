import '../styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import Head from "next/head";
import type { AppProps } from 'next/app'
import { SWRConfig } from "swr";
import axios from "axios";

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}


export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page)

    return (
        <>
        <SWRConfig value={{ fetcher: (url) => axios(url).then((r) => r.data) }}>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <title>Survey Redbox - Dashboard</title>
            </Head>
            <>
                {getLayout(<Component {...pageProps} />)}
            </>
            </SWRConfig>
        </>
    )


}
