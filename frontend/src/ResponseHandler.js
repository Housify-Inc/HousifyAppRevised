//Dummy funciton to be able to access responseData in any js file
let responseData = {};

const UseSession = () => {
  const storedSession = localStorage.getItem('userSession');
  const session = storedSession ? JSON.parse(storedSession) : null;
  return session;
};

const getResponseData = () => {
  responseData = UseSession();
  return UseSession();
};
const updateUser = async (username) => {
  try {
    console.log("THIS IS USERNAME", username);
    const response = await fetch(`http://localhost:8090/update_user?username=${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data from the server');
    }
    const newData = await response.json();
    responseData = newData;
    // Update localStorage if needed
    localStorage.setItem('userSession', JSON.stringify(newData));
  } catch (error) {
    console.error('Error updating response data from the database:', error);
  }
};
window.addEventListener('load', () => {
  const data = getResponseData();
  console.log("THIS IS DATA", data);
  updateUser(data.username);
});
export { updateUser, getResponseData };
