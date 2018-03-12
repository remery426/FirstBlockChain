const SHA256 = require('crypto-js/sha256')
class Transaction{
  constructor(fromAddress, toAddress,amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount
  }
}
class Block{
  constructor(timestamp,transactions, previousHash= ''){
    this.timestamp = timestamp;
    this.transactions = transactions
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0
  }
  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + this.nonce + JSON.stringify(this.data)).toString();
  }
  mineBlock(difficulty){
    while(this.hash.substring(0,difficulty)!== Array(difficulty+1).join("0")){
      this.nonce++;;
      this.hash = this.calculateHash()
    }
    console.log('Block mined ' + this.hash)
  }
}
class Blockchain
{
  constructor(){
    this.chain= [this.createGenesisBlock()]
    this.pending = []
    this.reward = 100
    this.difficulty = 2;
  }
  createGenesisBlock(){
    return new Block("01/01/2017", "Genesis block", "0")
  }
  getLatestBlock(){
    return this.chain[this.chain.length-1]
  }
  minePendingTransactions(miningRewardAddress){
    let block = new Block(Date.now(),this.pending)
    block.mineBlock(this.difficulty)
    console.log("mined this")
    this.chain.push(block)
    this.pending = [
      new Transaction(null, miningRewardAddress, this.reward)
    ]

  }
  createTransaction(transaction){
    this.pending.push(transaction)
  }
  getBalanceOfAddress(address){
    let balance = 0
    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.fromAddress === address){
          balance -= trans.amount
        }
        if(trans.toAddress === address){
          balance += trans.amount
        }
      }
    }
    return balance
  }
  isChainValid(){
    for(var i =1; i <this.chain.length; i++){
      const currentBlock = this.chain[i]
      const previous_block = this.chain[i-1]
      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false
      }
      if(currentBlock.previousHash !== previous_block.hash ){
        return false
      }

    }
    return true
  }
}
let myChain = new Blockchain();
myChain.createTransaction(new Transaction('address1','address2',100))
myChain.createTransaction(new Transaction('address2','address1',50))
console.log("Starting the miner...")
myChain.minePendingTransactions("ryan-address")

console.log("balance of Ryan" , myChain.getBalanceOfAddress('ryan-address'))
console.log("Starting the miner...")
myChain.minePendingTransactions("ryan-address")

console.log("balance of Ryan" , myChain.getBalanceOfAddress('ryan-address'))
