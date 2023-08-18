export function parseQueryString(queryString) {

    queryString = decodeURIComponent(queryString)
    const paramPairs = queryString.split("?")[1].split("&");
    const parsedParams = [];

    paramPairs.forEach(pair => {
        const [key, value] = pair.split("=");
        const paramObject = {};
        paramObject[key] = value;
        parsedParams.push(paramObject);
    });
    const mergedObject = Object.assign({}, ...parsedParams);
    return mergedObject;
}

