// mixins/formats.js
const useFormats = () => {
  const currencyFormat = (
    amount,
    type = "fixed",
    locale = "en-US",
    currency = "USD"
  ) => {
    if (type === "percentage") {
      return `${amount}%`;
    }

    const minimumFractionDigits = currency === "ILS" ? 0 : 2;

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits,
      maximumFractionDigits: minimumFractionDigits,
    }).format(amount);
  };
  const calculatePriceAfterOffer = (product) => {
    let price = parseFloat(product.price);

    if (product.offer) {
      const offer = product.offer;

      if (offer.discount_price) {
        price -= parseFloat(offer.discount_price);
      } else if (offer.discount_percent) {
        price -= price * (parseFloat(offer.discount_percent) / 100);
      }
    }

    return Math.max(price, 0);
  };
  const getRelativeTime = (date) => {
    const rtf = new Intl.RelativeTimeFormat("ar", { numeric: "auto" });
    const now = new Date();
    const diff = (new Date(date) - now) / 1000; // فرق بالثواني

    const minutes = Math.round(diff / 60);
    const hours = Math.round(diff / 3600);
    const days = Math.round(diff / 86400);

    if (Math.abs(days) > 0) return rtf.format(days, "day");
    if (Math.abs(hours) > 0) return rtf.format(hours, "hour");
    if (Math.abs(minutes) > 0) return rtf.format(minutes, "minute");
    return rtf.format(Math.round(diff), "second");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const cleanId = (id) => {
    return Number(id.toString().replace("#", "").trim());
  };

  const timeAgo = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const updatedAt = new Date(dateString);
    const diffInSeconds = Math.floor((now - updatedAt) / 1000);

    if (diffInSeconds < 60) {
      return `منذ ${diffInSeconds} ثانية`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `منذ ${minutes} دقيقة`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `منذ ${hours} ساعة`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `منذ ${days} يوم`;
    } else if (diffInSeconds < 31104000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `منذ ${months} شهر`;
    } else {
      const years = Math.floor(diffInSeconds / 31104000);
      return `منذ ${years} سنة`;
    }
  };

  return {
    currencyFormat,
    formatDate,
    cleanId,
    getRelativeTime,
    calculatePriceAfterOffer,
    timeAgo,
  };
};

export default useFormats;
