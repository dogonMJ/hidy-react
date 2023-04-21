const PROXY_HOST = process.env.REACT_APP_PROXY_BASE;

declare var AbortSignal: {
  prototype: AbortSignal;
  new(): AbortSignal;
  abort(reason?: any): AbortSignal;
  timeout(milliseconds: number): AbortSignal;
};
const abortTime = 5000
export const account = {
  getCsrfToken: async function (csrfName = "csrf") {
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
      cookieValue = account.setCsrfToken()
    }
    return cookieValue;
  },

  setCsrfToken: async () => {
    return fetch(`${PROXY_HOST}/auth`, {
      credentials: 'include',
      signal: AbortSignal.timeout(abortTime)
    })
      .then(response => response.json())
      .then(json => json.token)
  },

  login: async ({ username, password, remember }: any) => {
    const request = new Request(`${PROXY_HOST}/auth/login`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'x-csrf-token': await account.getCsrfToken(),
      },
      body: JSON.stringify({ username, password, remember })
    })
    return fetch(request, { signal: AbortSignal.timeout(abortTime) }).then(response => response.json())
  },

  getUserInfo: async () => {
    return fetch(`${PROXY_HOST}/auth/userinfo`, {
      signal: AbortSignal.timeout(abortTime),
      credentials: 'include',
      headers: {
        'x-csrf-token': await account.getCsrfToken(),
      },
    })
      .then(response => {
        return response.json()
      })
      .catch(error => { throw (error) })
  },

  logout: async () => {
    return fetch(`${PROXY_HOST}/auth/logout`, {
      credentials: 'include',
    })
      .then(response => response.json())
  },

  signup: async (form: any) => {
    const formbody = new URLSearchParams(form).toString()
    return fetch(`${PROXY_HOST}/account/signup`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'x-csrf-token': await account.getCsrfToken(),
        'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formbody
    })
      .then(res => res.json())
  },

  resetPassword: async (form: any) => {
    const formbody = new URLSearchParams(form).toString()
    return fetch(`${PROXY_HOST}/account/reset_password`, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8" },
      body: formbody
    })
      .then(res => res.json())
  },
  // test: () => {
  //   console.log('test')
  // }
}
//const AUTH_HOST = 'https://odbsso.oc.ntu.edu.tw/sso2/odbauth'
 // getCsrfToken: async function (csrfName = "csrftoken") {
  //   // django default csrf name "csrftoken"
  //   let cookieValue = undefined;
  //   if (document.cookie && document.cookie !== '') {
  //     const cookies = document.cookie.split(';');
  //     for (let i = 0; i < cookies.length; i++) {
  //       const cookie = cookies[i].trim();
  //       if (cookie.substring(0, csrfName.length + 1) === (csrfName + '=')) {
  //         cookieValue = decodeURIComponent(cookie.substring(csrfName.length + 1));
  //         break;
  //       }
  //     }
  //   } else {
  //     cookieValue = account.setCsrfToken()
  //   }
  //   return cookieValue;
  // },
  // setCsrfToken: async () => {
  //   const response = await fetch(`${AUTH_HOST}/csrf/`, {
  //     credentials: 'include',
  //   })
  //     .then(response => response.json())
  //   return response.csrfToken
  // },
  // login: async ({ username, password, remember }: any) => {
  //   const request = new Request(`${AUTH_HOST}/login/`, {
  //     method: 'POST',
  //     credentials: 'include',
  //     headers: {
  //       'X-CSRFTOKEN': await account.getCsrfToken(),
  //     },
  //     body: JSON.stringify({ username, password, remember })
  //   })
  //   return fetch(request)
  //     .then(response => response.json()
  //       .then(result => ({
  //         statusCode: response.status,
  //         logged: result.logged
  //       })
  //       )
  //     )
  // },
  // logout: async () => {
  //   return fetch(`${AUTH_HOST}/logout/`, {
  //     method: 'POST',
  //     credentials: 'include',
  //     headers: {
  //       'X-CSRFTOKEN': await account.getCsrfToken(),
  //     },
  //   })
  //     .then(response => response.json())
  // },
  // logintest: async ({ username, password, remember }: any) => {
  //   const request = new Request(`${AUTH_HOST}/login2/`, {
  //     method: 'POST',
  //     credentials: 'include',
  //     headers: {
  //       'X-CSRFTOKEN': await account.getCsrfToken(),
  //     },
  //     body: JSON.stringify({ username, password, remember })
  //   })
  //   const response = await fetch(request)
  //   const result: any = await response.json()
  //     .then((json) => {
  //       return {
  //         statusCode: response.status,
  //         logged: json.logged,
  //         ticket: json.ticket
  //       }
  //     })
  //   const userInfo = await account.verify(result)
  //   return userInfo
  // },
  // verify: (arg: argVerify) => {
  //   const { statusCode, logged, ticket } = arg
  //   if ((statusCode === 200) && (logged === true)) {
  //     return fetch(`${PROXY_HOST}/verify?ticket=${ticket}`, {
  //       credentials: 'include'
  //     })
  //       .then(response => response.json())
  //   } else if (logged === false) {
  //     return { stauts: false, message: 'Not logged in' }
  //   } else {
  //     return { stauts: false, message: `Error: ${statusCode}` }
  //   }
  // },

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