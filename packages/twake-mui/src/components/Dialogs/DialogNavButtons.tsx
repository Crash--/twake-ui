import React from 'react'

import DialogBackButton from './DialogBackButton'
import DialogCloseButton from './DialogCloseButton'
import type {
  DialogLayoutComponentsProps,
  DialogLayoutProps
} from './useDialogLayout'

export interface DialogNavButtonsProps extends Pick<
  DialogLayoutProps,
  'onClose' | 'onBack'
> {
  id: string
  fullScreen: boolean
  componentsProps?: Pick<
    DialogLayoutComponentsProps,
    'closeButton' | 'backButton'
  >
}

/**
 * Close and back buttons of a dialog. On full screen, a single back button calls `onBack`, or `onClose` without it.
 * It then takes the props of the button whose action it does, `backButton` or `closeButton`.
 */
const DialogNavButtons = ({
  id,
  fullScreen,
  onClose,
  onBack,
  componentsProps
}: DialogNavButtonsProps): React.ReactElement | null => {
  const onBackOrClose = onBack ?? onClose

  if (fullScreen) {
    return onBackOrClose ? (
      <DialogBackButton
        data-testid={`modal-backclose-button-${id}`}
        {...(onBack
          ? componentsProps?.backButton
          : componentsProps?.closeButton)}
        onClick={onBackOrClose}
      />
    ) : null
  }

  return (
    <>
      {onClose && (
        <DialogCloseButton
          data-testid={`modal-close-button-${id}`}
          {...componentsProps?.closeButton}
          onClick={onClose}
        />
      )}
      {onBack && (
        <DialogBackButton
          data-testid={`modal-back-button-${id}`}
          {...componentsProps?.backButton}
          onClick={onBack}
        />
      )}
    </>
  )
}

export default DialogNavButtons
