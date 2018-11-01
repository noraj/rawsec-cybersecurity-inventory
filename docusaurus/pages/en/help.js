/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
}

class Help extends React.Component {
  render() {
    const language = this.props.language || '';
    const supportLinks = [
      {
        content: `Learn more using the [documentation on this site.](${docUrl(
          'add.html',
          language,
        )})`,
        title: 'Browse Docs',
      },
      {
        content: 'You can join the community by joining the conversation on [Discord](https://discord.gg/xvTb2vx) on the text channel: `#rawsec-inventory-⚙`.',
        title: 'Discord',
      },
      {
        content: "You can follow and contact us on [Twitter](https://twitter.com/rawsec_cyber).",
        title: 'Twitter',
      },
      {
        content: "At our [GitLab repo](https://gitlab.com/rawsec/rawsec-cybersecurity-list/) Browse and submit [issues](https://gitlab.com/rawsec/rawsec-cybersecurity-list/issues) or [merge requests](https://gitlab.com/rawsec/rawsec-cybersecurity-list/merge_requests) for bugs you find or any new features you may want implemented. Be sure to also check out our [contributing information](add.html).",
        title: 'GitLab',
      },
    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h1>Need help?</h1>
            </header>
            <p>This project is maintained by people during their free time.</p>
            <GridBlock contents={supportLinks} layout="fourColumn" />
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Help;
