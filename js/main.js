'use strict';

(function () {
    class InitOptions {
        static get initRows() {
            return 5;
        }

        static get initCols() {
            return 5;
        }
    }

    class EditableTable extends HTMLElement {


        constructor() {
            super();

            // Get shadow root
            const shadow = this.attachShadow({mode: 'open'});

            // Create wrapper of table
            const editableTableContainer = document.createElement('div');
            editableTableContainer.classList.add('table_wrapper');


            // get attribute values
            const rows = this.rows;
            const cols = this.cols;

            console.log(rows);
            console.log(cols);

            // binding methods
            this.handleRemoveRow = this.handleRemoveRow.bind(this);
            this.handleRemoveCol = this.handleRemoveCol.bind(this);
            this.removeCol = this.removeCol.bind(this);
            this.removeRow = this.removeRow.bind(this);
            this.renderTable = this.renderTable.bind(this);
            this.getStyles = this.getStyles.bind(this);

            this.getStyles(editableTableContainer);
            this.renderTable(editableTableContainer, cols, rows);
            shadow.appendChild(editableTableContainer);

        }

        getStyles(element) {
            element.innerHTML = `
                <style>
                    table {
                    }
                    td {
                        height: 70px;
                        width: 50px;
                        text-align: center;
                        background-color: #5d90e2;
                        color: white;
                        padding: 0 10px;
                    }
                    tr:first-child td, td:first-child {
                        background-color: #d85147;
                        font-size: 30px;
                    }
                    .control-cell {
                        
                    }
                    .control-row {
                        
                    }
                </style>
            `;
        }

        // element - dom element where table will be attached
        renderTable(element, colNumber, rowNumber) {
            // Main table
            var table = document.createElement("TABLE");
            table.classList.add('root-table');

            for (var i = 0; i < rowNumber + 1; i++) {
                var tr = document.createElement('TR');
                if (i === 0 ) {
                    tr.classList.add('control-row')
                }
                for (var j = 0; j < colNumber + 1; j++) {
                    var td = document.createElement('TD');
                    if (i === 0 || j === 0) {
                        td.textContent = "-";
                        td.classList.add('control-cell')
                    } else {
                        td.textContent = "Test";
                    }
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }

            // Main table
            element.appendChild(table);
        }

        // Get rows number of table from attributes
        get rows() {
            return parseInt(this.getAttribute('data-table-rows')) || InitOptions.initRows;
        }

        // Get cols number of table from attributes
        get cols() {
            return parseInt(this.getAttribute('data-table-cols')) || InitOptions.initCols;
        }

        // Add listener to remove row buttons
        handleRemoveRow(elements) {
            elements.forEach(element => {
                element.addEventListener('click', this.removeRow, false);
            });
        }

        // Add listener to remove col buttons
        handleRemoveCol(elements) {
            elements.forEach(element => {
                element.addEventListener('click', this.removeCol, false);
            });
        }

        removeRow(e) {
            console.log('Remove row');
        }

        removeCol(e) {
            console.log('Remove col');
        }

    }

    customElements.define('editable-table', EditableTable);
})();