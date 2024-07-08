import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";

// ==============================================================

// ==============================================================

const Link = forwardRef(({
  href,
  ...others
}, ref) => {
  return <RouterLink ref={ref} to={href} {...others} />;
});
export default Link;