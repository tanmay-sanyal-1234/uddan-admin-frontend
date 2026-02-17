import { Oval, ThreeDots } from "react-loader-spinner";

const FullPageLoader = () => {
  return (
    <div style={styles.wrapper}>
      {/* <Oval
        height={80}
        width={80}
        color="#2563eb"
        secondaryColor="#e9f4ff"
        strokeWidth={4}
        strokeWidthSecondary={4}
        ariaLabel="loading"
        visible={true}
      /> */}
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#2563eb"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

const styles = {
  wrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
};

export default FullPageLoader;
