import { ethers } from "ethers";
import contractABI from "../abi/ENotary.json";

const contractAddress = "YOUR_CONTRACT_ADDRESS";

export async function getContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI.abi, signer);
}