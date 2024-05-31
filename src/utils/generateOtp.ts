import crypto from "crypto";


export const generateRandomString = (length: number): string => {
  const digits = "012345678912";
  let OTP = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    OTP += digits[randomIndex];
  }

  return OTP;
};
