
export function csvToJson(csv, fieldDelimiter = ',') {
  const lines = csv.split(/\r?\n|\r/);
  const result = [];
  const headers = lines[0].split(fieldDelimiter);

  for (let i = 1; i < lines.length; i++) {
    let obj = {};
    let currentline = lines[i].split(fieldDelimiter);

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  return result;
}

export function getFileExtension(file) {
  if ( typeof file === 'string') {
    return file.split('.').pop();
  }

  if ( file && file.name) {
    return file.name.split('.').pop();
  }

  return '';
}
