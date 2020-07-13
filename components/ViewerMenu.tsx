import React from 'react';
import UserMenu, { PartialUser } from './UserMenu';
import { useClient, useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export const query = `
  query ViewerMenuQuery {
    viewer {
      avatarUrl
      login
      name
    }
  }
`;

export interface Query {
  viewer: PartialUser;
}

const ViewerMenu = () => {
  const { data } = useClient<Query>(query);
  const { logout } = useAuth();
  const router = useRouter();

  function viewProfile() {
    router.push('/');
  }

  return (
    <UserMenu
      user={data && data.viewer}
      signout={logout}
      viewProfile={viewProfile}
    />
  );
};

export default ViewerMenu;
