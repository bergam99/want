import { Outlet } from "react-router-dom";
// import Loader from "../../components/Loader/Loader";

const RootLayout = () => {
  // const navigation = useNavigation();

  return (
    <main>
      {/* {navigation.state === "loading" && <Loader />} */}
      <Outlet />
    </main>
  );
};

export default RootLayout;
