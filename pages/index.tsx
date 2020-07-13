import {
  Divider,
  Heading,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/core';
import endOfDay from 'date-fns/endOfDay';
import subYears from 'date-fns/subYears';
import { useRouter } from 'next/router';
import React from 'react';
import Header from '../components/Header';
import UserSummary, {
  userSummaryFragment,
  PartialUser,
} from '../components/UserSummary';
import { useClient, useViewer } from '../context/AuthContext';
import ContentContainer from '../components/ContentContainer';
import ContributionCalendar, {
  contributionCalendarFragment,
  PartialContributionCalendar,
} from '../components/ContributionCalendar';
import RepositoryCard, {
  repositoryCardFragment,
  PartialRepository,
} from '../components/RepositoryCard';
import withAuthPage from '../components/withAuthPage';
import { RepositoryConnection } from '../graphql/types';
import { pluralizeContributions } from '../lib/formatters';

const userQuery = `
  query UserQuerySummary($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      ...userSummary
      repositories(first: 6, ownerAffiliations: OWNER, orderBy: { field: PUSHED_AT, direction: DESC }) {
        nodes {
          ...repositoryCard
        }
      }
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          ...contributionCalendar
        }
      }
    }
  }

  ${userSummaryFragment}
  ${repositoryCardFragment}
  ${contributionCalendarFragment}
`;

interface Query {
  user: PartialUser & {
    repositories: Omit<RepositoryConnection, 'nodes'> & {
      nodes: PartialRepository[];
    };
    contributionsCollection: {
      contributionCalendar: PartialContributionCalendar;
    };
  };
}

const Home = () => {
  const router = useRouter();
  const login = router.query.login as string;
  const { data: viewerData } = useViewer();
  const today = endOfDay(new Date());
  const lastYear = subYears(today, 1);

  const { data: userData, error } = useClient<Query>(
    viewerData ? userQuery : null,
    {
      login: login || (viewerData && viewerData.viewer.login),
      from: lastYear.toISOString(),
      to: today.toISOString(),
    }
  );

  return (
    <>
      <Header />
      {!error ? (
        <>
          <ContentContainer>
            <UserSummary user={userData && userData.user} />
          </ContentContainer>
          <Divider />
          <ContentContainer>
            <Heading as="h3" size="md" mb={4}>
              Popular Repositories
            </Heading>
            {userData
              ? userData.user.repositories.nodes.length
                ? userData.user.repositories.nodes.map((repository) => (
                    <RepositoryCard
                      key={repository.resourcePath}
                      repository={repository}
                    />
                  ))
                : `${userData.user.login} has no repositories.`
              : new Array(6)
                  .fill(null)
                  .map((_, i) => <RepositoryCard key={i} />)}
          </ContentContainer>
          <Divider />
          <ContentContainer>
            <Heading as="h3" size="md" mb={4}>
              {userData
                ? `${
                    userData.user.contributionsCollection.contributionCalendar
                      .totalContributions
                  } ${pluralizeContributions(
                    userData.user.contributionsCollection.contributionCalendar
                      .totalContributions
                  )}`
                : '0 contributions'}{' '}
              in the last year
            </Heading>
            <ContributionCalendar
              contributionCalendar={
                userData &&
                userData.user.contributionsCollection.contributionCalendar
              }
            />
          </ContentContainer>
        </>
      ) : (
        <ContentContainer>
          {error.response.errors.map((err, i) => (
            <Alert status="warning" key={i}>
              <AlertIcon />
              <AlertDescription>{err.message}</AlertDescription>
            </Alert>
          ))}
        </ContentContainer>
      )}
    </>
  );
};

export default withAuthPage(Home);
