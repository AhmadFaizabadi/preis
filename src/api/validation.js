/* eslint-disable max-len */
import { useI18n } from "vue-i18n";
export default function useValidation() {
  const { t } = useI18n()
  function required(value, field) {
    return !!value || `${field} ${t('isRequired')}.`;
  }

  function email(value) {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(value) || t('emailAddressIsNotValid');
  }

  function mobileNumber(value) {
    const regex = /^0\d{10}$/;
    return regex.test(value) || t('mobileNumberIsNotValid');
  }


  return {
    required,
    email,
    mobileNumber,
  };
}
