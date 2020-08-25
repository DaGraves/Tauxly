const INTERACTION_TYPES = {
  LIKE: 'LIKE',
  COMMENT: 'COMMENT',
};

const DEFAULT_PROFILE_PICTURE = 'default_profile';

const PROFILE_IMAGE_OPTIONS = {
  compressImageQuality: 0.4,
  compressImageMaxHeight: 256,
  compressImageMaxWidth: 256,
  cropping: true,
  width: 256,
  height: 256,
};

const IAP_SKU = 'photo_submission_100';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const USERNAME_REGEX = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,50}[a-zA-Z0-9]$/;

const VALIDATIONS = {
  email: text => EMAIL_REGEX.test(String(text).toLowerCase()),
  paypalEmail: text => EMAIL_REGEX.test(String(text).toLowerCase()),
  username: text => USERNAME_REGEX.test(String(text).toLowerCase()),
  password: text => text.length >= 6,
  passwordConfirm: text => text.length >= 6,
};

export {
  INTERACTION_TYPES,
  DEFAULT_PROFILE_PICTURE,
  PROFILE_IMAGE_OPTIONS,
  IAP_SKU,
  VALIDATIONS,
};
