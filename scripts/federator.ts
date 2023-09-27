import { ethers } from "hardhat";

const FEDERATION_ADDRESS = "0x1a98f4e6df0dd48c519179d4289feb7c1700dd59";

const abi = require('../abi/Federation.json');

async function main() {
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log('block number', blockNumber);


  const contract = new ethers.Contract(FEDERATION_ADDRESS, abi, ethers.provider);


  const owner = await contract.owner();
  console.log('owner', owner);

  await ethers.provider.send("hardhat_setBalance", [owner, ethers.utils.parseEther("1").toHexString().replace("0x0", "0x")])

  // const impersonator = await ethers.provider.send("hardhat_impersonateAccount", [owner]);

  // console.log('impersonator', impersonator);

  const impersonatedSigner = await ethers.getImpersonatedSigner(owner);


  const iface = new ethers.utils.Interface(abi);
  const data = iface.encodeFunctionData('addMember', ['0x95F1F9393D1D3e46df2cda491Fc323E142758C21']);

  const tx2 = await impersonatedSigner.populateTransaction({
    to: FEDERATION_ADDRESS,
    data: data.replace("0x0", "0x"),
    gasLimit: 9999999,
    nonce: 1,
  });

  console.log('tx2', tx2);

  const t = await impersonatedSigner.sendTransaction(tx2);

  const tw2 = await t.wait();

  console.log('tx', tw2);

  // const waited = await tx.wait();
  // console.log('waited', waited);

  // const add = await connected.addMember('0x95F1F9393D1D3e46df2cda491Fc323E142758C21');
  // console.log('added?', add);

  // const tx = add.wait();
  // console.log('tx', tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
