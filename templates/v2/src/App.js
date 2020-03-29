import React, { Component } from "react";
import { hot } from "react-hot-loader";
import "./App.css";
import "bulma/css/bulma.css";

function App() {
  return (
    <>
      <nav
        className="navbar is-info"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container is-fluid">
          <div className="column is-one-fifth">
            <div className="navbar-brand">
              <a
                className="navbar-item brand-text has-text-weight-bold is-size-4"
                href="#"
              >
                COVID19-PY
              </a>
              <a
                role="button"
                className="navbar-burger burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
              >
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="column">
            <div className="navbar-menu">
              <div className="navbar-start">
                {/* <a className="navbar-item">Home</a>
            <a className="navbar-item">Documentation</a>
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">More</a>
              <div className="navbar-dropdown">
                <a className="navbar-item">About</a>
                <a className="navbar-item">Jobs</a>
                <a className="navbar-item">Contact</a>
                <hr className="navbar-divider" />
                <a className="navbar-item">Report an issue</a>
              </div>
            </div> */}
                <a class="navbar-item has-text-weight-bold is-size-5" href="#">
                  Gestión de Denuncias y Reportes
                </a>
              </div>
              {/* <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <a className="button is-primary">
                  <strong>Sign up</strong>
                </a>
                <a className="button is-light">Log in</a>
              </div>
            </div>
          </div> */}
            </div>
          </div>
        </div>
      </nav>
      <div className="container is-fluid">
        <div className="columns">
          <div className="column is-one-fifth">
            <article className="panel is-info">
              <p className="panel-heading">Filtros</p>
              {/* <p className="panel-tabs">
              <a className="is-active">All</a>
              <a>Public</a>
              <a>Private</a>
              <a>Sources</a>
              <a>Forks</a>
            </p> */}
              {/* <div className="panel-block">
                <p className="control has-icons-left">
                  <input
                    className="input is-info"
                    type="text"
                    placeholder="Search"
                  />
                  <span className="icon is-left">
                    <i className="fas fa-search" aria-hidden="true" />
                  </span>
                </p>
              </div> */}
              <a className="panel-block is-active">
                <span className="panel-icon">
                  <i className="fas fa-book" aria-hidden="true" />
                </span>
                <input type="checkbox"></input> Aglomeración
              </a>
              <a className="panel-block">
                <span className="panel-icon">
                  <i className="fas fa-book" aria-hidden="true" />
                </span>
                <input type="checkbox"></input> Incumpl. (medidas sanitarias)
              </a>
              <a className="panel-block">
                <span className="panel-icon">
                  <i className="fas fa-book" aria-hidden="true" />
                </span>
                <input type="checkbox"></input> Incumpl. (cuarentena)
              </a>
              <a className="panel-block">
                <span className="panel-icon">
                  <i className="fas fa-book" aria-hidden="true" />
                </span>
                <input type="checkbox"></input> Reporte de Síntomas
              </a>
            </article>
          </div>
          <div className="column is-three-fifths">
            <div className="box">Mapa</div>
          </div>
          <div className="column">
            <div className="box">
              <div className="content">
                <p class="title">Información de denuncia</p>

                <p>
                  <strong>Tipo de denuncia:</strong> aglomeración
                </p>
                <p>
                  <strong>Denunciante:</strong> CCC
                </p>
                <p>
                  <strong>Observaciones:</strong> Local no cumple con medidas
                  sanitarias
                </p>
                <button class="button is-primary is-rounded">
                  Marcar como atendido
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default hot(module)(App);
