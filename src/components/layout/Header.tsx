import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  BarChart3,
  Flame,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md group-hover:shadow-lg transition-all duration-200">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Memo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/explore" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Explore
              </Link>
              
              {/* Streak Badge */}
              {user && user.studyStreak > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm font-semibold">{user.studyStreak}</span>
                </div>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-border">
                      <AvatarImage src={user?.avatar} alt={user?.displayName} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user?.displayName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">{user?.displayName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/stats')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Statistics
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link 
                to="/explore" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Explore
              </Link>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button variant="hero" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <nav className="container py-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/explore" 
                    className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Explore
                  </Link>
                  <Link 
                    to="/profile" 
                    className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button 
                    variant="ghost-destructive" 
                    className="justify-start px-4" 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    to="/explore" 
                    className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Explore
                  </Link>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>
                    Log in
                  </Button>
                  <Button variant="default" onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}>
                    Get Started
                  </Button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
