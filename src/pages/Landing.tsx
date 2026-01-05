import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Sparkles, 
  Layers, 
  BarChart3, 
  Zap,
  ArrowRight,
  Play,
  Users,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';

const features = [
  {
    icon: Brain,
    title: 'Spaced Repetition',
    description: 'Our algorithm schedules reviews at optimal intervals for long-term retention.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Get smart answer suggestions and auto-generate flashcards with AI.',
  },
  {
    icon: Layers,
    title: 'Organized Decks',
    description: 'Create, categorize, and tag your flashcard decks for easy access.',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description: 'Visualize your learning journey with detailed statistics and streaks.',
  },
  {
    icon: Globe,
    title: 'Public Library',
    description: 'Explore and clone thousands of community-created decks.',
  },
  {
    icon: Zap,
    title: 'Fast & Intuitive',
    description: 'Study anywhere with keyboard shortcuts and a distraction-free interface.',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <div className="container relative py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              <Sparkles className="h-4 w-4" />
              <span>Now with AI-powered learning</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              Master Anything with{' '}
              <span className="text-gradient">Memo</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The smart flashcard app that uses spaced repetition and AI to help you learn faster, 
              remember longer, and study smarter.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate('/signup')}
                className="group"
              >
                Start Learning Free
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => navigate('/explore')}
              >
                <Globe className="h-5 w-5 mr-2" />
                Explore Public Decks
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center justify-center gap-6 mt-12 text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">10K+ learners</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                <span className="text-sm font-medium">50K+ decks created</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                <span className="text-sm font-medium">2M+ cards studied</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image/Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none z-10" />
              
              {/* Mock Dashboard Preview */}
              <div className="p-6 bg-gradient-to-br from-background to-secondary/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-accent/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                  </div>
                  <div className="flex-1 h-8 bg-secondary rounded-lg" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card rounded-xl p-4 border border-border shadow-sm">
                      <div className="h-4 w-24 bg-secondary rounded mb-3" />
                      <div className="h-3 w-full bg-secondary/60 rounded mb-2" />
                      <div className="h-3 w-3/4 bg-secondary/40 rounded mb-4" />
                      <div className="flex justify-between items-center">
                        <div className="h-6 w-16 bg-primary/20 rounded" />
                        <div className="h-8 w-20 bg-primary rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Learn Effectively
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to maximize your learning efficiency and help you achieve your goals faster.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-16 text-center"
            style={{ background: 'var(--gradient-hero)' }}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                Join thousands of learners who are already using Memo to master new subjects and ace their exams.
              </p>
              <Button 
                size="xl" 
                onClick={() => navigate('/signup')}
                className="bg-white text-primary hover:bg-white/90 shadow-xl"
              >
                Get Started for Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Layers className="h-4 w-4" />
            </div>
            <span className="font-bold">Memo</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Memo. Learn smarter, not harder.
          </p>
        </div>
      </footer>
    </div>
  );
}
