import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5050'
    }
  }
});

const MyPage = () => {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <div className="hero text--center">
        <div className="container">
          <div className="padding-vert--md">
            <h1 className="hero__title">{siteConfig.title}</h1>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
          </div>
          <div>
            <ThemeProvider theme={theme}>
            <Stack spacing={2} direction="row" justifyContent="center" alignItems="center">
              <Button variant="outlined">Usage</Button>
              <Button variant="contained">Contribution</Button>
              <Button variant="outlined">Development</Button>
              <Button variant="outlined">API</Button>
            </Stack>
            </ThemeProvider>
          </div>
          <div>
          <Box mt={3} p={2} width='100%' component="p">
            This is the documentation for Rawsec's CyberSecurity Inventory. You will find a User Guide, Contribution Guidelines, Development Guidelines, an API Reference, a F.A.Q. section and more importantly, we wish, some answers to your questions.
          </Box>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyPage;
