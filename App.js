import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./src/components/header";
import Body from "./src/components/body";
import Footer from "./src/components/footer";

const AppLayout = () => {
  return (
    <>
      <Header />
      <Body />
      <Footer />
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppLayout />);
