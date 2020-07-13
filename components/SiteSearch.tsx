import {
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  List,
  ListItem,
  useTheme,
  useColorMode,
} from '@chakra-ui/core';
import { SearchIcon } from '@chakra-ui/icons';
import { useCombobox } from 'downshift';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react';
import useDebounce from '../hooks/useDebounce';
import useKeyPress from '../hooks/useKeyPress';
import { useClient } from '../context/AuthContext';

const query = `
query SearchUsers($queryString: String!) {
  search(query: $queryString, type: USER, first: 5) {
    repositoryCount
    edges {
      node {
        ... on User {
          login
          name
          avatarUrl
        }
      }
    }
  }
}
`;

interface Props {
  id: string; // needed for ssr
}

const SiteSearch = React.forwardRef<HTMLInputElement, Props>(({ id }, ref) => {
  const router = useRouter();
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const slashPress = useKeyPress('/');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [inputItems, setInputItems] = useState([]);
  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    inputValue,
  } = useCombobox({
    id,
    items: inputItems,
    onSelectedItemChange: ({ inputValue }) =>
      router.push({
        pathname: '/',
        query: { login: inputValue },
      }),
  });
  const debouncedSearchTerm = useDebounce(inputValue, 500);
  const { data } = useClient(
    debouncedSearchTerm.length ? query : null,
    {
      queryString: debouncedSearchTerm,
    },
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (slashPress) {
      searchInputRef.current.focus();
    }
  }, [slashPress]);

  useEffect(() => {
    setInputItems(
      data
        ? data.search.edges
            .filter((edge) => edge.node.login)
            .map((edge) => edge.node.login)
        : []
    );
  }, [data]);

  return (
    <Box position="relative">
      <label
        htmlFor="siteSearch"
        style={{ display: 'none' }}
        {...getLabelProps()}
      >
        Choose an element:
      </label>
      <div {...getComboboxProps()}>
        <InputGroup width="100%">
          <InputLeftElement>
            <SearchIcon color="gray.500" />
          </InputLeftElement>
          <Input
            {...getInputProps({
              id: 'siteSearch',
              ref: (value) => {
                searchInputRef.current = value;

                if (typeof ref === 'function') {
                  ref(value);
                } else {
                  ref.current = value;
                }
              },
              onFocus: () => setInputItems([]),
              placeholder: `Search for GitHub Users (Press "/" to focus)`,
            })}
          />
        </InputGroup>
      </div>
      <List
        position="absolute"
        top="100%"
        left={0}
        right={0}
        boxShadow="lg"
        zIndex={1}
        {...getMenuProps()}
      >
        {isOpen &&
          inputItems.map((item, index) => (
            <div key={item} {...getItemProps({ item, index })}>
              <ListItem
                bg={
                  highlightedIndex === index
                    ? colorMode === 'light'
                      ? theme.colors.gray[50]
                      : theme.colors.black
                    : colorMode === 'light'
                    ? theme.colors.white
                    : theme.colors.gray[900]
                }
                mb={0}
                p={2}
                borderBottomWidth="1px"
                color={
                  colorMode === 'light'
                    ? theme.colors.black
                    : theme.colors.white
                }
              >
                {item}
              </ListItem>
            </div>
          ))}
      </List>
    </Box>
  );
});

export default SiteSearch;
