import 'dotenv/config'

export const TYK_AUTHORIZATION_SECRET = process.env.TYK_AUTHORIZATION_SECRET
export const TYK_HOST = process.env.TYK_HOST
export const TYK_HEADERS = {
  'x-tyk-authorization': TYK_AUTHORIZATION_SECRET,
}
