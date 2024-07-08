import { useEffect } from "react";
import LandingPageView from "page-sections/landing/page-view";
import useNavigate from "hooks/useNavigate";

const LandingPage = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/dashboard"); });
  return <LandingPageView />;
};
export default LandingPage;