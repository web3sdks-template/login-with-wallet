import { Web3sdksSDK } from "@web3sdks/sdk";
import { NextApiRequest, NextApiResponse } from "next";

const authenticate = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ 
      error: "Invalid method. Only POST supported." 
    });
  }

  const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    console.error("Missing ADMIN_PRIVATE_KEY environment variable");
    return res.status(500).json({ 
      error: "Admin private key not set" 
    })
  }

  // Get access token off cookies
  const token = req.cookies.access_token;
  if (!token) {
    res.status(401).json({
      error: "Must provide an access token to authenticate"
    })
  }

  const sdk = Web3sdksSDK.fromPrivateKey(process.env.ADMIN_PRIVATE_KEY as string, "mainnet");

  // Authenticate token with the SDK
  const domain = "web3sdks.com"
  const address = await sdk.auth.authenticate(domain, token);

  res.status(200).json(address);
};

export default authenticate;
