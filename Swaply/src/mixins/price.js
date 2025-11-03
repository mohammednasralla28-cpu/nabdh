// mixins/price.js
const usePrice = () => {
  const calculatePriceRating = (merchantPrice, recentPrices, backendRating = null) => {
    // If backend provides rating, use it directly
    if (backendRating) {
      return getPriceRatingFromBackend(backendRating);
    }

    // Fallback to frontend calculation if no backend rating
    if (!recentPrices || recentPrices.length < 5) {
      return {
        rating: "بلا تقييم",
        message: "Insufficient market data to determine fair price.",
        style:
          "text-gray-600 font-normal bg-gray-50 dark:bg-gray-700 dark:text-gray-300",
      };
    }

    const sortedPrices = [...recentPrices].sort((a, b) => a - b);
    const q1 = calculatePercentile(sortedPrices, 25);
    const medianPrice = calculatePercentile(sortedPrices, 50);
    const q3 = calculatePercentile(sortedPrices, 75);
    const iqr = q3 - q1;

    let lowerBound = q1 - 1.0 * iqr;
    lowerBound = Math.max(0, lowerBound);
    const upperBound = q3 + 1.0 * iqr;

    let rating;
    let style;
    if (merchantPrice <= medianPrice) {
      rating = "عادل";
      style =
        "text-yellow-700 font-normal bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400";
    } else if (merchantPrice <= upperBound) {
      rating = "جيد";
      style =
        "text-green-700 font-normal bg-green-50 dark:bg-green-900/30 dark:text-green-400";
    } else {
      rating = "مرتفع";
      style =
        "text-red-700 font-normal bg-red-50 dark:bg-red-900/30 dark:text-red-400";
    }
    return { rating, message: "", style };
  };

  const getPriceRatingFromBackend = (backendRating) => {
    switch (backendRating) {
      case 'best':
        return {
          rating: "عادل",
          style: "text-yellow-700 font-normal bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400"
        };
      case 'good':
        return {
          rating: "جيد", 
          style: "text-green-700 font-normal bg-green-50 dark:bg-green-900/30 dark:text-green-400"
        };
      case 'high':
        return {
          rating: "مرتفع",
          style: "text-red-700 font-normal bg-red-50 dark:bg-red-900/30 dark:text-red-400"
        };
      case 'no_rating':
      default:
        return {
          rating: "بلا تقييم",
          style: "text-gray-600 font-normal bg-gray-50 dark:bg-gray-900/30 dark:text-gray-400"
        };
    }
  };

  const calculatePercentile = (sortedArray, percentile) => {
    const index = (percentile / 100) * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    
    if (lower === upper) {
      return sortedArray[lower];
    }
    
    return sortedArray[lower] + (index - lower) * (sortedArray[upper] - sortedArray[lower]);
  };

  return { calculatePriceRating, getPriceRatingFromBackend };
};
export default usePrice;
