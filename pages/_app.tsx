import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import { AppBar, Button, Divider, Drawer, IconButton, List, ListItem, ListItemText, Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [state, setState] = React.useState({
    open: false,
  });

  const toggleDrawer = (isOpen: boolean) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ open: isOpen });
  };

  const list = (
    <Box
      sx={{ width: 250 }}
    >
      <List>
        {[{ text: 'Create Note', page: "/" }, { text: 'List Note Files', page: "/notes" }].map(({ text, page }, index) => (
          <ListItem button key={text}>
            <Link href={`${page}`} passHref>
              <ListItemText primary={text} />
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {[{ text: 'About', page: "/about" }].map(({ text, page }, index) => (
          <ListItem button key={text}>
            <Link href={`${page}`} passHref>
              <ListItemText primary={text} />
            </Link>
          </ListItem>
        ))}
      </List>
    </Box >
  );

  const appBar = (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Button color="inherit">
            Placeholder Tab 1
          </Button>
          <Button color="inherit">Placeholder Tab 2</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <div>
          {appBar}
          <React.Fragment>
            <Drawer
              open={state.open}
              onClose={toggleDrawer(false)}
            >
              {list}
            </Drawer>
          </React.Fragment>
        </div>
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
