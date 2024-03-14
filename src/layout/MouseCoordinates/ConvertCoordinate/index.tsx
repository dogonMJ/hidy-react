import proj4 from "proj4"
import { Box, Button, FormControl, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { ChangeEvent, memo, useCallback, useEffect, useState } from "react"
import { useAlert } from "hooks/useAlert"
import { AlertSlide } from "components/AlertSlide/AlertSlide"
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks"
import { coordInputSlice } from "store/slice/coordInputSlice"
import { customRound } from "Utils/UtilsMap"

const styles = {
  textField: {
    width: 'auto',
  },
  input: {
    fontFamily: 'monospace',
    fontSize: '12px',
    height: '1.9rem'
  },
  inputLabel: {
    fontSize: '14px',
  },
  selectInputProps: {
    padding: 0.5,
    textAlign: 'center',
    fontSize: '12px',
  },
  menuItem: {
    fontSize: '12px'
  }
};

const EPSGSelect = memo(({ EPSG, handleSelect }: { EPSG: string, handleSelect: (event: SelectChangeEvent) => void }) => {
  return (
    <FormControl>
      <Select
        value={EPSG}
        onChange={handleSelect}
        size="small"
        inputProps={{ sx: styles.selectInputProps, }}>
        <MenuItem sx={styles.menuItem} value="EPSG:4326">WGS84 (EPSG:4326)</MenuItem>
        <MenuItem sx={styles.menuItem} value="EPSG:3857">WGS84 Web Mercator (EPSG:3857)</MenuItem>
        <MenuItem sx={styles.menuItem} value="EPSG:3825">TWD97/119 (EPSG:3825)</MenuItem>
        <MenuItem sx={styles.menuItem} value="EPSG:3826">TWD97/121 (EPSG:3826)</MenuItem>
        <MenuItem sx={styles.menuItem} value="EPSG:3827">TWD67/119 (EPSG:3827)</MenuItem>
        <MenuItem sx={styles.menuItem} value="EPSG:3828">TWD67/121 (EPSG:3828)</MenuItem>
        <MenuItem sx={styles.menuItem} value="EPSG:32650">WGS84/UTM 50N (EPSG:32650)</MenuItem>
        <MenuItem sx={styles.menuItem} value="EPSG:32651">WGS84/UTM 51N (EPSG:32651)</MenuItem>
      </Select>
    </FormControl>
  )
})

export const ConverCoordinates = memo((props: { activeMarker: boolean }) => {
  const { activeMarker } = props
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  const { openAlert, setOpenAlert } = useAlert()
  const [inputX, setInputX] = useState<string>('')
  const [inputY, setInputY] = useState<string>('')
  const [Y, setY] = useState<number | null>(null)
  const [X, setX] = useState<number | null>(null)
  const [EPSG1, setEPSG1] = useState('EPSG:4326')
  const [EPSG2, setEPSG2] = useState('EPSG:3826')
  const [transformed, setTransformed] = useState('')
  const [coor4326, setCoord4326] = useState<number[]>()
  const current = useAppSelector(state => state.coordInput.current)

  const handleSelectEPSG1 = useCallback((event: SelectChangeEvent) => {
    setEPSG1(event.target.value)
    setTransformed('')
  }, [])
  const handleSelectEPSG2 = useCallback((event: SelectChangeEvent) => {
    setEPSG2(event.target.value)
  }, [])

  const handleY = (event: ChangeEvent<HTMLInputElement>) => {
    setInputY(event.target.value)
  }
  const handleX = (event: ChangeEvent<HTMLInputElement>) => {
    setInputX(event.target.value)
  }

  const handleBlurY = () => {
    if (Number(inputY) || inputY === '0') {
      setY(Number(inputY))
    } else if (inputY.trim() === '') {
      setX(null)
    } else {
      setY(null)
      setOpenAlert(true)
    }
  }
  const handleBlurX = () => {
    if (Number(inputX) || inputX === '0') {
      setX(Number(inputX))
    } else if (inputX.trim() === '') {
      setX(null)
    } else {
      setX(null)
      setOpenAlert(true)
    }
  }

  const handleTransform = () => {
    if (X !== null && Y !== null) {
      const result = proj4(EPSG1, EPSG2, [X, Y])
      setCoord4326(proj4(EPSG1, 'EPSG:4326', [X, Y]))
      if (EPSG2 === 'EPSG:4326') {
        setTransformed(`${customRound(result[1], 5, 'string')}, ${customRound(result[0], 5, 'string')}`)
      } else {
        setTransformed(`${customRound(result[1], 1, 'string')}, ${customRound(result[0], 1, 'string')} m`)
      }
    } else {
      setTransformed('')
    }
  }
  const handlePaste = () => {
    setInputX(current[1].toString())
    setInputY(current[0].toString())
    setX(current[1])
    setY(current[0])
  }

  const handlePass = () => {
    const fromTransform = coor4326?.map(n => customRound(n, 5) as number) //toFixed 5 進位問題
    fromTransform && dispatch(coordInputSlice.actions.setCurrent([fromTransform[1], fromTransform[0]]))
  }
  useEffect(() => {
    handleTransform()
  }, [EPSG2])

  return (
    <>
      <Paper
        className="mousePos"
        sx={{
          bottom: activeMarker ? '124px' : '50px',
          paddingBlock: '6px'
        }}
      >
        <Stack spacing={1}>
          <Stack
            direction='row'
            justifyContent={'space-between'}
            alignItems={'center'}
            display={'flex'}
          >
            <Typography variant="caption" sx={{ paddingLeft: '4px' }}>
              {t('transformHeader')}
            </Typography>
            {activeMarker && EPSG1 === 'EPSG:4326' &&
              <Button
                sx={{
                  height: '20px',
                  fontSize: '12px',
                  textTransform: 'none'
                }}
                onClick={handlePaste}
              >
                {t('pasteCoor')}
              </Button>
            }
          </Stack>
          <EPSGSelect EPSG={EPSG1} handleSelect={handleSelectEPSG1} />
          <Stack direction='row' spacing={1} sx={{ paddingTop: '6px' }}>
            <TextField
              size="small"
              style={styles.textField}
              label={EPSG1 === 'EPSG:4326' ? `${t("latitude")}` : `y`}
              value={inputY}
              onChange={handleY}
              onBlur={handleBlurY}
              InputProps={{ style: styles.input }}
              InputLabelProps={{
                shrink: true,
                style: styles.inputLabel
              }}
            />
            <TextField
              size="small"
              style={styles.textField}
              label={EPSG1 === 'EPSG:4326' ? `${t("longitude")}` : `x`}
              value={inputX}
              onChange={handleX}
              onBlur={handleBlurX}
              InputProps={{ style: styles.input }}
              InputLabelProps={{
                shrink: true,
                style: styles.inputLabel
              }}
            />
          </Stack>
          <FormControl>
            <Button
              variant="outlined"
              size="small"
              sx={{ width: '60%', marginLeft: 'auto', marginRight: 'auto' }}
              onClick={handleTransform}
            >
              ↓  {t('transform')}  ↓
            </Button>
          </FormControl>
          <EPSGSelect EPSG={EPSG2} handleSelect={handleSelectEPSG2} />
          <Stack
            direction='row'
            justifyContent={'space-between'}
            alignItems={'center'}
            display={'flex'}
          >
            <Typography variant='caption' sx={{ fontFamily: 'monospace', paddingInline: '4px' }}>
              {EPSG2 === 'EPSG:4326' ? `${t("lat")},${t("lng")}:` : `y,x:`}
            </Typography>
            <Box
              height='31px'
              width={EPSG2 === 'EPSG:4326' ? '155px' : '190px'}
              justifyContent={'center'}
              alignItems={'center'}
              display={'flex'}
              sx={{
                borderRadius: '4px',
                backgroundColor: 'rgba(0,0,0,0.1)'
              }}
            >
              {transformed &&
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                  {transformed}
                </Typography>
              }
            </Box>
          </Stack>
          {activeMarker &&
            <Button
              sx={{
                height: '20px',
                fontSize: '12px',
                textTransform: 'none'
              }}
              onClick={handlePass}
            >
              ↓  {t('passCoor')}  ↓
            </Button>
          }
        </Stack>
      </Paper>
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity='error' timeout={3000} > {t('alert.notValidNumber')} </AlertSlide>
    </>
  )
})