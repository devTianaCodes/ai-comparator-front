import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext";
import DefaultLayout from "./layouts/DefaultLayout";
import FavoritesPage from "./pages/FavoritesPage";
import ModelCompare from "./pages/ModelCompare";
import ModelDetail from "./pages/ModelDetail";
import ModelList from "./pages/ModelList";
import "./App.css";


function App() {

  return (

    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            
            <Route path="/" element={<ModelList />}
            /> 
            <Route path="/models/:id" element={<ModelDetail />}
            />
            <Route path="/favorites" element={<FavoritesPage />}
            />
            <Route path="/compare" element={<ModelCompare />} 
            />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
