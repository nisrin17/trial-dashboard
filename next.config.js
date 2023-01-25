const { node } = require('prop-types')

/** @type {import('next').NextConfig} */

module.exports = {
    // reactStrictMode: true,
    staticPageGenerationTimeout: 240,
    env: {
        CRYPTO_SECRET: process.env.CRYPTO_SECRET,
        ROOT_API: process.env.ROOT_API
    },
    node: {
        net: 'empty'
    },
    async redirects()
    {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: true,
            }
        ]
    },
}
