import CubeStories from "@/components/stories/CubeStories";

const stories = [
  {
    id: 1,
    content: (
      <div className="h-full flex flex-col items-center justify-center space-y-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <h1 className="text-4xl font-bold text-center">Welcome to Stories</h1>
        <p className="text-lg text-center">Swipe to explore more content</p>
      </div>
    ),
  },
  {
    id: 2,
    content: (
      <div className="h-full flex flex-col bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
        <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
          <h2 className="text-2xl font-bold">Featured Content</h2>
          <div className="space-y-2">
            <p>• Interactive 3D transitions</p>
            <p>• Support for rich HTML content</p>
            <p>• Smooth touch navigation</p>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1617575521317-d2974f3b56d2"
            alt="Demo content"
            className="w-full h-48 object-cover rounded-lg mt-4"
          />
        </div>
      </div>
    ),
  },
  {
    id: 3,
    content: (
      <div className="h-full flex flex-col bg-gradient-to-br from-green-500 to-teal-500 text-white">
        <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
          <h2 className="text-2xl font-bold">Interactive Elements</h2>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
              Click Me!
            </button>
            <div className="bg-white/20 p-4 rounded-lg">
              <p>Custom components and interactive elements are fully supported</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    content: (
      <div className="h-full flex flex-col bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
        <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
          <h2 className="text-2xl font-bold">Dynamic Content</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 p-4 rounded-lg text-center">
              <p className="text-4xl font-bold">7+</p>
              <p>Stories Support</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg text-center">
              <p className="text-4xl font-bold">3D</p>
              <p>Transitions</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    content: (
      <div className="h-full flex flex-col bg-gradient-to-br from-red-500 to-pink-600 text-white">
        <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
          <h2 className="text-2xl font-bold">Rich Media Support</h2>
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f"
                alt="Tech visualization"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-lg">Support for images, videos, and interactive elements</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    content: (
      <div className="h-full flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="flex-1 p-6 flex flex-col justify-center space-y-6">
          <h2 className="text-2xl font-bold">Interactive Features</h2>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                className="p-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                Feature {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    content: (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="p-6 text-center space-y-4">
          <h2 className="text-3xl font-bold">Get Started</h2>
          <div className="space-y-2">
            <p>Ready to create your own stories?</p>
            <button className="px-6 py-2 bg-white text-red-600 rounded-full font-medium hover:bg-opacity-90 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    ),
  },
];

export default function Stories() {
  return (
    <div className="min-h-screen bg-[#FFEB3B] flex items-center justify-center p-4">
      <CubeStories stories={stories} />
    </div>
  );
}