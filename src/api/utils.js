import { Notify } from "quasar";
/**
 * Validate required field
 * @param  {String} value Inputed value
 * @param  {String} label Start of the error string message
 * @returns {Boolean | String } Returns Boolean value if true or Error string if false
 */
const validateRequired = (value, label) =>
  !!value || `${label} is a required field`;

/**
 * Validate format of sent email string
 * @param  {String} email Inputed address
 * @returns {Boolean | String } Returns Boolean value if true or Error string if false
 */
const validateEmail = (email) => {
  const pattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return pattern.test(email) || "Please enter a valid email address";
};

/**
 * Validate number of password charactes
 * @param  {String} value Inputed value
 * @returns {Boolean | String } Returns Boolean value if true or Error string if false
 */
const validatePassword = (value, minimum = 6) =>
  value.length >= minimum ||
  `Password must containt at least ${minimum} characters`;

/**
 * Validate format of sent phone number string
 * @param  {String} phoneNumber Inputed phone number
 * @returns {Boolean | String } Returns Boolean value if true or Error string if false
 */
const validatePhoneNumber = (phonenumber) => {
  // Regex to check valid
  // International Phone Numbers
  let pattern = new RegExp(/\+?[0-9]+([0-9]|\/|\(|\)|\-| ){10,}/);
  return (
    pattern.test(phonenumber) ||
    "Please enter a valid international phone number"
  );
};
const postedSuccessfully = (msg) => {
  Notify.create({ type: "positive", message: msg || "posted" });
};

const uuidv1 = (pre = undefined) =>
  "xx-xxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return (pre ? `${pre}-` : "") + v.toString(16);
  });

const uuidv4 = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
const capitalize = (name) =>
  name
    ?.split(" ")
    .reduce((t, c) => (t += c.charAt(0).toUpperCase() + c.slice(1) + " "), "")
    .trim();
const germanDate = (d) => d?.substring(0, 10).split("-").reverse().join(".");
export {
  validateRequired,
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  postedSuccessfully,
  uuidv1,
  uuidv4,
  capitalize,
  germanDate,
};
