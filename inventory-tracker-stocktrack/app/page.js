"use client"
import Modal from '@mui/material/Modal';
import * as React from 'react';
import {Box, Typography} from "@mui/material";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import {Stack, Grid} from "@mui/material";
import {firestore} from "@/firebase";
import MenuItem from '@mui/material/MenuItem';

import { collection, query,getDocs,doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 500,

  bgcolor: 'background.paper',
  border: '2px solid #8FB8DE',
  boxShadow: 24,
  p: 4,
};

const currencies = [
  {
    value: 'Perishable',
    label: 'Perishable',
  },
  {
    value: 'Non-perishable',
    label: 'Non-perishable',
  },
];

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Home() {
  const [inventory, setInventory] = useState([])

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState("")
  const [itemType, setItemType] = useState("")
  const [quantity, setQuantity] = useState(1)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      const data = doc.data()
      inventoryList.push({ id: doc.id, ...data })
    })
    console.log(inventoryList)
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (itemName, itemType, quantity) => {
    const capitalizedItemName = capitalizeFirstLetter(itemName)
    const docRef = await doc(collection(firestore, "inventory"), capitalizedItemName)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { count } = docSnap.data()
      await setDoc(docRef, { count: count + quantity, type: itemType })
    } else {
      await setDoc(docRef, { count: quantity, type: itemType })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef =  doc(collection(firestore,"pantry"), item)
   const docSnap= await getDoc(docRef)
    if(docSnap.exists()){
      const {count} = docSnap.data()
      if(count === 1){
        await deleteDoc(docRef)
      } else{
        await setDoc(docRef, {count:count-1})
      }
  
     }
    await updatePantry()
  }

  return (
    <Box width="100vw" height="100vh">
      <Box component="section" width="275px" margin="15px" height="92px" sx={{ p: 2, border: '2px dashed #8FB8DE' }}>
        <Typography variant="h3" gutterBottom color={'#2742AC'}>
          StockTrack
        </Typography>
      </Box>
      <Box width="100vw" height="100vh" display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={'column'}>
        <Box width={"300px"} display={"inline-block"}>
          <Button variant="outlined" startIcon={<DeleteIcon />}>
            Delete
          </Button>

          <div>
            <Button onClick={handleOpen} variant="outlined" startIcon={<AddIcon />}>Add</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h5" component="h2" color={'#2742AC'} textAlign={'center'}>
                  Add Inventory Item
                </Typography>

                <Box
                  textAlign={'center'}
                  marginTop={'30px'}
                  component="form"
                  sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField id="standard-basic" label="Inventory Item" variant="standard"  inputProps={{style: {textTransform: 'capitalize'}}}
                    value={itemName} 
                    onChange={(e) => setItemName(e.target.value)} 
                  />
                  <TextField id="standard-basic" label="Quantity" type="number" variant="standard" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                  />
                  <TextField
                    id="item-type"
                    select
                    label="Select"
                    variant="standard"
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                  >
                    {currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button variant="outlined" sx={{border: '2px solid #8FB8DE' }} onClick={() =>{
                    addItem(itemName, itemType, quantity)
                    setItemName('')
                    setItemType('')
                    setQuantity(1)
                    handleClose()
                  }}>
                    <Typography variant="h6" gutterBottom color={'#2742AC'}>
                      Save
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Modal>
          </div>
        </Box>

        <Box width="800px" height="50px" textAlign={'center'} bgcolor={'#8FB8DE'}>
          <Typography variant="h4" gutterBottom> 
            Inventory
          </Typography>
        </Box>

        <Box width="800px">
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6" color={'#2742AC'}>Item Name</Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6" color={'#2742AC'}>Type</Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6" color={'#2742AC'}>Quantity</Typography>
            </Grid>
          </Grid>
          <Stack spacing={2} overflow={"scroll"}>

            {inventory.map((i) => (
              <Grid container spacing={2} key={i.id} sx={{ bgcolor: 'lightgray' }}>
                <Grid item xs={4} textAlign="center">
                  <Typography>{i.id}</Typography>
                </Grid>
                <Grid item xs={4} textAlign="center">
                  <Typography>{i.type}</Typography>
                </Grid>
                <Grid item xs={4} textAlign="center">
                  <Typography>{i.count}</Typography>
                </Grid>
              </Grid>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
