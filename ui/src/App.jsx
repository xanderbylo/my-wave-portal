import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
	const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState('')
  
  const contractAddress = "0x5f846aFB1B8A0d6Fe56a14604C440724531ea616";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.log("Make sure you have metamask!");
			} else {
				console.log("We have the ethereum object", ethereum);
			}

			const accounts = await ethereum.request({ method: "eth_accounts" });

			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log("Found an authorized account:", account);
				setCurrentAccount(account);
        getAllWaves();
			} else {
				console.log("No authorized account found");
			}
		} catch (error) {
			console.log(error);
		}
	}

	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get Metamask!");
				return;
			}

			const accounts = await ethereum.request({
				method: "eth_requestAccounts"
			});

			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error);
		}
	}

  const getAllWaves = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let wavePortalContract;
  
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

	const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }  
  };

  const sendMessage = (e) => setMessage(e.target.value)

  useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	return (
    <div className="wrapper">
      <nav>
        <div className="logo">
          WavePortal
        </div>
        
        {!currentAccount && (
					<button className="connectButton" onClick={connectWallet}>
						Connect wallet
					</button>
				)}
        {currentAccount && (
        <button className="connectButton">
          {currentAccount.toString().substring(0, 10) + '...'}
					</button> 
        )}
      </nav>

      <div className="container">
        <div className="hero">
  				<h1>
  					<span className="wave">👋</span>
  					&nbsp;WavePortal
  				</h1>
  
  				<p className="subtitle">
  					I'm building the future of the internet. Connect your Ethereum wallet and send me a wave through the metaverse!✨
  				</p>
  
          <input className="messageInput" type="text" value={message} placeholder="Your message..." onChange={e => setMessage(e.target.value)}></input>
  
  				<button className="waveButton" onClick={wave}>
  					Make waves
  				</button>

          {allWaves.map((wave, index) => {
          return (
            <div className="waveCard" key={index}>
              <p className="messageText">{wave.message}</p>
              <div className="waveMessage">
                <p className="messageAddress">{wave.address}</p>
                <p className="messageTime">{wave.timestamp.toLocaleString()}</p>
              </div>
            </div>)
        })}
        </div>
      </div>
		</div>
	);
};

export default App;