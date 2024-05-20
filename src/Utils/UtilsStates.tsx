export function str2List<T>(str: string, toType: (value: string) => T = String as any, sep: string = ','): T[] {
  return [str.replace('[', '').replace(']', '').split(sep)][0].map(toType)
}

export const readUrlQuery = (key: string) => {
  const urlParams = new URLSearchParams(window.location.search)
  const options = urlParams.get(key)?.split(';').reduce((acc: any, pair) => {
    const [key, value] = pair.split(/:(.*)/s);
    acc[key] = value.replaceAll('&', '%26')
    return acc;
  }, {});
  return options
}

const isObject = (obj: any) => typeof obj === 'object' && obj !== null && !Array.isArray(obj);
export const isJSONString = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

const findDifferences = (obj1: any, obj2: any): any => {
  const differences: any = {};
  for (const key in obj2) {
    if ((obj1[key] !== obj2[key]) && isObject(obj2[key])) { //nested
      const nestedDifferences = findDifferences(obj1[key], obj2[key]);
      if (Object.keys(nestedDifferences).length > 0) { //避免differences[key]相同
        differences[key] = nestedDifferences;
      }
    } else if ((obj1[key] !== obj2[key]) && !isObject(obj2[key])) { //非object且值不同，值相同跳過
      differences[key] = obj2[key]
    }
  }
  return differences;
};

export const findModified = (originalObject: any, modifiedObject: any, ons: string[]) => {
  const modifiedElements: any = {};
  for (const key in modifiedObject) {
    if (ons.includes(key)) {
      if ((originalObject[key] !== modifiedObject[key] || ons.includes(key)) && key !== 'switches') {
        modifiedElements[key] = {};
        for (const k in modifiedObject[key]) {
          // k=第二層key
          if ((originalObject[key][k] !== modifiedObject[key][k] || (Array.isArray(modifiedObject[key][k]) && modifiedObject[key][k].length > 0)) && k !== 'userInfo') {
            if (isObject(modifiedObject[key][k])) {
              const difference = findDifferences(originalObject[key][k], modifiedObject[key][k])
              //併入網址列預設值，避免修改參數時遺漏 (findDifferences以網址值為基準比較，若沒有網址，default值將和原始無網址query狀態不同)
              const isUrlQuery = readUrlQuery(key) && readUrlQuery(key)[k]
              const diff_and_Url = isUrlQuery ? { ...difference, ...JSON.parse(readUrlQuery(key)[k]) } : difference
              if (Object.keys(diff_and_Url).length > 0) {
                //object內有任何element更動，修改更動，貼上其他原本項目，避免後續default value更改 (eg. CTD min max)
                modifiedElements[key][k] = {}
                Object.keys(diff_and_Url).forEach((differenceKey: string) => {
                  if (isObject(difference[differenceKey])) {
                    modifiedElements[key][k][differenceKey] = { ...originalObject[key][k][differenceKey], ...difference[differenceKey] }
                  } else {
                    modifiedElements[key][k][differenceKey] = difference[differenceKey]
                  }
                })
              }
            } else {
              modifiedElements[key][k] = modifiedObject[key][k]
            }
          }
        }
      }
    }
  }
  return modifiedElements;
}

export const flattenObject = (obj: any, parentKey = "", depth = 0) => {
  let queryArr: any = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let currentKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        if (depth < 1) {
          Object.keys(obj[key]).length === 0 ?
            queryArr.push(`&${key}`) :
            queryArr.push(`&${key}=${flattenObject(obj[key], currentKey, depth + 1)}`)
        } else {
          //大於第二層object
          isObject(obj[key]) ?
            queryArr.push(`${key}:${JSON.stringify(obj[key])}`) :
            queryArr.push(`${key}:${obj[key]}`)
        }
      } else if (Array.isArray(obj[key])) {
        // parentKey ?
        //   queryArr.push(`${key}:[${obj[key].join(",")}]`) :
        //   queryArr.push(`&${key}=[${obj[key].join(",")}]`)
        parentKey ?
          queryArr.push(`${key}:${JSON.stringify(obj[key])}`) :
          queryArr.push(`&${key}=${JSON.stringify(obj[key])}`)
      } else {
        if (obj[key] || obj[key] === 0) {
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

export const checkQuerytPar = (queryObject: any, par: string) => queryObject && queryObject[par]

export const initStringArray = (queryObject: any, par: string, defaultValue: string[], typeGuard?: any) => {
  if (queryObject && queryObject[par]) {
    // const values = str2List(queryObject[par])
    const values = JSON.parse(queryObject[par])
    if (typeGuard) {
      return values.every(typeGuard) ? values : defaultValue //所有參數必須正確，避免部分正確造成困擾
    } else {
      return values
    }
  } else {
    return defaultValue
  }
}


export const initNumberArray = (queryObject: any, par: string, defaultValue: number[], range?: [number, number]) => {
  if (queryObject && queryObject[par]) {
    // const values = str2List(queryObject[par], Number)
    const values = JSON.parse(queryObject[par])
    if (!values.some(isNaN)) {
      if (range && values.length === 2) {
        const max = Math.min(Math.max(...values), range[1]);
        const min = Math.max(Math.min(...values), range[0]);
        return [min, max]
      } else {
        return values
      }
    } else {
      return defaultValue
    }
  } else {
    return defaultValue
  }
}

export const initString = (queryObject: any, par: string, defaultValue: string, typeGuard?: any) => {
  if (typeGuard) {
    return queryObject && queryObject[par] && typeGuard(queryObject[par]) ? queryObject[par] : defaultValue
  } else {
    return (queryObject && queryObject[par]) ?? defaultValue
  }
}

export const initNumber = (queryObject: any, par: string, defaultValue: number, range?: [number, number]) => {
  if (queryObject && queryObject[par]) {
    const value = Number(queryObject[par])
    if (range) {
      return value >= range[0] && value <= range[1] ? value : defaultValue
    } else {
      return value
    }
  } else {
    return defaultValue
  }
}
export const initBoolean = (queryObject: any, par: string) =>
  queryObject && queryObject[par] === 'true' ? true : false


export const initRadio = (urlParams: URLSearchParams, key: string, typeGuard?: any, defaultValue: string = 'close') => {
  if (typeGuard) {
    return typeGuard(urlParams.get(key)) ? urlParams.get(key) : defaultValue
  } else {
    return urlParams.get(key) ?? defaultValue
  }
}