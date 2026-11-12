import { Alert as MuiAlert, AlertProps as MuiAlertProps } from '@mui/material'
import cx from 'classnames'
import React from 'react'

export interface AlertProps extends MuiAlertProps {
  /**
   * `bottom`: the action on a row of its own under the message, aligned with
   * the icon, for a narrow screen where it would be squeezed beside it
   */
  actionPlacement?: 'end' | 'bottom'
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, actionPlacement = 'end', ...props }, ref) => (
    <MuiAlert
      ref={ref}
      className={cx(className, {
        'Alert-actionBottom': actionPlacement === 'bottom'
      })}
      {...props}
    />
  )
)

Alert.displayName = 'Alert'

export default Alert
