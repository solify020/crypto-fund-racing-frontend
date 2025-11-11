import { create } from 'ipfs-http-client';

// You can get projectId and projectSecret from https://infura.io/
const projectId = '9b6053cf4a1a465a96437da26a7d3408';
const projectSecret = 'a3mV6ZjNILPcBMys56PmxnguLIP5KgJjBIrcRSNWxr773zfG06loRw';
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

// Connect to Infura IPFS node
const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

const uploadPic = async (file: File) => {
  try {
    const added = await client.add(file);
    const url = `https://ipfs.io/ipfs/${added.path}`;
    return url; // Publicly accessible link
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw error;
  }
}

export default uploadPic;