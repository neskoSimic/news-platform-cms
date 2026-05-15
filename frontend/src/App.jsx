import { Route, Routes } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import CategoriesPage from "./pages/cms/CategoriesPage";
import NewsPage from "./pages/cms/NewsPage";
import UsersPage from "./pages/cms/UsersPage";
import CategoryPage from "./pages/public/CategoryPage";
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import MostReadPage from "./pages/public/MostReadPage";
import NewsDetailsPage from "./pages/public/NewsDetailsPage";
import SearchNewsPage from "./pages/public/SearchNewsPage";
import TagNewsPageShow from "./pages/public/TagNewsPageShow";

function App() {
  return (
    <div>
      <NavbarComponent />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/most-read" element={<MostReadPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchNewsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/news/:id" element={<NewsDetailsPage />} />
          <Route path="/tag/:id" element={<TagNewsPageShow />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/category/:id" element={<NewsPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
