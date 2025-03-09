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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <CubeStories stories={stories} />
    </div>
  );
}