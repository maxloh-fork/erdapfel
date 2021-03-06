/* global _ */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const facebookShareUrl = location => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location)}`;
};

const twitterShareUrl = location => {
  return `https://twitter.com/intent/tweet?url=${ encodeURIComponent(location) }`;
};

const menu_height = 3 * 32;

export default class ShareMenu extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    scrollableParent: PropTypes.string,
    children: PropTypes.func.isRequired,
  }

  state = {
    open: false,
    copied: false,
    top: 0,
    left: 0,
  }

  componentWillUnmount() {
    this.close();
  }

  open = e => {
    if (navigator.share) {
      // Native share modal (on mobile and Safari Mac)
      navigator.share({
        title: document.title,
        url: this.props.url,
      });
      return;
    }
    const targetBoundingRect = e.target.getBoundingClientRect();
    const top = targetBoundingRect.top;
    const left = targetBoundingRect.left;
    e.stopPropagation();
    this.setState({
      open: true,
      copied: false,
      top: top + 30 + menu_height < innerHeight ? top + 20 : top - 15 - menu_height,
      left,
    });
    document.addEventListener('click', this.close);
    (document.querySelector(this.props.scrollableParent) || document.body)
      .addEventListener('scroll', this.close);
  }

  close = () => {
    document.removeEventListener('click', this.close);
    (document.querySelector(this.props.scrollableParent) || document.body)
      .removeEventListener('scroll', this.close);
    if (this.state.open) {
      this.setState({ open: false });
    }
  }

  openPopup = href => {
    const style = 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600';
    window.open(href, '', style);
  }

  copy(url) {
    const el = document.createElement('textarea');
    el.value = url;
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.setState({ copied: true });
  }

  render() {
    const { url, children } = this.props;

    return <Fragment>
      {children(this.open)}
      {this.state.open && <div className="shareMenu-menu"
        style={{ left: this.state.left + 'px', top: this.state.top + 'px' }}>

        <div className="shareMenu-menuItem shareMenu-menuItem--copy" onClick={e => {
          e.nativeEvent.stopImmediatePropagation();
          this.copy(url);
        }}>
          <i className="icon-copy" />
          {
            this.state.copied
              ? <span className="shareMenu-menuItem--copied">
                { _('Copied!') }
              </span>
              : _('Copy link', 'share')
          }
        </div>

        <div className="shareMenu-menuItem shareMenu-menuItem--facebook" onClick={() => {
          this.openPopup(facebookShareUrl(url));
        }}>
          <i className="icon-facebook" />
          {_('Facebook', 'share')}
        </div>

        <div className="shareMenu-menuItem shareMenu-menuItem--twitter" onClick={() => {
          this.openPopup(twitterShareUrl(url));
        }}>
          <i className="icon-twitter" />
          {_('Twitter', 'share')}
        </div>
      </div>}
    </Fragment>;
  }
}
