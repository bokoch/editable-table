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

            this.getStyles(editableTableContainer);
            this.renderTable(editableTableContainer, cols, rows);
            shadow.appendChild(editableTableContainer);

            var rootTable = editableTableContainer.querySelector('#root-table');
            var tds = rootTable.getElementsByTagName('td');

            this.hideControlsHandler(editableTableContainer);
            this.showControlsHandler(editableTableContainer, tds);
            this.handleRemoveRow(editableTableContainer.getElementsByClassName("control-row"));
            this.handleRemoveCol(editableTableContainer.getElementsByClassName("control-col"));

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
                    .red {
                        background-color: #cc4543;
                    }
                    .yellow {
                        background-color: #e5d932;
                    }
                    .control-row, .control-col {
                        width: 70px;
                        height: 70px;
                        color: white;
                        justify-content: center;
                        align-items: center;
                        display: none;
                        font-size: 30px;
                        cursor:pointer;
                    }
                    .control-add {
                        display: flex;
                        font-weight: 600;
                    }
                    .control-add.control-col {
                        margin-top: 4px;                        
                    }
                    .main-container.active .control-add.control-row {
                        margin-left: 74px;
                    }
                    .control-add.control-row {
                        margin-left: 4px;
                    }
                    .control-col td, .control-row td {
                        background-color: #bf563f;
                    }
                    .row-container {
                        display: flex;;
                    }
                    .main-container {
                        margin-top: 88px;
                        margin-left: 70px;
                    }
                    .main-container.active {
                        margin: 0;
                    }
                </style>
            `;
        }

        // handler for showing control element (Remove buttons)
        showControlsHandler(rootElement, tdsArray) {
            for (var i = 0; i < tdsArray.length; i++) {
                tdsArray[i].addEventListener('mouseover', function () {
                    rootElement.querySelector('#control-col').style.marginLeft = (this.offsetLeft + 72) + "px";
                    rootElement.querySelector('#control-row').style.marginTop = this.offsetTop + "px";

                    rootElement.querySelector('#control-col').style.width = this.offsetWidth + "px";
                    rootElement.querySelector('#control-row').style.height = this.offsetHeight + "px";
                });
            }
        }

        // handler for hiding control elements (Remove buttons)
        hideControlsHandler(element) {
            element.addEventListener('mouseover', function (e) {
                if ((e.target.tagName !== 'TD') && (e.target.tagName !== 'TABLE') && !e.target.classList.contains("js-control")) {
                    element.querySelector('#control-row').style.display = "none";
                    element.querySelector('#control-col').style.display = "none";
                    element.querySelector(".main-container").classList.remove('active');
                } else {
                    element.querySelector('#control-row').style.display = "flex";
                    element.querySelector('#control-col').style.display = "flex";
                    element.querySelector(".main-container").classList.add('active');
                }
            });
        }

        // element - dom element where table will be attached
        renderTable(element, colNumber, rowNumber) {

            var mainContainer = document.createElement("DIV");
            mainContainer.classList.add('main-container');
            var rowContainer = document.createElement("DIV");
            rowContainer.classList.add('row-container');

            // btn for removing columns
            var controlCol = document.createElement("DIV");
            controlCol.classList.add('control-col');
            controlCol.classList.add('js-control');
            controlCol.classList.add('red');
            controlCol.id = 'control-col';
            controlCol.textContent = "-";

            // btn for removing rows
            var controlRow = document.createElement("DIV");
            controlRow.classList.add('control-row');
            controlRow.classList.add('js-control');
            controlRow.classList.add('red');
            controlRow.id = 'control-row';
            controlRow.textContent = "-";

            // btn for add row
            var controlAddRow = document.createElement("DIV");
            controlAddRow.classList.add('control-row');
            controlAddRow.classList.add('control-add');
            controlAddRow.classList.add('yellow');
            controlAddRow.textContent = "+";

            // btn for add columns
            var controlAddCol = document.createElement("DIV");
            controlAddCol.classList.add('control-col');
            controlAddCol.classList.add('control-add');
            controlAddCol.classList.add('yellow');
            controlAddCol.textContent = "+";

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
            rowContainer.appendChild(controlAddCol);

            mainContainer.appendChild(controlCol);
            mainContainer.appendChild(rowContainer);
            mainContainer.appendChild(controlAddRow);


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
            for (var i = 0; i < elements.length; i++) {
                elements[i].addEventListener('click', this.removeRow, false);
            }
        }

        // Add listener to remove col buttons
        handleRemoveCol(elements) {
            for (var i = 0; i < elements.length; i++) {
                elements[i].addEventListener('click', this.removeCol, false);
            }
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