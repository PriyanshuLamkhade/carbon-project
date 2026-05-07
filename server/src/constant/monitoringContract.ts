import { ethers } from "ethers";

import abi from "./monitoringAbi.json" with {
  type: "json",
};

const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL
);

const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY!,
  provider
);

export const monitoringContract =
  new ethers.Contract(
    process.env.MONITORING_CONTRACT!,
    abi,
    wallet
  );