import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuGroup,
  MenuList,
  MenuItem,
  Skeleton,
} from '@chakra-ui/core';
import { ChevronDownIcon } from '@chakra-ui/icons';
import React from 'react';
import { User } from '../graphql/types';

export type PartialUser = Pick<User, 'avatarUrl' | 'login' | 'name'>;

interface Props {
  user?: PartialUser;
  signout?: ((event: React.KeyboardEvent<HTMLElement>) => void) &
    ((event: React.MouseEvent<any, MouseEvent>) => void);
  viewProfile?: ((event: React.KeyboardEvent<HTMLElement>) => void) &
    ((event: React.MouseEvent<any, MouseEvent>) => void);
}

const defaultUser: any = {
  name: 'Skeleton',
  login: 'skeleton',
  avatarUrl: '',
};

const UserMenu: React.FC<Props> = ({ user, signout, viewProfile }) => {
  const u = user ? user : defaultUser;

  const { avatarUrl, name, login } = u;

  return (
    <Skeleton isLoaded={!!user}>
      <Menu>
        <MenuButton
          as={Button}
          pr={2}
          variant="ghost"
          display="flex"
          alignItems="center"
        >
          <Avatar size="xs" name={name} src={avatarUrl} />
          <ChevronDownIcon />
        </MenuButton>
        <MenuList>
          <MenuGroup title={`You are signed in as ${login}`}>
            <MenuItem onClick={signout}>Sign out</MenuItem>
            <MenuItem onClick={viewProfile}>View profile</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </Skeleton>
  );
};

export default UserMenu;
