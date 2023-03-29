import { execSync } from 'child_process'
import {
  TYK_AUTHORIZATION_SECRET,
  TYK_HEADERS,
  TYK_HOST,
} from './lib/constants.js'
import axois from 'axios'

const API_ID = 'USERS_V1'
const API_NAME = 'USER_TEST_API'

// const command = `
// curl -X POST -H "x-tyk-authorization: ${TYK_AUTHORIZATION_SECRET}" \
//   -s \
//   -H "Content-Type: application/json" \
//   -X POST \
//   -d '{
//     "allowance": 1000,
//     "rate": 1000,
//     "per": 1,
//     "expires": -1,
//     "quota_max": -1,
//     "org_id": "1",
//     "quota_renews": 1449051461,
//     "quota_remaining": -1,
//     "quota_renewal_rate": 60,
//     "access_rights": {
//       "${API_ID}": {
//         "api_id": "${API_ID}",
//         "api_name": "${API_NAME}",
//         "versions": ["Default"]
//       }
//     },
//     "meta_data": {}
//   }' http://${TYK_HOST}/tyk/keys/create | python -mjson.tool
// `

// const output = execSync(command, {
//   encoding: 'utf-8',
// })

// console.log(output)

axois
  .post(
    `${TYK_HOST}/tyk/keys/create`,
    {
      allowance: 1000,
      rate: 1000,
      per: 1,
      expires: -1,
      quota_max: -1,
      org_id: '1',
      quota_renews: 1449051461,
      quota_remaining: -1,
      quota_renewal_rate: 60,
      access_rights: {
        '${API_ID}': {
          api_id: '${API_ID}',
          api_name: '${API_NAME}',
          versions: ['Default'],
        },
      },
      meta_data: {},
    },
    {
      headers: TYK_HEADERS,
    }
  )
  .then(({ data }) => console.log(data))
  .catch((err) => console.log(err))
