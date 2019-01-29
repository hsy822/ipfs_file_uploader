import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import ipfs from "./ipfs";
import { Card, Input, Image, Heading, MetaMaskButton, PublicAddress  } from 'rimble-ui'
import "./App.css";

class App extends Component {
  state = { 
    ipfsHash: '', 
    storageValue: 0, 
    web3: null, 
    buffer: null,
    account: null ,
    contract: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const coinBase = await web3.eth.getCoinbase()
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log("networkId", networkId)
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      console.log("deployedNetwork", deployedNetwork)
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, coinBase }, this.getFile);
      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  captureFile = (event) => {
    console.log('capture file...')
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer : Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onClick = (event) => {
    event.preventDefault()
    console.log('submit...')

    const { buffer, coinBase, contract } = this.state;

    ipfs.files.add(buffer, (error, result) => {
      
      if(error) {
        console.error(error)
        return
      }
      console.log('result', result)

      contract.methods.set(result[0].hash).send({ from: coinBase })
      .then((result) => {
        this.getFile()
      })
    })
    
  }

  getFile = () => {
    this.state.contract.methods.get(this.state.coinBase).call()
    .then((ipfsHash) => {
      this.setState({ ipfsHash })
      console.log("ipfsHash", this.state.ipfsHash)
    })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Card className="container">
          <PublicAddress address={this.state.coinBase}></PublicAddress>
          <div className="pure-g">
            <div className="pure-u-1-1">             
              <Heading>Upload file on IPFS and save the returned 'ipfsHash' in Ethereum</Heading>
              <Image src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""></Image>
              <div style={{marginBottom : '20px'}}>
                <Input type="file" onChange={this.captureFile}></Input>
              </div>
              <div>
                <MetaMaskButton type="submit" onClick={this.onClick}>upload</MetaMaskButton>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

export default App;
