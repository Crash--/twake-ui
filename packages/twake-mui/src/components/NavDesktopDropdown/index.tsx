import React, { Children, isValidElement, useState } from 'react'

import { useBreakpoints } from '../../hooks/useBreakpoints'
import DropdownText from '../DropdownText'
import ListItem from '../ListItem'

export interface NavDesktopDropdownProps {
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
  limit?: number
}

export const NavDesktopDropdown = ({
  label,
  children,
  defaultOpen = true,
  limit = 5
}: NavDesktopDropdownProps): React.ReactElement | null => {
  const { isDesktop } = useBreakpoints()
  const [open, setOpen] = useState(defaultOpen)
  const isActivated =
    Children.toArray(children).filter(isValidElement).length > limit

  const onToggle = (): void => setOpen(current => !current)

  if (!isDesktop) return null

  return (
    <>
      <ListItem
        size="small"
        sx={{ cursor: isActivated ? 'pointer' : undefined }}
      >
        <DropdownText
          variant="caption"
          color="textSecondary"
          spaceBetween
          onClick={isActivated ? onToggle : undefined}
          innerIconProps={{
            rotate: open ? 0 : -90,
            display: isActivated ? undefined : 'none'
          }}
        >
          {label}
        </DropdownText>
      </ListItem>
      {open && children}
    </>
  )
}
