import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

//버튼을 만든 것(type 가 module이기 때문에 js로 만든것)
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
withdrawButton.onclick = withdraw
async function connect() {
    //첫번째로, windows.ethereum 있는지 확인 = metamask 설치
    if (typeof window.ethereum !== "undefined") {
        //metamask 키는 것
        window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "Please Install Metamask"
    }
}

//fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}`)
    if (typeof window.ethereum !== "undefined") {
        //무엇이 필요한가?
        // provider = connection to the blockchain
        // signer = wallet = someone with gas
        // contract that we are interacting with = ABI, address 필요

        const provider = new ethers.providers.Web3Provider(window.ethereum) // provider = Metamask 이므로 metamask
        const signer = provider.getSigner() //front end랑 연결된 계정
        const contract = new ethers.Contract(contractAddress, abi, signer) //? ABI, address
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("done")
            // listen for the tx to be mined
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    //provider.once(얘가 나오면, 이 함수 실행)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmation`
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner() //front end랑 연결된 계정
        const contract = new ethers.Contract(contractAddress, abi, signer) //? ABI, address
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
// withdraw
