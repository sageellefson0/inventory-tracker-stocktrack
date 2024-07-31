"use client"
import Modal from '@mui/material/Modal';
import * as React from 'react';
import {Box, Typography} from "@mui/material";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import {Stack, Grid} from "@mui/material";
import {firestore} from "@/firebase";
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
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

const theme = createTheme({
  palette: {
    darkblue: {
      main: '#2742AC',
      contrastText: '#fff',
    },
    lightblue: {
      main: '#8FB8DE',
      contrastText: '#000',
    },
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState("");
  const [quantity, setQuantity] = useState(1);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      inventoryList.push({ id: doc.id, ...data });
    });
    console.log(inventoryList);
    setInventory(inventoryList);
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (itemName, itemType, quantity) => {
    const capitalizedItemName = capitalizeFirstLetter(itemName);
    const docRef = await doc(collection(firestore, "inventory"), capitalizedItemName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + quantity, type: itemType });
    } else {
      await setDoc(docRef, { count: quantity, type: itemType });
    }
    await updateInventory();
  }

  const removeItem = async (itemName) => {
    const docRef = doc(collection(firestore, "inventory"), itemName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1, type: docSnap.data().type });
      }
    }
    await updateInventory();
  }

  const removeAllItems = async (itemName) => {
    const docRef = doc(collection(firestore, "inventory"), itemName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }
    await updateInventory();
  }

  const increaseItemQuantity = async (itemName) => {
    const docRef = await doc(collection(firestore, "inventory"), itemName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1, type: docSnap.data().type });
    }
    await updateInventory();
  }

  const filteredInventory = inventory.filter(item =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Box width="100vw" height="100vh" overflow={'hidden'}>
        <Box component="section" width="275px" margin="15px" height="92px" sx={{ p: 2, border: '2px dashed #8FB8DE' }}>
          <Typography variant="h3" gutterBottom color={'#2742AC'}>
            StockTrack
          </Typography>
        </Box>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={'column'}>
          <Box width={"1000px"} display={"inline-block"}  marginBottom={2}>
            <div>
            <Grid container gap={3} justifyContent="flex-end">
            <Button onClick={handleOpen} variant="outlined" startIcon={<AddIcon />}>Add Item</Button>
              <Box>
              <TextField
                id="standard-search"
                label="Search"
                variant="outlined"
                inputProps={{ style: { textTransform: 'capitalize' } }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>
            </Grid>

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
                    <TextField id="standard-name" label="Inventory Item" variant="standard" inputProps={{ style: { textTransform: 'capitalize' } }}
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />
                    <TextField id="standard-qty" label="Quantity" type="number" variant="standard"
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

                    <Button variant="outlined" sx={{ border: '2px solid #8FB8DE' }} onClick={() => {
                      addItem(itemName, itemType, quantity);
                      setItemName('');
                      setItemType('');
                      setQuantity(1);
                      handleClose();
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

          <Box width="1000px" height="70px" textAlign={'center'} bgcolor={'#8FB8DE'} padding={"15px"}>
            <Typography variant="h4" gutterBottom>
              Inventory
            </Typography>
          </Box>

          <Box width="1000px" border={"solid 3px #8FB8DE"} minHeight="400px" maxHeight="400px" sx={{ overflowY: 'auto' }}>
            <Grid container spacing={2} sx={{ mb: 2 }} paddingTop={'20px'}>
              <Grid item xs={2.5} textAlign="center">
                <Typography variant="h6" color={'#2742AC'}>Item Name</Typography>
              </Grid>
              <Grid item xs={1.5} textAlign="center">
                <Typography variant="h6" color={'#2742AC'}>Type</Typography>
              </Grid>
              <Grid item xs={2.5} textAlign="center">
                <Typography variant="h6" color={'#2742AC'}>Quantity</Typography>
              </Grid>
            </Grid>
            <Stack spacing={2}>
              {filteredInventory.map((i) => (
              <Grid container spacing={2} key={i.id} sx={{ bgcolor: 'lightgray', padding: '20px', '& > .MuiGrid-item': { padding: '0' } }} alignItems="center">
                  <Grid item xs={2} textAlign="center">
                    <Typography>{i.id}</Typography>
                  </Grid>
                  <Grid item xs={2} textAlign="center">
                    <Typography>{i.type}</Typography>
                  </Grid>
                  <Grid item xs={2} textAlign="center">
                    <Typography>{i.count}</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="center">
                    <Box display="flex" gap={"15px"} height="100%" alignItems="center" justifyContent="center">
                      <Button color="darkblue" variant="contained" onClick={() => increaseItemQuantity(i.id)}>Add +1</Button>
                      <Button color="darkblue" variant="contained" onClick={() => removeItem(i.id)}>Remove -1</Button>
                      <Button color="darkblue" variant="contained" onClick={() => removeAllItems(i.id)}>Remove All</Button>
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </Stack>
          </Box>
        </Box>
        <Box bgcolor={'lightgray'} padding={"30px"} textAlign={'center'} bottom={0} position={'absolute'} width={'100%'}>
          Stock Track © 2024 | All rights reserved.
        </Box>
      </Box>
    </ThemeProvider>
  );
}