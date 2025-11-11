import lighthouse from "@lighthouse-web3/sdk";

const apiKey = "1ccb0653.ab4daeb9b4144956990c062bb6631ea6";

const uploadPic = async (file: File): Promise<string> => {
    try {
            console.log(file);
            
            const response = await lighthouse.uploadBuffer(file, apiKey);
            console.log("File URL:", `https://ipfs.io/ipfs/${response.data.Hash}`);
            return `https://ipfs.io/ipfs/${response.data.Hash}`;
    } catch (error) {
        console.error('IPFS upload error:', error);
        throw error;
    }
}

export default uploadPic;