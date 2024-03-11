//Dummy funciton to be able to access responseData in any js file
let responseData = {};

const useSession = () => {
  const storedSession = localStorage.getItem('userSession');
  const session = storedSession ? JSON.parse(storedSession) : null;
  console.log("When we read session, we get: ", session);
  return session;
};

const getResponseData = () => {
  return useSession();
};

export { getResponseData };
