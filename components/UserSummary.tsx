import React from 'react';
import { User } from '../graphql/types';
import {
  Avatar,
  Box,
  Grid,
  Heading,
  Text,
  useTheme,
  Flex,
  Link,
  Skeleton,
} from '@chakra-ui/core';

export const userSummaryFragment = `
  fragment userSummary on User {
    avatarUrl
    bio
    company
    isViewer
    location
    login
    name
    followers {
      totalCount
    }
    following {
      totalCount
    }
    starredRepositories {
      totalCount
    }
    organizations(first: 10) {
      totalCount
      nodes {
        name
        avatarUrl
        resourcePath
      }
    }
  }
`;

export type PartialUser = Pick<
  User,
  | 'avatarUrl'
  | 'bio'
  | 'company'
  | 'isViewer'
  | 'location'
  | 'login'
  | 'name'
  | 'followers'
  | 'following'
  | 'starredRepositories'
  | 'company'
  | 'organizations'
>;

interface Props {
  user?: PartialUser;
}

function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1) as any) + 'k'
    : Math.sign(num) * Math.abs(num);
}

const defaultUser: any = {
  name: 'Skeleton',
  login: 'skeleton',
  avatarUrl: '',
  location: null,
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  followers: {
    totalCount: 1,
  },
  following: {
    totalCount: 1,
  },
  starredRepositories: {
    totalCount: 1,
  },
  company: '@skeleton',
  organizations: {
    totalCount: 1,
    nodes: [
      {
        name: 'Skeleton',
        avatarUrl: 'https://avatars3.githubusercontent.com/u/69631?v=4',
        resourcePath: '/skeleton',
      },
    ],
  },
};

const UserSummary: React.FC<Props> = ({ user }) => {
  const theme = useTheme();
  const { gray } = theme.colors;

  const u = user ? user : defaultUser;

  return (
    <Skeleton isLoaded={!!user}>
      <Grid
        gridTemplateColumns={[
          null,
          null,
          '[main-start avatar-start] auto [avatar-end details-start] 1fr [details-end main-end]',
        ]}
        gridGap={[null, null, 6]}
        justifyContent={['center', null, 'normal']}
        textAlign={['center', null, 'initial']}
      >
        <Box gridColumn={[null, null, 'avatar']}>
          <Avatar name={u.name} src={u.avatarUrl} size="2xl" />
        </Box>
        <Box gridColumn={[null, null, 'details']}>
          <Heading>{u.login}</Heading>
          <Text fontSize="sm" color={gray[500]} mb={2}>
            {u.name}
          </Text>
          <Flex mt={-2} mb={2} justifyContent={['center', null, 'normal']}>
            <Box mt={2}>
              <Link
                href={`https://github.com/${u.login}?tab=followers`}
                isExternal
              >
                <Text as="span" fontWeight="bold" fontSize="sm" mr={2}>
                  {kFormatter(u.followers.totalCount)}
                </Text>
                <Text as="span" mr={4} color={gray[500]} fontSize="sm">
                  Followers
                </Text>
              </Link>
            </Box>
            <Box mt={2}>
              <Link
                href={`https://github.com/${u.login}?tab=following`}
                isExternal
              >
                <Text as="span" fontWeight="bold" fontSize="sm" mr={2}>
                  {kFormatter(u.following.totalCount)}
                </Text>
                <Text as="span" mr={4} color={gray[500]} fontSize="sm">
                  Following
                </Text>
              </Link>
            </Box>
            <Box mt={2}>
              <Link href={`https://github.com/${u.login}?tab=stars`} isExternal>
                <Text as="span" fontWeight="bold" fontSize="sm" mr={2}>
                  {kFormatter(u.starredRepositories.totalCount)}
                </Text>
                <Text as="span" color={gray[500]} fontSize="sm">
                  Stars
                </Text>
              </Link>
            </Box>
          </Flex>
          <Text mb={2}>{u.bio}</Text>
          {!!u.organizations.totalCount && (
            <Flex mt={-2} mb={2} justifyContent={['center', null, 'normal']}>
              {u.organizations.nodes.map((node) => (
                <Box mt={2} mr={2} key={node.resourcePath}>
                  <a
                    href={`https://github.com${node.resourcePath}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Avatar
                      name={node.avatarUrl}
                      src={node.avatarUrl}
                      size="sm"
                    />
                  </a>
                </Box>
              ))}
            </Flex>
          )}
        </Box>
      </Grid>
    </Skeleton>
  );
};

export default UserSummary;
