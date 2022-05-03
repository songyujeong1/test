let rowspanArray;

export function spanRow({ rowIndex, columnIndex }, data, option) {
  if (rowIndex === 0 && columnIndex === 0) {
    computeSpanRow(data, option);
  }

  if (is(option, columnIndex)) {
    const rowspan = rowspanArray[columnIndex][rowIndex];
    const colspan = rowspan > 0 ? 1 : 0;

    return {
      rowspan: rowspan,
      colspan: colspan
    };
  }

  return {
    rowspan: 1,
    colspan: 1
  };
}

export function debounce(fun, t = 0) {
  let st;

  if (typeof fun !== 'function') {
    throw new TypeError('Not a function');
  }

  return function() {
    if (st) {
      clearTimeout(st);
    }
    st = setTimeout(() => {
      fun.apply(this, arguments);
    }, t);
  };
}

export function getColumnInfo(cols, height, tableRect) {
  const header = getHeaders(cols);
  const columns = getColumns(cols);
  const mergeOption = getMergeOption(columns);
  const fixedHeader = getFixedHeader(cols);
  const fixedColumns = getFixedColumns(cols);
  let totalWidth = 0;
  let fixedWidth = 0;

  columns.forEach( x => {
    totalWidth += x.width;
  });

  fixedColumns.forEach( x => {
    fixedWidth += x.width;
  });

  if ( columns.length > 0 && columns[columns.length - 1].lastFill === true && totalWidth < tableRect.width) {
    const lastColumnSize = tableRect.width - totalWidth;

    columns[columns.length - 1].width = lastColumnSize;
    columns[columns.length - 1].flexWidth = '0 0 ' + lastColumnSize + 'px';
  }

  return {
    columns,
    fixedColumns,
    fixedHeader,
    fixedWidth,
    header,
    height: height - tableRect.headerHeight,
    mergeOption,
    totalWidth
  };
}

function getMergeOption(columns) {
  let mergeOption = [];

  columns.forEach((col, index) => {
    if ( col.isMerge === true) {
      if ( col.parentField) {
        mergeOption.push({
          index,
          field: col.mergeColum,
          parentField: col.parentField
        });
      } else {
        mergeOption.push({
          index,
          field: col.mergeColum
        });
      }
    }
  });

  return mergeOption;
}

function getColumns(columnInfo) {
  let tmp = [];

  columnInfo.forEach((c) => {
    if ( c.columns && c.columns.length > 0) {
      tmp = tmp.concat(getColumns(c.columns));
    } else {
      tmp.push(c);
    }
  });

  return tmp;
}

function getMaxRows(columns) {
  let maxrow = 0;

  columns.forEach(x => {
    if ( maxrow < 2) {
      maxrow = 1;
    }
    x.columns.forEach(y => {
      if ( maxrow < 3) {
        maxrow = 2;
      }
      y.columns.forEach(() => {
        maxrow = 3;
      });
    });
  });

  return maxrow;
}

function getFixedColumns(columnInfo) {
  let tmp = [];

  columnInfo.forEach((c) => {
    if ( c.fixed === true ) {
      if ( c.columns && c.columns.length > 0) {
        tmp = tmp.concat(getColumns(c.columns));
      } else {
        tmp.push(c);
      }
    }
  });

  return tmp;
}

function getFixedHeader(columns) {
  const maxrow = getMaxRows(columns);
  const rows = [];
  const firstRow = [];
  const secondRow = [];
  const thirdRow = [];

  columns.forEach(r1 => {
    if ( r1.fixed === true ) {
      let frowspan = maxrow;
      let fcolspan = 0;

      if (r1.columns.length > 0) {
        frowspan -= 2;
      }

      r1.columns.forEach(r2 => {
        let srowspan = maxrow - 1;
        let scolspan = r2.columns.length;

        if (r2.columns.length > 0) {
          srowspan--;
          fcolspan += r2.columns.length;
        } else {
          fcolspan += 1;
        }

        r2.columns.forEach(r3 => {
          let trowspan = maxrow - 2;
          let tcolspan = r3.columns.length;
          thirdRow.push({
            align: r3.headerAlign,
            colspan: tcolspan === 0 ? 1 : tcolspan,
            fixed: r1.fixed,
            label: r3.label,
            rowspan: trowspan === 0 ? 1 : trowspan,
            width: r3.width,
            sortColumn: r3.sortColumn
          });
        });
        secondRow.push({
          align: r2.headerAlign,
          colspan: scolspan === 0 ? 1 : scolspan,
          fixed: r1.fixed,
          label: r2.label,
          rowspan: srowspan === 0 ? 1 : srowspan,
          width: r2.width,
          sortColumn: r2.sortColumn
        });
      });

      firstRow.push({
        align: r1.headerAlign,
        colspan: fcolspan === 0 ? 1 : fcolspan,
        fixed: r1.fixed,
        label: r1.label,
        rowspan: frowspan === 0 ? 1 : frowspan,
        type: r1.type,
        width: r1.width,
        sortColumn: r1.sortColumn
      });
    }
  });

  rows.push(firstRow);

  if (secondRow.length > 0) {
    rows.push(secondRow);
  }

  if (thirdRow.length > 0) {
    rows.push(thirdRow);
  }

  return rows;
}

function getHeaders(columns) {
  const maxrow = getMaxRows(columns);
  const rows = [];
  const firstRow = [];
  const secondRow = [];
  const thirdRow = [];

  columns.forEach(r1 => {
    let frowspan = maxrow;
    let fcolspan = 0;

    if (r1.columns.length > 0) {
      frowspan -= 2;
    }

    r1.columns.forEach(r2 => {
      let srowspan = maxrow - 1;
      let scolspan = r2.columns.length;

      if (r2.columns.length > 0) {
        srowspan--;
        fcolspan += r2.columns.length;
      } else {
        fcolspan += 1;
      }

      r2.columns.forEach(r3 => {
        let trowspan = maxrow - 2;
        let tcolspan = r3.columns.length;
        thirdRow.push({
          align: r3.headerAlign,
          colspan: tcolspan === 0 ? 1 : tcolspan,
          fixed: r1.fixed,
          label: r3.label,
          rowspan: trowspan === 0 ? 1 : trowspan,
          width: r3.width,
          sortColumn: r3.sortColumn
        });
      });
      secondRow.push({
        align: r2.headerAlign,
        colspan: scolspan === 0 ? 1 : scolspan,
        fixed: r1.fixed,
        label: r2.label,
        rowspan: srowspan === 0 ? 1 : srowspan,
        width: r2.width,
        sortColumn: r2.sortColumn
      });
    });

    firstRow.push({
      align: r1.headerAlign,
      colspan: fcolspan === 0 ? 1 : fcolspan,
      fixed: r1.fixed,
      label: r1.label,
      rowspan: frowspan === 0 ? 1 : frowspan,
      type: r1.type,
      width: r1.width,
      sortColumn: r1.sortColumn
    });
  });

  rows.push(firstRow);

  if (secondRow.length > 0) {
    rows.push(secondRow);
  }

  if (thirdRow.length > 0) {
    rows.push(thirdRow);
  }

  return rows;
}

function computeSpanRow(data, option) {
  rowspanArray = [];

  let tempRow = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < option.length; j++) {
      let index = option[j].index;
      let field = option[j].field;
      let parentField = option[j].parentField;

      if (i === 0) {
        tempRow[index] = 0;
        rowspanArray[index] = [];
        rowspanArray[index].push(1);
      } else {
        if (parentField) {
          if (data[i][parentField] !== undefined && data[i][parentField] === data[i - 1][parentField] && data[i][field] === data[i - 1][field]) {
            rowspanArray[index][tempRow[index]] += 1;
            rowspanArray[index].push(0);
          } else {
            rowspanArray[index].push(1);
            tempRow[index] = i;
          }
        } else {
          if (data[i][field] === data[i - 1][field]) {
            rowspanArray[index][tempRow[index]] += 1;
            rowspanArray[index].push(0);
          } else {
            rowspanArray[index].push(1);
            tempRow[index] = i;
          }
        }
      }
    }
  }
}

function is(option, index) {
  for (let i = 0; i < option.length; i++) {
    if (option[i].index === index) {
      return true;
    }
  }
  return false;
}
