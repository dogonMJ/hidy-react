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
  // }
}
