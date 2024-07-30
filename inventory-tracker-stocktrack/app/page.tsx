import { Box, Stack, Typography } from "@mui/material";

const item = [
  'orange',
  'banana',
  'blueberries',
  'apple',
  'kiwi',
  'stawberry',
  'starfruit',
  'peach',
  'plum',
  'raspberry',
  'cherry',
  'watermelon'
]

export default function Home() {
  return (
    <Box width="100vw" height="100vh">
    <Box component="section" width="275px" margin="15px" height="92px" sx={{ p: 2, border: '2px dashed #8FB8DE' }}>
       <Typography variant="h3" gutterBottom color={'#2742AC'}>
      StockTrack
      </Typography>

    </Box>
    <Box width="100vw" height="100vh" display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={'column'}>

    <Box width="800px" height="50px" textAlign={'center'} bgcolor={'#8FB8DE'}>
      <Typography variant="h4" gutterBottom> 
      Inventory
      </Typography>
      </Box>

        <Stack
          width="800px" height="200px"
          spacing={2} overflow={"scroll"}>

          {item.map((i) => (
            <Box key={i} width="100%" height="200px" display={"flex"} justifyContent={"center"} alignItems={"center"} bgcolor={"lightgray"}>

              {i}
            </Box>
          ))}
        </Stack>
      </Box>
      </Box>
  );
}
