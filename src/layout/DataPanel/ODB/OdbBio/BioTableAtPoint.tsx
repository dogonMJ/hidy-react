import { useEffect, useState, forwardRef } from "react"
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import { StringObject } from "types"

const boxStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: '75%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const rankList = ["kingdom", "phylum", "subphylum", "infraphylum", "division", "class", "subclass", "infraclass", "order", "suborder",
  "infraorder", "family", "subfamily", "infrafamily", "genus", "subgenus", "species", "subspecies", "<group>"]

const rankOrder = rankList.reduce((acc, currentValue, index) => {
  acc[currentValue] = index + 1;
  return acc;
}, {} as { [key: string]: number });

export const BioTableAtPoint = forwardRef((props: { eventID: string }, ref) => {
  const { eventID } = props
  const [dataArray, setDataArray] = useState<StringObject[]>([])

  const url = `${process.env.REACT_APP_PROXY_BASE}/data/odbocc/taxlist/${eventID}`

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(json => {
        json.sort((a: StringObject, b: StringObject) => {
          if (rankOrder[a.taxonRank] !== rankOrder[b.taxonRank]) {
            return rankOrder[a.taxonRank] - rankOrder[b.taxonRank];
          } else {
            return a.canonicalName.localeCompare(b.canonicalName);
          }
        });
        setDataArray(json)
      })
  }, [url])

  return (
    <Box sx={boxStyle}>
      <TableContainer component={Paper} style={{ maxHeight: '75vh' }} >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow >
              <TableCell style={{ backgroundColor: '#f5f5f5' }}>Rank</TableCell>
              <TableCell style={{ backgroundColor: '#f5f5f5' }}>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataArray.map((data, i) => {
              if (data) {
                return (
                  <TableRow key={i}>
                    <TableCell scope="row" style={{ textAlign: 'left' }}>
                      {data.taxonRank}
                    </TableCell>
                    <TableCell style={{ textAlign: 'left' }}>
                      {data.canonicalName}
                    </TableCell>
                  </TableRow>
                )
              } else {
                return null
              }
            })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
})