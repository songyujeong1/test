export function clearClone(source, target) {
  const newObj = Object.assign({...source}, {});

  for (let key in newObj) {
    newObj[key] = null;
  }

  if ( target) {
    return Object.assign(newObj, target);
  }

  return newObj;
}

export function dateParse(value) {
  let y = 0;
  let m = 0;
  let d = 0;
  let h = 0;

  if (value.length === 8) {
    y = value.substr(0, 4);
    m = value.substr(4, 2);
    d = value.substr(6, 2);
  } else if (value.length === 10) {
    y = value.substr(0, 4);
    m = value.substr(5, 2);
    d = value.substr(8, 2);
  } else if (value.length === 13) {
    y = value.substr(0, 4);
    m = value.substr(5, 2);
    d = value.substr(8, 2);
    h = value.substr(11, 2);
  } else if (value.length === 16) {
    y = value.substr(0, 4);
    m = value.substr(5, 2);
    d = value.substr(8, 2);
    h = value.substr(11, 2);
  } else {
    return null;
  }

  return {
    y: parseInt(y),
    m: parseInt(m),
    d: parseInt(d),
    h: parseInt(h)
  };
}

export function getObjectKeys(obj) {
  let tmp = obj;
  const columns = [];

  if (Array.isArray(obj) && obj.length > 0) {
    tmp = obj[0];
  }

  if ( tmp ) {
    for (let key in tmp) {
      columns.push({label: key, prop: key});
    }
  }

  return columns;
};

export function stringToDate(value) {
  if (typeof value === 'string' && (value.length === 8 || value.length === 10 || value.length === 13 || value.length === 16)) {
    const dateObj = dateParse(value);

    return dateObj ? new Date(dateObj.y, dateObj.m - 1, dateObj.d, dateObj.h, 0) : null;
  }

  if (value instanceof Date) {
    return value;
  }

  return null;
}

export function treeToFlat(tree, key) {
  let rtn = [];

  if ( tree ) {
    tree.forEach((item) => {
      rtn.push(item);

      if (item[key]) {
        const child = treeToFlat(item[key], key);

        rtn = rtn.concat(child);
      }
    });
  }

  return rtn;
}
