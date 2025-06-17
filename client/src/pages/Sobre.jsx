import { motion } from "framer-motion";

const services = [ 
    {
        id: 1,
        imageUrl: '/images/catalogo/limpeza-pele.png',
        title: 'Estética Avançada',
        paragraph: 'Especialização em tratamentos faciais e corporais com foco em rejuvenescimento, hidratação profunda e técnicas não invasivas.',
    },
    {
        id: 2,
        imageUrl: '/images/catalogo/drenagem-linfatica.png',
        title: 'Massoterapia',
        paragraph: 'Formação completa em massagens terapêuticas, relaxantes e drenagem linfática, promovendo equilíbrio entre corpo e mente.'
    },
    {
        id: 3,
        imageUrl: '/images/catalogo/aromaterapia.png',
        title: 'Aromaterapia',
        paragraph: 'Capacitação no uso terapêutico de óleos essenciais para auxiliar no bem-estar físico, emocional e energético.'
    }
];

const Sobre = () => {
  return (
    <> 
        <section
        className="container py-5"
        aria-label="Apresentação da profissional Taís Bonilha"
        >
            <div className="row align-items-center">
                <motion.article
                className="col-md-6 text-center text-md-start"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                >
                <header>
                    <h2 className="fs-1 fw-medium text-forest-green mb-4">
                    Sobre a profissional <br />
                    <span className="fw-bold">Taís Bonilha</span>
                    </h2>
                </header>
                <p className="col-10 fw-normal lead text-forest-green">
                    Olá, sou <strong>Taís Bonilha</strong>, esteticista e massoterapeuta
                    dedicada a oferecer cuidados personalizados que valorizam a saúde, a
                    beleza e o bem-estar. Minha trajetória inclui experiências em clínicas
                    renomadas, onde aprimorei técnicas e atuei com compromisso e excelência.
                </p>
                <br />
                <p className="col-10 fw-normal lead text-forest-green">
                    Decidi abrir meu próprio espaço para proporcionar um atendimento ainda
                    mais humanizado, focado nas necessidades individuais de cada cliente.
                    Acredito que o cuidado estético vai além da aparência — é um momento de
                    equilíbrio para corpo e mente.
                </p>
                </motion.article>

                <motion.div
                className="col-md-6 text-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                >
                <img
                    src="/images/sobre-nos/tais-bonilha.png"
                    alt="Foto da profissional Taís Bonilha"
                    className="img-fluid rounded-4 w-100"
                    style={{ maxHeight: "500px", objectFit: "cover" }}
                />
                </motion.div>
            </div>
        </section>


        <section
            className="bg-forest-green py-5 ps-4 pe-4 ps-lg-0 pe-lg-0 text-light"
            aria-label="Formações Acadêmicas"
            >
            <div className="container">
                <div className="align-items-center row py-4">
                <div className="col-12 col-xxl-3 mb-4 mb-xl-0">
                    <h2 className="fs-2 fw-bold text-white mb-4">
                        Formações  <br />
                        Acadêmicas 
                    </h2> 
                </div>

                {/* Formação 1 */}
                <article className="col-12 col-xl-3 col-xxl-3 mb-4 mb-xl-0 border-start border-light border-opacity-10">
                    <h4 className="fw-bold mb-0 ps-lg-3">Técnica em Estética e Cosmetologia</h4>
                    <p className="mb-0 mt-1 ps-lg-3 small text-lime-green">Centro Universitário Senac</p>
                </article>

                {/* Formação 2 */}
                <article className="col-12 col-xl-3 col-xxl-3 mb-4 mb-xl-0 border-start border-light border-opacity-10">
                    <h4 className="fw-bold mb-0 ps-lg-3">Tecnóloga em Massoterapia</h4>
                    <p className="mb-0 mt-1 ps-lg-3 small text-lime-green">Universidade São Judas Tadeu</p>
                </article>

                {/* Formação 3 */}
                <article className="col-12 col-xl-3 col-xxl-3 mb-4 mb-xl-0 border-start border-light border-opacity-10">
                    <h4 className="fw-bold mb-0 ps-lg-3">Acupuntura e Terapias Holísticas</h4>
                    <p className="mb-0 mt-1 ps-lg-3 small text-lime-green">Instituto IBRAM</p>
                </article>
                </div>
            </div>
        </section>
 
        <section className="container mb-5 mt-5 py-5">
            <div className="align-items-center d-flex flex-column flex-lg-row gap-5"> 
                <div className="col-lg-6 overflow-hidden position-relative rounded-4">
                    <div className="bg-dark bg-opacity-50 h-100 position-absolute start-0 top-0 w-100 z-1"></div>

                    <img
                    alt="Mulher com sombra no rosto"
                    className="img-fluid"
                    src="/images/home/kiwi-estetica.png"
                    />
                </div>

                <div className="align-items-start col-lg-6 d-flex flex-column gap-3">
                    <h2 className="fs-1 fw-semibold text-forest-green">
                    Meu <span className="fw-bold">Espaço</span>
                    </h2>
                    
                    <p className="lead fw-normal mb-4 text-forest-green text-start">
                        Localizado em um ambiente tranquilo e acolhedor, o espaço foi planejado 
                        para proporcionar conforto, segurança e bem-estar desde o primeiro momento.
                        <br /> 
                        Cada detalhe foi pensado para oferecer uma experiência única e personalizada, 
                        onde você pode relaxar e se cuidar com tranquilidade e privacidade.
                    </p>

                    <div className="text-start">
                    <a
                        className="btn btn-lime-green fs-5 pe-4 ps-4 rounded-pill text-white"
                        href="/sobre-nos"
                    >
                        Saiba mais
                    </a>
                    </div>
                </div>
            </div>
        </section>  

        <section className="d-flex flex-column gap-3 py-5">
            <div className="align-items-start container d-flex flex-column gap-3 text-start">
                <h2 className="fs-1 fw-semibold text-forest-green">
                    Experiência <br /> <span className="fw-bold">Profissional</span>
                </h2>

                <p className="badge bg-forest-green fs-6 fw-normal pe-3 ps-3 rounded-4">by Taís Bonilha</p>
            </div>

            <div className="container container-sm-fluid mt-4 px-0">
                <div className="g-3 row">
                    {services.map((service) => (
                        <div key={service.id} className="col-12 col-md-6 col-lg-4">
                            <div className="bg-sage-green card border-0 h-100 rounded-4 text-white overflow-hidden">
                                <img
                                    alt={service.title}
                                    className="card-img-top"
                                    src={service.imageUrl}
                                    style={{ objectFit: 'cover', height: '524px' }}
                                /> 

                                <div className="align-items-start card-img-overlay d-flex flex-column gap-2 
                                                justify-content-end p-4 text-forest-green">
                                    <h5 className="card-title fw-bold mb-0 text-uppercase">{service.title}</h5>
                                    <p className="fw-normal lead mb-4 text-start">{service.paragraph}</p> 
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <motion.section
        className="container mt-5"
        style={{ marginBottom: "-24px" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-sage-green d-flex flex-column flex-xl-row gap-4 p-5 position-relative rounded-4 overflow-hidden">
          <div className="background-circles"></div>

          <div
            className="col-12 col-xl-8 d-flex flex-column gap-3 position-relative"
            style={{ zIndex: 1 }}
          >
            <h2 className="fs-1 text-forest-green">
              Cuidados <br />
              <span className="fw-bold">Pré-Procedimento</span>
            </h2>

            <p className="fw-normal lead text-forest-green">
              Antes do tratamento, informe seu histórico de saúde, alergias ou uso de medicação.
              Evite sol intenso e produtos irritantes na região a ser tratada por 2 dias antes.
            </p>
          </div>

          <ul
            className="col-12 col-xl-4 d-flex flex-wrap gap-3 justify-content-start justify-content-xl-center p-0 position-relative"
            style={{ zIndex: 1 }}
          >
            {[
              { src: "./images/catalogo/certificados/abihpec.png", alt: "Certificado ABIHPEC", label: "ABIHPEC" },
              { src: "./images/catalogo/certificados/anvisa.png", alt: "Certificado ANVISA", label: "ANVISA" },
              { src: "./images/catalogo/certificados/crueltyfree.png", alt: "Certificado Cruelty Free", label: "Cruelty Free" },
              { src: "./images/catalogo/certificados/iso9001.png", alt: "Certificado ISO 9001", label: "ISO 9001" }
            ].map((cert, index) => (
              <li
                key={index}
                className="align-items-center bg-white d-flex flex-column justify-content-center p-3 rounded-4 text-center"
                style={{ width: "140px", height: "100px" }}
              >
                <img
                  src={cert.src}
                  alt={cert.alt}
                  className="img-fluid mb-2"
                  style={{ maxHeight: "45px", objectFit: "contain" }}
                />
                <small className="fw-semibold text-forest-green">{cert.label}</small>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>
    </>
  );
};

export default Sobre;
