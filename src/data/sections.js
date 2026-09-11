// Page sections and their children share these identifiers everywhere, including
// the spatial navigator. Child numbers refer to their actual place on the page.
export const sections = {
  about: { number: "01", label: "About" },
  work: { number: "02", label: "Selected work" },
  skills: { number: "03", label: "Toolkit" },
  contact: { number: "04", label: "Contact" },
};
export const projectNumber = (index) => `${sections.work.number}.${index + 1}`;
export const skillNumber = (index) => `${sections.skills.number}.${index + 1}`;
