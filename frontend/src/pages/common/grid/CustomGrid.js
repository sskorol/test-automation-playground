import './Grid.css';
import React from 'react';
import ReactDataGrid from 'react-data-grid';
import StringFormatter, { extendedFormatter } from '../../../formatters/StringFormatter';
import { getAllUsers } from '../../../util/APIUtils';
import { observer, inject } from 'mobx-react';
import { action, observable, computed } from 'mobx';
import { GRID_UPDATE_INTERVAL, AUTOUPDATE_GRID } from '../../../constants';

const {
    Toolbar,
    Data: { Selectors }
} = require('react-data-grid-addons');

@inject('sessionStore')
@observer
class GridComponent extends React.Component {
    @observable
    columns: [];
    @observable
    rows: [];
    @observable
    filters: {};
    @observable
    sortColumn: string;
    @observable
    sortDirection: string;

    constructor(props, context) {
        super(props, context);
        this.createRows();
        this.columns = [
            {
                key: 'id',
                name: 'ID',
                sortable: true
            },
            {
                key: 'name',
                name: 'Name',
                filterable: true,
                sortable: true
            },
            {
                key: 'username',
                name: 'Username',
                filterable: true,
                sortable: true
            },
            {
                key: 'email',
                name: 'Email',
                filterable: true,
                sortable: true
            }
        ].map(column => ({
            ...column,
            headerRenderer: <div data-qa={column.key}>{column.name}</div>,
            formatter: extendedFormatter(StringFormatter, { 'data-qa': `cell-${column.key}` })
        }));
    }

    componentDidMount() {
        if (AUTOUPDATE_GRID) {
            setInterval(() => this.setRandomData(), GRID_UPDATE_INTERVAL);
        }
    }

    @action
    setRandomData() {
        const rows = this.rows;
        if (rows) {
            const shuffled = rows
                .map(a => [Math.random(), a])
                .sort((a, b) => a[0] - b[0])
                .map(a => a[1]);
            this.setRows(shuffled);
        }
        const updatedColumns = this.columns.slice();
        this.setColumns(updatedColumns);
    }

    @action
    setRows(rows) {
        this.rows = rows;
    }

    @action
    setColumns(columns) {
        this.columns = columns;
    }

    @action
    createRows = async () => {
        this.rows = await getAllUsers(50);
    };

    @computed
    get getRows() {
        let result = Selectors.getRows({
            rows: this.rows,
            filters: this.filters,
            sortColumn: this.sortColumn,
            sortDirection: this.sortDirection
        });
        return result;
    }

    @computed
    get getSize() {
        return this.getRows.length;
    }

    @action
    rowGetter = rowIdx => {
        return this.getRows[rowIdx];
    };

    @action
    handleGridSort = (sortColumn, sortDirection) => {
        this.sortColumn = sortColumn;
        this.sortDirection = sortDirection;
    };

    @action
    handleFilterChange = filter => {
        let newFilters = Object.assign({}, this.filters);
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        this.filters = newFilters;
    };

    @action
    onClearFilters = () => {
        this.filters = {};
    };

    render() {
        const { sessionStore } = this.props;
        return !sessionStore.isLoading ? (
            <ReactDataGrid
                onGridSort={this.handleGridSort}
                sortColumn={this.sortColumn}
                sortDirection={this.sortDirection}
                enableCellSelect={false}
                columns={this.columns}
                rowGetter={this.rowGetter}
                rowsCount={this.getSize}
                minHeight={500}
                minWidth={1020}
                emptyRowsView={EmptyGridView}
                rowRenderer={RowRenderer}
                toolbar={<Toolbar enableFilter={true} />}
                onAddFilter={this.handleFilterChange}
                onClearFilters={this.onClearFilters}
            />
        ) : null;
    }
}

class EmptyGridView extends React.Component {
    render() {
        return (
            <div className="empty-grid" data-qa="empty-grid">
                No records found
            </div>
        );
    }
}

class RowRenderer extends React.Component {
    setScrollLeft = scrollBy => {
        this.row.setScrollLeft(scrollBy);
    };

    render() {
        return (
            <div data-qa="gridRow">
                <ReactDataGrid.Row ref={node => (this.row = node)} {...this.props} />
            </div>
        );
    }
}

export default GridComponent;
