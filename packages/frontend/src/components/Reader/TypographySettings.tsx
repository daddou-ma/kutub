import React from 'react'
import { Box, Button, ButtonGroup, createStyles, makeStyles, Slider, Theme, Typography } from "@material-ui/core";
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'block',
      padding: 32,
      background: 'white',
      borderRadius: 8,
      width: '100%'
    },
  })
);

export default function TypographySettings({ theme: { font, fontSize }, onFontSizeChange, onFontChange }) : React.ReactElement {
  const classes = useStyles()
  const { t } = useTranslation();


  return <Box className={classes.container} onClick={e => e.stopPropagation()}>
      <Box>
        <Typography>{t('Font Size')}</Typography>
        <Slider
          defaultValue={fontSize}
          getAriaValueText={() => fontSize}
          aria-labelledby="discrete-slider-custom"
          step={1}
          valueLabelDisplay="auto"
          min={12}
          max={24}
          onChange={(e, value) => onFontSizeChange(value)}
        />
      </Box>
     
      <Box>
        <Typography>{t('Font Family')}</Typography>
        <ButtonGroup disableElevation size="small">
          <Button
            variant={font === 'serif' ? 'contained': 'outlined'}
            onClick={() => onFontChange('serif')}
          >
            {t('Serif')}
          </Button>
          <Button
            variant={font === 'sans-serif' ? 'contained': 'outlined'}
            onClick={() => onFontChange('sans-serif')}
          >
            {t('Sans Serif')}
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
}