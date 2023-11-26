import { ClerkProvider } from "@clerk/nextjs";
import { InterfaceContextProvider } from "@/context/InterfaceContext";
import { UserContextProvider } from "@/context/UserContext";
import { ToastContainer } from "react-toastify";
import { dark } from "@clerk/themes";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={dark}>
      <html className="bg-theme1" lang="en">
        <InterfaceContextProvider>
          <UserContextProvider>
            <body className="w-full h-screen">
              {children}
              <ToastContainer
                position="bottom-right"
                autoClose={8000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
            </body>
          </UserContextProvider>
        </InterfaceContextProvider>
      </html>
    </ClerkProvider>
  );
}
