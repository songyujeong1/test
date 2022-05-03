import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messageData = require('./message.json');
const dateTimeFormats = {
  en: {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    d: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    D: {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    day: {
      day: 'numeric'
    },
    f: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit'
    },
    F: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    },
    g: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    G: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    m: {
      month: 'long',
      day: '2-digit'
    },
    M: {
      month: '2-digit',
      day: '2-digit'
    },
    MM: {
      month: 'numeric'
    },
    t: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    T: {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    u: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    U: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    y: {
      year: 'numeric',
      month: 'long'
    },
    Y: {
      year: 'numeric',
      month: 'numeric'
    },
    w: {
      weekday: 'short'
    },
    W: {
      weekday: 'long'
    }
  },
  ko: {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    d: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    D: {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    day: {
      day: 'numeric'
    },
    f: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit'
    },
    F: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    },
    g: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    G: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    m: {
      month: 'long',
      day: '2-digit'
    },
    M: {
      month: '2-digit',
      day: '2-digit'
    },
    MM: {
      month: 'numeric'
    },
    t: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    T: {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    u: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    U: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    y: {
      year: 'numeric',
      month: 'narrow'
    },
    Y: {
      year: 'numeric',
      month: 'numeric'
    },
    w: {
      weekday: 'short'
    },
    W: {
      weekday: 'long'
    }
  },
  ja: {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    d: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    D: {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    day: {
      day: 'numeric'
    },
    f: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit'
    },
    F: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    },
    g: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    G: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    m: {
      month: 'long',
      day: '2-digit'
    },
    M: {
      month: '2-digit',
      day: '2-digit'
    },
    MM: {
      month: 'numeric'
    },
    t: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    T: {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    u: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    U: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    y: {
      year: 'numeric',
      month: 'narrow'
    },
    Y: {
      year: 'numeric',
      month: 'numeric'
    },
    w: {
      weekday: 'short'
    },
    W: {
      weekday: 'long'
    }
  }
};
const numberFormats = {
  en: {
    currency: {
      style: 'currency',
      currency: 'USD'
    }
  },
  ko: {
    currency: {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0, // set fraction digits to 0 to remove cents
      maximumFractionDigits: 2
    }
  },
  ja: {
    currency: {
      style: 'currency', currency: 'JPY', currencyDisplay: 'symbol'
    }
  },
  AED: {
    currency: {
      style: 'currency', currency: 'AED', currencyDisplay: 'symbol'
    }
  },
  AUD: {
    currency: {
      style: 'currency', currency: 'AUD', currencyDisplay: 'symbol'
    }
  },
  BDT: {
    currency: {
      style: 'currency', currency: 'BDT', currencyDisplay: 'symbol'
    }
  },
  BHD: {
    currency: {
      style: 'currency', currency: 'BHD', currencyDisplay: 'symbol'
    }
  },
  BND: {
    currency: {
      style: 'currency', currency: 'BND', currencyDisplay: 'symbol'
    }
  },
  BRL: {
    currency: {
      style: 'currency', currency: 'BRL', currencyDisplay: 'symbol'
    }
  },
  CAD: {
    currency: {
      style: 'currency', currency: 'CAD', currencyDisplay: 'symbol'
    }
  },
  CHF: {
    currency: {
      style: 'currency', currency: 'CHF', currencyDisplay: 'symbol'
    }
  },
  CLP: {
    currency: {
      style: 'currency', currency: 'CLP', currencyDisplay: 'symbol'
    }
  },
  CNY: {
    currency: {
      style: 'currency', currency: 'CNY', currencyDisplay: 'symbol'
    }
  },
  CZK: {
    currency: {
      style: 'currency', currency: 'CZK', currencyDisplay: 'symbol'
    }
  },
  DKK: {
    currency: {
      style: 'currency', currency: 'DKK', currencyDisplay: 'symbol'
    }
  },
  DZD: {
    currency: {
      style: 'currency', currency: 'DZD', currencyDisplay: 'symbol'
    }
  },
  EGP: {
    currency: {
      style: 'currency', currency: 'EGP', currencyDisplay: 'symbol'
    }
  },
  EUR: {
    currency: {
      style: 'currency', currency: 'EUR', currencyDisplay: 'symbol'
    }
  },
  GBP: {
    currency: {
      style: 'currency', currency: 'GBP', currencyDisplay: 'symbol'
    }
  },
  HKD: {
    currency: {
      style: 'currency', currency: 'HKD', currencyDisplay: 'symbol'
    }
  },
  HUF: {
    currency: {
      style: 'currency', currency: 'HUF', currencyDisplay: 'symbol'
    }
  },
  IDR: {
    currency: {
      style: 'currency', currency: 'IDR', currencyDisplay: 'symbol'
    }
  },
  ILS: {
    currency: {
      style: 'currency', currency: 'ILS', currencyDisplay: 'symbol'
    }
  },
  INR: {
    currency: {
      style: 'currency', currency: 'INR', currencyDisplay: 'symbol'
    }
  },
  JOD: {
    currency: {
      style: 'currency', currency: 'JOD', currencyDisplay: 'symbol'
    }
  },
  JPY: {
    currency: {
      style: 'currency', currency: 'JPY', currencyDisplay: 'symbol'
    }
  },
  KES: {
    currency: {
      style: 'currency', currency: 'KES', currencyDisplay: 'symbol'
    }
  },
  KRW: {
    currency: {
      style: 'currency', currency: 'KRW', currencyDisplay: 'symbol'
    }
  },
  KWD: {
    currency: {
      style: 'currency', currency: 'KWD', currencyDisplay: 'symbol'
    }
  },
  KZT: {
    currency: {
      style: 'currency', currency: 'KZT', currencyDisplay: 'symbol'
    }
  },
  LKR: {
    currency: {
      style: 'currency', currency: 'LKR', currencyDisplay: 'symbol'
    }
  },
  MNT: {
    currency: {
      style: 'currency', currency: 'MNT', currencyDisplay: 'symbol'
    }
  },
  MOP: {
    currency: {
      style: 'currency', currency: 'MOP', currencyDisplay: 'symbol'
    }
  },
  MXN: {
    currency: {
      style: 'currency', currency: 'MXN', currencyDisplay: 'symbol'
    }
  },
  MYR: {
    currency: {
      style: 'currency', currency: 'MYR', currencyDisplay: 'symbol'
    }
  },
  NOK: {
    currency: {
      style: 'currency', currency: 'NOK', currencyDisplay: 'symbol'
    }
  },
  NZD: {
    currency: {
      style: 'currency', currency: 'NZD', currencyDisplay: 'symbol'
    }
  },
  OMR: {
    currency: {
      style: 'currency', currency: 'OMR', currencyDisplay: 'symbol'
    }
  },
  PHP: {
    currency: {
      style: 'currency', currency: 'PHP', currencyDisplay: 'symbol'
    }
  },
  PKR: {
    currency: {
      style: 'currency', currency: 'PKR', currencyDisplay: 'symbol'
    }
  },
  PLN: {
    currency: {
      style: 'currency', currency: 'PLN', currencyDisplay: 'symbol'
    }
  },
  QAR: {
    currency: {
      style: 'currency', currency: 'QAR', currencyDisplay: 'symbol'
    }
  },
  RUB: {
    currency: {
      style: 'currency', currency: 'RUB', currencyDisplay: 'symbol'
    }
  },
  SAR: {
    currency: {
      style: 'currency', currency: 'SAR', currencyDisplay: 'symbol'
    }
  },
  SEK: {
    currency: {
      style: 'currency', currency: 'SEK', currencyDisplay: 'symbol'
    }
  },
  SGD: {
    currency: {
      style: 'currency', currency: 'SGD', currencyDisplay: 'symbol'
    }
  },
  THB: {
    currency: {
      style: 'currency', currency: 'THB', currencyDisplay: 'symbol'
    }
  },
  TRY: {
    currency: {
      style: 'currency', currency: 'TRY', currencyDisplay: 'symbol'
    }
  },
  TWD: {
    currency: {
      style: 'currency', currency: 'TWD', currencyDisplay: 'symbol'
    }
  },
  USD: {
    currency: {
      style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
    }
  },
  VND: {
    currency: {
      style: 'currency', currency: 'VND', currencyDisplay: 'symbol'
    }
  },
  ZAR: {
    currency: {
      style: 'currency', currency: 'ZAR', currencyDisplay: 'symbol'
    }
  }
};

export default new VueI18n({
  locale: 'ko',
  dateTimeFormats,
  numberFormats,
  messages: messageData
});
