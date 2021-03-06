'use strict';

(function () {
    const defaultProps = {
        /** @property {int} Default rows amount */
        rowsAmount: 5,

        /** @property {int} Default columns amount */
        colsAmount: 5,
    };

    const initProps = {
        /** @property {String} Wrapper for all element */
        ELEMENT_WRAPPER_CLASS: '.table_wrapper',

        /** @property {String} ID of removing row button */
        REMOVE_ROW_BTN_ID: '#controlRemoveRow',

        /** @property {String} ID of removing column button */
        REMOVE_COL_BTN_ID: '#controlRemoveCol',

        /** @property {String} ID of adding row button */
        ADD_ROW_BTN_ID: '#controlAddRow',

        /** @property {String} ID of adding column button */
        ADD_COL_BTN_ID: '#controlAddCol',

        /** @property {String} Class for all buttons that can change table (remove, add) */
        CONTROL_BUTTON_CLASS: '.js-control',

        /** @property {String} Container class for remove column button, ROW_CONTAINER_CLASS and add row button */
        TABLE_CONTAINER_CLASS: '.main-container',

        /** @property {String} Container class for remove row button, table and add col button */
        ROW_CONTAINER_CLASS: '.row-container',

        /** {String} ID of main table */
        TABLE_ID: '#root-table',

        /** {String} Attribute that contain index of current column */
        CURRENT_COL: 'data-col',

        /** {String} Attribute that contain index of current row */
        CURRENT_ROW: 'data-row',

        /** {String} Class to set styles for remove/add columns buttons */
        CONTROL_COL_CSS: 'control-col',

        /** {String} Class to set styles for remove/add row buttons */
        CONTROL_ROW_CSS: 'control-row',

        CONTROL_ADD_BTN_CSS: 'control-add',

        /** {String} Class to set color for remove button */
        CONTROL_REMOVE_COLOR_CSS: 'red',

        /** {String} Class to set color for add button */
        CONTROL_ADD_COLOR_CSS: 'yellow',

    };

    class EditableTable extends HTMLElement {

        constructor() {
            super();

            // Get shadow root
            const shadow = this.attachShadow({mode: 'open'});

            // Create wrapper of table
            const editableTableContainer = document.createElement('div');
            editableTableContainer.classList.add(
                this.removeSelectorSign(initProps.ELEMENT_WRAPPER_CLASS)
            );

            // get attribute values
            const rows = this.rows;
            const cols = this.cols;

            // binding methods
            this.handleRemoveRow = this.handleRemoveRow.bind(this);
            this.handleRemoveCol = this.handleRemoveCol.bind(this);
            this.removeCol = this.removeCol.bind(this);
            this.removeRow = this.removeRow.bind(this);
            this.addRow = this.addRow.bind(this);
            this.addCol = this.addCol.bind(this);

            this.getStyles(editableTableContainer);
            this.renderTable(editableTableContainer, cols, rows);
            shadow.appendChild(editableTableContainer);

            const rootTable = editableTableContainer.querySelector(initProps.TABLE_ID);
            const tds = rootTable.getElementsByTagName('td');

            this.hideControlsHandler(editableTableContainer);
            this.showControlsHandler(editableTableContainer, tds);

            this.handleRemoveRow(editableTableContainer.querySelector(initProps.REMOVE_ROW_BTN_ID));
            this.handleRemoveCol(editableTableContainer.querySelector(initProps.REMOVE_COL_BTN_ID));
            this.handleAddRow(editableTableContainer.querySelector(initProps.ADD_ROW_BTN_ID));
            this.handleAddCol(editableTableContainer.querySelector(initProps.ADD_COL_BTN_ID));

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

        /**
         * @description Handler for showing control elements on hover (Add and Remove buttons)
         *
         * @param rootElement table container (with add and remove buttons)
         * @param tdsArray array of cells, where adding listener mouseover
         */
        showControlsHandler(rootElement, tdsArray) {
            for (let i = 0; i < tdsArray.length; i++) {
                tdsArray[i].addEventListener('mouseover', function () {
                    let rowControl, colControl;

                    colControl = rootElement.querySelector(initProps.REMOVE_COL_BTN_ID);
                    rowControl = rootElement.querySelector(initProps.REMOVE_ROW_BTN_ID);

                    // if table cell change width/height (text content)
                    // change width/height of remove buttons
                    colControl.style.marginLeft = (this.offsetLeft + 72) + "px";
                    rowControl.style.marginTop = this.offsetTop + "px";

                    colControl.style.width = this.offsetWidth + "px";
                    rowControl.style.height = this.offsetHeight + "px";

                    // set attribute for row and col number in remove buttons
                    colControl.setAttribute(initProps.CURRENT_COL, String(this.cellIndex));
                    rowControl.setAttribute(initProps.CURRENT_ROW, String(this.parentNode.rowIndex));
                });
            }
            tdsArray[0].addEventListener('mouseover', function () {
                rootElement.querySelector(initProps.ADD_COL_BTN_ID).style.height = tdsArray[0].offsetHeight + "px";
                rootElement.querySelector(initProps.ADD_COL_BTN_ID).style.width = tdsArray[0].offsetWidth + "px";
            });
        }

        // handler for hiding control elements (Remove buttons)
        hideControlsHandler(element) {
            let self = this;

            element.addEventListener('mouseover', function (e) {
                if ((e.target.tagName !== 'TD') &&
                    (e.target.tagName !== 'TABLE') &&
                    !e.target.classList.contains(self.removeSelectorSign(initProps.CONTROL_BUTTON_CLASS))
                ) {
                    element.querySelector(initProps.REMOVE_ROW_BTN_ID).style.display = "none";
                    element.querySelector(initProps.REMOVE_COL_BTN_ID).style.display = "none";
                    element.querySelector(initProps.TABLE_CONTAINER_CLASS).classList.remove('active');
                } else {
                    element.querySelector(initProps.REMOVE_ROW_BTN_ID).style.display = "flex";
                    element.querySelector(initProps.REMOVE_COL_BTN_ID).style.display = "flex";
                    element.querySelector(initProps.TABLE_CONTAINER_CLASS).classList.add('active');
                }
            });
        }

        // element - dom element where table will be attached
        renderTable(element, colNumber, rowNumber) {

            let mainContainer = document.createElement("DIV");
            mainContainer.classList.add(this.removeSelectorSign(initProps.TABLE_CONTAINER_CLASS));
            let rowContainer = document.createElement("DIV");
            rowContainer.classList.add(this.removeSelectorSign(initProps.ROW_CONTAINER_CLASS));

            // btn for removing columns
            let controlCol = document.createElement("DIV");
            controlCol.classList.add(initProps.CONTROL_COL_CSS);
            controlCol.classList.add(initProps.CONTROL_REMOVE_COLOR_CSS);
            controlCol.classList.add(this.removeSelectorSign(initProps.CONTROL_BUTTON_CLASS));
            controlCol.id = this.removeSelectorSign(initProps.REMOVE_COL_BTN_ID);
            controlCol.setAttribute(initProps.CURRENT_COL, '0');
            controlCol.textContent = "-";

            // btn for removing rows
            let controlRow = document.createElement("DIV");
            controlRow.classList.add(initProps.CONTROL_ROW_CSS);
            controlRow.classList.add(initProps.CONTROL_REMOVE_COLOR_CSS);
            controlRow.classList.add(this.removeSelectorSign(initProps.CONTROL_BUTTON_CLASS));
            controlRow.id = this.removeSelectorSign(initProps.REMOVE_ROW_BTN_ID);
            controlRow.setAttribute(initProps.CURRENT_ROW, '0');
            controlRow.textContent = "-";

            // btn for add row
            let controlAddRow = document.createElement("DIV");
            controlAddRow.classList.add(initProps.CONTROL_ADD_BTN_CSS);
            controlAddRow.classList.add(initProps.CONTROL_ROW_CSS);
            controlAddRow.classList.add(initProps.CONTROL_ADD_COLOR_CSS);
            controlAddRow.id = this.removeSelectorSign(initProps.ADD_ROW_BTN_ID);
            controlAddRow.textContent = "+";

            // btn for add columns
            let controlAddCol = document.createElement("DIV");
            controlAddCol.classList.add(initProps.CONTROL_COL_CSS);
            controlAddCol.classList.add(initProps.CONTROL_ADD_BTN_CSS);
            controlAddCol.classList.add(initProps.CONTROL_ADD_COLOR_CSS);
            controlAddCol.id = this.removeSelectorSign(initProps.ADD_COL_BTN_ID);
            controlAddCol.textContent = "+";

            // Main table
            let table = document.createElement("TABLE");
            table.id = this.removeSelectorSign(initProps.TABLE_ID);

            for (let i = 0; i < rowNumber; i++) {
                let tr = document.createElement('TR');
                for (let j = 0; j < colNumber; j++) {
                    let td = document.createElement('TD');
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
            return parseInt(this.getAttribute('data-table-rows')) || defaultProps.rowsAmount;
        }

        // Get cols number of table from attributes
        get cols() {
            return parseInt(this.getAttribute('data-table-cols')) || defaultProps.colsAmount;
        }

        /**
         * @description Remove querySelector sign (remove # or . from str)
         */
        removeSelectorSign(str) {
            return str.replace(/\.|#/g, '');
        }

        // Add listener to remove row buttons
        handleRemoveRow(element) {
            element.addEventListener('click', this.removeRow, false);
        }

        // Add listener to remove col buttons
        handleRemoveCol(element) {
            element.addEventListener('click', this.removeCol, false);

        }

        handleAddRow(element) {
            element.addEventListener('click', this.addRow, false);

        }

        handleAddCol(element) {
            element.addEventListener('click', this.addCol, false);
        }

        removeRow(e) {
            let controlRow = this.shadowRoot.querySelector(initProps.REMOVE_ROW_BTN_ID);
            let rowNumber = parseInt(controlRow.getAttribute(initProps.CURRENT_ROW));
            let table = this.shadowRoot.querySelector(initProps.TABLE_ID);

            if (this.colsAmount(table) > 1) {
                table.deleteRow(rowNumber);
            }

            // If last row hide remove button
            if (this.colsAmount(table) === rowNumber) {
                controlRow.style.display = 'none';
            }
        }

        removeCol(e) {
            let controlCol = this.shadowRoot.querySelector(initProps.REMOVE_COL_BTN_ID);
            let colNumber = parseInt(controlCol.getAttribute(initProps.CURRENT_COL));
            let table = this.shadowRoot.querySelector(initProps.TABLE_ID);

            let trArray = table.getElementsByTagName("TR");

            // Keep last cell
            if (this.rowsAmount(table) > 1) {
                for (let i = 0; i < trArray.length; i++) {
                    trArray[i].deleteCell(colNumber);
                }
            }
            // If last column hide remove button
            if (this.rowsAmount(table) === colNumber) {
                controlCol.style.display = 'none';
            }
        }

        addRow(e) {
            let newTr = document.createElement("TR");
            let table = this.shadowRoot.querySelector(initProps.TABLE_ID);
            let container = this.shadowRoot.querySelector(initProps.ELEMENT_WRAPPER_CLASS);
            let tdAmount = this.rowsAmount(table);

            let tdArray = [];
            // Need to refactor getting amount of table cells in a row
            for (let i = 0; i < tdAmount; i++) {
                let newTd = document.createElement("TD");
                newTd.textContent = "TestNew";
                newTr.appendChild(newTd);

                tdArray.push(newTd);
            }
            table.appendChild(newTr);

            // set handlers for new cells
            this.showControlsHandler(container, tdArray);
            this.hideControlsHandler(container, tdArray);
        }

        addCol(e) {
            let table = this.shadowRoot.querySelector(initProps.TABLE_ID);
            let container = this.shadowRoot.querySelector(initProps.ELEMENT_WRAPPER_CLASS);
            let trArray = table.getElementsByTagName("TR");
            let trAmount = this.colsAmount(table);

            let tdArray = [];
            for (let i = 0; i < trAmount; i++) {
                let newTd = document.createElement("TD");
                newTd.textContent = "TestNew";
                trArray[i].appendChild(newTd);

                tdArray.push(newTd);
            }
            // set handlers for new cells
            this.showControlsHandler(container, tdArray);
            this.hideControlsHandler(container, tdArray);
        }

        colsAmount(table) {
            return table.getElementsByTagName("tr").length;
        }

        rowsAmount(table) {
            return table.getElementsByTagName("tr")[0].getElementsByTagName("td").length;
        }

    }

    customElements.define('editable-table', EditableTable);
})();