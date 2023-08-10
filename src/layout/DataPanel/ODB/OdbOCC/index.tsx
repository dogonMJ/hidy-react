import { useState } from "react";
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Tab, Tabs, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
  Stack, Typography
} from "@mui/material"
import { useTranslation } from "react-i18next";
import { SamplingEvents } from "./SamplingEvents";
import { Microplastics } from "./MicroPlastics";
import { BioComposition } from "./BioComposition";
import { BioDataset, BioFilter } from "types";
import { SwitchSameColor } from "components/SwitchSameColor";

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

export const OdbOCC = () => {
  const { t } = useTranslation()
  const [tabNum, setTabNum] = useState(0)
  const [dataset, setDataset] = useState<BioDataset>("all")
  const [filter, setFilter] = useState<BioFilter>('topic')
  const [expanded, setExpanded] = useState<string | false>(false);

  const handlePanelChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

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
      <Box sx={{ margin: 1 }}>
        <Accordion
          TransitionProps={{ unmountOnExit: true }}
          expanded={expanded === 'panel1'}
          onChange={handlePanelChange('panel1')}
        >
          <AccordionSummary>
            {t('bio.bioTitle')}
          </AccordionSummary>
          <AccordionDetails>
            <Tabs value={tabNum} onChange={handleTabChange} sx={{ marginBottom: 1 }}>
              <Tab label="Sampling Points" />
              <Tab label="Composition" />
            </Tabs>
            <Stack spacing={1} alignItems="left">
              <FormControl>
                <FormLabel>Dataset</FormLabel>
                <RadioGroup
                  row
                  defaultValue={dataset}
                  value={dataset}
                  onChange={handleDatasetChange}
                >
                  <FormControlLabel value="all" control={<Radio size="small" />} label="ALL" />
                  <FormControlLabel value="odb" control={<Radio size="small" />} label="ODB" />
                  <FormControlLabel value="oca" control={<Radio size="small" />} label="OCA" />
                </RadioGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Filter</FormLabel>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" gutterBottom>By Topic</Typography>
                  <ModeSwitch onChange={handleModeSwitch} />
                  <Typography variant="subtitle2" gutterBottom>By Taxon</Typography>
                </Stack>
              </FormControl>
            </Stack>
            <CustomTabPanel value={tabNum} index={0}>
              <SamplingEvents dataset={dataset} filter={filter} />
            </CustomTabPanel>
            <CustomTabPanel value={tabNum} index={1}>
              <BioComposition dataset={dataset} filter={filter} />
            </CustomTabPanel>
          </AccordionDetails>
        </Accordion>
        <Accordion
          TransitionProps={{ unmountOnExit: true }}
          expanded={expanded === 'panel2'}
          onChange={handlePanelChange('panel2')}
        >
          <AccordionSummary>
            Microplastic
          </AccordionSummary>
          <AccordionDetails>
            <Microplastics />
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  )
}