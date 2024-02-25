import MainQuery from "./components/MainQuery";
import { Box, Container, Heading } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function App() {
  return (
    <Box>
      <Heading align="center" size="8" mt="9" mb="9">
        SNS Query Tool
      </Heading>
      <Container size="2">
        <MainQuery />
      </Container>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClic={false}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
    </Box>
  );
}

export default App;
