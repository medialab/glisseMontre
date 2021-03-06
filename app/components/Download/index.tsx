/**
 *
 * Download
 *
 */

import * as React from 'react';
import { Button } from 'quinoa-design-library';
import { FormattedMessage } from 'react-intl';

import { useExport } from 'containers/App/hooks';
import messages from './messages';

interface OwnProps {
  disabled?: boolean;
}

const Download: React.SFC<OwnProps> = (props: OwnProps) => {
  const [loading, exportCallback] = useExport();
  return (
    <Button
      isFullWidth
      onClick={exportCallback}
      disabled={loading}
      data-for="tooltip"
      data-tip="Download this image project"
      isLoading={loading}
      isColor="info"
      {...props}
    ><FormattedMessage {...messages.content} /></Button>
  );
};

export default Download;
