import { useTranslation } from "react-i18next";
import "./About.css";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="About">
      <h2>{t("legal")}</h2>
      <section>
        <h3>Version</h3>
        <p>App version: 1.0.0</p>
        <p>Last updated: June 30, 2025</p>
      </section>

      <section>
        <h3>Company & Legal Notice</h3>
        <p>Publisher: WaterAndToilet SAS</p>
        <p>SIRET: 123 456 789 00012</p>
        <p>Headquarters: 1 bis bd de montmorency, 750016 Paris, France</p>
        <p>Director of publication: Jean Dupont</p>
      </section>

      <section>
        <h3>Privacy Policy</h3>
        <p>
          We collect only the data strictly necessary to provide our services.
          This includes login information, location data (when authorized), and
          usage analytics.
        </p>
        <p>
          Your data is processed in compliance with the GDPR and stored securely
          within the EU. You can request access, correction, or deletion of your
          personal data by emailing <p>📧 waterandtoilet@icloud.com</p>
        </p>
      </section>

      <section>
        <h3>Terms of Service</h3>
        <p>
          By using our app, you agree to the{" "}
          <a href="/terms">Terms of Service</a>. These terms define the rules
          for use, user responsibilities, and service limitations.
        </p>
      </section>

      <section>
        <h3>Contact & Data Protection Officer</h3>
        <p>
          For any legal inquiry or personal data request, please contact our
          Data Protection Officer (DPO):
          <p>📧 waterandtoilet@icloud.com</p>
        </p>
      </section>
    </div>
  );
};

export default About;
