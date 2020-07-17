/* global _ */
import React, { useState, useEffect } from 'react';
import nconf from '@qwant/nconf-getter';
import Alert from 'src/components/ui/Alert';

const masqAlertEnabled = nconf.get().masq.alertEnabled;
const masqLink = nconf.get().masq.link;

const MasqAlert = () => {
  if (!masqAlertEnabled) {
    return null;
  }

  let masqDismissed = false;
  try {
    masqDismissed = window.localStorage.getItem('masq_alert_dismissed');
  } catch (e) {
    console.error(e);
  }

  const [masqAlertDate, setMasqAlertDate] = useState('');
  const [isVisible, setIsVisible] = useState(masqAlertEnabled && masqDismissed !== 'true');
  if (!isVisible) {
    return null;
  }

  useEffect(() => {
    setMasqAlertDate(Intl
      .DateTimeFormat(window.getLang().locale.replace('_', '-'))
      .format(new Date(nconf.get().masq.alertDate))
    );
  });

  const dismiss = () => {
    setIsVisible(false);
    try {
      window.localStorage.setItem('masq_alert_dismissed', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  return <Alert
    title={_('Masq will be disabled', 'masq')}
    description={
      <span>{_(
        'Masq by Qwant will be disabled starting from {masqAlertDate}.',
        'masq',
        { masqAlertDate }
      )}
      <a href={ masqLink } rel="noopener noreferrer">
        {` ${_('Learn more', 'masq')}`}
      </a>
      </span>
    }
    type="info"
    onClose={dismiss}
    closeButtonLabel="close"
  />;
};

export default MasqAlert;
