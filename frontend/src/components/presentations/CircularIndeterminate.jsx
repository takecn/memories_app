import React from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';

const ProgressPosition = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 100px;
`;

export const CircularIndeterminate = () => {
  return (
    <ProgressPosition>
      <CircularProgress />
    </ProgressPosition>
  )
};
