// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export default function initMiddleware(middleware : any) {
    return (req : any, res: any) =>
      new Promise((resolve, reject) => {
        middleware(req, res, (result : any) => {
          if (result instanceof Error) {
            return reject(result)
          }
          return resolve(result)
        })
      })
  }

// import cors, { CorsOptions, CorsOptionsDelegate } from 'cors'
// import { NextApiRequest, NextApiResponse } from 'next'

// // - Helper method to wait for a middleware to execute before continuing
// // - And to throw an error when an error happens in a middleware
// function initMiddleware(middleware: typeof cors) {
//   return (req: NextApiRequest, res: NextApiResponse, options?: CorsOptions | CorsOptionsDelegate) =>
//     new Promise((resolve, reject) => {
//       middleware(options)(req, res, (result: Error | unknown) => {
//         if (result instanceof Error) {
//           return reject(result)
//         }

//         return resolve(result)
//       })
//     })
// }

// // - You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
// const NextCors = initMiddleware(cors)

// export default NextCors