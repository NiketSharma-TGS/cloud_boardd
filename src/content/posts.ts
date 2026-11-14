export const instagramUrl = "https://www.instagram.com/cloud_boardd";

export type Post = {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
};

// Provisional editorial artwork; replace with approved Instagram images and URLs.
export const posts: Post[] = [
  { id: "mock-analysis", title: "Mock analysis 101.", category: "Mock analysis", image: "/images/post-mocks.svg", href: instagramUrl },
  { id: "reading", title: "Reading tips for CAT.", category: "Reading room", image: "/images/post-reading.svg", href: instagramUrl },
  { id: "perspective", title: "A little prep. A little perspective.", category: "Study notes", image: "/images/desk.webp", href: instagramUrl },
];
