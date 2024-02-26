//Dummy funciton to be able to access responseData in any js file
let responseData = {};

const setResponseData = (data) => {
  responseData = data;
};

const getResponseData = () => {
  return responseData;
};

export { setResponseData, getResponseData };