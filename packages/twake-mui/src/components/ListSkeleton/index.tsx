import { List } from '@mui/material'
import React from 'react'

import ListItemSkeleton from '../ListItemSkeleton'
import ListSubheader from '../ListSubheader'

export interface ListSkeletonProps {
  count?: number
  hasSecondary?: boolean
  withSubheader?: boolean
  divider?: boolean
}

const ListSkeleton = ({
  count = 1,
  hasSecondary,
  withSubheader,
  divider
}: ListSkeletonProps): React.ReactElement => (
  <List
    subheader={
      withSubheader ? <ListSubheader>&nbsp;</ListSubheader> : undefined
    }
  >
    {Array.from({ length: count }, (_, idx) => (
      <ListItemSkeleton
        key={idx}
        hasSecondary={hasSecondary}
        divider={divider}
      />
    ))}
  </List>
)

export default ListSkeleton
