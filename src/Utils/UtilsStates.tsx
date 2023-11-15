export function str2List<T>(str: string, toType: (value: string) => T = String as any, sep: string = ','): T[] {
  return [str.replace('[', '').replace(']', '').split(sep)][0].map(toType)
}

export const readUrlQuery = (key: string) => {
  const urlParams = new URLSearchParams(window.location.search)
  const options = urlParams.get(key)?.split(';').reduce((acc: any, pair) => {
    const [key, value] = pair.split(/:(.*)/s);
    acc[key] = value;
    return acc;
  }, {});
  return options
}

export const findModified = (originalObject: any, modifiedObject: any, ons: string[]) => {
  const modifiedElements: any = {};
  for (const key in modifiedObject) {
    if ((originalObject[key] !== modifiedObject[key] || ons.includes(key)) && key !== 'switches') {
      modifiedElements[key] = {};
      for (const k in modifiedObject[key]) {
        if (originalObject[key][k] !== modifiedObject[key][k] && k !== 'userInfo') {
          modifiedElements[key][k] = modifiedObject[key][k]
        }
      }
    }
  }
  return modifiedElements;
}

export const flattenObject = (obj: any, parentKey = "") => {
  let queryArr: any = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let currentKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        Object.keys(obj[key]).length === 0 ?
          queryArr.push(`&${key}`) :
          queryArr.push(`&${key}=${flattenObject(obj[key], currentKey)}`)
      } else if (Array.isArray(obj[key])) {
        parentKey ?
          queryArr.push(`${key}:[${obj[key].join(",")}]`) :
          queryArr.push(`&${key}=[${obj[key].join(",")}]`)
      } else {
        if (obj[key]) {
          parentKey ?
            queryArr.push(`${key}:${obj[key]}`) :
            queryArr.push(`&${key}=${obj[key]}`)
        }
      }
    }
  }
  const string = queryArr.join(";")
  return string.replaceAll(';&', '&').replaceAll('=&', '&')
}

export const toIETF = (inputString: string) => {
  const sanitizedString = inputString.replace(/-/g, '').toLowerCase();
  if (sanitizedString === 'zhtw' || sanitizedString === 'zh' || sanitizedString === 'tw') {
    return 'zh-TW';
  } else {
    return 'en';
  }
}