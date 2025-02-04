import axios from 'axios';

export const doGet = async (url: string, params?: any) => {
    try {
        const response = await axios.get(url, { params });
        return response?.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const doPost = async (url: string, data: any, params?: any) => {
    try {
        const response = await axios.post(url, data, {params});
        return response?.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};