// Server URL
const PRODUCTION_URL = "http://localhost:8080"; // Replace with your actual server address

// Controller Endpoints
const ACCOUNT = "/register";
const PRODUCT = "/product";

// Globals Object
export const globals = {
    account: {
        register: `${PRODUCTION_URL}${ACCOUNT}/createNewAccount`,
        login: `${PRODUCTION_URL}/login`,
    },
};
