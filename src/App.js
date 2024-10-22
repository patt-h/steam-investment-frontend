import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import { useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import MainPage from "./scenes/mainpage/MainPage";
import ConfirmAccount from "./scenes/confirmpage";
import ItemsPage from "./scenes/itemspage";
import PriceHistory from "./scenes/pricehistory";
import ItemHistoryPage from "./scenes/chartpage";
import FinancesPage from "./scenes/financespage";
import SuggestedPage from "./scenes/suggestedpage";
import FAQ from "./scenes/faq";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  const hideSidebarAndTopbar = location.pathname === '/' || location.pathname === '/confirm-account';;

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <div className="app">
        {!hideSidebarAndTopbar && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!hideSidebarAndTopbar && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/confirm-account" element={<ConfirmAccount />} />
              <Route path="/home" element={<ProtectedRoute element={ItemsPage} />} />
              <Route path="/history" element={<ProtectedRoute element={PriceHistory} />} />
              <Route path="/history/:marketHashName" element={<ProtectedRoute element={ItemHistoryPage} />} />
              <Route path="/finances" element={<ProtectedRoute element={FinancesPage} /> } />
              <Route path="/suggested" element={<ProtectedRoute element={SuggestedPage} />} />
              <Route path="/faq" element={<ProtectedRoute element={FAQ} />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
