import Link from 'next/link';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useNetwork, useSigner, useSwitchNetwork } from 'wagmi';
import { useEffect, useState } from 'react';
import DeployButton from '@/components/DeployButton';
import UnlockButton from '@/components/UnlockButton';
import Greeter from '@/components/Greeter';
import NetworkSelector from '@/components/NetworkSelector';
import Connect from '@/components/Connect';
import SuccessAlert from '@/components/alerts/Success';
import FailAlert from '@/components/alerts/Fail';

export default function Home() {
  const { data: signer, isLoading, error } = useSigner();
  const [txType, setTxType] = useState<'deploy' | 'unlock'>();
  const [locked, setLocked] = useState<boolean>(true);
  const [deployed, setDeployed] = useState<boolean>(false);
  const [contractAddress, setContractAddress] = useState<string>();
  const [txHash, setTxHash] = useState<string>();
  const [network, setNetwork] = useState<boolean>(false);
  // 
  const [newChain, setNewChain] = useState<number>();
  // const [renderer, setRenderer] = useState<boolean>(false);
  // 
  const [successAlert, setSuccessAlert] = useState<boolean>(false);
  const [failAlert, setFailAlert] = useState<boolean>(false);
  const { chain } = useNetwork();
  // const { switchNetwork } = useSwitchNetwork();

  const handleAlert = (success: boolean, type?: 'deploy' | 'unlock') => {
    setTxType(type);
    if(success) {
      setSuccessAlert(true);
      setTimeout(() => setSuccessAlert(false), 5000);
    }
    else {
      setFailAlert(true);
      setTimeout(() => setFailAlert(false), 5000);  
    }
  }

  useEffect(() => {
    if(newChain && newChain === chain?.id)
     setNetwork(true);
    if(newChain !== chain?.id)
     setNetwork(false);
  }, [chain, newChain])



  console.log('chain', chain?.name, chain?.id);
  console.log('network?', network )
  // console.log('locked', locked);
  console.log('signer', signer)
  console.log('signer error', error);
  console.log('newChain', newChain);
  console.log('newChain=chain?', newChain === chain?.id)

  return (
    <>
    {successAlert && ( 
      <div className="fixed top-4 right-4 z-50 text-white">
        <SuccessAlert 
         network={chain?.id} 
         contractAddress={contractAddress}
         txHash={txHash}
         setSuccessAlert={setSuccessAlert}
         type={txType}
        />
      </div>
    )}
    {failAlert && (
      <div className="fixed top-4 right-4 z-50 text-white">
        <FailAlert type={txType} />
      </div>
    )}
    
    <main className="h-screen flex items-center justify-center bg-black">
      <div className="border-4 border-green-400 max-w-2xl w-full p-4 rounded-lg bg-black">
        <h1 className="mb-6 text-center text-3xl font-mono font-bold tracking-tight text-white">
          One Click Contract Deployer
        </h1>
        {signer ? (
          network ? (
            <>
              <p className="mb-6 text-center text-white font-mono">
                <b>Welcome Airdrop Hunter!</b><br />
                Here you can deploy your own greeter contracts with a few clicks<br /> and increase your chance to earn airdrops. <br />
                Follow these easy steps:<br />
                <b>1 - </b>hit &apos;unlock&apos;, pay the unlock fee (0.0007 ETH);<br />
                <b>2 - </b>hit &apos;deploy&apos; and confirm the tx;<br />
                <b>3 - </b>interact with your contract setting new greeter messages.<br />
                Well Done. You increased your chances to earn some free doe!!<br/>
                DON&apos;T REFRESH UNTIL YOU ARE DONE!
              </p>
              <div className="flex justify-center items-center">
                {locked ? (
                  <UnlockButton 
                   setLocked={setLocked}
                   setTxHash={setTxHash}
                   handleAlert={handleAlert} 
                  />
                ) : deployed ? (
                  <Greeter 
                   address={contractAddress} 
                   setTxHash={setTxHash}
                   handleAlert={handleAlert}/>
                ) : (
                  <DeployButton 
                   setDeployed={setDeployed} 
                   setContractAddress={setContractAddress} 
                   handleAlert={handleAlert}
                  />
                )}
              </div>
            </>
          ) : (
            <NetworkSelector setNetwork={setNetwork} 
             setNewChain={setNewChain}
            />
          )
        ) : (
          <Connect />
        )}
      </div>
    </main>
    <div className="fixed bottom-0 left-0 w-full bg-black p-4">
      <div className="text-center">
          <Link href="https://github.com/oneclick-web3/oneClick-deployer" target="_blank" className="text-white hover:underline cursor-pointer font-mono">
              View on GitHub
          </Link>
      </div>
    </div>
    </>
  );
}
