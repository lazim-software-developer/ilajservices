// import { Box } from "@mui/material";
// import Header from "../components/header-new";
// import Footer from "../components/footer";
import { useEffect, useRef } from "react";

const LicenseAgreement = () => {
  const iframeRef = useRef(null);
  useEffect(() => {
    const iframe = iframeRef.current;

    iframe.onload = function(){
        iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    }
  } , []);
  return (
    <>
    {/* <Box >
    <Header />
    <Box mt={16} className='container'> */}
    <iframe
        ref={iframeRef}
        src="/documents/END_USER_LICENSE_AGREEMENT.html"
        width="100%"
        height="100vh"
        style={{
          overflow: "hidden",
        }}
        scrolling="no"
        seamless="seamless"
      />
    {/* </Box> */}
    
     {/* <footer style={{ marginTop: "50px" }}>
       <Footer />
     </footer>
   </Box> */}
  </>
  );
};
export default LicenseAgreement;
