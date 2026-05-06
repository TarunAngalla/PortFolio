import { MdArrowOutward, MdCopyright } from "react-icons/md";
import { siteData } from "../data/site";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>{siteData.contact.heading}</h3>
        <p className="contact-lead">{siteData.contact.lead}</p>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${siteData.contact.email}`} data-cursor="disable">
                {siteData.contact.email}
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href={`tel:${siteData.contact.phoneTel}`} data-cursor="disable">
                {siteData.contact.phone}
              </a>
            </p>
            <h4>Location</h4>
            <p>{siteData.contact.location}</p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a href={siteData.social.github} target="_blank" rel="noreferrer" data-cursor="disable" className="contact-social">
              Github <MdArrowOutward />
            </a>
            <a href={siteData.social.linkedin} target="_blank" rel="noreferrer" data-cursor="disable" className="contact-social">
              LinkedIn <MdArrowOutward />
            </a>
            <a href={siteData.social.x} target="_blank" rel="noreferrer" data-cursor="disable" className="contact-social">
              X <MdArrowOutward />
            </a>
            <a href={siteData.social.youtube} target="_blank" rel="noreferrer" data-cursor="disable" className="contact-social">
              YouTube <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              {siteData.footer.line} <br /> by <span>{siteData.footer.creditName}</span>
            </h2>
            <h5>
              <MdCopyright /> {siteData.footer.year}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
