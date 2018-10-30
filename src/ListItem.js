import React from 'react';
import AppComponent from 'flow-app-component';

import appBuilderComponents from '..';

class ListItem extends AppComponent {
  constructor() {
    super();
    const newState = {
      properties: [
        {
          categoryName: 'General',
          categoryDescription: 'Basic settings for List Item.',
          properties: [
            {
              id: 'columns',
              name: 'Select Columns',
              type: 'select-columns',
              options: {},
              data: { table: null, columns: [] },
            },
          ],
        },
      ],
      iconUrl: '/assets/images/list-component.svg',
    };

    this.state = Object.assign(this.state, newState); // merge two states together, and dont lose any parent state properties.
  }

  getAppComponent(columnName) {
    const { dataType } = this.props.columns.filter(
      column => column.document.name === columnName,
    )[0];

    if (['Id', 'DateTime', 'Text'].includes(dataType)) {
      return appBuilderComponents.text;
    } else if (['image', 'profilePic'].includes(columnName)) {
      return appBuilderComponents.image;
    }

    return appBuilderComponents.text;
  }

  renderContent() {
    const elemProps = this.getElementProps();
    elemProps.style = this.getDefaultStyle() || {};

    const listItems = Object.keys(this.props.item).map((columnName, i) => {
      const AppBuilderComponent = this.getAppComponent(columnName);
      // this assumes what's to be displayed will always be the first property child
      const {
        id,
      } = new AppBuilderComponent().state.properties[0].properties[0];
      const propertyData = [
        {
          properties: [
            {
              id,
              data: this.props.item[columnName],
            },
          ],
        },
      ];

      return (
        <AppBuilderComponent
          className="node listItem"
          key={i}
          propertyData={propertyData}
        />
      );
    });

    return <div className="node-item">{listItems}</div>;
  }
}

export default ListItem;
