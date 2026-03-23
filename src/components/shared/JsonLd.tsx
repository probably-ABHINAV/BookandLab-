export default function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "BookandLab",
    url: "https://new-bookandlab.vercel.app",
    description:
      "An interactive EdTech platform for students to learn through structured 6-step chapters, track progress, build streaks, and get mentor feedback.",
    sameAs: [],
    foundingDate: "2024",
    areaServed: "IN",
    educationalCredentialAwarded: "Skill-based rubric scores",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BookandLab",
    url: "https://new-bookandlab.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://new-bookandlab.vercel.app/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
