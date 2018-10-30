import React from 'react';
import AppComponent from 'flow-app-component';

import ListItem from './ListItem';

// List Canvas Styles
import './style.css';

class ListComponent extends AppComponent {
  static properties = {
    columns: [],

    properties: [
      {
        categoryName: 'General',
        categoryDescription: 'Basic settings for List Component.',
        properties: [
          {
            id: 'columns',
            name: 'Select Columns',
            type: 'select-columns',
            options: {},
            data: { table: null, columns: [] },
          },
          {
            id: 'size',
            name: 'Enter Page Size',
            type: 'number',
            options: {},
            data: null,
          },
          {
            id: 'filter',
            name: 'Add Filter',
            type: 'query',
            options: {},
            data: { table: null, query: null },
          },
          {
            id: 'layout',
            name: 'Layout',
            type: 'toggle',
            options: {
              values: [
                { text: 'Horizontal', value: 'horizontal' },
                { text: 'Vertical', value: 'vertical' },
                { text: 'Both', value: 'both' },
              ],
            },
            data: null,
          },
        ],
      },
      {
        categoryName: 'Events',
        categoryDescription: 'Events for the list',
        properties: [
          {
            id: 'event',
            name: 'Events',
            type: 'graph',
            options: {},
            data: null,
          },
        ],
      },
    ],

    iconUrl: '/assets/images/list-component.png',
    name: 'List',
    componentType: 'list',
    category: 'Views',
    parent: null,
    allowsChildren: false
  };

  constructor() {
    super();
    const newState = {
      listItems: [],
      ...ListComponent.properties
    };

    this.state = Object.assign(this.state, newState); // merge two states together, and dont lose any parent state properties.
  }

  async componentDidMount() {
    const { table } = this.getPropertyData('columns');
    const { listItems, columns } = await this.getListItems(table);
    // eslint-disable-next-line
       this.setState({ listItems, columns });
  }

  generateFakeObjects() {
    const fakeObjects = Array(
      parseInt(this.getPropertyData('size'), 10) || 10,
    ).fill({});

    this.getPropertyData('columns')
      .columns.map(column => column.name)
      .forEach((column, i) => {
        fakeObjects[0][column] = column;
      });

    return fakeObjects;
  }

  getListItems(table) {
    const promise = CB.CloudTable.getAll();
    return promise
      .then(data => {
        const tableIndex = data.findIndex(
          cloudTable => cloudTable.document._id === table,
        );
        if (tableIndex > -1) {
          const { query } = this.getPropertyData('filter');
          return [
            query
              ? query
                  .setLimit(parseInt(this.getPropertyData('size'), 10) || 10)
                  .find()
              : false,
            data[tableIndex].document.columns,
          ];
        }

        return [false];
      })
      .then(([tableObjects, columns]) => {
        if (tableObjects && tableObjects.length) {
          return [tableObjects, columns];
        }

        return [this.generateFakeObjects(), columns];
      })
      .then(([listItems, columns]) => ({ listItems, columns }));
  }

  renderContent() {
    const elemProps = this.getElementProps();
    elemProps.style = this.getDefaultStyle() || {};
    return (
      <div
        className={`node ${this.getPropertyData('layout') || 'horizontal'}`}
        {...elemProps}
      >
        {this.state.listItems && this.state.listItems.length ? (
          this.state.listItems.map((listItem, i) => (
            <ListItem key={i} item={listItem} columns={this.state.columns} />
          ))
        ) : (
          <span />
        )}
      </div>
    );
  }
}

export default ListComponent;
