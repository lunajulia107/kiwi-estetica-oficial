import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    id: 1,
    title: 'Hidratação Facial',
    category: 'Facial',
    imageUrl: '/images/catalogo/hidratacao-facial.png',
    indication: "Pele ressecada, sem viço ou com aspecto cansado.",
    link: '/catalogo#hidratacao-facial'
  },
  {
    id: 2,
    title: 'Limpeza de Pele',
    category: 'Facial',
    imageUrl: '/images/catalogo/limpeza-pele.png',
    indication: "Controle de oleosidade, acne e remoção de cravos.",
    link: '/catalogo#limpeza-pele'
  },
  {
    id: 3,
    title: 'Drenagem Linfática',
    category: 'Corporal',
    imageUrl: '/images/catalogo/drenagem-linfatica.png',
    indication: "Retenção de líquidos, inchaço e melhora da circulação.",
    link: '/catalogo#drenagem-linfatica'
  },
  {
    id: 4,
    title: 'Massagem relaxante',
    category: 'Corporal',
    imageUrl: '/images/catalogo/massagem-relaxante.png',
    indication: "Estresse, tensão muscular e fadiga física.",
    link: '/catalogo#massagem-relaxante'
  },
  {
    id: 5,
    title: 'Acunputura',
    category: 'Terapias',
    imageUrl: '/images/catalogo/acupuntura.png',
    indication: "Alívio de dores, estresse, ansiedade, insônia e problemas musculares.",
    link: '/catalogo#acunputura'
  },
  {
    id: 6,
    title: 'Ventosaterapia',
    category: 'Terapias',
    imageUrl: '/images/catalogo/ventosaterapia.png',
    indication: "Dores musculares, pontos de tensão, celulite, retenção de líquidos e osteoartrite.",
    link: '/catalogo#ventosaterapia'
  }
];

function ServicesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === services.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? services.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === services.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getVisibleServices = () => {
    const numCards = services.length;
    const cardsToShow = 4;
    const visible = [];

    for (let i = 0; i < cardsToShow; i++) {
      visible.push(services[(currentIndex + i) % numCards]);
    }

    return visible;
  };

  return (
    <motion.section
      className="d-flex flex-column gap-3 py-5"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ amount: 0.4 }}
      transition={{ duration: 0.7 }}
    >
      <div className="align-items-start container d-flex flex-column gap-3 text-start">
        <h2 className="fs-1 fw-semibold text-forest-green">
          Nossos principais <br />
          <span className="fw-bold">Tratamentos & Terapias</span>
        </h2>

        <div className="d-flex flex-row justify-content-between w-100">
          <p className="bg-forest-green d-flex p-2 pe-3 ps-3 rounded-5 text-white">
            by Taís Bonilha
          </p>
          <div className="align-items-center d-flex flex-row gap-2 justify-content-between">
            <button
              aria-label="Anterior"
              className="btn btn-border-lime-green d-none d-md-flex p-2 pb-1 pt-1 rounded-circle text-lime-green"
              onClick={goToPrevious}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              aria-label="Próximo"
              className="btn btn-border-lime-green d-none d-md-flex p-2 pb-1 pt-1 rounded-circle text-lime-green"
              onClick={goToNext}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="container container-sm-fluid mt-4 overflow-hidden px-0">
        <ul className="row flex-nowrap">
          {getVisibleServices().map((service) => (
            <li key={service.id} className="col-12 col-md-5 col-lg-4">
              <div className="align-items-start bg-white d-flex flex-column h-100 p-3 rounded-4 w-100">
                <img
                  alt={service.title}
                  className="card-img-top mb-3 rounded-4"
                  src={service.imageUrl}
                  style={{
                    maxHeight: "525px",
                    objectFit: "cover",
                    width: "100%"
                  }}
                />
                <p className="badge bg-brown fw-medium rounded-4">
                  {service.category}
                </p>
                <h5 className="mt-2 text-forest-green">{service.title}</h5>
                <p className="flex-grow-1 mt-2 text-forest-green">
                  {service.indication}
                </p>
                <a
                  className="fw-medium mt-3 text-decoration-none text-lime-green"
                  href={service.link}
                >
                  Mais detalhes
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}

export default ServicesCarousel;
