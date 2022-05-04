const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);

  //Get Contract Balance
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  //Get Total Waves
  let waveCount;
  waveCount = await waveContract.getTotalWaves();
  console.log(waveCount.toNumber());

  //Send Wave
  let waveTxn = await waveContract.wave("A test message! Wave #1");
  await waveTxn.wait(); // Wait for the transaction to be mined

  //Send a Second Wave (random user)
  const [_, randomPerson] = await hre.ethers.getSigners();
  waveTxn = await waveContract
    .connect(randomPerson)
    .wave("Another test message! Wave #2");
  await waveTxn.wait(); // Wait for the transaction to be mined

  //Send a Second Wave (same original user)
  waveTxn = await waveContract.wave("A test message! Wave #3");
  await waveTxn.wait(); // Wait for the transaction to be mined

  //Get Contract Balance after sending waves
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();
