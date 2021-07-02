let miniSearch = new MiniSearch({
  fields: ['name', 'description', 'keywords', 'category'],
  storeFields: ['name', 'description', 'language', 'source', 'website', 'price', 'online', 'keywords', 'category', 'blackarch'],
  //idField: 'name', // https://github.com/lucaong/minisearch/issues/59#issuecomment-841691275
  extractField: (document, fieldName) => {
    if (fieldName === 'id') {
      return `${document.category}-${document.name}`
    } else {
      return document[fieldName]
    }
  },

  searchOptions: {
    boost: {name: 2, keywords: 1.2},
    prefix: true,
  }
});

fetch('https://inventory.raw.pm/api/api.json')
  .then(res => res.json())
  .then(function(data) {
    for (const [key, value] of Object.entries(data.tools)) {
      // add category
      tools = value.tools;
      for (let i=0; i<tools.length; i++) {
        tools[i]['category'] = 'tools_' + key;
        // crop strings that are too long and will overflow the tag label
        if (tools[i]['category'].length > 34) {
          tools[i]['category'] = tools[i]['category'].substring(0, 33) + '…'
        }
      }
      // index items
      miniSearch.addAll(tools);
    }
    for (const [key, value] of Object.entries(data.ctf_platforms)) {
      // add category
      ctf_platforms = value.ctf_platforms;
      for (let i=0; i<ctf_platforms.length; i++) {
        ctf_platforms[i]['category'] = 'ctf_platforms_' + key;
      }
      // index items
      miniSearch.addAll(ctf_platforms);
    }
    for (const [key, value] of Object.entries(data.resources)) {
      // add category
      resources = value.resources;
      for (let i=0; i<resources.length; i++) {
        resources[i]['category'] = 'resources_' + key;
        // crop strings that are too long and will overflow the tag label
        if (resources[i]['category'].length > 34) {
          resources[i]['category'] = resources[i]['category'].substring(0, 33) + '…'
        }
      }
      // index items
      miniSearch.addAll(resources);
    }
    for (const [key, value] of Object.entries(data.operating_systems)) {
      // add category
      operating_systems = value.operating_systems;
      for (let i=0; i<operating_systems.length; i++) {
        operating_systems[i]['category'] = 'os_' + key;
        // crop strings that are too long and will overflow the tag label
        if (operating_systems[i]['category'].length > 34) {
          operating_systems[i]['category'] = operating_systems[i]['category'].substring(0, 33) + '…'
        }
      }
      // index items
      miniSearch.addAll(operating_systems);
    }
  });

  let searchInput = function (val) {
    if (val.length > 2) {
      output = document.getElementById("output");
      output.innerHTML = "";
      res = miniSearch.search(val);
      if (res.length > 0) {
        for (elem of res) {
          div = document.createElement("div");
          par = document.createElement("p");
          control = div.cloneNode(true);
          control.classList = "control";
          tags = div.cloneNode(true);
          tags.classList = "tags has-addons";
          tag1 = div.cloneNode(true);
          tag1.classList = "tag is-dark";
          tag2 = div.cloneNode(true);
          tag2.classList = "tag";
          tag_keyword = document.createElement("span");
          tag_keyword.classList = "tag is-primary";
          card_footer_item = document.createElement("a");
          card_footer_item.classList = "card-footer-item";

          column = div.cloneNode(true);
          column.classList = "column is-full-mobile is-half-tablet is-one-third-widescreen is-one-quarter-desktop is-one-quarter-fullhd";
          card = div.cloneNode(true);
          card.classList = "card card-equal-height";
          card_header = document.createElement("header");
          card_header.classList = "card-header";
          card_header_title = par.cloneNode(true);
          card_header_title.classList = "card-header-title";
          card_header_title.innerText = elem.name;
          card_header.appendChild(card_header_title);
          card.appendChild(card_header);
          card_content = div.cloneNode(true);
          card_content.classList = "card-content";
          content = div.cloneNode(true);
          content.classList = "content";
          description = par.cloneNode(true);
          description.innerHTML = elem.description;
          content.appendChild(description);
          field = div.cloneNode(true);
          field.classList = "field is-grouped is-grouped-multiline";
          if (elem.category) {
            control_category = control.cloneNode(true);
            tags_category = tags.cloneNode(true);
            category = tag1.cloneNode(true);
            category.innerText = 'Category';
            tags_category.appendChild(category);
            category_value = tag2.cloneNode(true);
            category_value.classList.add('is-danger');
            category_value.innerText = elem.category;
            tags_category.appendChild(category_value);
            control_category.appendChild(tags_category);
            field.appendChild(control_category);
          }
          if (elem.language) {
            control_language = control.cloneNode(true);
            tags_language = tags.cloneNode(true);
            language = tag1.cloneNode(true);
            language.innerText = 'Language';
            tags_language.appendChild(language);
            language_value = tag2.cloneNode(true);
            language_value.classList.add('is-warning');
            language_value.innerText = elem.language;
            tags_language.appendChild(language_value);
            control_language.appendChild(tags_language);
            field.appendChild(control_language);
          }
          if (elem.price) {
            control_price = control.cloneNode(true);
            tags_price = tags.cloneNode(true);
            price = tag1.cloneNode(true);
            price.innerText = 'Price';
            tags_price.appendChild(price);
            price_value = tag2.cloneNode(true);
            price_value.classList.add('is-info');
            price_value.innerText = elem.price;
            tags_price.appendChild(price_value);
            control_price.appendChild(tags_price);
            field.appendChild(control_price);
          }
          if (elem.online) {
            control_online = control.cloneNode(true);
            tags_online = tags.cloneNode(true);
            online = tag1.cloneNode(true);
            online.innerText = 'Online';
            tags_online.appendChild(online);
            online_value = tag2.cloneNode(true);
            online_value.classList.add('is-success');
            online_value.innerText = elem.online;
            tags_online.appendChild(online_value);
            control_online.appendChild(tags_online);
            field.appendChild(control_online);
          }
          if (elem.blackarch) {
            control_blackarch = control.cloneNode(true);
            tags_blackarch = tags.cloneNode(true);
            blackarch = tag1.cloneNode(true);
            blackarch.innerText = 'BlackArch';
            tags_blackarch.appendChild(blackarch);
            blackarch_value = tag2.cloneNode(true);
            blackarch_value.classList.add('is-black');
            blackarch_value.innerText = elem.blackarch;
            tags_blackarch.appendChild(blackarch_value);
            control_blackarch.appendChild(tags_blackarch);
            field.appendChild(control_blackarch);
          }
          if (elem.review) {
            control_review = control.cloneNode(true);
            tags_review = tags.cloneNode(true);
            review = tag1.cloneNode(true);
            review.innerText = 'Review';
            tags_review.appendChild(review);
            review_value = tag2.cloneNode(true);
            review_value.classList.add('is-link');
            review_value.innerText = elem.review;
            tags_review.appendChild(review_value);
            control_review.appendChild(tags_review);
            field.appendChild(control_review);
          }
          content.appendChild(field);
          if (elem.keywords) {
            keywords = par.cloneNode(true);
            keywords.innerText = 'Keywords:';
            content.appendChild(keywords);
            keyword_tags = div.cloneNode(true);
            keyword_tags.classList = 'tags';
            for (tag of elem.keywords.split(', ')) {
              tag_x = tag_keyword.cloneNode(true);
              tag_x.innerText = tag;
              keyword_tags.appendChild(tag_x);
            }
            content.appendChild(keyword_tags);
          }
          card_content.appendChild(content);
          card.appendChild(card_content);
          if (elem.website || elem.source) {
            footer = document.createElement("footer");
            footer.classList = "card-footer";
            if (elem.website) {
              website = card_footer_item.cloneNode(true);
              website.setAttribute('href', elem.website);
              website.innerText = 'Website';
              footer.appendChild(website);
            }
            if ( elem.source) {
              source = card_footer_item.cloneNode(true);
              source.setAttribute('href', elem.source);
              source.innerText = 'Source';
              footer.appendChild(source);
            }
            card.appendChild(footer);
          }
          column.appendChild(card);
          output.appendChild(column);
        }
      }
    }
  };

//let results = miniSearch.search('cewl');
//results = miniSearch.search('wordlist', {
//    filter: (result) => result.language === 'Ruby'
//  });
