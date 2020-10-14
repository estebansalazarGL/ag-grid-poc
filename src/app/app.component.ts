import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import { map } from 'rxjs/operators';

import { AgGridAngular } from 'ag-grid-angular';

import { CellButtonComponent } from './components/cell-button/cell-button.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private gridApi;
  private gridColumnApi;
  private gridApiSecond;
  private gridColumnApiSecond;
  private context;
  private frameworkComponents;

  @ViewChild('agGrid', { static: true }) agGrid: AgGridAngular;
  @ViewChild('agGrid', { static: true }) agGrid2: AgGridAngular;

  hiddenColumns = false;
  hiddenPagination = false;

  columnTypes = {
    'nonEditableColumn': { editable: false },
    'dateColumn': {
        filter: 'agDateColumnFilter',
        filterParams: { comparator: this.dateComparator },
    }
  };

  filterParams = {
    comparator: this.dateComparator,
  };

  columnDefs = [
    { field: 'title', filter: true, resizable: true },
    { field: 'director', filter: true, resizable: true },
    { headerName: 'Date', field: 'second_date', sortable: true, filter: 'agDateColumnFilter', },
  ];

  columnDefsIncludedExtra = [
    {
      headerName: 'Group A',
      children: [
        { field: 'title', filter: true, resizable: true, rowDrag: true, checkboxSelection: true, },
        { field: 'director', filter: true, resizable: true,
        cellClass: (params) => params.value === 'Hayao Miyazaki' ? 'older' : 'normal' },
      ],
    },
    { headerName: 'Date', field: 'release_date', filter: 'agNumberColumnFilter' },
    { headerName: 'Date', field: 'release_date', type: ['dateColumn', 'nonEditableColumn']},
    { headerName: 'Date', field: 'release_date', type: 'dateColumn' },
    { headerName: 'Complete Date', field: 'complete_date', filter: 'agDateColumnFilter',
      valueFormatter: (params) => params.value.toLocaleString()
    },
    { headerName: 'Complete Date 2', field: 'complete_date', filter: 'agDateColumnFilter' },
  ];

  columnDefsSecond = [
    { field: 'title', filter: true, resizable: true },
    { field: 'director', filter: true, resizable: true },
    { headerName: 'Date', field: 'second_date', sortable: true, filter: 'agDateColumnFilter', },
    {
      headerName: 'Child/Parent',
      field: 'value',
      cellRenderer: 'cellButtonComponent',
      colId: 'params',
      editable: false,
      minWidth: 150,
    },
  ];

  // rowData = [
  //     { make: 'Toyota', model: 'Celica', price: 35000 },
  //     { make: 'Ford', model: 'Mondeo', price: 32000 },
  //     { make: 'Porsche', model: 'Boxter', price: 72000 }
  // ];
  rowData: any;
  rowDataSecond: any;

  defaultColDef = {
    sortable: true,
    flex: 1,
    // minWidth: 100,
  };

  rowClassRules = {
    'row-background-custom': (params) => params.data.release_date >= 2000,
  };

  constructor(private http: HttpClient) {
    this.context = { componentParent: this };
    this.frameworkComponents = {
      cellButtonComponent: CellButtonComponent
    };
  }

  ngOnInit() {
      // this.rowData = this.http.get('https://ghibliapi.herokuapp.com/films');
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http.get('https://ghibliapi.herokuapp.com/films')
      .pipe(
        map((data: any[]) => {
          data.forEach((film) => {
            film.second_date = new Date(film.release_date).toLocaleString();
            film.complete_date = new Date(film.release_date);
          });
          return data;
        })
      )
      .subscribe((data) => {
        this.showColumns();
        this.rowData = data;
      });
  }

  onGridReadySecond(params) {
    this.gridApiSecond = params.api;
    this.gridColumnApiSecond = params.columnApi;

    this.http.get('https://ghibliapi.herokuapp.com/films')
      .pipe(
        map((data: any[]) => {
          data.forEach((film, index) => {
            film.second_date = new Date(film.release_date).toLocaleString();
            film.complete_date = new Date(film.release_date);
            film.value = index;
          });
          return data;
        })
      )
      .subscribe((data) => {
        this.gridApiSecond.setColumnDefs(this.columnDefsSecond);
        this.rowData = [...data, ...data, ...data];
      });
  }

  /**
   * Get data from selected nodes
   *
   * @memberof AppComponent
   */
  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data );
    const selectedDataStringPresentation = selectedData.map(node => node.title + ' of ' + node.director).join(', ');

    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }

  /**
   * Hide columns on grid
   *
   * @memberof AppComponent
   */
  hideColumns() {
    this.gridApi.setColumnDefs(this.columnDefs);
    this.hiddenColumns = true;
  }

  /**
   * Show columns on grid
   *
   * @memberof AppComponent
   */
  showColumns() {
    this.gridApi.setColumnDefs(this.columnDefsIncludedExtra);
    this.hiddenColumns = false;
  }

  /**
   * Function to compare dates
   * Must be completed
   *
   * @param {*} filterLocalDateAtMidnight
   * @param {*} cellValue
   * @return {*}
   * @memberof AppComponent
   */
  dateComparator(filterLocalDateAtMidnight, cellValue) {

  }

  exportCSV() {
    const params = {
      suppressQuotes: true,
      columnSeparator: '|',
      customHeader: 'array',
      customFooter: 'array',
    };

    this.gridApi.exportDataAsCsv(params);
  }

  methodFromParent(cell) {
    alert('Parent Component Method from ' + cell + '!');
  }
}
