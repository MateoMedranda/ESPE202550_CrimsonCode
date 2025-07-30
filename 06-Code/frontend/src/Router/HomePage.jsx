import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/menu.css';
import '../css/project_managment.css';

const HomePage = () => {
  return (
    <div id="container" className="container mt-4 fade-in">
      <h1 className="letter_quicksand text-center text-light fw-bold">Bienvenido!</h1>

      <div className="row home_container">
        <div className="col-6 text-center">
          <img
            className="rounded shadow"
            src="/img/Macas.png"
            width="130%"
            alt="Macas"
          />
        </div>

        <div className="col-6 bg-light rounded p-4 shadow home_letter" style={{ color: 'rgb(21, 44, 26)' }}>
          <h2 className="letter_quicksand fw-bold">¿Qué significa BIOSIGMA?</h2>
          <p className="letter_quicksand fs-5">
            Nace de la unión de palabras que enfocan nuestro trabajo y filosofía:
            Biología, Sistemas Integrados de Gestión y Medio Ambiente.
          </p>
          <p className="letter_quicksand fs-5">
            Conceptualmente la letra griega Sigma significa la suma o unión de un todo
            y el conocimiento, por tanto, con nuestro trabajo pretendemos
            “Sumar y generar conocimiento”.
          </p>
          <p className="letter_quicksand fs-5">
            Nuestro símbolo es el BUHO, animal que tiene un significado de conocimiento
            y sabiduría y que enfoca gráficamente nuestro objetivo de crecimiento
            y mejoramiento continuo.
          </p>
          <img src="/img/biosigma_logo.png" alt="Biosigma Logo" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
