import { ethers } from "ethers";

import abi from "./monitoringAbi.json" with {
  type: "json",
};

let contractInstance: ethers.Contract | null = null;

function getContract() {
  if (contractInstance) return contractInstance;

  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const address = process.env.MONITORING_CONTRACT;

  if (!rpcUrl || !privateKey || !address) {
    throw new Error("Blockchain monitoring configuration missing (RPC_URL, PRIVATE_KEY, or MONITORING_CONTRACT)");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  contractInstance = new ethers.Contract(address, abi, wallet);
  return contractInstance;
}

export const monitoringContract = new Proxy({} as any, {
  get(target, prop, receiver) {
    const instance = getContract();
    const value = Reflect.get(instance, prop);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
  set(target, prop, value) {
    const instance = getContract();
    return Reflect.set(instance, prop, value);
  }
});