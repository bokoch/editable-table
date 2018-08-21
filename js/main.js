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


            var rootTable = editableTableContainer.querySelector('#root-table');
            var tds = rootTable.getElementsByTagName('td');

            editableTableContainer.addEventListener('mouseout', function (e) {
                console.log(e.target)
                // editableTableContainer.querySelector('#control-row').style.display = "none";
                // editableTableContainer.querySelector('#control-col').style.display = "none";
            });

            for (var i = 0; i < tds.length; i++) {
                tds[i].addEventListener('mouseover', function () {
                    editableTableContainer.querySelector('#control-row').style.display = "flex";
                    editableTableContainer.querySelector('#control-col').style.display = "flex";

                    editableTableContainer.querySelector('#control-col').style.marginLeft = (this.offsetLeft + 72) + "px";
                    editableTableContainer.querySelector('#control-row').style.marginTop = this.offsetTop + "px";

                    editableTableContainer.querySelector('#control-col').style.width = this.offsetWidth + "px";
                    editableTableContainer.querySelector('#control-row').style.height = this.offsetHeight + "px";
                });
            }

        }

        getStyles(element) {
            element.innerHTML = `
                <style>
                    table {
                        border: 2px solid #5d90e2;
                    }
                    td {
                        height: 70px;
                        width: 50px;
                        text-align: center;
                        background-color: #5d90e2;
                        color: white;
                        padding: 0 10px;
                    }
                    .control-col {

                    }
                    .control-row, .control-col {
                        width: 70px;
                        height: 70px;
                        background-color: #cc4543;
                        color: white;
                        justify-content: center;
                        align-items: center;
                        display: none;
                        font-size: 30px;
                    }
                    .control-col td, .control-row td {
                        background-color: #bf563f;
                    }
                    .row-container {
                    display: flex;;
                    }
                    .main-container {
                    
                    }
                </style>
            `;
        }

        // element - dom element where table will be attached
        renderTable(element, colNumber, rowNumber) {

            var mainContainer = document.createElement("DIV");
            mainContainer.classList.add('main-container');
            var rowContainer = document.createElement("DIV");
            rowContainer.classList.add('row-container');

            // Sub table for removing rows
            var controlCol = document.createElement("DIV");
            controlCol.classList.add('control-col');
            controlCol.id = 'control-col';
            controlCol.textContent = "-";

            // Sub table for removing rows
            var controlRow = document.createElement("DIV");
            controlRow.classList.add('control-row');
            controlRow.id = 'control-row';
            controlRow.textContent = "-";


            // Main table
            var table = document.createElement("TABLE");
            table.id = 'root-table';

            for (var i = 0; i < rowNumber; i++) {
                var tr = document.createElement('TR');
                for (var j = 0; j < colNumber; j++) {
                    var td = document.createElement('TD');
                    td.textContent = "Test";
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }

            // Main table
            rowContainer.appendChild(controlRow);
            rowContainer.appendChild(table);

            mainContainer.appendChild(controlCol);
            mainContainer.appendChild(rowContainer);

            element.appendChild(mainContainer);
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