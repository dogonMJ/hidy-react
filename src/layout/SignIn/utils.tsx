import decodeJwt, { JwtPayload } from 'jwt-decode'

interface odbssoPayload extends JwtPayload {
  username: string
  secLevel: number
}

const API_HOST = 'http://127.0.0.1:8000/odbauth'

export const sign = {
  getCsrfToken: async function (csrfName = "csrftoken") {
    // django default csrf name "csrftoken"
    let cookieValue = undefined;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, csrfName.length + 1) === (csrfName + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(csrfName.length + 1));
          break;
        }
      }
    } else {
      cookieValue = sign.setCsrfToken()
    }
    return cookieValue;
  },
  setCsrfToken: async () => {
    const response = await fetch(`${API_HOST}/csrf/`, {
      credentials: 'include',
    })
      .then(response => response.json())
    return response.csrfToken
  },
  login: async ({ username, password, remember }: any) => {
    const request = new Request(`${API_HOST}/login/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFTOKEN': await sign.getCsrfToken(),
      },
      body: JSON.stringify({ username, password, remember })
    })
    return fetch(request)
      .then(response => response.json()
        .then(result => ({
          statusCode: response.status,
          logged: result.logged
        })
        )
      )
  },
  logout: async () => {
    return fetch(`${API_HOST}/logout/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFTOKEN': await sign.getCsrfToken(),
      },
    })
      .then(response => response.json())
  },
  getUserInfo: async () => {
    return fetch(`${API_HOST}/getinfo/`, {
      credentials: 'include',
    })
      .then(response => response.json())
  },
}
//// JWT


// signIn: async ({ username, password }: any) => {
//   const request = new Request(`${API_HOST}/api/login/`, {
//     method: 'POST',
//     credentials: 'include',
//     body: JSON.stringify({ username, password }),
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   })
//   return fetch(request)
//     .then(response => {
//       if (response.status < 200 || response.status >= 300) {
//         return { token: false, statusCode: response.status }
//       } else {
//         return response.json().then(jwt => ({ statusCode: response.status, token: jwt }))
//       }
//     })
//     .then((json) => {
//       const { token, statusCode } = json
//       if (token) {
//         localStorage.setItem('token', JSON.stringify(token));
//       }
//       return { statusCode }
//     })
// },
// signOut: () => {
//   localStorage.removeItem('token');
//   return Promise.resolve();
// },


///舊版作法
//let _csrfToken = '';
//const data = new FormData(event.currentTarget)
// const token = await sign.getCsrfToken(_csrfToken)
    // const token = await getCsrfToken()
    // const ucodeFetch = await fetch(`${API_HOST}/genucode/`).then(response => response.json())
    // const ucode = ucodeFetch.ucode
    // document.cookie = `odbsso=${ucode}; expires="01 Jan 2200 00:00:00 GMT";`
    // const loginFetch = await fetch(`${API_HOST}/test/`, {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers: {
    //     'X-CSRFTOKEN': token,
    //   },
    //   body: JSON.stringify({
    //     'username': data.get('username'),
    //     'password': data.get('password'),
    //   })
    // })
    //   .then(response => {
    //     console.log(response.status)
    //     return response.json()
    //   })
    // const login = loginFetch.result
    // const ucode = loginFetch.ucode
    // document.cookie = `odbsso=${ucode}; expires="01 Jan 2200 00:00:00 GMT";`
    // if (login) {
    //   fetch(`${API_HOST}/chkuser/?ucode=${ucode}`)
    //     .then(response => response.json())
    //   // .then(json => dispatch(coordInputSlice.actions.userInfo(json)))
    // }
    // console.log({ ucode, login })