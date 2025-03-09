import CubeStories from "@/components/stories/CubeStories";

const stories = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667",
    alt: "Medical professional examining data",
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1617575521317-d2974f3b56d2",
    alt: "Healthcare worker in protective equipment",
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1533601017-dc61895e03c0",
    alt: "Medical consultation",
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1576560234699-77aa0d8f9ba8",
    alt: "Laboratory research",
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1578496479914-7ef3b0193be3",
    alt: "Medical equipment",
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1583912267382-49a82d19bd94",
    alt: "Healthcare professional at work",
  },
  {
    id: 7,
    imageUrl: "https://images.unsplash.com/photo-1576086476234-1103be98f096",
    alt: "Medical research",
  },
  {
    id: 8,
    imageUrl: "https://images.unsplash.com/photo-1579165466741-7f35e4755660",
    alt: "Laboratory scientist",
  },
];

export default function Stories() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <CubeStories stories={stories} />
    </div>
  );
}
