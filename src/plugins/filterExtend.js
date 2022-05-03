const filterExtend = {
  install(Vue) {
    Vue.filter('Upper', function (value) {
      return value.toUpperCase();
    });

    Vue.filter('Lower', function (value) {
      return value.toLowerCase();
    });

    Vue.filter('toFixed', function (price, limit) {
      return price.toFixed(limit);
    });

    Vue.filter('readMore', function (text, length, suffix) {
      if (text.length > length ) {
        return text.substring(0, length) + suffix;
      }

      return text.substring(0, length);
    });

    Vue.filter('toString', function (value) {
      return value.toString();
    });

    Vue.filter('toNumber', function(value) {
      if ( value === null || value === undefined || value === '') {
        return 0;
      }

      return value;
    });

    Vue.filter('toStandardDateString', function (value) {
      return value.toStandardDateString();
    });

    Vue.filter('digits', function (value) {
      if ( value === null || value === undefined || value === '') {
        return;
      }

      if (typeof value !== 'string') {
        value = value.toString();
      }

      return value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    });
  }
};

export default filterExtend;
