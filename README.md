---
Title:  IPFS File Uploader
Author: Sooyoung Hyun
Date:   January 2019
Mail:   hyunsy822@gmail.com
File:   README
---

IPFS File Uploader
===

## What does this project do?

Upload file on IPFS and save the returned 'ipfsHash' in Ethereum

## How to set it up?

Clone this repository.
```
$ git clone https://github.com/hsy822/ipfs_file_uploader.git
$ cd ipfs_file_uploader/
```

Go to the repository folder.
```
$ cd client/
$ npm install
$ cd ..
``` 

Start Ganache-cli.
```
$ ganache-cli
``` 

Open a new terminal and go to project folder. Compile and migrate smart contract. 
```
$ cd ipfs_file_uploader/
$ truffle compile
$ truffle migrate --reset
```

Open a new terminal and go to client folder. You can start server. 
```
$ cd ipfs_file_uploader/
$ cd client/
$ npm run start
```

Go to [http//localhost:3000](http://localhost:3000/) 

---
