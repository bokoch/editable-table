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
            const shadow = this.attachShadow({ mode: 'open' });

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