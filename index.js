import { ethers } from 'ethers';
import createCsvWriter from "csv-writer"

async function getBlockTransactions(blockNumber) {
    const provider = new ethers.providers.WebSocketProvider(WS_URL);
    const block = await provider.getBlock(blockNumber);

    const blockData = []

    for (let i = 0; i < block.transactions.length; i++) {
        const tx = block.transactions[i]
        const txn = await provider.getTransaction(tx)

        let _blockData = {}

        _blockData.txHash = txn.hash
        _blockData.gasPrice = ethers.utils.formatUnits(txn.gasPrice, 'gwei')
        _blockData.gasLimit = txn.gasLimit.toString()
        _blockData.nonce = txn.nonce.toString()
        _blockData.txnData = txn.data.toString()
        _blockData.size = txn.data.toString().length

        blockData.push(_blockData)
    };

    return blockData
}


async function main() {
    const blockNumber = 25431404;
    const transactions = await getBlockTransactions(blockNumber);

    console.log(transactions)

    const csvWriter = createCsvWriter.createObjectCsvWriter({
        path: `transactions_block.csv`,
        header: [
            { id: 'nonce', title: 'Nonce' },
            { id: 'txHash', title: 'Transaction' },
            { id: 'gasPrice', title: 'Gas Price' },
            { id: 'gasLimit', title: 'Gas Limit' },
            { id: 'txnData', title: 'Data' },
            { id: 'size', title: 'Size' }
        ]
    });
    csvWriter.writeRecords(transactions);
}

main();
