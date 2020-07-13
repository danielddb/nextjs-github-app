import {
  Box,
  Flex,
  Grid,
  useColorMode,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/core';
import { MoonIcon, SunIcon, SearchIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import LogoIcon from '../icons/LogoIcon';
import SiteSearch from './SiteSearch';
import ViewerMenu from './ViewerMenu';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [showSearch, setShowSearch] = useState(false);
  const searchColor = useColorModeValue('gray.500', 'gray.500');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  return (
    <Grid
      as="header"
      templateColumns={['1fr 1fr', null, 'auto 1fr auto']}
      gridGap={2}
      alignItems="center"
      borderBottomWidth="1px"
      px={4}
      py={4}
    >
      <Box>
        <Link href="/" passHref>
          <IconButton
            as="a"
            aria-label={`NextJS Github App`}
            variant="ghost"
            fontSize="2rem"
            icon={<LogoIcon />}
          />
        </Link>
      </Box>
      <Box
        gridArea={['2/1/2/-1', null, 'auto']}
        display={[!showSearch && 'none', null, 'block']}
      >
        <SiteSearch id="header-search" ref={searchRef} />
      </Box>
      <Box>
        <Flex justifyContent="flex-end">
          <ViewerMenu />
          <IconButton
            aria-label={`Switch to ${
              colorMode === 'light' ? 'dark' : 'light'
            } mode`}
            variant="ghost"
            onClick={toggleColorMode}
            {...{ icon: colorMode === 'light' ? <MoonIcon /> : <SunIcon /> }}
          />
          <IconButton
            display={[null, null, 'none']}
            aria-label={`Search toggle`}
            variant="ghost"
            color={showSearch ? searchColor : null}
            onClick={() => setShowSearch((s) => !s)}
            {...{ icon: <SearchIcon /> }}
          />
        </Flex>
      </Box>
    </Grid>
  );
};

export default Header;
