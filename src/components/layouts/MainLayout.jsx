import Header from "../Header/header";
import Footer from "../Footer/footer";
const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
