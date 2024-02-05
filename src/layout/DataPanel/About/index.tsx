import { Avatar, Box, Card, CardContent, CardHeader, Divider, Link, Modal, Tab, Tabs, Typography } from "@mui/material"
import { CustomTabPanel } from "components/CustomTabPanel"
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react"
import ODBlogo from 'assets/images/logo192.png'
import { Trans, useTranslation } from "react-i18next"

interface AboutType {
  open: { [key: string]: boolean }
  setOpen: Dispatch<SetStateAction<{ about: boolean, contact: boolean, news: boolean }>>
}
const links: { [key: string]: string } = {
  old: 'https://odbgo.oc.ntu.edu.tw/odbargo/',
  nor1: 'https://newor1.oc.ntu.edu.tw/',
  nor1inst: 'https://ntuio.oc.ntu.edu.tw/',
  nor2: 'https://nor2.ntou.edu.tw/',
  nor2inst: 'http://www.nor2pic.ntou.edu.tw/bin/home.php',
  nor3: 'https://or3.nsysu.edu.tw/',
  nor3inst: 'https://or3mic.nsysu.edu.tw/',
  odb: 'https://www.odb.ntu.edu.tw/',
  odbservice: 'https://www.odb.ntu.edu.tw/odb-services/',
  odbreg: 'https://www.odb.ntu.edu.tw/regulation/',
  odbnews: 'https://www.odb.ntu.edu.tw/epaper/',
  iontu: 'http://www.oc.ntu.edu.tw/',
  cplan: 'https://odbwms.oc.ntu.edu.tw/odbintl/rasters/cplan/',
  chemview: 'https://chemview.odb.ntu.edu.tw/',
  bioquery: 'https://bio.odb.ntu.edu.tw/query/',
  mhw: 'https://eco.odb.ntu.edu.tw/pub/MHW/',
  pco2: 'https://www.odb.ntu.edu.tw/pco2/',
  gwr: 'https://www.odb.ntu.edu.tw/gwrdata/',
  seats: 'https://www.odb.ntu.edu.tw/seats/',
  copkey: 'https://bio.odb.ntu.edu.tw/',
  rose: 'https://app05.odb.ntu.edu.tw/physv/sadcp/rose/odbphy_current_rose.htm',
  ctd: 'https://www.odb.ntu.edu.tw/ctd/',
  adcp: 'https://www.odb.ntu.edu.tw/adcp/',
  report: 'http://app01.odb.ntu.edu.tw/CSRQry/CSRQry/'
}
const genLinks = (linkKey: string, children: string | JSX.Element) => <Link href={links[linkKey]} target="_blank" rel="noopener noreferrer">{children}</Link>

export const About = (props: AboutType) => {
  const { open, setOpen } = props
  const { t } = useTranslation()
  const [tabValue, setTabValue] = useState(0)
  const [news, setNews] = useState('')

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => setTabValue(newValue)

  useEffect(() => {
    open.news &&
      fetch('https://service.oc.ntu.edu.tw/data/getnews/')
        .then(res => res.json())
        .then(json => {
          const text = json
          const formattedString = text.split('\r\n').map((str: string, index: number) => (
            <Typography key={index} sx={{ width: 368, whiteSpace: 'pre-wrap' }} variant="body1">
              {str}
              {index !== text.length - 1 && <br />}
            </Typography>
          ));
          setNews(formattedString)
        })
  }, [open.news])

  return (
    <>
      <Modal
        open={open['about']}
        onClose={() => setOpen({ about: false, contact: false, news: false })}
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 1,
            p: 4,
          }}
        >
          <Card sx={{ width: 610, height: 500 }}>
            <CardHeader
              avatar={
                <Avatar alt="ODB" src={ODBlogo} />
              }
              title='Hidy Viewer 2'
              subheader={t('siteSubtitle')}
              sx={{ paddingBottom: 0 }}
            />
            <CardContent>
              <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label={t('about.site.title')} />
                <Tab label={t('about.acc.title')} />
                <Tab label={t('about.link.title')} />
              </Tabs>
              <CustomTabPanel value={tabValue} index={0}>
                <Typography variant="body2" component={'div'} sx={{ padding: 2, textIndent: '2rem', height: 325, overflowY: 'auto' }}>
                  <p>
                    <Trans i18nKey={'about.site.p1'}>
                      {genLinks('odb', '')}
                    </Trans>
                  </p>
                  <p>
                    <Trans i18nKey={'about.site.p2'}>
                      {genLinks('iontu', '')}{genLinks('nor1', '')}{genLinks('nor2', '')}{genLinks('nor3', '')}<br />
                    </Trans>
                  </p>
                  <p>
                    <Trans i18nKey={'about.site.p3'}>
                      {genLinks('odbreg', '')}{genLinks('odbservice', '')}<br />
                    </Trans>
                  </p>
                  <p>
                    {t('about.site.p4')}
                  </p>
                  <p>
                    {t('about.site.p5')}<Link href={`mailto:r04228026@ntu.edu.tw`}>r04228026@ntu.edu.tw</Link>
                  </p>
                </Typography>
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={1}>
                <Typography variant="body2" component={'div'} sx={{ padding: 2, textIndent: '2rem', height: 325, overflowY: 'auto' }} >
                  <p>
                    {t('about.acc.p1')}
                  </p>
                  <p>
                    <Trans i18nKey={'about.acc.p2'}>
                      <Link href={`mailto:r04228026@ntu.edu.tw`}>c</Link>
                    </Trans>
                  </p>
                  <p>
                    {t('about.acc.p3')}
                  </p>
                  <p>
                    {t('about.acc.p4')}
                  </p>
                </Typography>
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={2} >
                <Typography variant="body2" component={'div'} sx={{ padding: 2, height: 320, overflowY: 'scroll', lineHeight: 2 }}>
                  <Typography variant="subtitle1">{t('about.link.aboutOdb')}</Typography>
                  <Divider />
                  {genLinks('odb', t('about.link.odb'))}: {t('about.link.odb2')}<br />
                  {genLinks('odbnews', t('about.link.odbnews'))}: {t('about.link.odbnews2')}<br />
                  {genLinks('old', 'Hidy Viewer')}: {t('about.link.old2')}<br />
                  {genLinks('report', t('about.link.report'))}: {t('about.link.report2')}<br />
                  {genLinks('cplan', 'C-planner')}: {t('about.link.cplan2')}<br />
                  {genLinks('chemview', 'Chemistry Viewer')}: {t('about.link.chemview2')}<br />
                  {genLinks('mhw', 'Marine Heatwaves')}: {t('about.link.mhw2')}<br />
                  {genLinks('bioquery', 'BioQuery and Open API')}: {t('about.link.bioquery2')}<br />
                  {genLinks('copkey', 'Copkey')}: {t('about.link.copkey2')}<br />
                  {genLinks('seats', 'SEATS')}: {t('about.link.seats2')}<br />
                  {genLinks('pco2', t('about.link.pco2'))}: {t('about.link.pco22')}<br />
                  {genLinks('rose', t('about.link.rose'))}: {t('about.link.rose2')}<br />
                  {genLinks('ctd', t('about.link.ctd'))}: {t('about.link.ctd2')}<br />
                  {genLinks('adcp', t('about.link.adcp'))}: {t('about.link.adcp2')}<br />
                  {genLinks('gwr', t('about.link.gwr'))}: {t('about.link.gwr2')}<br />
                  <Typography variant="subtitle1" sx={{ marginTop: 2 }}>{t('about.link.aboutShip')}</Typography>
                  <Divider />
                  {genLinks('nor1', t('about.link.nor1'))}<br />
                  {genLinks('nor1inst', t('about.link.nor1inst'))}<br />
                  {genLinks('nor2', t('about.link.nor2'))}<br />
                  {genLinks('nor2inst', t('about.link.nor2inst'))}<br />
                  {genLinks('nor3', t('about.link.nor3'))}<br />
                  {genLinks('nor3inst', t('about.link.nor3inst'))}<br />
                </Typography>
              </CustomTabPanel>
            </CardContent>
          </Card>
        </Box>
      </Modal >
      <Modal
        open={open['contact']}
        onClose={() => setOpen({ about: false, contact: false, news: false })}
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            borderRadius: 1,
            p: 4,
          }}
        >
          <Card>
            <CardHeader title={t('contact.title')} sx={{ pb: 0 }} />
            <CardContent>
              <Typography variant='body1'>
                {t('contact.content')}<br />
                <Link href={`mailto:r04228026@ntu.edu.tw`}>r04228026@ntu.edu.tw</Link>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Modal>
      <Modal
        open={open['news']}
        onClose={() => setOpen({ about: false, contact: false, news: false })}
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            borderRadius: 1,
            p: 4,
          }}
        >
          <Card>
            <CardHeader title={t('news.title')} sx={{ pb: 0 }} />
            <CardContent>
              {news}
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </>
  )
}