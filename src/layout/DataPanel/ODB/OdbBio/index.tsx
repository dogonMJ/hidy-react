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
import { useDispatch, useSelector } from "react-redux";
import { odbBioSlice } from "store/slice/odbBioSlice";
import { RootState } from "store/store";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}
const ModeSwitch = SwitchSameColor()

export const OdbBio = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const tabNum = useSelector((state: RootState) => state.odbBio.tabNum)
  const dataset = useSelector((state: RootState) => state.odbBio.dataset)
  const filter = useSelector((state: RootState) => state.odbBio.filter)
  const handleTabChange = () => {
    dispatch(odbBioSlice.actions.switchTab())
  }
  const handleDatasetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(odbBioSlice.actions.setDataset((event.target as HTMLInputElement).value as BioDataset))
  };
  const handleModeSwitch = () => {
    // dispatch(odbBioSlice.actions.setFilter(filter === 'topic' ? 'taxon' : 'topic'))
    dispatch(odbBioSlice.actions.setFilter(filter === BioFilter.topic ? BioFilter.taxon : BioFilter.topic))
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
              <ModeSwitch onChange={handleModeSwitch} checked={filter === 'taxon'} />
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