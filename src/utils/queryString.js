
export function parseQueryString(queryString) {
    queryString = decodeURIComponent(queryString)
    // Split the input query string into individual parameters
    const paramPairs = queryString.split("?")[1].split("&");

    // Initialize an array to store the parsed key-value pairs
    const parsedParams = [];

    // Iterate through each parameter pair
    paramPairs.forEach(pair => {
        // Split the parameter pair into key and value
        const [key, value] = pair.split("=");

        // Create an object with key-value pair and add it to the parsedParams array
        const paramObject = {};
        paramObject[key] = value;
        parsedParams.push(paramObject);
    });

    const mergedObject = Object.assign({}, ...parsedParams);
    return mergedObject;
}

// Example usage
// const queryString = "http://localhost:3000/api/dashboard?tag=essential&day=sunday";
// // const queryString = "param1=value1&param2=value2&param3=value3";
// const parsedParams = parseQueryString(queryString);
// console.log(parsedParams);
