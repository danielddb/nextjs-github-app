import React from 'react';
import { Repository, StargazerConnection, Language } from '../graphql/types';
import {
  Skeleton,
  Box,
  Link,
  Text,
  useColorMode,
  useTheme,
  Badge,
} from '@chakra-ui/core';

export const repositoryCardFragment = `
  fragment repositoryCard on Repository {
    description
    isFork
    nameWithOwner
    resourcePath
    parent {
      nameWithOwner
      resourcePath
    }
    primaryLanguage {
      name
    }
    stargazers {
      totalCount
    }
    watchers {
      totalCount
    }
  }
`;

export type PartialRepository = Pick<
  Repository,
  | 'description'
  | 'isFork'
  | 'nameWithOwner'
  | 'primaryLanguage'
  | 'resourcePath'
> & {
  parent: Pick<Repository, 'nameWithOwner' | 'resourcePath'> | null;
  primaryLanguage: Pick<Language, 'name'>;
  stargazers: Pick<StargazerConnection, 'totalCount'> | null;
};

interface Props {
  repository?: PartialRepository;
}

const defaultRepository: PartialRepository = {
  nameWithOwner: 'skeleton/skeleton',
  resourcePath: '/skeleton/skeleton',
  isFork: true,
  primaryLanguage: null,
  parent: {
    nameWithOwner: 'skeleton/skeleton',
    resourcePath: '/skeleton/skeleton',
  },
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  stargazers: {
    totalCount: 0,
  },
};

const RepositoryCard: React.FC<Props> = ({ repository, ...props }) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const r = repository ? repository : defaultRepository;

  return (
    <Skeleton isLoaded={!!repository} mb={4}>
      <Box
        borderWidth="1px"
        borderRadius={8}
        p={4}
        backgroundColor={
          colorMode === 'light' ? theme.colors.gray[50] : theme.colors.gray[900]
        }
        {...props}
      >
        <Box mb={2}>
          <Text fontSize="xl" fontWeight="bold" lineHeight="short">
            <Link href={`https://github.com${r.resourcePath}`} isExternal>
              {r.nameWithOwner}
            </Link>
          </Text>
          {r.isFork ? (
            <Text fontSize="sm" color={theme.colors.gray[500]}>
              Forked from {r.parent.nameWithOwner}
            </Text>
          ) : null}
        </Box>
        <Text mb={2}>{r.description}</Text>
        {r.primaryLanguage ? (
          <Badge colorScheme="purple">{r.primaryLanguage.name}</Badge>
        ) : null}
      </Box>
    </Skeleton>
  );
};

export default RepositoryCard;
