### Please use pnpm package manager

### Install Dependencies
`pnpm install`

### Run Dev Server
`pnpm dev`

### API Url
`/api/v1`

### User signup | POST
```
body -
{
  name: example,
  email: example@eg.com
  password: 123456
}

Response Header - 
Authorization Bearer <token>

url -
/api/v1/signup
```

### User login | POST
```
body -
{
  email: example@eg.com
  password: 123456
}

Response Header - 
Authorization Bearer <token>

url -
/api/v1/login
```


### Post creation | POST
```
body -
{
  title: "example-title"
  content: "Hello World!"
}

Request Header - 
Authorization Bearer <token>

Response -
publicURL for the post

url -
/api/v1/create-post
```

### View Post | GET
```
url -
/api/v1/post/:publicURL
```


