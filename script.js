// Set up web3 provider with Metamask


window.addEventListener("load", async () => {


	let ethereum = window.ethereum;
	
	
	let web3 = window.web3;
	
	
	if (typeof ethereum !== "undefined" && ethereum.isMetaMask) {
	
	
	// Check if connected to the network on which the smart contract is deployed
	
	try {
	
	let networkId = await ethereum.request({ method: "net_version" });
	
	if (networkId !== "8080") {
	
	console.error("Please connect to the correct network.");
	
	return;
	
	}
	
	// Request access to user's MetaMask account.
	
	await ethereum.request({ method: "eth_requestAccounts" });
	
	web3 = new Web3(ethereum);
	
	// Display the connected wallet address.
	
	let accounts = await web3.eth.getAccounts();
	
	let walletAddress = document.createElement("p");
	
	walletAddress.innerHTML = "Connected Wallet: " + accounts[0];
	
	let connectWalletBtn = document.getElementById("connect-wallet-btn");
	
	connectWalletBtn.parentNode.insertBefore(
	
	walletAddress,
	
	connectWalletBtn.nextSibling
	
	);
	
	} catch (error) {
	
	console.error("Failed to connect to Metamask: " + error.message);
	
	return;
	
	}
	
	} else {
	
	
	console.error("Please install MetaMask.");
	
	return;
	
	}
	
	
	// Declare smart contract addresses and contract functions.
	
	
	const contractAddress = "0x1234567890123456789012345678901234567890"; // Replace with actual contract address.
	
	
	const contractAbi = [
	{
		"inputs": [],
		"name": "computePathsCurrentBoard",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "generateNewBoard",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newCoordinates",
				"type": "uint256"
			}
		],
		"name": "updateCurrentRoomCoordinates",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "currentRoom",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "escapeRoomData",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "currentRoomCoordinates",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
	
	
	const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
	
	
	// Declare image filenames.
	
	
	const emptyCellImage = "empty-cell.png";
	
	
	const obstacleImage = "obstacle.png";
	
	
	const startImage = "start.png";
	
	
	const escapeImage = "escape.png";
	
	
	const gameBoardCanvas = document.getElementById("game-board");
	
	
	const gameBoardCtx = gameBoardCanvas.getContext("2d");
	
	
	const cellSize = 100;
	
	
	// Draw the current board on the canvas.
	
	
	function drawGameBoard(currentRoom) {
	
	
	for (let row = 0; row < currentRoom.length; row++) {
	
	for (let col = 0; col < currentRoom[row].length; col++) {
	
	// Set the proper image based on the value at the current cell.
	
	let cellImage = emptyCellImage;
	
	if (currentRoom[row][col] === 1) {
	
	cellImage = obstacleImage;
	
	} else if (row === 0 && col === 0) {
	
	cellImage = startImage;
	
	} else if (row === 2 && col === 2) {
	
	cellImage = escapeImage;
	
	}
	
	// Draw the image on the canvas.
	
	let img = new Image();
	
	img.src = cellImage;
	
	img.onload = () => {
	
	gameBoardCtx.drawImage(
	
	img,
	
	col * cellSize,
	
	row * cellSize,
	
	cellSize,
	
	cellSize
	
	);
	
	};
	
	}
	
	}
	
	}
	
	
	// Connect to Metamask wallet
	
	
	let connectWalletBtn = document.getElementById("connect-wallet-btn");
	
	
	connectWalletBtn.addEventListener("click", async () => {
	
	
	try {
	
	// Request access to user's MetaMask account.
	
	await ethereum.request({ method: "eth_requestAccounts" });
	
	web3 = new Web3(ethereum);
	
	// Check if connected to the network on which the smart contract is deployed
	
	let networkId = await web3.eth.net.getId();
	
	if (networkId !== EXPECTED_NETWORK_ID) {
	
	console.error("Please connect to the correct network.");
	
	return;
	
	}
	
	// Display the connected wallet address.
	
	let accounts = await web3.eth.getAccounts();
	
	let walletAddress = document.createElement("p");
	
	walletAddress.innerHTML = "Connected Wallet: " + accounts[0];
	
	connectWalletBtn.parentNode.insertBefore(
	
	walletAddress,
	
	connectWalletBtn.nextSibling
	
	);
	
	} catch (error) {
	
	console.error("Failed to connect to Metamask: " + error.message);
	
	}
	
	});
	
	
	// Generate new board
	
	
	let generateNewBoardBtn = document.getElementById("generate-new-board-btn");
	
	
	generateNewBoardBtn.addEventListener("click", async () => {
	
	
	try {
	
	let currentAccount = await web3.eth.getAccounts();
	
	let generateNewBoardResponse = await contractInstance.methods.generateNewBoard().send({
	
	from: currentAccount[0],
	
	});
	
	if (generateNewBoardResponse.status !== true) {
	
	console.log("Failed to generate new board.");
	
	return;
	
	}
	
	currentRoomResponse = await contractInstance.methods.getCurrentRoom().call({
	
	from: currentAccount[0],
	
	});
	
	let currentRoom = currentRoomResponse[0];
	
	drawGameBoard(currentRoom);
	
	let updateRoomResponse = await contractInstance.methods.updateRoom(currentRoom).send({
	
	from: currentAccount[0],
	
	});
	
	if (updateRoomResponse.status !== true) {
	
	console.log("Update failed.");
	
	return;
	
	}
	
	} catch (error) {
	
	console.error(error);
	
	}
	
	});
	
	
	// Compute paths
	
	
	let computePathsBtn = document.getElementById("compute-paths-btn");
	
	
	computePathsBtn.addEventListener("click", async () => {
		try {
		  let currentAccount = await web3.eth.getAccounts();
		  let computePathsResponse = await contractInstance.methods.computePaths().send({
			from: currentAccount[0],
		  });
	
		  if (computePathsResponse.status !== true) {
			console.log("Failed to compute path.");
			return;
		  }
	
		  let pathsResponse = await contractInstance.methods.getPaths().call({
			from: currentAccount[0],
		  });
		  console.log("Paths computed:", pathsResponse[0]);
		} catch (error) {
		  console.error(error);
		}
	  });
	  
	  // Permission prompt when calling smart contract methods
	  ethereum.autoRefreshOnNetworkChange = false;
	  ethereum.on("chainChanged", () => {
		document.location.reload();
	  });
	
	  ethereum.on("accountsChanged", (accounts) => {
		document.location.reload();
	  });
	
	  ethereum.on("message", (message) => {
		console.log(message);
	  });
	});