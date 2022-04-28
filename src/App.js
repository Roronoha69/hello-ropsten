import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import 'bootstrap/dist/css/bootstrap.css'
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Button, Card, CardGroup } from "react-bootstrap"
import gifDemo from './meta-demo.gif'


const greeterAddress = '0x04F079aA280175DE3d96AD2d9D59fFD45d16c1F8';
 
function App() {
  const [greeting, setGreetingValue] = useState();
  const [bn, setBn] = useState();
  const [offGreet, setOffGreet] = useState();
  const [time, setTime] = useState();
  const [ethAddress, setEthAddress] = useState();
  const [transactionHash, setTransactionHash] = useState();

  useEffect(() => {
    fetchGreeting();
  }, [])

  async function requestAccount() {
    await window.ethereum.request({method: 'eth_requestAccounts'});
  }

  async function fetchGreeting() {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet();
        setGreetingValue(data);        
        setOffGreet(data)        
      }
      catch(err) {
        console.log(err);
      }
    }
  }

  async function setGreeting() {
    if(!greeting) return 
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue('');
      setOffGreet('')
    
      await transaction.wait();
      fetchGreeting();
      console.log(transaction.hash);
       const infos = await provider.getTransactionReceipt(transaction.hash);
       const hash_ = transaction.hash
       getHashInfo(infos)
       getHash(hash_)
           
    }
  }


  async function getHashInfo(hash) { 
    setEthAddress(hash.from);
    setBn(hash.blockNumber);   
  }

  async function getHash(hash) {   
    setTransactionHash(hash);
  }
  


  return (
    <div className="App">
     <Navbar bg="light" expand="lg">
  <Container fluid>
    <Navbar.Brand href="#">Hello world</Navbar.Brand>
      <Button variant="success" href='#demo'>Demo</Button>
        <Button variant="outline-success" onClick={requestAccount}>Connect</Button>
        
  </Container>
</Navbar>

<div className="center">
<Card className="text-center">
  <Card.Header><h3>Your life might not be the same after printing "hello world!" on the blockchain</h3></Card.Header>
  <Card.Body>
    <Card.Title>{greeting}</Card.Title>
    <Card.Text>
    
    <a href='https://faucet.egorfine.com/' target="_blank" rel='noreferrer'> You will need rETH from the Ropsten test nework</a>
    <p><span>Changing the greeting can take between 30s and 90s</span></p>
    </Card.Text>
    <button  onClick={setGreeting} variant="primary">Set Greeting</button>
    <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />

  </Card.Body>
  <Card.Footer className="text-muted"> <a className='no-deco' href="https://ropsten.etherscan.io/address/0x04F079aA280175DE3d96AD2d9D59fFD45d16c1F8"> Deployed 2 days ago</a></Card.Footer>
</Card>
</div>


<CardGroup>
  <Card>
    <Card.Body>
      <Card.Title>Actual greeting</Card.Title>
      <Card.Text>
      <span> {offGreet}</span>
      
      
      </Card.Text>
    </Card.Body>
   
  </Card>
  <Card>
    <Card.Body>
      <Card.Title>New transaction infos</Card.Title>
      <Card.Text>

        

  
        <div> 
          <p>From : "{ethAddress}"</p>
          <p>Bloc number {bn} of the ropsten test blockchain</p>
          <p>Transaction hash : <a href={"https://ropsten.etherscan.io/tx/" + transactionHash} target="_blank" rel='noreferrer'> "{transactionHash}"</a>
          </p>
        </div>
        
          <p>Change the greeting to see the new data</p>
      
    
      
      </Card.Text>
    </Card.Body>
  
  </Card>
  
</CardGroup>

     <div className="demo" id='demo'>
     <img src={gifDemo} alt="demo" />
     </div>

    </div>
  );
}

export default App;