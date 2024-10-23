import countries from 'i18n-iso-countries';
import currencies from 'currency-codes';

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

export const getCurrencyByCountry = (countryName: string): string | null => {
  const countryCode = countries.getAlpha2Code(countryName, 'en');
  if (!countryCode) return null;

  const currencyData = currencies.country(countryCode);
  return currencyData && currencyData.length > 0 ? currencyData[0].code : null;
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    const response = await fetch(
      `https://api.currencyapi.com/v3/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCY_API_KEY}&base_currency=${fromCurrency}&currencies=${toCurrency}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch conversion rate');
    }
    const data = await response.json();
    const rate = data.data[toCurrency].value;
    return amount * rate;
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
};

export const commonCurrencies = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'VND', 'THB'
];

export async function getCurrencyConversion(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const data = await response.json();
    const rate = data.rates[toCurrency];
    return amount * rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
}
