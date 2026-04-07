export const metadata = {
  title: "Aviso Legal — Mystora",
  description: "Aviso legal, política de privacidad y condiciones de uso de mystora.es",
};

export default function LegalPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080613",
        color: "#e0dce8",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <a
          href="/"
          style={{
            color: "#d4a574",
            textDecoration: "none",
            fontSize: 14,
            display: "inline-block",
            marginBottom: 24,
          }}
        >
          ← Volver a Mystora
        </a>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 32,
          }}
        >
          Aviso Legal y Política de Privacidad
        </h1>

        {/* NATURALEZA DEL SERVICIO */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>1. Naturaleza del servicio</h2>
          <p style={paragraph}>
            Mystora ofrece guías personalizadas de carácter astrológico y
            numerológico con fines exclusivamente de entretenimiento y
            desarrollo personal. El contenido generado no constituye consejo
            médico, financiero, jurídico ni psicológico. Ninguna información
            proporcionada debe interpretarse como una predicción garantizada.
          </p>
          <p style={paragraph}>
            El usuario reconoce que los resultados tienen un carácter lúdico e
            inspiracional y que las decisiones que tome basándose en ellos son
            de su exclusiva responsabilidad.
          </p>
        </section>

        {/* CONDICIONES DE COMPRA */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>2. Condiciones de compra</h2>
          <p style={paragraph}>
            La apertura gratuita (extracto breve) se ofrece sin compromiso. La
            guía completa es un producto digital de pago único. El precio se
            muestra antes de la confirmación del pago.
          </p>
          <p style={paragraph}>
            El pago se procesa de forma segura a través de{" "}
            <strong>Stripe</strong>. Mystora no almacena datos bancarios ni
            de tarjeta de crédito.
          </p>
          <p style={paragraph}>
            <strong>Derecho de desistimiento:</strong> De conformidad con el
            artículo 103 del Real Decreto Legislativo 1/2007 (España) y el
            artículo L221-28 del Código de Consumo francés, al tratarse de
            contenido digital suministrado de forma inmediata tras la compra, el
            usuario acepta la ejecución inmediata del servicio y renuncia
            expresamente al derecho de desistimiento. No obstante, si considera
            que el servicio no se ha prestado correctamente, puede contactarnos
            en contact@mystora.es y estudiaremos su caso de forma individual.
          </p>
        </section>

        {/* POLÍTICA DE PRIVACIDAD */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>3. Política de privacidad (RGPD)</h2>

          <h3 style={subTitle}>3.1. Datos recogidos</h3>
          <p style={paragraph}>
            Recogemos únicamente los datos necesarios para la prestación del
            servicio: nombre (o seudónimo), fecha de nacimiento y, de forma
            opcional, dirección de correo electrónico. En caso de compra, Stripe
            recoge los datos de pago de forma independiente.
          </p>

          <h3 style={subTitle}>3.2. Finalidad del tratamiento</h3>
          <p style={paragraph}>
            Los datos se utilizan para generar su guía personalizada, enviarle
            el informe por correo electrónico (si lo solicita) y, en su caso,
            enviarle comunicaciones comerciales relacionadas con Mystora.
          </p>

          <h3 style={subTitle}>3.3. Base jurídica</h3>
          <p style={paragraph}>
            El tratamiento se basa en el consentimiento del usuario (artículo
            6.1.a del RGPD) para la generación de la guía, y en la ejecución
            de un contrato (artículo 6.1.b) para el procesamiento del pago.
          </p>

          <h3 style={subTitle}>3.4. Conservación</h3>
          <p style={paragraph}>
            Los datos personales se conservan durante un máximo de 36 meses
            desde la última interacción. Las guías generadas se almacenan de
            forma cifrada y pueden ser eliminadas previa solicitud.
          </p>

          <h3 style={subTitle}>3.5. Derechos del usuario</h3>
          <p style={paragraph}>
            De conformidad con el RGPD, usted dispone de los derechos de
            acceso, rectificación, supresión, portabilidad y oposición al
            tratamiento de sus datos. Puede ejercer estos derechos escribiendo
            a contact@mystora.es. Nos comprometemos a responder en un plazo máximo de 30 días.
          </p>

          <h3 style={subTitle}>3.6. Encargados del tratamiento</h3>
          <p style={paragraph}>
            Sus datos pueden ser tratados por los siguientes proveedores:{" "}
            Vercel Inc. (alojamiento, EE.UU.), Stripe Inc. (pagos, EE.UU.),
            Brevo (correo electrónico, Francia), Anthropic PBC (generación de
            contenido, EE.UU.). Todos cumplen con las garantías adecuadas
            conforme al RGPD (cláusulas contractuales tipo o equivalentes).
          </p>
        </section>

        {/* COOKIES */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>4. Cookies</h2>
          <p style={paragraph}>
            Mystora utiliza únicamente cookies funcionales estrictamente
            necesarias para el correcto funcionamiento del sitio (por ejemplo,
            para limitar el acceso gratuito a una consulta por período de 24
            horas). No utilizamos cookies publicitarias ni de seguimiento de
            terceros con fines de marketing.
          </p>
          <p style={paragraph}>
            Vercel Analytics puede recoger datos anónimos de uso. Para más
            información, consulte la{" "}
            <a
              href="https://vercel.com/docs/analytics/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              política de privacidad de Vercel Analytics
            </a>
            .
          </p>
        </section>

        {/* PROPIEDAD INTELECTUAL */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>5. Propiedad intelectual</h2>
          <p style={paragraph}>
            Todos los elementos del sitio (textos, diseño, logotipo, código)
            son propiedad de Sylvain Mercier y están protegidos por la
            legislación vigente en materia de propiedad intelectual.
            Queda prohibida cualquier reproducción total o parcial sin
            autorización previa por escrito.
          </p>
        </section>

        {/* LIMITACIÓN DE RESPONSABILIDAD */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>6. Limitación de responsabilidad</h2>
          <p style={paragraph}>
            Mystora no garantiza la exactitud, exhaustividad ni idoneidad del
            contenido generado para ningún fin particular. El servicio se
            proporciona &quot;tal cual&quot; y su uso es bajo la exclusiva
            responsabilidad del usuario. Mystora no será responsable de
            ningún daño directo o indirecto derivado del uso del servicio.
          </p>
        </section>

        {/* LEY APLICABLE */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>7. Ley aplicable</h2>
          <p style={paragraph}>
            El presente aviso legal se rige por la legislación francesa, sin
            perjuicio de las disposiciones imperativas de protección del
            consumidor del país de residencia del usuario. Para los usuarios
            residentes en España, serán de aplicación las disposiciones del
            Real Decreto Legislativo 1/2007 y la Ley 34/2002 (LSSI-CE).
          </p>
          <p style={paragraph}>
            En caso de litigio, el usuario podrá recurrir a la plataforma
            europea de resolución de litigios en línea:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              https://ec.europa.eu/consumers/odr
            </a>
          </p>
        </section>

        {/* CONTACTO */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={sectionTitle}>8. Contacto</h2>
          <p style={paragraph}>
            Para cualquier consulta, reclamación o ejercicio de derechos: contact@mystora.es
          </p>
        </section>

        <p
          style={{
            fontSize: 12,
            color: "#8a8494",
            marginTop: 40,
            paddingTop: 20,
            borderTop: "1px solid #1a1747",
          }}
        >
          Última actualización: abril 2026
        </p>
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  color: "#d4a574",
  marginBottom: 12,
  marginTop: 0,
};

const subTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: "#ffffff",
  marginBottom: 8,
  marginTop: 16,
};

const paragraph: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "#c8c3d2",
  marginBottom: 12,
};

const linkStyle: React.CSSProperties = {
  color: "#c8c3d2",
  textDecoration: "underline",
};
