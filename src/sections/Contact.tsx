function Contact() {
  const gitContenLikn =
    "https://raw.githubusercontent.com/3manuel0/3manuel0/refs/heads/assets/";
  interface ContactType {
    logo: string;
    url: string;
  }
  const contact: ContactType[] = [
    { logo: "Github.svg", url: "https://github.com/3manuel0" },
    {
      logo: "Linkedin.svg",
      url: "https://www.linkedin.com/in/said-bennaji-4990492b6/",
    },
    {
      logo: "X.svg",
      url: "https://x.com/3manuel_s",
    },
  ];
  return (
    <section className="projects p-8 mt-6" id="contact">
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl">Contact</h1>
      <div className="flex items-center justify-around relative mt-8 ">
        {contact.map((contact, index) => (
          <div
            key={index}
            className="flex justify-center flex-col items-center group cursor-pointer"
          >
            <a href={contact.url} target="_blank">
              <img
                className="w-14 h-14 sm:w-16 sm:h-16"
                src={gitContenLikn + contact.logo}
                alt={
                  contact.logo.split(".").length > 1
                    ? contact.logo.split(".")[0]
                    : ""
                }
              />
            </a>
            <a
              href={contact.url}
              target="_blank"
              className="text-[0.5rem] md:text-xs mt-2 opacity-0  group-hover:opacity-100 absolute text-outline"
            >
              {contact.logo.split(".").length > 1
                ? contact.logo.split(".")[0]
                : ""}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Contact;
