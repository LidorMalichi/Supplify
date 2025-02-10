// Server URL
const PRODUCTION_URL = "http://10.0.2.2:8080"; 

// Controller Endpoints
const AUTH = "/auth";
const PRODUCT = "/product";
const SUPPLIERS = "/suppliers"
// Globals Object
export const globals = {

    AUTH: {
        register: `${PRODUCTION_URL}${AUTH}/register`,
        login: `${PRODUCTION_URL}${AUTH}/login`,
        google: `${PRODUCTION_URL}${AUTH}/google`,
    },

    SUPPLIERS:{
     createSupplier: `${PRODUCTION_URL}${SUPPLIERS}/createSupplier`,
    },
    PRODUCT:{
    createProduct: `${PRODUCTION_URL}${PRODUCT}/createProduct`,
    }
};
