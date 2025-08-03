// src/utils/toastUtils.js
import { toast } from "react-toastify";

export const showSuccess = (message = "Success") => {
  toast.success(message);
};

export const showError = (message = "Something went wrong") => {
  toast.error(message);
};

export const showInfo = (message = "Info message") => {
  toast.info(message);
};

export const showWarning = (message = "Warning") => {
  toast.warning(message);
};
