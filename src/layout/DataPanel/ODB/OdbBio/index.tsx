import { useState } from "react";
import {
  Divider, Box, Tab, Tabs, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
  Stack, Typography
} from "@mui/material"
import { useTranslation } from "react-i18next";
import { SamplingEvents } from "./SamplingEvents";
import { BioComposition } from "./BioComposition";
import { BioDataset, BioFilter } from "types";
import { SwitchSameColor } from "components/SwitchSameColor";
import { CustomTabPanel } from "components/CustomTabPanel";

const ModeSwitch = SwitchSameColor()

export const OdbBio = () => {
  const { t } = useTranslation()
  const [tabNum, setTabNum] = useState(0)
  const [dataset, setDataset] = useState<BioDataset>("all")
  const [filter, setFilter] = useState<BioFilter>('topic')

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNum(newValue);
  }

  const handleDatasetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDataset((event.target as HTMLInputElement).value as BioDataset);
  };
  const handleModeSwitch = () => {
    setFilter(filter === 'topic' ? 'taxon' : 'topic')
  }
  return (
    <>
      <Divider variant="middle" />
      <Box sx={{ margin: 2 }}>
        <Tabs value={tabNum} onChange={handleTabChange} sx={{ marginBottom: 1 }} centered>
          <Tab label={t('OdbData.Bio.samplingPt')} />
          <Tab label={t('OdbData.Bio.composition')} />
        </Tabs>
        <Stack spacing={1} alignItems="left">
          <FormControl>
            <FormLabel>{t('OdbData.dataset')}</FormLabel>
            <RadioGroup
              row
              defaultValue={dataset}
              value={dataset}
              onChange={handleDatasetChange}
            >
              <FormControlLabel value="all" control={<Radio size="small" />} label={t('OdbData.all')} />
              <FormControlLabel value="odb" control={<Radio size="small" />} label="ODB" />
              <FormControlLabel value="oca" control={<Radio size="small" />} label={t('OdbData.OCA')} />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>{t('OdbData.filter')}</FormLabel>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle2" gutterBottom>{t('OdbData.Bio.by')}{t('OdbData.Bio.topic')}</Typography>
              <ModeSwitch onChange={handleModeSwitch} />
              <Typography variant="subtitle2" gutterBottom>{t('OdbData.Bio.by')}{t('OdbData.Bio.taxon')}</Typography>
            </Stack>
          </FormControl>
        </Stack>
        <CustomTabPanel value={tabNum} index={0}>
          <SamplingEvents dataset={dataset} filter={filter} />
        </CustomTabPanel>
        <CustomTabPanel value={tabNum} index={1}>
          <BioComposition dataset={dataset} filter={filter} />
        </CustomTabPanel>
      </Box>
      <Divider variant="middle" />
    </>
  )
}