const contractAddress="0x0970BA6c919D85c342424D8407D1887760fB8964";
const contactAbi=[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "patientID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "donorID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "organID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "DonationStored",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_patientID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_donorID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_organID",
				"type": "string"
			}
		],
		"name": "storeDonation",
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
			}
		],
		"name": "donations",
		"outputs": [
			{
				"internalType": "string",
				"name": "patientID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "donorID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "organID",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDonations",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "patientID",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "donorID",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "organID",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct TransplantContract.Donation[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
export {contractAddress,contactAbi}