import { NavLink, Outlet } from "react-router-dom";


function DefaultLayout() {

  return (
    <>
      <header className="app-header">
        <nav className="header-nav-left">
          <NavLink to="/">
            Modelli
          </NavLink>
        </nav>

        <h1>Comparatore IA</h1>

        <nav className="header-nav-right">
          <NavLink to="/favorites">
            Preferiti
          </NavLink>
        </nav>
      </header>

      <main className="page">
        <Outlet />
      </main>
    </>
  );
}

export default DefaultLayout;
