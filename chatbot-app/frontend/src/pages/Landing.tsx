import { Link } from 'react-router-dom';
import Hero3DBackground from '../components/Hero3DBackground';
import FloatingElements from '../components/FloatingElements';
        {/* Hero Section */}


const Landing = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Hero3DBackground />
      <FloatingElements />
      
      <div className="relative z-10">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 fixed top-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-sm">
          <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 drop-shadow-[0_0_8px_rgba(0,255,136,0.7)]">
            SOLO AI
          </Link>
          <div className="space-x-4">
            <Link
              to="/login"
              className="rounded-full border border-white px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-white hover:text-black"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-gray-200"
            >
              Get started
            </Link>
          </div>
        </header>
        
        {/* Hero Section */}
        <main className="mx-auto max-w-7xl px-6 pt-24 pb-20">
          <div className="flex flex-col items-center text-center py-20">
            <div className="inline-block mb-6">
              <span className="text-sm uppercase tracking-[0.2em] text-gray-300 font-medium">
                AI-POWERED LEARNING PLATFORM
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-6">
              Transform Your Learning Experience
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mb-10">
              The ultimate AI-powered learning platform that helps students, educators, and professionals study smarter, not harder. Upload documents, analyze videos, and master any subject with intelligent assistance.
            </p>
            
            <div className="flex gap-4">
              <Link
                to="/signup"
                className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:bg-gray-200"
              >
                Start Learning Free
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-black"
              >
                View Demo
              </Link>
            </div>
          </div>
          
          {/* About Section */}
          <div className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">About Our Platform</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We're revolutionizing education through artificial intelligence, making learning more accessible, efficient, and personalized for everyone.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
                <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed">
                  To democratize education by providing cutting-edge AI tools that make learning more engaging, personalized, and effective. We believe everyone deserves access to high-quality educational assistance regardless of their background or resources.
                </p>
              </div>
              
              <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
                <h3 className="text-2xl font-bold text-white mb-4">How It Works</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our platform combines advanced natural language processing, document analysis, and machine learning to create an intelligent learning companion that adapts to your needs and helps you master any subject through interactive exploration.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-900/30 p-12 rounded-3xl border border-gray-800">
              <h3 className="text-3xl font-bold text-white text-center mb-8">Why Choose Our Platform?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-4">24/7</div>
                  <div className="text-gray-300">Always Available Assistance</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-4">100%</div>
                  <div className="text-gray-300">AI-Powered Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-4">∞</div>
                  <div className="text-gray-300">Unlimited Learning Potential</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Redesigned Features Section */}
          <div className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">Powerful Learning Features</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything you need to transform your learning experience with AI-powered tools
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Document Chat Feature */}
              <div className="group rounded-3xl border border-gray-800 bg-gray-900/30 p-8 transition-all duration-300 hover:border-white hover:bg-gray-800/50 hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-900/30 flex items-center justify-center mr-4">
                    <span className="text-blue-400 text-lg font-bold">D</span>
                  </div>
                  <h3 className="font-bold text-2xl text-white">Document Chat</h3>
                </div>
                <p className="text-gray-300">Upload PDFs, DOCX, or TXT files and engage in contextual conversations with your study materials.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-900/20 text-blue-300 text-xs rounded-full">AI-Powered</span>
                  <span className="px-3 py-1 bg-blue-900/20 text-blue-300 text-xs rounded-full">Real-time</span>
                </div>
              </div>
              
              {/* Code Analysis Feature */}
              <div className="group rounded-3xl border border-gray-800 bg-gray-900/30 p-8 transition-all duration-300 hover:border-white hover:bg-gray-800/50 hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-900/30 flex items-center justify-center mr-4">
                    <span className="text-purple-400 text-lg font-bold">Co</span>
                  </div>
                  <h3 className="font-bold text-2xl text-white">Code Analysis</h3>
                </div>
                <p className="text-gray-300">Understand complex code structures with AI-powered explanations and debugging assistance.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-900/20 text-purple-300 text-xs rounded-full">Multi-language</span>
                  <span className="px-3 py-1 bg-purple-900/20 text-purple-300 text-xs rounded-full">Debugging</span>
                </div>
              </div>
              
              {/* Video Learning Feature */}
              <div className="group rounded-3xl border border-gray-800 bg-gray-900/30 p-8 transition-all duration-300 hover:border-white hover:bg-gray-800/50 hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-900/30 flex items-center justify-center mr-4">
                    <span className="text-red-400 text-lg font-bold">V</span>
                  </div>
                  <h3 className="font-bold text-2xl text-white">Video Learning</h3>
                </div>
                <p className="text-gray-300">Analyze YouTube videos, generate summaries, and create study materials from lecture content.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-red-900/20 text-red-300 text-xs rounded-full">Transcription</span>
                  <span className="px-3 py-1 bg-red-900/20 text-red-300 text-xs rounded-full">Summarization</span>
                </div>
              </div>
              
              {/* Quiz Generation Feature */}
              <div className="group rounded-3xl border border-gray-800 bg-gray-900/30 p-8 transition-all duration-300 hover:border-white hover:bg-gray-800/50 hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-900/30 flex items-center justify-center mr-4">
                    <span className="text-green-400 text-lg font-bold">Q</span>
                  </div>
                  <h3 className="font-bold text-2xl text-white">Quiz Generation</h3>
                </div>
                <p className="text-gray-300">Create personalized quizzes from your documents to test your knowledge and track progress.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-900/20 text-green-300 text-xs rounded-full">Adaptive</span>
                  <span className="px-3 py-1 bg-green-900/20 text-green-300 text-xs rounded-full">Scoring</span>
                </div>
              </div>
              
              {/* Progress Tracking Feature */}
              <div className="group rounded-3xl border border-gray-800 bg-gray-900/30 p-8 transition-all duration-300 hover:border-white hover:bg-gray-800/50 hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-900/30 flex items-center justify-center mr-4">
                    <span className="text-yellow-400 text-lg font-bold">P</span>
                  </div>
                  <h3 className="font-bold text-2xl text-white">Progress Tracking</h3>
                </div>
                <p className="text-gray-300">Monitor your learning journey with detailed analytics and performance insights.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-yellow-900/20 text-yellow-300 text-xs rounded-full">Analytics</span>
                  <span className="px-3 py-1 bg-yellow-900/20 text-yellow-300 text-xs rounded-full">Insights</span>
                </div>
              </div>
              
              {/* Smart Summaries Feature */}
              <div className="group rounded-3xl border border-gray-800 bg-gray-900/30 p-8 transition-all duration-300 hover:border-white hover:bg-gray-800/50 hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-900/30 flex items-center justify-center mr-4">
                    <span className="text-cyan-400 text-lg font-bold">S</span>
                  </div>
                  <h3 className="font-bold text-2xl text-white">Smart Summaries</h3>
                </div>
                <p className="text-gray-300">Generate concise, AI-crafted summaries of complex topics and concepts.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-900/20 text-cyan-300 text-xs rounded-full">Concise</span>
                  <span className="px-3 py-1 bg-cyan-900/20 text-cyan-300 text-xs rounded-full">Accurate</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="py-16">
            <h2 className="text-4xl font-bold text-white text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800">
                <div className="text-yellow-400 text-lg font-bold mb-4">5/5</div>
                <p className="text-gray-300 mb-4">"This platform completely changed how I study. The AI explanations are so clear and helpful!"</p>
                <div className="text-white font-semibold">- Sarah M., Student</div>
              </div>
              
              <div className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800">
                <div className="text-yellow-400 text-lg font-bold mb-4">5/5</div>
                <p className="text-gray-300 mb-4">"As a teacher, I recommend this to all my students. It's like having a personal tutor 24/7."</p>
                <div className="text-white font-semibold">- Dr. James R., Professor</div>
              </div>
              
              <div className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800">
                <div className="text-yellow-400 text-lg font-bold mb-4">5/5</div>
                <p className="text-gray-300 mb-4">"The quiz generation feature helped me prepare for my certification exam perfectly."</p>
                <div className="text-white font-semibold">- Alex K., Professional</div>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center py-16 bg-gray-900/30 rounded-3xl border border-gray-800">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Join thousands of learners who are already achieving better results with our AI-powered platform.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/signup"
                className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:bg-gray-200"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;