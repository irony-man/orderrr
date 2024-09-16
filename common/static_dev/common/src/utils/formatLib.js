export default {
  formatDate(value, locale = 'en-US', timeZone = 'Asia/Kolkata') {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);
    const options = { dateStyle: 'long', timeZone: timeZone };
    const formatedDate = new Intl.DateTimeFormat(locale, options).format(date);
    return formatedDate;
  },
  formatDateTime(value, locale = 'en-IN', timeZone = 'Asia/Kolkata') {
    if (!value) {
      return '';
    }

    const date = new Date(value + ' UTC');
    const options = { timeZone: timeZone };
    return date.toISOString(locale, options);
  },
  formatDateTimeAsString(value, locale = 'en-IN', timeZone = 'Asia/Kolkata') {
    if (!value) {
      return '';
    }

    const date = new Date(value + ' UTC');
    const options = { dateStyle: 'full', timeStyle: 'long', timeZone: timeZone };
    return new Intl.DateTimeFormat(locale, options).format(date);
  },
  formatTime(value, locale = 'en-IN', timeZone = 'Asia/Kolkata') {
    if (!value) {
      return '';
    }

    const date = new Date(value + ' UTC');
    const options = { hour: '2-digit', minute: '2-digit', timeZone: timeZone };
    return new Intl.DateTimeFormat(locale, options).format(date);
  },
  formatNumber(
    value = 0,
    locale = 'en-IN',
    minDecimal = 2,
    maxDecimal = 2,
    notation = 'standard'
  ) {
    if(!value) {
      value = 0;
    }
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: minDecimal,
      maximumFractionDigits: maxDecimal,
      notation: notation,
      compactDisplay: 'short',
    }).format(value);
  },
  formatInteger(value = 0, locale = 'en-IN', notation = 'standard') {
    return this.formatNumber(value, locale, 0, 0, notation);
  },
  formatCurrency(
    value = 0,
    currency = 'INR',
    locale = 'en-IN',
    minDecimal = 2,
    maxDecimal = 4
  ) {
    // TODO: Why does not this work with Google Fonts

    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: minDecimal,
      maximumFractionDigits: maxDecimal,
      style: 'currency',
      currency: currency,
    }).format(value);
  },
  formatPercentage(value = 0, locale = 'en-IN', maxDecimal = 2) {
    return `${this.formatNumber(value * 100, locale, maxDecimal)}%`;
  },
  formatHumanNumber(value = 0, locale = 'en-IN') {
    return this.formatNumber(value, locale, 0, 0, 'compact');
  },
};
