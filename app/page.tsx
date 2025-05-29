import ProjectForm from "@/components/project-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-red-50 to-red-100">
      <div className="relative z-10 p-6 md:p-16 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6">
            <span className="text-3xl">🍎</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">Apple Innovation Hub</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Share your groundbreaking ideas with Apple. Help us shape the future of technology together.
          </p>
        </div>
        <ProjectForm />
      </div>
    </main>
  )
}
