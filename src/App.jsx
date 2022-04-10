import React, {useState, useEffect} from 'react';
import {Box, Grid, Stack, Button, TextField} from '@mui/material';
import DesoIdentity from './libs/desoIdentity'
const IdentityUsersKey = "identityUsersV2"
import DesoApi from './libs/desoApi'

function App() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [toUsername, setToUsername] = useState("BC1YLg7LHWJ23XGScW67yrT66GXtyXE7KQpBDDrpXsLF4huH1VwY6QE")
    const [message, setMessage]= useState("Send a transaction:")
    const [publicKey, setSetPublicKey] = useState(null)
    const [desoIdentity, setDesoIdentity] = useState(null)
    const [desoApi, setDesoApi] = useState(null)

    useEffect(() => {
        const di = new DesoIdentity()
        setDesoIdentity(di)
        const da = new DesoApi()
        setDesoApi(da)

        let user = {}
        if (localStorage.getItem(IdentityUsersKey) === 'undefined'){
            user = {}
        } else if (localStorage.getItem(IdentityUsersKey)){
            user = JSON.parse(localStorage.getItem(IdentityUsersKey) || '{}')
        }

        if(user.publicKey){
            setLoggedIn(true)
            setSetPublicKey(user.publicKey)
        }

    } , []) // eslint-disable-line react-hooks/exhaustive-deps

    const login = async () => {
        const user = await desoIdentity.loginAsync(4)
        setSetPublicKey(user.publicKey)
        setLoggedIn(true)
    }
    const logout = async () => {
        const result = await desoIdentity.logout(publicKey)
        setSetPublicKey(null)
        setLoggedIn(false)
    }

    const sendDeso = async () => {
        const sendAmt = "100000000"; // 0.1 Deso
        const rtnSendDeso = await desoApi.sendDeso(publicKey, toUsername, sendAmt);
        // const rtnSubmitPost = await desoApi.submitPost(publicKey,  body, extraData)
        const transactionHex = rtnSendDeso.TransactionHex
        const signedTransactionHex = await desoIdentity.signTxAsync(transactionHex)
        const rtnSubmitTransaction = await desoApi.submitTransaction(signedTransactionHex) 

        if(rtnSubmitTransaction) {
            setMessage("🎉 Deso Sent!!! 🥳")
        }

    }
    

    return (
        <>
        <iframe
            title="desoidentity"
            id="identity"
            frameBorder="0"
            src="https://identity.deso.org/embed?v=2"
            style={{height: "100vh", width: "100vw", display: "none", position: "fixed",  zIndex: 1000, left: 0, top: 0}}
        ></iframe>
        <Grid container>
        <Grid item sm={0} lg={4}></Grid>
        <Grid item sm={12} lg={4} sx={{alignItems:"center", justifyContent:"center", display:"flex"}}  >

        <Stack >
        <Box sx={{mb:2, mt:2}}>
            {
                (loggedIn) ? (
                <Button variant="contained" onClick={logout}>
                    Log Out
                </Button>

                ) : (
                <Button variant="contained" onClick={login}>
                Login
                </Button>  
                )
            }
            </Box>
            {
                (loggedIn) ? (
                <>
                <Box sx={{mb:2}}>
                    GM, person whose publicKey is: {publicKey}
                </Box>
                <Box sx={{mb:2}}>
                    <TextField
                    sx={{width:"100%", mb:2}}
                    id="event-username"
                    label="Send GM to..."
                    value={toUsername}
                    onChange={e => setToUsername(e.target.value)}
                    />
                </Box>
                <Box sx={{mb:2}}>
                    <Button variant="contained" onClick={sendDeso} > Send deso </Button>
                </Box>
                <Box sx={{mb:2}}>
                    {message}
                </Box>
                </>
                ) : (
                null
                )
            }
        </Stack>  

        </Grid>
        <Grid item sm={0} lg={4}></Grid>
        
        </Grid>

        </>
        
    );
}

export default App;