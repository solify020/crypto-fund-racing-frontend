import axios from "axios";

const uploadPic = async (file: File): Promise<string> => {

    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    const data = new FormData();
    data.append("file", file);

    const res = await axios.post(url, data, {
        maxBodyLength: Infinity,
        headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: "fa8ce6c8da85c7cdeb4f",
            pinata_secret_api_key: "56d8ab556c831ac0c6c8c44e8695d9ab37d1be4f4842d2b5d4528447b476ca75",
        },
    });

    console.log("CID:", res.data.IpfsHash);

    return `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
}

export default uploadPic;