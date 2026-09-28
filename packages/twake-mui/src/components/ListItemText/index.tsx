import {
  ListItemText as MuiListItemText,
  ListItemTextProps as MuiListItemTextProps
} from '@mui/material'
import React, { forwardRef } from 'react'

export interface ListItemTextProps extends Omit<MuiListItemTextProps, 'ref'> {
  ellipsis?: boolean
}

const ListItemText = forwardRef<HTMLDivElement, ListItemTextProps>(
  ({ ellipsis = true, slotProps, ...props }, ref) => {
    const primarySlot = slotProps?.primary

    return (
      <MuiListItemText
        ref={ref}
        {...props}
        // A primary or secondary slot replaces these defaults, ellipsis included
        slotProps={{
          ...slotProps,
          primary:
            typeof primarySlot === 'function'
              ? primarySlot
              : {
                  // Keeps a caption primary out of the theme's grey caption rule
                  color: 'inherit',
                  ...(primarySlot ?? { noWrap: ellipsis })
                },
          secondary: slotProps?.secondary ?? {
            variant: 'caption',
            noWrap: ellipsis
          }
        }}
      />
    )
  }
)

ListItemText.displayName = 'ListItemText'

export default ListItemText
