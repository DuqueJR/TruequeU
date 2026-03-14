export interface ListingValidation {
  valid: boolean;
  message: string;
}

const TITLE_MIN = 3;
const TITLE_MAX = 100;
const DESCRIPTION_MIN = 10;
const DESCRIPTION_MAX = 1000;
const PRICE_MIN = 0;
const PRICE_MAX = 999999;

export function validateListing(data: {
  title: string;
  description: string;
  price: string;
}): ListingValidation {
  const title = data.title.trim();
  if (title.length < TITLE_MIN) {
    return { valid: false, message: `El título debe tener al menos ${TITLE_MIN} caracteres` };
  }
  if (title.length > TITLE_MAX) {
    return { valid: false, message: `El título no puede superar ${TITLE_MAX} caracteres` };
  }

  const description = data.description.trim();
  if (description.length < DESCRIPTION_MIN) {
    return { valid: false, message: `La descripción debe tener al menos ${DESCRIPTION_MIN} caracteres` };
  }
  if (description.length > DESCRIPTION_MAX) {
    return { valid: false, message: `La descripción no puede superar ${DESCRIPTION_MAX} caracteres` };
  }

  const priceNum = Number(data.price);
  if (isNaN(priceNum)) {
    return { valid: false, message: "El precio debe ser un número válido" };
  }
  if (priceNum < PRICE_MIN) {
    return { valid: false, message: "El precio no puede ser negativo" };
  }
  if (priceNum > PRICE_MAX) {
    return { valid: false, message: `El precio no puede superar $${PRICE_MAX.toLocaleString()}` };
  }

  return { valid: true, message: "" };
}
