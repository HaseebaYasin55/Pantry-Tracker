'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#ffffff', // Background color of the modal
  border: '2px solid #28666E',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingItem, setEditingItem] = useState(null)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  const addItem = async () => {
    if (itemName) {
      const docRef = doc(collection(firestore, 'inventory'), itemName)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1 })
      } else {
        await setDoc(docRef, { quantity: 1 })
      }
      await updateInventory()
      resetForm()
    }
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const updateItem = async () => {
    if (editingItem && itemQuantity) {
      const docRef = doc(collection(firestore, 'inventory'), editingItem)
      await setDoc(docRef, { quantity: parseInt(itemQuantity) })
      await updateInventory()
      resetForm()
    }
  }

  const resetForm = () => {
    setItemName('')
    setItemQuantity('')
    setEditingItem(null)
    handleClose()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSearch = (e) => setSearchTerm(e.target.value)

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      bgcolor={'#ffffff'} // Background color changed to white
    >
      <Typography
        variant="h2"
        sx={{
          color: '#28666E',
          marginBottom: 2,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Pantry Tracker
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {editingItem ? 'Edit Item' : 'Add Item'}
          </Typography>
          <Stack width="100%" direction={'column'} spacing={2}>
            <TextField
              id="item-name"
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            {!editingItem && (
              <TextField
                id="item-quantity"
                label="Item Quantity"
                variant="outlined"
                fullWidth
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                type="number"
              />
            )}
            <Stack direction={'row'} spacing={2}>
              <Button
                variant="contained"
                onClick={editingItem ? updateItem : addItem}
                sx={{
                  bgcolor: '#28666E',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#C8C8A9',
                  },
                }}
              >
                {editingItem ? 'Update' : 'Add'}
              </Button>
              <Button
                variant="outlined"
                onClick={resetForm}
                sx={{
                  bgcolor: '#28666E',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#C8C8A9',
                  },
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
      <Box
        width="800px"
        border={'1px solid #28666E'} // Border color for the inventory box
        sx={{
          borderRadius: '10px',
          overflow: 'hidden',
          bgcolor: '#ffffff', // Background color of the inventory box
          marginTop: 2,
          padding: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#28666E',
            marginBottom: 2,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Items
        </Typography>
        <Stack spacing={2} marginBottom={2}>
          <TextField
            label="Search Items"
            variant="outlined"
            fullWidth
            onChange={handleSearch}
          />
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              bgcolor: '#28666E',
              color: 'white',
              '&:hover': {
                bgcolor: '#C8C8A9',
              },
            }}
          >
            Add New Item
          </Button>
        </Stack>
        <Stack
          height="300px"
          spacing={2}
          overflow={'auto'}
          bgcolor={'#7c9885'} // Background color of the list box
          paddingY={2}
          sx={{
            '&::-webkit-scrollbar': {
              width: '12px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#7c9885', // Scrollbar track color
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#28666E', // Scrollbar thumb color
              borderRadius: '10px',
            },
          }}
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="80px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={3}
              sx={{
                border: '2px solid #28666E', // Border color for items
                borderRadius: '5px',
              }}
            >
              <Typography sx={{ fontWeight: 'bold', color: 'black', width: '50%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</Typography>
              <Typography>{quantity}</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setItemName(name)
                    setEditingItem(name)
                    handleOpen()
                  }}
                  sx={{
                    bgcolor: '#28666E',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#C8C8A9',
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                  sx={{
                    bgcolor: '#28666E',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#C8C8A9',
                    },
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}


