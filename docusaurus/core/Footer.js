/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return `${baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="50"
                height="40"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('en/usage.html', this.props.language)}>
              User Guide
            </a>
            <a href={this.docUrl('en/add.html', this.props.language)}>
              Contribution Guidelines
            </a>
            <a href={this.docUrl('en/install.html', this.props.language)}>
              Development Guidelines
            </a>
            <a href={this.docUrl('en/api.html', this.props.language)}>
              API Reference
            </a>
            <a href={this.docUrl('en/faq.html', this.props.language)}>
              F.A.Q.
            </a>
          </div>
          <div>
            <h5>Community and Social</h5>
            <a
              href="https://discord.gg/xvTb2vx"
              target="_blank"
              rel="noreferrer noopener">
              Discord
            </a>
            <a
              href="https://twitter.com/rawsec_cyber"
              target="_blank"
              rel="noreferrer noopener">
              Twitter (Rawsec)
            </a>
            <a
              href="https://twitter.com/RawsecBot"
              target="_blank"
              rel="noreferrer noopener">
              Twitter (Rawsec bot)
            </a>
            <a
              href="https://twitter.com/noraj_rawsec"
              target="_blank"
              rel="noreferrer noopener">
              Twitter (noraj: Rawsec's captain)
            </a>
          </div>
          <div>
            <h5>Source</h5>
            <a href="https://gitlab.com/rawsec/rawsec-cybersecurity-list">Source</a>
            <a href="https://github.com/noraj/rawsec-cybersecurity-inventory">Source mirror</a>
          </div>
        </section>

        <a
          href="https://inventory.raw.pm/"
          target="_blank"
          rel="noreferrer noopener"
          className="fbOpenSource">
          Rawsec's CyberSecurity Inventory
        </a>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
