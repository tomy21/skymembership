import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || 'default_secret_key';

// Define a more specific type for the data
interface Data {
    identifier: string;
    password: string;
    rememberMe: boolean;
}

interface ResponseData {
    status: string;
    message: string;
    token: string;
}

// Fungsi untuk enkripsi data
export const encryptData = (data: Data): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Fungsi untuk dekripsi data
export const decryptData = (encryptedData: string): ResponseData | null => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        
        // Return data if it matches the expected structure, otherwise return null
        if (decryptedData.message && decryptedData.status && decryptedData.token) {
            return decryptedData as ResponseData;
        }
        
        return null; 
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
};
